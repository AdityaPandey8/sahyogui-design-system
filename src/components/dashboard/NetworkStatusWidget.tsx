import { motion } from "framer-motion";
import { Activity, Globe, Wifi, ShieldCheck } from "lucide-react";

export function NetworkStatusWidget() {
  const metrics = [
    { label: "Global Network", value: "Optimal", icon: Globe, color: "text-success" },
    { label: "System Latency", value: "24ms", icon: Wifi, color: "text-primary" },
    { label: "AI Node Security", value: "Shield Active", icon: ShieldCheck, color: "text-primary" },
    { label: "Live Uptime", value: "99.9%", icon: Activity, color: "text-success" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 mb-6">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
          className="flex items-center gap-3 rounded-2xl border border-white/10 bg-card/40 p-3 backdrop-blur-md transition-all hover:bg-card/60 hover:shadow-lg hover:shadow-primary/5 group"
        >
          <div className={`rounded-xl bg-background/50 p-2.5 ${m.color} group-hover:scale-110 transition-transform`}>
            <m.icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground truncate">{m.label}</p>
            <p className="text-xs font-bold text-foreground truncate">{m.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
