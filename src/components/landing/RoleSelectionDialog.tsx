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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Who are you?</DialogTitle>
          <DialogDescription>Select your role to continue</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3 pt-2">
          {roles.map((role) => (
            <button
              key={role.key}
              onClick={() => {
                onOpenChange(false);
                navigate(`/dashboard/${role.key}`);
              }}
              className="flex flex-col items-center gap-2 rounded-lg border p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-full ${role.color}`}>
                <role.icon className="h-5 w-5" />
              </div>
              <span className="text-sm font-semibold text-foreground">{role.label}</span>
              <span className="text-[11px] text-muted-foreground">{role.desc}</span>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
