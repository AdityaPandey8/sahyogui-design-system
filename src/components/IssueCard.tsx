import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Issue } from "@/data/mockData";
import { StatusBadge } from "./StatusBadge";
import { UrgencyBadge } from "./UrgencyBadge";

const urgencyBorder: Record<string, string> = {
  High: "border-l-danger",
  Medium: "border-l-warning",
  Low: "border-l-success",
};

export function IssueCard({ issue }: { issue: Issue }) {
  return (
    <div className={cn(
      "group rounded-xl border border-l-[3px] bg-card p-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]",
      urgencyBorder[issue.urgency]
    )}>
      <div className="mb-3 flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-card-foreground leading-snug">{issue.title}</h3>
        <UrgencyBadge urgency={issue.urgency} />
      </div>
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          {issue.location}
        </span>
        <StatusBadge status={issue.status} />
      </div>
    </div>
  );
}
