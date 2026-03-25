import { Brain, Clock, Users, Zap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import type { Issue } from "@/data/mockData";

export function AIPriorityCard({ issue }: { issue: Issue }) {
  const scoreColor = issue.aiPriorityScore >= 80 ? "text-danger" : issue.aiPriorityScore >= 50 ? "text-warning" : "text-success";
  const progressColor = issue.aiPriorityScore >= 80 ? "[&>div]:bg-danger" : issue.aiPriorityScore >= 50 ? "[&>div]:bg-warning" : "[&>div]:bg-success";

  return (
    <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-2 mb-4">
        <div className="relative">
          <Brain className="h-5 w-5 text-primary" />
          <Sparkles className="absolute -top-1 -right-1 h-2.5 w-2.5 text-primary animate-pulse" />
        </div>
        <span className="text-sm font-bold">AI Decision Panel</span>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary animate-pulse">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" /> LIVE
        </span>
      </div>

      <h4 className="text-sm font-semibold mb-3">{issue.title}</h4>

      {/* Priority Score with progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Zap className="h-3 w-3" /> Priority Score
          </span>
          <span className={cn("text-lg font-bold tabular-nums", scoreColor)}>{issue.aiPriorityScore}</span>
        </div>
        <Progress value={issue.aiPriorityScore} className={cn("h-2", progressColor)} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
          <div>
            <p className="text-[10px] text-muted-foreground">Est. Response</p>
            <p className="text-sm font-semibold">{issue.responseTime || "45 min"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-3.5 w-3.5 text-muted-foreground" />
          <div>
            <p className="text-[10px] text-muted-foreground">Affected</p>
            <p className="text-sm font-semibold tabular-nums">{issue.affectedPeople.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Suggested Action */}
      <div className="mt-4 rounded-lg bg-background/60 border border-border/50 p-3">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Suggested Action</p>
        <p className="text-xs font-medium">
          {issue.aiPriorityScore >= 80
            ? `🚨 High urgency – Deploy ${Math.ceil(issue.affectedPeople / 300)} volunteers immediately + coordinate ${Math.ceil(issue.affectedPeople / 1000)} NGOs`
            : issue.aiPriorityScore >= 50
              ? `⚠️ Medium priority – Assign ${Math.ceil(issue.affectedPeople / 500)} volunteers within 2 hours`
              : `✅ Low priority – Schedule ${Math.ceil(issue.affectedPeople / 800)} volunteers for next shift`
          }
        </p>
      </div>
    </div>
  );
}
