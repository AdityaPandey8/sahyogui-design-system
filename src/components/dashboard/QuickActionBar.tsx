import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface QuickAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: "default" | "destructive" | "outline";
}

export function QuickActionBar({ actions, className }: { actions: QuickAction[]; className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {actions.map((a, i) => (
        <motion.div
          key={a.label}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Button 
            variant={a.variant || "outline"} 
            size="sm" 
            onClick={a.onClick} 
            className={cn(
              "gap-2 rounded-xl font-bold transition-all active:scale-95 shadow-sm",
              !a.variant || a.variant === "outline" ? "border-white/10 bg-card/40 backdrop-blur-md hover:bg-card/60" : ""
            )}
          >
            <a.icon className="h-4 w-4" />
            {a.label}
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
