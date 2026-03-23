import { Brain, Clock, Users, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Issue } from "@/data/mockData";

export function AIPriorityCard({ issue }: { issue: Issue }) {
  const scoreColor = issue.aiPriorityScore >= 80 ? "text-danger" : issue.aiPriorityScore >= 50 ? "text-warning" : "text-success";

  return (
    <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Brain className="h-4 w-4 text-primary" />
        <span className="text-sm font-bold">AI Decision Panel</span>
      </div>
      <h4 className="text-sm font-semibold mb-2">{issue.title}</h4>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2">
          <Zap className="h-3.5 w-3.5 text-muted-foreground" />
          <div>
            <p className="text-[10px] text-muted-foreground">Priority Score</p>
            <p className={cn("text-lg font-bold tabular-nums", scoreColor)}>{issue.aiPriorityScore}</p>
          </div>
        </div>
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
        <div>
          <p className="text-[10px] text-muted-foreground">Suggested Action</p>
          <p className="text-xs font-medium">Deploy {Math.ceil(issue.affectedPeople / 300)} volunteers + 1 NGO</p>
        </div>
      </div>
    </div>
  );
}
