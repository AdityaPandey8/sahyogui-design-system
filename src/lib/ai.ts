type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
const ANALYZE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-issue`;

export async function streamChat({
  messages,
  onDelta,
  onDone,
  language = "en"
}: {
  messages: Msg[];
  onDelta: (deltaText: string) => void;
  onDone: () => void;
  language?: string;
}) {
  try {
    const resp = await fetch(CHAT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({ messages, language }),
    });

    if (resp.status === 429) throw new Error("Rate limit exceeded. Please try again later.");
    if (resp.status === 402) throw new Error("AI credits exhausted. Please add funds in Settings.");
    if (!resp.ok || !resp.body) throw new Error("Failed to start stream");

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch {
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    if (textBuffer.trim()) {
      for (let raw of textBuffer.split("\n")) {
        if (!raw) continue;
        if (raw.endsWith("\r")) raw = raw.slice(0, -1);
        if (raw.startsWith(":") || raw.trim() === "") continue;
        if (!raw.startsWith("data: ")) continue;
        const jsonStr = raw.slice(6).trim();
        if (jsonStr === "[DONE]") continue;
        try {
          const parsed = JSON.parse(jsonStr);
          const content = parsed.choices?.[0]?.delta?.content as string | undefined;
          if (content) onDelta(content);
        } catch { /* ignore partial leftovers */ }
      }
    }

    onDone();
  } catch (error) {
    console.error("AI Chat error:", error);
    // Provide fallback response
    const fallbackMessage = "I'm sorry, but the AI assistant is currently unavailable. Please try again later or contact support for assistance with crisis coordination.";
    onDelta(fallbackMessage);
    onDone();
  }
}

export async function analyzeIssue(data: {
  title: string;
  description: string;
  category: string;
  language?: string;
}): Promise<{ priority: number; suggestedCategory: string; responderType: string; summary: string }> {
  try {
    const resp = await fetch(ANALYZE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify(data),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: "Analysis failed" }));
      throw new Error(err.error || "Analysis failed");
    }

    return resp.json();
  } catch (error) {
    console.error("AI Analysis error:", error);
    // Provide fallback analysis
    return {
      priority: 50,
      suggestedCategory: data.category || "General",
      responderType: "Volunteer",
      summary: `Issue reported: ${data.title}. ${data.description}. AI analysis currently unavailable - please coordinate manually.`
    };
  }
}

/**
 * Calculates a comprehensive priority score (0-100) based on AI analysis and metadata.
 */
export function calculateAIPriorityScore(
  baseAiPriority: number,
  urgency: "High" | "Medium" | "Low",
  affectedPeople: number,
  category: string
): number {
  let score = baseAiPriority;

  // Urgency multiplier
  const urgencyWeight = { High: 1.5, Medium: 1.0, Low: 0.5 };
  const multiplier = urgencyWeight[urgency as keyof typeof urgencyWeight] || 1.0;
  score *= multiplier;

  // Impact weighting (logarithmic scale for affected people)
  if (affectedPeople > 0) {
    score += Math.log10(affectedPeople) * 5;
  }

  // Category weightings
  const categoryBoosts: Record<string, number> = {
    Disaster: 15,
    Health: 10,
    Food: 8,
    Infrastructure: 5,
    Safety: 12,
  };
  score += categoryBoosts[category] || 0;

  // Normalize to 0-100
  return Math.min(Math.max(Math.round(score), 0), 100);
}
