import { MapPin } from "lucide-react";
import type { Issue } from "@/data/mockData";
import { StatusBadge } from "./StatusBadge";
import { UrgencyBadge } from "./UrgencyBadge";

export function IssueCard({ issue }: { issue: Issue }) {
  return (
    <div className="group rounded-lg border bg-card p-4 shadow-sm transition-shadow duration-200 hover:shadow-md active:scale-[0.98]">
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
