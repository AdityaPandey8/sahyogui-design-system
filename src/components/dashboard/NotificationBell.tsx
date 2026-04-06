import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "danger" | "success";
  time: string;
  read: boolean;
}

interface NotificationBellProps {
  notifications: Notification[];
}

const typeStyle: Record<string, string> = {
  info: "bg-primary/10 text-primary",
  warning: "bg-warning/10 text-warning",
  danger: "bg-danger/10 text-danger",
  success: "bg-success/10 text-success",
};

export function NotificationBell({ notifications: initialNotifs }: NotificationBellProps) {
  const [notifications, setNotifications] = useState(initialNotifs);
  const unread = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[9px] font-bold text-danger-foreground animate-pulse">
              {unread}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h4 className="text-sm font-bold">Notifications</h4>
          {unread > 0 && (
            <button onClick={markAllRead} className="text-[10px] text-primary hover:underline">
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-64 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="p-4 text-center text-xs text-muted-foreground">No notifications</p>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                className={cn(
                  "flex items-start gap-3 border-b px-4 py-3 transition-colors last:border-0",
                  !n.read && "bg-primary/[0.03]"
                )}
              >
                <div className={cn("mt-0.5 h-2 w-2 shrink-0 rounded-full", !n.read ? "bg-primary" : "bg-transparent")} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn("rounded-full px-1.5 py-0.5 text-[9px] font-bold", typeStyle[n.type])}>
                      {n.type.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{n.time}</span>
                  </div>
                  <p className="text-xs font-medium mt-0.5">{n.title}</p>
                  <p className="text-[10px] text-muted-foreground line-clamp-2">{n.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
