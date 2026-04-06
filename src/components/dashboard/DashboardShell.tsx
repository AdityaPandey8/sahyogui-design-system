import { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationBell, type Notification } from "@/components/dashboard/NotificationBell";
import { cn } from "@/lib/utils";
import { ArrowLeft, PanelLeftClose, PanelLeft, LogOut, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SidebarItem<T extends string> {
  id: T;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardShellProps<T extends string> {
  panelLabel: string;
  sidebarItems: SidebarItem<T>[];
  activeSection: T;
  onSectionChange: (section: T) => void;
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
  notifications?: Notification[];
  crisisMode?: boolean;
  headerExtra?: ReactNode;
  children: ReactNode;
}

export function DashboardShell<T extends string>({
  panelLabel,
  sidebarItems,
  activeSection,
  onSectionChange,
  sidebarOpen,
  onSidebarToggle,
  notifications = [],
  crisisMode,
  headerExtra,
  children,
}: DashboardShellProps<T>) {
  const currentLabel = sidebarItems.find((s) => s.id === activeSection)?.label ?? panelLabel;
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate("/auth");
  };

  const handleSectionClick = (id: T) => {
    onSectionChange(id);
    if (sidebarOpen) {
      onSidebarToggle();
    }
  };

  return (
    <div className={cn("min-h-screen bg-background flex", crisisMode && "ring-2 ring-destructive ring-inset")}>
      {/* Sidebar */}
      <aside
        className={cn(
          "sticky top-0 h-screen border-r bg-card/50 backdrop-blur-xl transition-all duration-500 flex flex-col shrink-0 z-30",
          sidebarOpen ? "w-64" : "w-[68px]"
        )}
      >
        <div className="flex items-center gap-3 border-b border-border/50 px-4 h-16 shrink-0 overflow-hidden">
          <AnimatePresence mode="wait">
            {sidebarOpen ? (
              <motion.div
                key="logo-full"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex items-center gap-2"
              >
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20 shrink-0">
                  S
                </div>
                <span className="text-sm font-bold truncate tracking-tight text-foreground">{panelLabel}</span>
              </motion.div>
            ) : (
              <motion.div
                key="logo-short"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="mx-auto"
              >
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20">
                  S
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 py-6 space-y-1.5 px-3 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSectionClick(item.id)}
              className={cn(
                "group relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all duration-300",
                activeSection === item.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110", activeSection === item.id ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")} />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className="truncate font-medium"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {activeSection === item.id && !sidebarOpen && (
                <div className="absolute right-0 h-5 w-1 rounded-l-full bg-primary" />
              )}
            </button>
          ))}
        </nav>

        {/* User Profile Section at Bottom */}
        <div className="p-3 border-t border-border/50">
          <div className={cn(
            "rounded-xl bg-muted/40 p-2 transition-all duration-300",
            sidebarOpen ? "flex items-center gap-3" : "flex flex-col items-center gap-2"
          )}>
            <div className="relative shrink-0">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold shadow-md">
                JD
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card bg-success" />
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0 overflow-hidden">
                <p className="text-xs font-bold truncate text-foreground leading-tight">Jane Doe</p>
                <p className="text-[10px] text-muted-foreground truncate leading-tight">jane@example.com</p>
              </div>
            )}
            {sidebarOpen && (
              <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
          {!sidebarOpen && (
            <div className="mt-2 space-y-1">
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-muted-foreground hover:text-destructive" onClick={handleSignOut}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 border-b border-border/50 bg-background/60 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <div className="md:hidden">
                 <Button variant="ghost" size="icon" className="h-9 w-9" onClick={onSidebarToggle}>
                    <PanelLeft className="h-5 w-5" />
                 </Button>
              </div>
              <Link to="/">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-muted/50 transition-colors">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="h-6 w-px bg-border/50 mx-1 hidden sm:block" />
              <h1 className="text-lg font-bold tracking-tight text-foreground">{currentLabel}</h1>
              {crisisMode && (
                <span className="ml-2 flex items-center gap-1.5 rounded-full bg-destructive/10 border border-destructive/20 px-3 py-1 text-[10px] font-bold text-destructive animate-pulse">
                  <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                  CRISIS MODE
                </span>
              )}
              {headerExtra}
            </div>
            <div className="flex items-center gap-3">
              <NotificationBell notifications={notifications} />
              <div className="h-6 w-px bg-border/50 mx-1" />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 max-w-7xl overflow-x-hidden">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
