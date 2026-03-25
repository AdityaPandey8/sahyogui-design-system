import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div
      className={cn(
        "rounded-xl border bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5",
        className
      )}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-primary/10 p-2">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        {trend && (
          <span className={cn(
            "inline-flex items-center gap-0.5 text-xs font-medium",
            trend.direction === "up" ? "text-success" : "text-danger"
          )}>
            {trend.direction === "up" ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {trend.value}
          </span>
        )}
      </div>
      <p className="mt-3 text-2xl font-bold tabular-nums text-card-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
