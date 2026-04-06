import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Brain, TrendingUp, AlertTriangle, CheckCircle2, Zap } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { motion } from "framer-motion";

const data = [
  { name: "Mon", issues: 12, resolved: 8 },
  { name: "Tue", issues: 18, resolved: 12 },
  { name: "Wed", issues: 45, resolved: 20 },
  { name: "Thu", issues: 32, resolved: 28 },
  { name: "Fri", issues: 24, resolved: 22 },
  { name: "Sat", issues: 15, resolved: 14 },
  { name: "Sun", issues: 10, resolved: 10 },
];

export function AIInsightsCard() {
  return (
    <Card className="col-span-full lg:col-span-4 overflow-hidden border-white/10 bg-card/50 backdrop-blur-xl shadow-xl shadow-primary/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">AI Command Insights</CardTitle>
              <CardDescription className="text-xs">Real-time crisis pattern analysis</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-[10px] font-bold text-success border border-success/20">
            <Zap className="h-3 w-3" /> LIVE ANALYSIS
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-3 rounded-xl bg-background/50 border border-border/50"
          >
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Trend Score</span>
            </div>
            <p className="text-2xl font-black text-foreground">84<span className="text-xs font-medium text-success ml-1">+12%</span></p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-3 rounded-xl bg-background/50 border border-border/50"
          >
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Urgent Alerts</span>
            </div>
            <p className="text-2xl font-black text-foreground">03</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-3 rounded-xl bg-background/50 border border-border/50"
          >
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-success" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Resolution Rate</span>
            </div>
            <p className="text-2xl font-black text-foreground">92%</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-3 rounded-xl bg-background/50 border border-border/50"
          >
            <div className="flex items-center gap-2 mb-1">
              <Brain className="h-3.5 w-3.5 text-primary" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">AI Accuracy</span>
            </div>
            <p className="text-2xl font-black text-foreground">98.4</p>
          </motion.div>
        </div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorIssues" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  borderColor: "hsl(var(--border))",
                  borderRadius: "12px",
                  fontSize: "12px"
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="issues" 
                stroke="hsl(var(--primary))" 
                fillOpacity={1} 
                fill="url(#colorIssues)" 
                strokeWidth={3}
              />
              <Area 
                type="monotone" 
                dataKey="resolved" 
                stroke="hsl(var(--success))" 
                fillOpacity={1} 
                fill="url(#colorResolved)" 
                strokeWidth={3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl bg-primary/5 border border-primary/10 p-4 relative overflow-hidden">
           <div className="flex items-start gap-3 relative z-10">
              <div className="p-2 rounded-lg bg-primary/20 text-primary">
                <Brain className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-primary uppercase tracking-wider">AI Forecast</p>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Heavy rains predicted in the next 24 hours likely to increase infrastructure reports by <span className="font-bold text-primary">35%</span>. Recommended to pre-deploy volunteers in Sector 4 and 9.
                </p>
              </div>
           </div>
           <div className="absolute top-0 right-0 p-2 opacity-10">
              <Brain className="h-24 w-24 -mr-8 -mt-8" />
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
