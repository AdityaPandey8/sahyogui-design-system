import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Package, Users, TrendingUp, Heart, Droplets, Utensils, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";

const leaderboard = [
  { id: 1, name: "HelpBridge Foundation", type: "NGO", score: 9840, solved: 142, impact: "5.2k lives" },
  { id: 2, name: "Priya Sharma", type: "Volunteer", score: 8720, solved: 45, impact: "1.2k lives" },
  { id: 3, name: "CareLine Initiative", type: "NGO", score: 8150, solved: 98, impact: "3.8k lives" },
  { id: 4, name: "Rahul Verma", type: "Volunteer", score: 7900, solved: 38, impact: "850 lives" },
  { id: 5, name: "Red Cross Local", type: "NGO", score: 7600, solved: 112, impact: "4.5k lives" },
];

const resources = [
  { id: 1, name: "Clean Water", icon: Droplets, available: 1200, needed: 5000, unit: "Liters", color: "text-blue-500" },
  { id: 2, name: "Food Packets", icon: Utensils, available: 450, needed: 2000, unit: "Units", color: "text-orange-500" },
  { id: 3, name: "Medical Kits", icon: Stethoscope, available: 85, needed: 500, unit: "Kits", color: "text-red-500" },
];

export function ImpactLeaderboard() {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-warning" /> Impact Leaderboard
        </CardTitle>
        <CardDescription>Top contributors making a difference this month.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {leaderboard.map((item, index) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/50 hover:bg-primary/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted font-bold text-sm">
                {index + 1}
              </div>
              <div>
                <p className="text-sm font-bold leading-none">{item.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[10px] h-4 px-1.5 font-bold uppercase tracking-tighter">{item.type}</Badge>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                    <Heart className="h-2.5 w-2.5" /> {item.impact}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-black tabular-nums text-primary">{item.score.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Points</p>
            </div>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

export function ResourceTracker() {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" /> Resource Pulse
        </CardTitle>
        <CardDescription>Real-time tracking of essential relief supplies.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {resources.map((res, index) => (
          <div key={res.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-lg bg-background border border-border/50 ${res.color}`}>
                  <res.icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold">{res.name}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{res.available} / {res.needed} {res.unit}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black">{Math.round((res.available / res.needed) * 100)}%</p>
              </div>
            </div>
            <Progress value={(res.available / res.needed) * 100} className="h-1.5" />
          </div>
        ))}
        
        <div className="pt-4 border-t border-border/50">
           <div className="flex items-center gap-3 p-3 rounded-xl bg-success/5 border border-success/10">
              <TrendingUp className="h-4 w-4 text-success" />
              <div>
                <p className="text-[10px] font-bold text-success uppercase tracking-widest">Supply Trend</p>
                <p className="text-xs text-foreground/80">Water supplies increased by <span className="font-bold">12%</span> today due to NGO donations.</p>
              </div>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
