import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { issues as initialIssues, ngos, volunteers, alerts, type Issue } from "@/data/mockData";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { HeatmapPlaceholder } from "@/components/dashboard/HeatmapPlaceholder";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { IssueReportForm } from "@/components/dashboard/IssueReportForm";
import { IssueDetailDialog } from "@/components/dashboard/IssueDetailDialog";
import { BadgeDisplay } from "@/components/dashboard/BadgeDisplay";
import { AvailabilityToggle } from "@/components/dashboard/AvailabilityToggle";
import { ActivityLog, type Activity } from "@/components/dashboard/ActivityLog";
import { StatusBadge } from "@/components/StatusBadge";
import { UrgencyBadge } from "@/components/UrgencyBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  ArrowLeft, CheckCircle, Clock, MapPin, Zap, Trophy,
  BarChart3, AlertTriangle, Star, Upload, User, Brain, Plus
} from "lucide-react";
import { toast } from "sonner";

const currentVol = volunteers[0]; // Simulate logged-in volunteer

export default function DashboardVolunteer() {
  const [issueList, setIssueList] = useState<Issue[]>(initialIssues);
  const [search, setSearch] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [availability, setAvailability] = useState<"Available" | "Busy" | "Offline">("Available");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [acceptedTasks, setAcceptedTasks] = useState<string[]>([]);
  const [completedTasks, setCompletedTasks] = useState<string[]>(["ISS-007", "ISS-010"]);
  const [reportOpen, setReportOpen] = useState(false);

  const [activities] = useState<Activity[]>([
    { id: "a1", action: "Completed: Road debris clearing", time: "1d ago", type: "completed" },
    { id: "a2", action: "Accepted: Food shortage relief", time: "2h ago", type: "assigned" },
    { id: "a3", action: "Emergency: Joined flood response", time: "3h ago", type: "emergency" },
    { id: "a4", action: "Updated status: In Progress", time: "4h ago", type: "update" },
    { id: "a5", action: "Completed: Stray animal rescue", time: "2d ago", type: "completed" },
    { id: "a6", action: "Accepted: Medical supply delivery", time: "3d ago", type: "assigned" },
  ]);

  const [skills] = useState(currentVol.skills);

  // Nearby issues sorted by simulated distance
  const nearbyIssues = useMemo(() => {
    return issueList
      .filter((i) => i.status !== "Solved")
      .map((i) => ({
        ...i,
        distance: (Math.abs(i.coords.x - currentVol.coords.x) + Math.abs(i.coords.y - currentVol.coords.y)) * 0.15,
      }))
      .sort((a, b) => a.distance - b.distance);
  }, [issueList]);

  const filtered = useMemo(() => {
    return nearbyIssues.filter((i) => {
      if (search && !i.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (urgencyFilter !== "all" && i.urgency !== urgencyFilter) return false;
      return true;
    });
  }, [nearbyIssues, search, urgencyFilter]);

  // Smart suggestion - best skill match
  const bestMatch = useMemo(() => {
    const skillKeywords: Record<string, string[]> = {
      "First Aid": ["Health", "Disaster"],
      "Medical": ["Health"],
      "Logistics": ["Food", "Shelter", "Infrastructure"],
      "Driving": ["Food", "Shelter"],
      "Construction": ["Infrastructure", "Shelter"],
    };
    return nearbyIssues.find((i) =>
      skills.some((s) => skillKeywords[s]?.includes(i.category))
    ) || nearbyIssues[0];
  }, [nearbyIssues, skills]);

  const myTasks = useMemo(() =>
    issueList.filter((i) => acceptedTasks.includes(i.id)),
    [issueList, acceptedTasks]
  );

  const stats = useMemo(() => ({
    assigned: acceptedTasks.length,
    completed: completedTasks.length,
    active: acceptedTasks.filter((id) => !completedTasks.includes(id)).length,
    reliability: currentVol.reliabilityScore,
    badges: 3,
  }), [acceptedTasks, completedTasks]);

  const handleAccept = (id: string) => {
    setAcceptedTasks((prev) => [...prev, id]);
    setIssueList((prev) => prev.map((i) => i.id === id ? { ...i, status: "In Progress" as const } : i));
    toast.success("Task accepted!");
  };

  const handleComplete = (id: string) => {
    setCompletedTasks((prev) => [...prev, id]);
    setIssueList((prev) => prev.map((i) => i.id === id ? { ...i, status: "Solved" as const } : i));
    toast.success("Task marked complete! 🎉");
  };

  const handleEmergencyJoin = () => {
    const urgent = nearbyIssues.find((i) => i.urgency === "High" && !acceptedTasks.includes(i.id));
    if (urgent) {
      handleAccept(urgent.id);
      toast.success("🚨 Joined emergency: " + urgent.title);
    } else {
      toast.info("No nearby emergencies right now");
    }
  };

  const handleNewIssue = (issue: Issue) => {
    setIssueList((prev) => [issue, ...prev]);
    toast.success("Issue reported");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link to="/"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
            <div>
              <h1 className="text-base font-bold">{currentVol.name}</h1>
              <AvailabilityToggle status={availability} onChange={setAvailability} />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Emergency Join */}
            <Button
              variant="destructive"
              size="sm"
              className="gap-1.5 animate-pulse hover:animate-none"
              onClick={handleEmergencyJoin}
            >
              <Zap className="h-3.5 w-3.5" /> Join Emergency
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <MetricCard icon={BarChart3} label="Assigned" value={stats.assigned} />
          <MetricCard icon={CheckCircle} label="Completed" value={stats.completed} trend={{ direction: "up", value: "+2" }} />
          <MetricCard icon={AlertTriangle} label="Active" value={stats.active} />
          <MetricCard icon={Star} label="Reliability" value={stats.reliability} />
          <MetricCard icon={Trophy} label="Badges" value={stats.badges} />
        </div>

        {/* Smart Suggestion */}
        {bestMatch && !acceptedTasks.includes(bestMatch.id) && (
          <div className="rounded-lg border-2 border-primary/40 bg-primary/5 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-primary">AI RECOMMENDED FOR YOU</span>
            </div>
            <h3 className="text-sm font-semibold mb-1">{bestMatch.title}</h3>
            <p className="text-xs text-muted-foreground mb-2">{bestMatch.description}</p>
            <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{bestMatch.distance.toFixed(1)} km</span>
              <UrgencyBadge urgency={bestMatch.urgency} />
              <StatusBadge status={bestMatch.status} />
            </div>
            <Button size="sm" onClick={() => handleAccept(bestMatch.id)}>Accept Task</Button>
          </div>
        )}

        {/* My Tasks */}
        {myTasks.length > 0 && (
          <div>
            <h2 className="mb-3 text-sm font-bold flex items-center gap-1.5"><User className="h-4 w-4 text-primary" /> My Tasks ({myTasks.length})</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {myTasks.map((task) => {
                const isComplete = completedTasks.includes(task.id);
                const ngo = ngos.find((n) => n.id === task.assignedNgo);
                return (
                  <div key={task.id} className={`rounded-lg border p-3 ${isComplete ? "bg-success/5 border-success/20" : "bg-card"}`}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-sm font-semibold leading-snug">{task.title}</h3>
                      <StatusBadge status={task.status} />
                    </div>
                    {ngo && <p className="text-[10px] text-muted-foreground mb-2">NGO: {ngo.name}</p>}
                    <div className="flex items-center gap-2">
                      {!isComplete && (
                        <>
                          <Button size="sm" className="h-7 text-xs" onClick={() => handleComplete(task.id)}>
                            <CheckCircle className="h-3 w-3 mr-1" />Complete
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs gap-1">
                            <Upload className="h-3 w-3" />Upload Proof
                          </Button>
                        </>
                      )}
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setSelectedIssue(task)}>Details</Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Nearby Issues */}
        <div>
          <h2 className="mb-3 text-sm font-bold flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> Nearby Issues</h2>
          <div className="flex items-center gap-2 mb-3">
            <Button size="sm" variant="outline" className="h-8 text-xs gap-1" onClick={() => setReportOpen(true)}>
              <Plus className="h-3 w-3" /> Report Issue
            </Button>
          </div>
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            filters={[
              { label: "Urgency", value: urgencyFilter, onChange: setUrgencyFilter, options: [{ value: "High", label: "High" }, { value: "Medium", label: "Medium" }, { value: "Low", label: "Low" }] },
            ]}
          />
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {filtered.slice(0, 8).map((issue) => {
              const accepted = acceptedTasks.includes(issue.id);
              return (
                <div key={issue.id} className="rounded-lg border bg-card p-3">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold leading-snug">{issue.title}</h3>
                    <UrgencyBadge urgency={issue.urgency} />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{issue.distance.toFixed(1)} km</span>
                    <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" />{issue.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <StatusBadge status={issue.status} />
                    <div className="flex gap-1">
                      {!accepted && (
                        <Button size="sm" className="h-7 text-xs" onClick={() => handleAccept(issue.id)}>Accept</Button>
                      )}
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setSelectedIssue(issue)}>View</Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Crisis Map */}
        <div>
          <h2 className="mb-2 text-sm font-bold">Crisis Map</h2>
          <HeatmapPlaceholder issues={issueList} volunteers={[currentVol]} size="lg" />
        </div>

        {/* Skill Profile */}
        <div>
          <h2 className="mb-3 text-sm font-bold flex items-center gap-1.5"><User className="h-4 w-4 text-primary" /> Skill Profile</h2>
          <div className="rounded-lg border bg-card p-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {skills.map((s) => (
                <span key={s} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{s}</span>
              ))}
            </div>
            <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.info("Skill editing coming soon")}>Edit Skills</Button>
          </div>
        </div>

        {/* Performance */}
        <div>
          <h2 className="mb-3 text-sm font-bold flex items-center gap-1.5"><Trophy className="h-4 w-4 text-warning" /> Performance</h2>
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-lg border bg-card p-4 text-center">
              <p className="text-2xl font-bold tabular-nums">{currentVol.tasksCompleted}</p>
              <p className="text-xs text-muted-foreground">Tasks Done</p>
            </div>
            <div className="rounded-lg border bg-card p-4 text-center">
              <p className="text-2xl font-bold tabular-nums text-success">{currentVol.responseRate}%</p>
              <p className="text-xs text-muted-foreground">Response Rate</p>
            </div>
            <div className="rounded-lg border bg-card p-4 text-center">
              <p className="text-2xl font-bold tabular-nums text-primary">{currentVol.reliabilityScore}</p>
              <p className="text-xs text-muted-foreground">Reliability</p>
            </div>
            <div className="rounded-lg border bg-card p-4 text-center">
              <p className="text-2xl font-bold tabular-nums">#3</p>
              <p className="text-xs text-muted-foreground">Ranking</p>
            </div>
          </div>
        </div>

        {/* Badges */}
        <div>
          <h2 className="mb-3 text-sm font-bold flex items-center gap-1.5"><Star className="h-4 w-4 text-warning" /> Rewards & Badges</h2>
          <BadgeDisplay tasksCompleted={currentVol.tasksCompleted} reliabilityScore={currentVol.reliabilityScore} />
        </div>

        {/* Activity Log */}
        <div>
          <h2 className="mb-3 text-sm font-bold">Activity History</h2>
          <div className="rounded-lg border bg-card p-3">
            <ActivityLog activities={activities} />
          </div>
        </div>

        {/* Communication */}
        <div>
          <h2 className="mb-3 text-sm font-bold">Messages from NGO</h2>
          <div className="rounded-lg border bg-card p-3 space-y-2">
            <div className="rounded-md bg-muted/50 p-2">
              <p className="text-xs font-medium">HelpBridge Foundation</p>
              <p className="text-xs text-muted-foreground">Please bring extra water supplies to Camp B. Thank you for your efforts!</p>
              <p className="text-[10px] text-muted-foreground mt-1">2h ago</p>
            </div>
            <div className="rounded-md bg-muted/50 p-2">
              <p className="text-xs font-medium">CareLine Initiative</p>
              <p className="text-xs text-muted-foreground">Medical kits are ready for pickup at the central warehouse.</p>
              <p className="text-[10px] text-muted-foreground mt-1">5h ago</p>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div>
          <h2 className="mb-2 text-sm font-bold">Alerts</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {alerts.slice(0, 3).map((a) => <AlertCard key={a.id} alert={a} />)}
          </div>
        </div>
      </main>

      <IssueReportForm open={reportOpen} onOpenChange={setReportOpen} onSubmit={handleNewIssue} />
      <IssueDetailDialog issue={selectedIssue} open={!!selectedIssue} onOpenChange={(open) => !open && setSelectedIssue(null)} />
    </div>
  );
}
