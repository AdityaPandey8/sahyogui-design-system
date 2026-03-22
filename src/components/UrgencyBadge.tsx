import { cn } from "@/lib/utils";
import type { Urgency } from "@/data/mockData";

const urgencyStyles: Record<Urgency, string> = {
  High: "bg-danger/15 text-danger border-danger/25",
  Medium: "bg-warning/15 text-warning border-warning/25",
  Low: "bg-success/15 text-success border-success/25",
};

export function UrgencyBadge({ urgency }: { urgency: Urgency }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", urgencyStyles[urgency])}>
      {urgency}
    </span>
  );
}
