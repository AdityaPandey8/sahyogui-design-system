import { cn } from "@/lib/utils";
import type { IssueStatus } from "@/data/mockData";

const statusStyles: Record<IssueStatus, string> = {
  Pending: "bg-warning/15 text-warning border-warning/25",
  Verified: "bg-primary/15 text-primary border-primary/25",
  "In Progress": "bg-warning/20 text-orange-700 border-orange-300",
  Solved: "bg-success/15 text-success border-success/25",
};

export function StatusBadge({ status }: { status: IssueStatus }) {
  return (
    <span className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold", statusStyles[status])}>
      {status}
    </span>
  );
}
