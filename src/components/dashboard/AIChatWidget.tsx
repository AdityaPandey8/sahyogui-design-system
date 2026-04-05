import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { streamChat } from "@/lib/ai";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

type Message = { role: "user" | "assistant"; content: string };

export function AIChatWidget() {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I am your AI Crisis Assistant. How can I help you coordinate or find information today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const send = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    const assistantMsg: Message = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantMsg]);

    let assistantSoFar = "";

    try {
      await streamChat({
        messages: [...messages, userMsg],
        language: i18n.language,
        onDelta: (delta) => {
          assistantSoFar += delta;
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last && last.role === "assistant") {
              return [...prev.slice(0, -1), { ...last, content: assistantSoFar }];
            }
            return prev;
          });
        },
        onDone: () => setIsLoading(false),
      });
    } catch (err) {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="mb-4 flex h-[500px] w-[350px] flex-col overflow-hidden rounded-2xl border bg-background shadow-2xl shadow-primary/20 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between bg-primary p-4 text-primary-foreground">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold leading-tight">{t('ai_assistant')}</h3>
                  <div className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                    <span className="text-[10px] opacity-80">Always Online</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground hover:bg-white/10" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-gradient-to-b from-transparent to-muted/20">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex items-start gap-2.5", m.role === "user" ? "flex-row-reverse" : "flex-row")}>
                  <div className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg shadow-sm",
                    m.role === "assistant" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  )}>
                    {m.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                  <div className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm",
                    m.role === "assistant" ? "rounded-tl-none bg-card border" : "rounded-tr-none bg-primary text-primary-foreground"
                  )}>
                    {m.content || (isLoading && i === messages.length - 1 ? <Loader2 className="h-4 w-4 animate-spin opacity-50" /> : null)}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t p-4 bg-background">
              <div className="flex gap-2">
                <Input
                  placeholder={t('chat_placeholder')}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  className="h-9 rounded-xl bg-muted/50 border-none focus-visible:ring-1 ring-primary/20"
                  disabled={isLoading}
                />
                <Button size="icon" className="h-9 w-9 rounded-xl shadow-lg shadow-primary/20 active:scale-95 transition-all" onClick={send} disabled={isLoading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="icon"
        className={cn(
          "h-14 w-14 rounded-2xl shadow-2xl transition-all active:scale-95",
          open ? "rotate-90 bg-muted text-muted-foreground hover:bg-muted" : "bg-primary text-primary-foreground hover:shadow-primary/40"
        )}
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>
    </div>
  );
}
