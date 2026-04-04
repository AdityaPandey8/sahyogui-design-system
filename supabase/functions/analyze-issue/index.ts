const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { title, description, category } = await req.json();
    if (!title || !description) {
      return new Response(JSON.stringify({ error: "title and description are required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const GOOGLE_KEY = Deno.env.get("GOOGLE_GEMINI_API_KEY");
    const LOVABLE_KEY = Deno.env.get("LOVABLE_API_KEY");

    console.log("Analyze-issue check:", { hasGoogle: !!GOOGLE_KEY, hasLovable: !!LOVABLE_KEY });

    if (GOOGLE_KEY) {
      console.log("Using Google Gemini direct...");
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GOOGLE_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{
                  text: `Analyze this community issue and return JSON with: priority (number 0-100), suggestedCategory (one of: Health, Disaster, Food, Infrastructure, Environment, Safety, Communication, Shelter), responderType (one of: Volunteer, NGO, Government, Medical Team, Emergency Services), summary (1-2 sentence analysis).

Title: ${title}
Description: ${description}
Category: ${category || "Unknown"}`
                }],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
            },
          }),
        }
      );

      if (!response.ok) {
        const errText = await response.text();
        console.error("Gemini error:", response.status, errText);
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error("No response from Gemini");

      return new Response(text, {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
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
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: "You are an AI that analyzes community issues for a disaster relief platform. Analyze the issue and provide structured output using the provided tool.",
            },
            {
              role: "user",
              content: `Analyze this community issue:\nTitle: ${title}\nDescription: ${description}\nCategory: ${category || "Unknown"}`,
            },
          ],
          tools: [
            {
              type: "function",
              function: {
                name: "analyze_issue",
                description: "Provide analysis of a community issue.",
                parameters: {
                  type: "object",
                  properties: {
                    priority: { type: "number", description: "Priority score 0-100" },
                    suggestedCategory: { type: "string", enum: ["Health", "Disaster", "Food", "Infrastructure", "Environment", "Safety", "Communication", "Shelter"] },
                    responderType: { type: "string", enum: ["Volunteer", "NGO", "Government", "Medical Team", "Emergency Services"] },
                    summary: { type: "string", description: "Brief analysis summary" },
                  },
                  required: ["priority", "suggestedCategory", "responderType", "summary"],
                  additionalProperties: false,
                },
              },
            },
          ],
          tool_choice: { type: "function", function: { name: "analyze_issue" } },
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Gateway error:", response.status, errText);
        throw new Error(`Gateway error: ${response.status}`);
      }

      const data = await response.json();
      const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
      if (!toolCall) throw new Error("No tool call in response");

      return new Response(toolCall.function.arguments, {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    throw new Error("No AI API key configured.");

  } catch (e) {
    console.error("Analyze issue error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Internal Server Error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
