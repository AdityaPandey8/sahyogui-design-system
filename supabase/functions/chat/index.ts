const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    const GOOGLE_KEY = Deno.env.get("GOOGLE_GEMINI_API_KEY");
    const LOVABLE_KEY = Deno.env.get("LOVABLE_API_KEY");

    console.log("AI Config check:", { 
      hasGoogle: !!GOOGLE_KEY, 
      hasLovable: !!LOVABLE_KEY 
    });

    if (GOOGLE_KEY) {
      console.log("Using Google Gemini API...");
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
        return new Response(JSON.stringify({ error: `Gemini API error: ${response.status}`, details: errText }), {
          status: response.status === 429 ? 429 : 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

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
              } catch { /* ignore parse errors in stream */ }
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

    if (LOVABLE_KEY) {
      console.log("Using Lovable AI Gateway...");
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-pro", // Updated model name for gateway
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
        const errText = await response.text();
        console.error("Gateway error:", response.status, errText);
        return new Response(JSON.stringify({ error: `Gateway error: ${response.status}` }), {
          status: response.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(response.body, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    throw new Error("No AI API key configured. Please set GOOGLE_GEMINI_API_KEY or LOVABLE_API_KEY in Supabase Secrets.");

  } catch (e) {
    console.error("Chat function error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Internal Server Error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
