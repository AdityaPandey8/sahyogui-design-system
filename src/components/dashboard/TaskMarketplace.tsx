import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { tasks as mockTasks, type Task } from "@/data/mockData";
import { ClipboardList, Users, Clock, Search, Filter, CheckCircle2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export function TaskMarketplace() {
  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => 
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase())
    );
  }, [tasks, search]);

  const handleSignUp = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        if (t.volunteersSignedUp < t.volunteersNeeded) {
          toast.success("Successfully signed up for task: " + t.title);
          return { ...t, volunteersSignedUp: t.volunteersSignedUp + 1 };
        } else {
          toast.error("This task is already full!");
        }
      }
      return t;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" /> Volunteer Marketplace
          </h2>
          <p className="text-sm text-muted-foreground">Find and sign up for specific relief tasks near you.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search tasks..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 w-[200px] sm:w-[300px] rounded-xl bg-card/50 border-border/50 focus:ring-primary/20"
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-xl h-10 w-10 border-border/50">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              <Card className="h-full border-border/50 bg-card/50 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/5 transition-all group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant={task.status === "Open" ? "default" : "secondary"} className="rounded-lg font-bold text-[10px] uppercase tracking-wider">
                      {task.status}
                    </Badge>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      <Clock className="h-3 w-3" /> {new Date(task.deadline).toLocaleDateString()}
                    </div>
                  </div>
                  <CardTitle className="text-lg font-bold mt-2 group-hover:text-primary transition-colors">{task.title}</CardTitle>
                  <CardDescription className="text-xs line-clamp-2 leading-relaxed">{task.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {task.requiredSkills.map(skill => (
                      <span key={skill} className="px-2 py-0.5 rounded-md bg-primary/5 border border-primary/10 text-[10px] font-medium text-primary uppercase">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Users className="h-3 w-3" /> {task.volunteersSignedUp}/{task.volunteersNeeded} Volunteers
                      </span>
                      <span className={cn(
                        "tabular-nums",
                        task.volunteersSignedUp === task.volunteersNeeded ? "text-success" : "text-primary"
                      )}>
                        {Math.round((task.volunteersSignedUp / task.volunteersNeeded) * 100)}% Full
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-primary/10 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(task.volunteersSignedUp / task.volunteersNeeded) * 100}%` }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>

                  <Button 
                    className="w-full rounded-xl font-bold group/btn active:scale-95 transition-all"
                    disabled={task.volunteersSignedUp >= task.volunteersNeeded}
                    onClick={() => handleSignUp(task.id)}
                  >
                    {task.volunteersSignedUp >= task.volunteersNeeded ? (
                      <><CheckCircle2 className="mr-2 h-4 w-4" /> Full</>
                    ) : (
                      <><ArrowRight className="mr-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" /> Sign Up Now</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredTasks.length === 0 && (
        <div className="py-20 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
             <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-bold">No tasks found</h3>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
