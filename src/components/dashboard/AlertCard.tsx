import { AlertTriangle, CloudRain, Siren, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Alert } from "@/data/mockData";

const iconMap = {
  disaster: AlertTriangle,
  weather: CloudRain,
  emergency: Siren,
  info: Info,
};

const severityStyle: Record<string, string> = {
  High: "border-danger/40 bg-danger/5",
  Medium: "border-warning/40 bg-warning/5",
  Low: "border-success/40 bg-success/5",
};

export function AlertCard({ alert }: { alert: Alert }) {
  const Icon = iconMap[alert.type];
  return (
    <div className={cn("flex items-start gap-3 rounded-lg border p-3", severityStyle[alert.severity])}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-sm font-semibold leading-tight">{alert.title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{alert.message}</p>
      </div>
    </div>
  );
}
