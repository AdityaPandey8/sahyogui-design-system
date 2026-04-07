import { useState, useEffect } from "react";
import { Bell, Info, AlertTriangle, ShieldAlert, CheckCircle, Trash2, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "danger" | "success";
  time: string;
  read: boolean;
  link?: string;
}

interface NotificationBellProps {
  notifications: Notification[];
}

const typeConfig = {
  info: { icon: Info, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
  warning: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  danger: { icon: ShieldAlert, color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20" },
  success: { icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
};

export function NotificationBell({ notifications: initialNotifs }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifs);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast.success("All notifications marked as read");
  };

  const clearAll = () => {
    setNotifications([]);
    toast.info("Notification history cleared");
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl hover:bg-muted/50 transition-colors">
          <Bell className={cn("h-5 w-5 transition-transform", unreadCount > 0 && "animate-ring")} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground ring-2 ring-background">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] sm:w-96 p-0 rounded-2xl border-border/50 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden" align="end" sideOffset={8}>
        <div className="flex items-center justify-between border-b border-border/50 px-4 py-4 bg-muted/30">
          <div>
            <h4 className="text-sm font-bold tracking-tight">Notifications</h4>
            <p className="text-[10px] text-muted-foreground font-medium">You have {unreadCount} unread alerts</p>
          </div>
          <div className="flex gap-1">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllRead} className="h-7 px-2 text-[10px] font-bold gap-1 rounded-lg">
                <Check className="h-3 w-3" /> Read All
              </Button>
            )}
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearAll} className="h-7 px-2 text-[10px] font-bold gap-1 rounded-lg text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3 w-3" /> Clear
              </Button>
            )}
          </div>
        </div>
        
        <div className="max-h-[400px] overflow-y-auto no-scrollbar">
          <AnimatePresence initial={false}>
            {notifications.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-12 px-4 text-center"
              >
                <div className="h-12 w-12 rounded-2xl bg-muted flex items-center justify-center mb-3">
                  <Bell className="h-6 w-6 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-bold text-muted-foreground">All caught up!</p>
                <p className="text-[10px] text-muted-foreground/60 max-w-[180px] mt-1">When you receive alerts, they'll show up here.</p>
              </motion.div>
            ) : (
              notifications.map((n, idx) => {
                const config = typeConfig[n.type];
                return (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => markRead(n.id)}
                    className={cn(
                      "group relative flex items-start gap-3 border-b border-border/40 px-4 py-4 transition-all cursor-pointer hover:bg-muted/40",
                      !n.read && "bg-primary/[0.02]"
                    )}
                  >
                    <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border shadow-sm", config.bg, config.border)}>
                      <config.icon className={cn("h-4 w-4", config.color)} />
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn("text-[10px] font-bold uppercase tracking-wider", config.color)}>
                          {n.type}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium">{n.time}</span>
                      </div>
                      <p className={cn("text-sm font-bold mt-0.5 leading-tight truncate", !n.read ? "text-foreground" : "text-muted-foreground")}>
                        {n.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                      
                      {!n.read && (
                        <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-full" />
                      )}
                    </div>

                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0">
                       <Button 
                         variant="ghost" 
                         size="icon" 
                         className="h-7 w-7 rounded-lg hover:bg-destructive/10 hover:text-destructive"
                         onClick={(e) => deleteNotification(n.id, e)}
                       >
                         <Trash2 className="h-3.5 w-3.5" />
                       </Button>
                       {n.link && (
                         <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg">
                           <ExternalLink className="h-3.5 w-3.5" />
                         </Button>
                       )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
        
        {notifications.length > 0 && (
          <div className="p-3 bg-muted/20 border-t border-border/50 text-center">
            <button className="text-[10px] font-bold text-primary hover:underline">
              View All Notifications Center
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

