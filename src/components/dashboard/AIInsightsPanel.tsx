import { Brain, Clock, Users, Building2, Zap, Sparkles, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { UrgencyBadge } from "@/components/UrgencyBadge";
import { getAIInsights } from "@/lib/ai-insights";
import type { Issue } from "@/data/mockData";

interface AIInsightsPanelProps {
  issue: Issue;
  compact?: boolean;
}

export function AIInsightsPanel({ issue, compact = false }: AIInsightsPanelProps) {
  const insights = getAIInsights(issue);
  const { priorityScore, responseTime, volunteersRequired, ngosRequired, suggestion, urgencyLabel } = insights;

  const scoreColor = priorityScore >= 80 ? "text-destructive" : priorityScore >= 50 ? "text-warning" : "text-success";
  const progressColor = priorityScore >= 80 ? "[&>div]:bg-destructive" : priorityScore >= 50 ? "[&>div]:bg-warning" : "[&>div]:bg-success";
  const scoreBg = priorityScore >= 80 ? "bg-destructive/10" : priorityScore >= 50 ? "bg-warning/10" : "bg-success/10";

  return (
    <div className="rounded-xl border-2 border-primary/20 bg-card shadow-card transition-shadow hover:shadow-hover">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 pb-0">
        <div className="relative">
          <Brain className="h-5 w-5 text-primary" />
          <Sparkles className="absolute -top-1 -right-1 h-2.5 w-2.5 text-primary animate-pulse" />
        </div>
        <span className="text-sm font-bold tracking-tight">AI Decision Panel</span>
        <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary animate-pulse">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" /> LIVE
        </span>
      </div>

      <div className="p-4 space-y-4">
        {/* Title + Urgency */}
        {!compact && (
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold leading-snug">{issue.title}</h4>
            <UrgencyBadge urgency={urgencyLabel} />
          </div>
        )}

        {/* Priority Score */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
              <Zap className="h-3.5 w-3.5" /> Priority Score
            </span>
            <div className="flex items-center gap-2">
              <span className={cn("text-2xl font-bold tabular-nums", scoreColor)}>{priorityScore}</span>
              <span className="text-[10px] text-muted-foreground">/100</span>
            </div>
          </div>
          <Progress value={priorityScore} className={cn("h-2", progressColor)} />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-muted/50 border border-border/50 p-3 text-center">
            <Clock className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
            <p className="text-lg font-bold tabular-nums">{responseTime}</p>
            <p className="text-[10px] text-muted-foreground">min response</p>
          </div>
          <div className="rounded-lg bg-muted/50 border border-border/50 p-3 text-center">
            <Users className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
            <p className="text-lg font-bold tabular-nums">{volunteersRequired}</p>
            <p className="text-[10px] text-muted-foreground">volunteers</p>
          </div>
          <div className="rounded-lg bg-muted/50 border border-border/50 p-3 text-center">
            <Building2 className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
            <p className="text-lg font-bold tabular-nums">{ngosRequired}</p>
            <p className="text-[10px] text-muted-foreground">NGOs</p>
          </div>
        </div>

        {/* Suggested Action */}
        <div className="rounded-lg bg-background/60 border border-border/50 p-3">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> Suggested Action
          </p>
          <p className="text-xs font-medium leading-relaxed">{suggestion}</p>
        </div>

        {/* Footer label */}
        <p className="text-[9px] text-center text-muted-foreground/60 font-medium uppercase tracking-widest">
          AI-Powered Insights (Simulated)
        </p>
      </div>
    </div>
  );
}
