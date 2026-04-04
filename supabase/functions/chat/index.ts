import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();

    // Try Google Gemini first, fall back to Lovable Gateway
    const GOOGLE_KEY = Deno.env.get("GOOGLE_GEMINI_API_KEY");
    const LOVABLE_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (GOOGLE_KEY) {
      // --- Google Gemini direct ---
      const contents = [
        {
          role: "user",
          parts: [{ text: "You are SahyogAI Assistant, an AI helper for a disaster relief and volunteer coordination platform. Help users with information about reporting issues, volunteering, NGO coordination, safety tips, and community support. Be concise, helpful, and empathetic. Use markdown formatting for clarity." }],
        },
        { role: "model", parts: [{ text: "Understood. I'm SahyogAI Assistant, ready to help with disaster relief coordination." }] },
        ...messages.map((m: { role: string; content: string }) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
      ];

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse&key=${GOOGLE_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        console.error("Gemini error:", response.status, errText);
        if (response.status === 429) {
          return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
            status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        throw new Error("Gemini API error: " + response.status);
      }

      // Transform Gemini SSE to OpenAI-compatible SSE format
      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();
      const encoder = new TextEncoder();

      (async () => {
        const reader = response.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            let newlineIdx: number;
            while ((newlineIdx = buffer.indexOf("\n")) !== -1) {
              const line = buffer.slice(0, newlineIdx).trim();
              buffer = buffer.slice(newlineIdx + 1);

              if (!line.startsWith("data: ")) continue;
              const jsonStr = line.slice(6);
              if (!jsonStr) continue;

              try {
                const parsed = JSON.parse(jsonStr);
                const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                  const openaiChunk = {
                    choices: [{ delta: { content: text }, index: 0, finish_reason: null }],
                  };
                  await writer.write(encoder.encode(`data: ${JSON.stringify(openaiChunk)}\n\n`));
                }
              } catch { /* skip unparseable */ }
            }
          }
          await writer.write(encoder.encode("data: [DONE]\n\n"));
        } catch (e) {
          console.error("Stream transform error:", e);
        } finally {
          await writer.close();
        }
      })();

      return new Response(readable, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    // --- Lovable AI Gateway fallback ---
    if (!LOVABLE_KEY) throw new Error("No AI API key configured. Set GOOGLE_GEMINI_API_KEY or LOVABLE_API_KEY.");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content: "You are SahyogAI Assistant, an AI helper for a disaster relief and volunteer coordination platform. Help users with information about reporting issues, volunteering, NGO coordination, safety tips, and community support. Be concise, helpful, and empathetic. Use markdown formatting for clarity.",
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
