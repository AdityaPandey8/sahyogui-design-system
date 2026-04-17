import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { issues, type Issue } from "@/data/mockData";
import { MapPin, Activity, ThumbsUp } from "lucide-react";

export function LiveActivityTicker() {
  const [currentIssue, setCurrentIssue] = useState<Issue>(issues[0]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % issues.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setCurrentIssue(issues[index]);
  }, [index]);

  if (!currentIssue) return null;

  return (
    <div className="bg-primary/5 border-y border-primary/10 py-2 overflow-hidden whitespace-nowrap">
      <div className="container mx-auto px-4 flex items-center gap-6">
        <div className="flex items-center gap-2 text-primary shrink-0">
          <Activity className="h-4 w-4 animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest">Live Updates</span>
        </div>
        <div className="h-4 w-px bg-primary/20 shrink-0" />
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIssue.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-4 text-xs font-medium text-muted-foreground"
          >
            <span className="text-foreground font-bold">{currentIssue.title}</span>
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {currentIssue.location}</span>
            <span className="flex items-center gap-1"><ThumbsUp className="h-3 w-3" /> {currentIssue.upvotes} supporters</span>
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">{currentIssue.status}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
