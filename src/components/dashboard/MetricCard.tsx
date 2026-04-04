import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MetricCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  trend?: { direction: "up" | "down"; value: string };
  className?: string;
  delay?: number;
}

export function MetricCard({ icon: Icon, label, value, trend, className, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay / 1000 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border bg-card/50 p-5 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:shadow-primary/5",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="rounded-xl bg-primary/10 p-2.5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold tracking-tight",
            trend.direction === "up" ? "bg-success/10 text-success border border-success/20" : "bg-destructive/10 text-destructive border border-destructive/20"
          )}>
            {trend.direction === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend.value}
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <p className="text-3xl font-bold tabular-nums tracking-tight text-foreground group-hover:text-primary transition-colors">{value}</p>
        <p className="text-xs font-medium text-muted-foreground mt-1 group-hover:text-foreground/80 transition-colors uppercase tracking-wider">{label}</p>
      </div>

      {/* Decorative element */}
      <div className="absolute -bottom-2 -right-2 h-16 w-16 rounded-full bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-colors" />
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
}

