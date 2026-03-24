import { cn } from "@/lib/utils";

type AvailabilityStatus = "Available" | "Busy" | "Offline";

interface AvailabilityToggleProps {
  status: AvailabilityStatus;
  onChange: (status: AvailabilityStatus) => void;
}

const statusConfig: Record<AvailabilityStatus, { dot: string; bg: string }> = {
  Available: { dot: "bg-success", bg: "bg-success/15 text-success border-success/25" },
  Busy: { dot: "bg-warning", bg: "bg-warning/15 text-warning border-warning/25" },
  Offline: { dot: "bg-muted-foreground", bg: "bg-muted text-muted-foreground border-muted" },
};

const statuses: AvailabilityStatus[] = ["Available", "Busy", "Offline"];

export function AvailabilityToggle({ status, onChange }: AvailabilityToggleProps) {
  return (
    <div className="flex gap-1">
      {statuses.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={cn(
            "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-all",
            status === s ? statusConfig[s].bg : "border-transparent text-muted-foreground hover:bg-muted"
          )}
        >
          <span className={cn("h-2 w-2 rounded-full", status === s ? statusConfig[s].dot : "bg-transparent")} />
          {s}
        </button>
      ))}
    </div>
  );
}
