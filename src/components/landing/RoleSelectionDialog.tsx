import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Shield, Building2, Heart, Globe } from "lucide-react";

const roles = [
  { key: "admin", label: "Admin", icon: Shield, desc: "Manage & oversee", color: "bg-primary/10 text-primary" },
  { key: "ngo", label: "NGO", icon: Building2, desc: "Coordinate relief", color: "bg-success/10 text-success" },
  { key: "volunteer", label: "Volunteer", icon: Heart, desc: "Help on ground", color: "bg-warning/10 text-warning" },
  { key: "public", label: "Public", icon: Globe, desc: "Report issues", color: "bg-destructive/10 text-destructive" },
];

interface RoleSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RoleSelectionDialog({ open, onOpenChange }: RoleSelectionDialogProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-w-[95vw] mx-4">
        <div className="space-y-4 sm:space-y-6">
          <div className="rounded-2xl sm:rounded-3xl border bg-card p-4 sm:p-6 shadow-sm">
            <div className="mb-3 sm:mb-4 inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              Start here
            </div>
            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground">Choose your role</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Select the path that matches you to continue into your personalized SahyogAI dashboard and tools.
              </p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {roles.map((role) => (
              <button
                key={role.key}
                onClick={() => {
                  onOpenChange(false);
                  navigate(`/auth?role=${role.key}`);
                }}
                className="group rounded-2xl sm:rounded-3xl border border-border bg-background p-4 sm:p-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
              >
                <div className="flex items-center justify-between gap-3 sm:gap-4">
                  <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl ${role.color}`}>
                    <role.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <span className="rounded-full bg-primary/10 px-2 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-primary transition-all group-hover:bg-primary/20">
                    {role.label}
                  </span>
                </div>
                <p className="mt-3 sm:mt-5 text-sm font-semibold text-foreground">{role.desc}</p>
                <p className="mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-muted-foreground">
                  {role.key === "admin"
                    ? "Access command controls, analytics, and approvals."
                    : role.key === "ngo"
                    ? "Coordinate missions, verify requests, and allocate support."
                    : role.key === "volunteer"
                    ? "View available tasks, connect with teams, and respond quickly."
                    : "Report issues, track progress, and stay informed."}
                </p>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border bg-secondary/10 p-3 sm:p-4 text-xs sm:text-sm text-muted-foreground">
            <strong className="text-foreground">Tip:</strong> Pick the role that best fits how you want to use SahyogAI. You can switch roles later from your dashboard menu.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
