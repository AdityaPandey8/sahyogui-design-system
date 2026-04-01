import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationBell, type Notification } from "@/components/dashboard/NotificationBell";
import { cn } from "@/lib/utils";
import { ArrowLeft, PanelLeftClose, PanelLeft } from "lucide-react";

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
  autoToast?: { message: string; description?: string; delay?: number };
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
  autoToast,
  crisisMode,
  headerExtra,
  children,
}: DashboardShellProps<T>) {
  const currentLabel = sidebarItems.find((s) => s.id === activeSection)?.label ?? panelLabel;

  return (
    <div className={cn("min-h-screen bg-background flex", crisisMode && "ring-2 ring-destructive ring-inset")}>
      {/* Sidebar */}
      <aside
        className={cn(
          "sticky top-0 h-screen border-r bg-card transition-all duration-300 flex flex-col shrink-0 z-30",
          sidebarOpen ? "w-52" : "w-14"
        )}
      >
        <div className="flex items-center gap-2 border-b px-3 h-14 shrink-0">
          {sidebarOpen && (
            <span className="text-sm font-bold truncate text-foreground">{panelLabel}</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-8 w-8 shrink-0"
            onClick={onSidebarToggle}
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          </Button>
        </div>
        <nav className="flex-1 py-2 space-y-0.5 px-2 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                activeSection === item.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
          <div className="flex h-14 items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h1 className="text-base font-bold text-foreground">{currentLabel}</h1>
              {crisisMode && (
                <span className="rounded-full bg-destructive px-2.5 py-0.5 text-[10px] font-bold text-destructive-foreground animate-pulse">
                  CRISIS MODE
                </span>
              )}
              {headerExtra}
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell notifications={notifications} autoToast={autoToast} />
              <ThemeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 max-w-6xl animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
