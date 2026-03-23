import { cn } from "@/lib/utils";
import type { Issue, Volunteer } from "@/data/mockData";

interface HeatmapProps {
  issues: Issue[];
  volunteers?: Volunteer[];
  className?: string;
  size?: "sm" | "lg";
}

const urgencyColor: Record<string, string> = {
  High: "bg-danger",
  Medium: "bg-warning",
  Low: "bg-success",
};

export function HeatmapPlaceholder({ issues, volunteers, className, size = "sm" }: HeatmapProps) {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-lg border bg-muted/30",
      size === "lg" ? "h-80" : "h-52",
      className
    )}>
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`h-${i}`} className="absolute left-0 right-0 border-t border-foreground" style={{ top: `${(i + 1) * 11}%` }} />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={`v-${i}`} className="absolute top-0 bottom-0 border-l border-foreground" style={{ left: `${(i + 1) * 11}%` }} />
        ))}
      </div>

      {/* Issue dots */}
      {issues.map((issue) => (
        <div
          key={issue.id}
          className={cn(
            "absolute h-3 w-3 rounded-full shadow-md ring-2 ring-background transition-transform hover:scale-150",
            urgencyColor[issue.urgency]
          )}
          style={{ left: `${issue.coords.x}%`, top: `${issue.coords.y}%` }}
          title={`${issue.title} (${issue.urgency})`}
        />
      ))}

      {/* Volunteer dots */}
      {volunteers?.filter(v => v.available).map((vol) => (
        <div
          key={vol.id}
          className="absolute h-2.5 w-2.5 rounded-full bg-primary shadow-md ring-2 ring-background transition-transform hover:scale-150"
          style={{ left: `${vol.coords.x}%`, top: `${vol.coords.y}%` }}
          title={`${vol.name} (Volunteer)`}
        />
      ))}

      {/* Legend */}
      <div className="absolute bottom-2 left-2 flex gap-3 rounded-md bg-background/80 px-2 py-1 text-[10px] backdrop-blur-sm">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-danger" /> High</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning" /> Medium</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" /> Low</span>
        {volunteers && <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-primary" /> Volunteer</span>}
      </div>

      <span className="absolute top-2 left-2 text-[10px] font-medium text-muted-foreground">Live Crisis Map</span>
    </div>
  );
}
