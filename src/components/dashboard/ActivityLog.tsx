import { CheckCircle, AlertTriangle, User, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Activity {
  id: string;
  action: string;
  time: string;
  type: "completed" | "assigned" | "emergency" | "update";
}

const typeConfig: Record<Activity["type"], { icon: LucideIcon; color: string }> = {
  completed: { icon: CheckCircle, color: "text-success" },
  assigned: { icon: User, color: "text-primary" },
  emergency: { icon: AlertTriangle, color: "text-danger" },
  update: { icon: Clock, color: "text-warning" },
};

interface ActivityLogProps {
  activities: Activity[];
  maxItems?: number;
}

export function ActivityLog({ activities, maxItems = 8 }: ActivityLogProps) {
  return (
    <div className="space-y-1">
      {activities.slice(0, maxItems).map((a) => {
        const config = typeConfig[a.type];
        const Icon = config.icon;
        return (
          <div key={a.id} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-xs hover:bg-muted/50">
            <Icon className={`h-3.5 w-3.5 shrink-0 ${config.color}`} />
            <span className="flex-1 text-foreground">{a.action}</span>
            <span className="text-[10px] text-muted-foreground shrink-0">{a.time}</span>
          </div>
        );
      })}
    </div>
  );
}

export type { Activity };
