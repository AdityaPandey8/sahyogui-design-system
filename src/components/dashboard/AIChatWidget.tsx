import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react";
import { streamChat } from "@/lib/ai";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

type Msg = { role: "user" | "assistant"; content: string };

export function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    const text = input.trim();
    if (!text || isLoading) return;
    setInput("");

    const userMsg: Msg = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    let assistantSoFar = "";
    const upsertAssistant = (chunk: string) => {
      assistantSoFar += chunk;
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantSoFar } : m));
        }
        return [...prev, { role: "assistant", content: assistantSoFar }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        onDelta: upsertAssistant,
        onDone: () => setIsLoading(false),
      });
    } catch (e) {
      setIsLoading(false);
      toast.error(e instanceof Error ? e.message : "AI chat failed");
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-110 active:scale-95"
        aria-label="Open AI Chat"
      >
        <MessageSquare className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex w-80 flex-col rounded-2xl border bg-card shadow-2xl sm:w-96">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" />
          <span className="text-sm font-bold">SahyogAI Assistant</span>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setOpen(false)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4" style={{ maxHeight: 320 }}>
        {messages.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-8">
            Ask me anything about disaster relief, volunteer coordination, or community issues.
          </p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={cn("flex gap-2", m.role === "user" ? "justify-end" : "justify-start")}>
            {m.role === "assistant" && (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bot className="h-3 w-3" />
              </div>
            )}
            <div className={cn(
              "rounded-xl px-3 py-2 text-xs max-w-[80%]",
              m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
            )}>
              {m.role === "assistant" ? (
                <div className="prose prose-sm dark:prose-invert max-w-none [&>p]:m-0 [&>ul]:m-0 [&>ol]:m-0">
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              ) : m.content}
            </div>
            {m.role === "user" && (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <User className="h-3 w-3" />
              </div>
            )}
          </div>
        ))}
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
          <div className="flex gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Bot className="h-3 w-3" />
            </div>
            <div className="rounded-xl bg-muted px-3 py-2">
              <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t p-3 flex gap-2">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Ask SahyogAI…"
          className="h-8 text-xs"
          disabled={isLoading}
        />
        <Button size="icon" className="h-8 w-8 shrink-0" onClick={send} disabled={isLoading || !input.trim()}>
          <Send className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
