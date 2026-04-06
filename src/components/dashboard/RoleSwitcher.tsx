import { useNavigate } from "react-router-dom";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { UserCog, Shield, Users, Building2, Globe, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleSwitcherProps {
  currentRole: string;
  isCollapsed?: boolean;
}

const roles = [
  { id: "admin", label: "Admin View", icon: Shield, path: "/dashboard/admin" },
  { id: "ngo", label: "NGO View", icon: Building2, path: "/dashboard/ngo" },
  { id: "volunteer", label: "Volunteer View", icon: Users, path: "/dashboard/volunteer" },
  { id: "public", label: "Public View", icon: Globe, path: "/dashboard/public" },
];

export function RoleSwitcher({ currentRole, isCollapsed = false }: RoleSwitcherProps) {
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className={cn(
            "w-full mt-2 gap-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300 px-3",
            isCollapsed ? "justify-center" : "justify-start"
          )}
        >
          <UserCog className="h-5 w-5 shrink-0" />
          {!isCollapsed && (
            <>
              <span className="text-xs font-bold uppercase tracking-wider flex-1 text-left">Switch Role</span>
              <ChevronUp className="h-3.5 w-3.5 opacity-50" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end" className="w-56 rounded-2xl border-border/50 bg-background/80 backdrop-blur-xl p-2 shadow-2xl">
        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-3 py-2">Select Command View</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-border/50" />
        <div className="space-y-1 mt-1">
          {roles.map((role) => (
            <DropdownMenuItem
              key={role.id}
              onClick={() => navigate(role.path)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-all",
                currentRole.toLowerCase() === role.id 
                  ? "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20" 
                  : "hover:bg-primary/10 hover:text-primary"
              )}
            >
              <role.icon className={cn(
                "h-4 w-4",
                currentRole.toLowerCase() === role.id ? "text-primary-foreground" : "text-muted-foreground"
              )} />
              <span className="text-sm">{role.label}</span>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
