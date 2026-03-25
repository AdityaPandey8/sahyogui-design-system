import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Issue, Volunteer } from "@/data/mockData";

interface HeatmapProps {
  issues: Issue[];
  volunteers?: Volunteer[];
  className?: string;
  size?: "sm" | "lg";
  onIssueClick?: (issue: Issue) => void;
  showRoute?: boolean;
  showStats?: boolean;
}

const urgencyColor: Record<string, string> = {
  High: "bg-danger",
  Medium: "bg-warning",
  Low: "bg-success",
};

const urgencyRing: Record<string, string> = {
  High: "ring-danger/40",
  Medium: "ring-warning/40",
  Low: "ring-success/40",
};

export function HeatmapPlaceholder({ issues, volunteers, className, size = "sm", onIssueClick, showRoute, showStats }: HeatmapProps) {
  const availableVols = volunteers?.filter(v => v.available) || [];

  // Find nearest issue to first volunteer for route line
  const routeTarget = showRoute && availableVols[0] && issues.filter(i => i.status !== "Solved" && i.urgency === "High")[0];

  return (
    <TooltipProvider delayDuration={200}>
      <div className={cn(
        "relative overflow-hidden rounded-xl border bg-muted/20 shadow-inner",
        size === "lg" ? "h-80" : "h-52",
        className
      )}>
        {/* SVG Map Background */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 300" preserveAspectRatio="none">
          {/* Topographic texture */}
          <defs>
            <pattern id="topo" patternUnits="userSpaceOnUse" width="60" height="60">
              <path d="M0 30 Q15 10 30 30 Q45 50 60 30" fill="none" stroke="currentColor" className="text-foreground/[0.04]" strokeWidth="1" />
              <path d="M0 50 Q15 30 30 50 Q45 70 60 50" fill="none" stroke="currentColor" className="text-foreground/[0.03]" strokeWidth="0.5" />
            </pattern>
            <radialGradient id="glow" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.06" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="400" height="300" fill="url(#topo)" />
          <rect width="400" height="300" fill="url(#glow)" />

          {/* Region outlines */}
          <path d="M60 80 Q120 40 200 70 Q280 100 340 60" fill="none" stroke="currentColor" className="text-foreground/[0.06]" strokeWidth="1.5" strokeDasharray="4 6" />
          <path d="M40 160 Q100 120 180 150 Q260 180 360 140" fill="none" stroke="currentColor" className="text-foreground/[0.06]" strokeWidth="1.5" strokeDasharray="4 6" />
          <path d="M80 240 Q160 200 240 230 Q320 260 380 220" fill="none" stroke="currentColor" className="text-foreground/[0.06]" strokeWidth="1.5" strokeDasharray="4 6" />

          {/* Road-like curves */}
          <path d="M20 100 Q80 90 140 120 Q200 150 260 130 Q320 110 380 140" fill="none" stroke="currentColor" className="text-foreground/[0.08]" strokeWidth="2" />
          <path d="M100 20 Q110 80 130 140 Q150 200 160 280" fill="none" stroke="currentColor" className="text-foreground/[0.08]" strokeWidth="2" />
          <path d="M250 10 Q240 70 260 130 Q280 190 270 270" fill="none" stroke="currentColor" className="text-foreground/[0.08]" strokeWidth="2" />

          {/* Simulated route line from volunteer to issue */}
          {showRoute && routeTarget && availableVols[0] && (
            <path
              d={`M${availableVols[0].coords.x * 4} ${availableVols[0].coords.y * 3} Q${(availableVols[0].coords.x * 4 + routeTarget.coords.x * 4) / 2} ${Math.min(availableVols[0].coords.y * 3, routeTarget.coords.y * 3) - 20} ${routeTarget.coords.x * 4} ${routeTarget.coords.y * 3}`}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeDasharray="6 4"
              opacity="0.6"
            />
          )}
        </svg>

        {/* Grid lines */}
        <div className="absolute inset-0 opacity-[0.04]">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`h-${i}`} className="absolute left-0 right-0 border-t border-foreground" style={{ top: `${(i + 1) * 14}%` }} />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={`v-${i}`} className="absolute top-0 bottom-0 border-l border-foreground" style={{ left: `${(i + 1) * 14}%` }} />
          ))}
        </div>

        {/* Issue markers */}
        {issues.map((issue) => {
          const markerSize = issue.urgency === "High" ? "h-4 w-4" : issue.urgency === "Medium" ? "h-3.5 w-3.5" : "h-3 w-3";
          return (
            <Tooltip key={issue.id}>
              <TooltipTrigger asChild>
                <button
                  className={cn(
                    "absolute rounded-full shadow-lg ring-2 ring-background transition-all duration-300 hover:scale-[1.8] hover:z-20 focus:outline-none",
                    urgencyColor[issue.urgency],
                    markerSize,
                    issue.urgency === "High" && "animate-pulse",
                    onIssueClick && "cursor-pointer"
                  )}
                  style={{ left: `${issue.coords.x}%`, top: `${issue.coords.y}%`, transform: "translate(-50%, -50%)" }}
                  onClick={() => onIssueClick?.(issue)}
                />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[200px]">
                <p className="text-xs font-semibold">{issue.title}</p>
                <p className="text-[10px] text-muted-foreground">{issue.location} · {issue.urgency}</p>
                <p className="text-[10px] text-muted-foreground">{issue.affectedPeople.toLocaleString()} affected</p>
              </TooltipContent>
            </Tooltip>
          );
        })}

        {/* Urgency halo rings for high urgency */}
        {issues.filter(i => i.urgency === "High").map((issue) => (
          <div
            key={`halo-${issue.id}`}
            className={cn("absolute h-8 w-8 rounded-full ring-2 animate-ping opacity-20", urgencyRing[issue.urgency])}
            style={{ left: `${issue.coords.x}%`, top: `${issue.coords.y}%`, transform: "translate(-50%, -50%)" }}
          />
        ))}

        {/* Volunteer markers */}
        {availableVols.map((vol) => (
          <Tooltip key={vol.id}>
            <TooltipTrigger asChild>
              <div
                className="absolute h-3 w-3 rounded-full bg-primary shadow-lg ring-2 ring-background transition-all duration-300 hover:scale-[1.8] hover:z-20"
                style={{ left: `${vol.coords.x}%`, top: `${vol.coords.y}%`, transform: "translate(-50%, -50%)" }}
              />
            </TooltipTrigger>
            <TooltipContent side="top">
              <p className="text-xs font-semibold">{vol.name}</p>
              <p className="text-[10px] text-muted-foreground">{vol.skills.join(", ")}</p>
            </TooltipContent>
          </Tooltip>
        ))}

        {/* Legend */}
        <div className="absolute bottom-2.5 left-2.5 flex gap-3 rounded-lg bg-background/80 px-3 py-1.5 text-[10px] font-medium backdrop-blur-md border border-border/50 shadow-sm">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-danger" /> High</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-warning" /> Medium</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-success" /> Low</span>
          {volunteers && <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Volunteer</span>}
        </div>

        {/* Title */}
        <span className="absolute top-2.5 left-2.5 rounded-md bg-background/80 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground backdrop-blur-md border border-border/50">
          Live Crisis Map
        </span>

        {/* Stats overlay */}
        {showStats && (
          <div className="absolute top-2.5 right-2.5 rounded-lg bg-background/80 px-3 py-1.5 text-[10px] font-medium backdrop-blur-md border border-border/50 shadow-sm">
            <span className="text-danger font-bold">{issues.filter(i => i.urgency === "High").length}</span> urgent ·{" "}
            <span className="text-primary font-bold">{availableVols.length}</span> volunteers
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
