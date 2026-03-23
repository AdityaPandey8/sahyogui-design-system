import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: "default" | "destructive" | "outline";
}

export function QuickActionBar({ actions, className }: { actions: QuickAction[]; className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {actions.map((a) => (
        <Button key={a.label} variant={a.variant || "outline"} size="sm" onClick={a.onClick} className="gap-1.5">
          <a.icon className="h-3.5 w-3.5" />
          {a.label}
        </Button>
      ))}
    </div>
  );
}
