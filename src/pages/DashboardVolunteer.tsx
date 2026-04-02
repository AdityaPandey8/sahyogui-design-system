import { useState, useMemo } from "react";
import { issues as initialIssues, ngos, volunteers, alerts, type Issue, type Alert } from "@/data/mockData";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { HeatmapPlaceholder } from "@/components/dashboard/HeatmapPlaceholder";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { AlertDetailDialog } from "@/components/dashboard/AlertDetailDialog";
import { IssueReportForm } from "@/components/dashboard/IssueReportForm";
import { IssueDetailDialog } from "@/components/dashboard/IssueDetailDialog";
import { NGODetailDialog } from "@/components/dashboard/NGODetailDialog";
import { BadgeDisplay } from "@/components/dashboard/BadgeDisplay";
import { AvailabilityToggle } from "@/components/dashboard/AvailabilityToggle";
import { ActivityLog, type Activity } from "@/components/dashboard/ActivityLog";
import { type Notification } from "@/components/dashboard/NotificationBell";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { AIChatWidget } from "@/components/dashboard/AIChatWidget";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { StatusBadge } from "@/components/StatusBadge";
import { UrgencyBadge } from "@/components/UrgencyBadge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CheckCircle, Clock, MapPin, Zap, Trophy,
  BarChart3, AlertTriangle, Star, Upload, User, Brain, Plus, Sparkles,
  LayoutDashboard, ListTodo, Map, MessageSquare, Bell, UserCircle, Trash2,
  Send, X, Building2, Eye, ChevronDown, ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const currentVol = volunteers[0];

const volNotifications: Notification[] = [
  { id: "n1", title: "New Task Assigned", message: "Food shortage relief task near you.", type: "warning", time: "3m ago", read: false },
  { id: "n2", title: "Emergency Alert", message: "Flood warning in Bihar — volunteers needed.", type: "danger", time: "20m ago", read: false },
  { id: "n3", title: "Task Completed", message: "Road debris clearing marked as done.", type: "success", time: "1h ago", read: true },
];

const ALL_SKILLS = ["First Aid", "Medical", "Logistics", "Driving", "Construction", "Electrical", "Counseling", "Teaching", "Communication", "Cooking", "Search & Rescue", "Navigation", "Photography", "Documentation", "Translation", "Data Entry", "Coordination", "Shelter Mgmt", "Supply Chain"];

type Section = "overview" | "tasks" | "issues" | "map" | "messages" | "profile" | "alerts";

const shellSidebarItems: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { label: "Overview", id: "overview", icon: LayoutDashboard },
  { label: "My Tasks", id: "tasks", icon: ListTodo },
  { label: "Nearby Issues", id: "issues", icon: MapPin },
  { label: "Map & Navigation", id: "map", icon: Map },
  { label: "Messages", id: "messages", icon: MessageSquare },
  { label: "Profile", id: "profile", icon: UserCircle },
  { label: "Alerts", id: "alerts", icon: Bell },
];

interface Message {
  id: string;
  ngoId: string;
  ngoName: string;
  text: string;
  time: string;
  fromVolunteer: boolean;
}

export default function DashboardVolunteer() {
  const [section, setSection] = useState<Section>("overview");
  const [issueList, setIssueList] = useState<Issue[]>(initialIssues);
  const [search, setSearch] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [availability, setAvailability] = useState<"Available" | "Busy" | "Offline">("Available");
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [selectedNgoId, setSelectedNgoId] = useState<string | null>(null);
  const [acceptedTasks, setAcceptedTasks] = useState<string[]>([]);
  const [completedTasks, setCompletedTasks] = useState<string[]>(["ISS-007", "ISS-010"]);
  const [reportOpen, setReportOpen] = useState(false);
  const [skills, setSkills] = useState<string[]>(currentVol.skills);
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    { id: "m1", ngoId: "NGO-001", ngoName: "HelpBridge Foundation", text: "Please bring extra water supplies to Camp B. Thank you for your efforts!", time: "2h ago", fromVolunteer: false },
    { id: "m2", ngoId: "NGO-003", ngoName: "CareLine Initiative", text: "Medical kits are ready for pickup at the central warehouse. Please collect before 5 PM.", time: "5h ago", fromVolunteer: false },
    { id: "m3", ngoId: "NGO-001", ngoName: "HelpBridge Foundation", text: "Great work on the flood relief today. We're assigning you to Camp C tomorrow.", time: "1d ago", fromVolunteer: false },
  ]);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});

  const [activities] = useState<Activity[]>([
    { id: "a1", action: "Completed: Road debris clearing", time: "1d ago", type: "completed" },
    { id: "a2", action: "Accepted: Food shortage relief", time: "2h ago", type: "assigned" },
    { id: "a3", action: "Emergency: Joined flood response", time: "3h ago", type: "emergency" },
    { id: "a4", action: "Updated status: In Progress", time: "4h ago", type: "update" },
    { id: "a5", action: "Completed: Stray animal rescue", time: "2d ago", type: "completed" },
    { id: "a6", action: "Accepted: Medical supply delivery", time: "3d ago", type: "assigned" },
  ]);

  const locations = useMemo(() => [...new Set(issueList.map(i => i.location))], [issueList]);

  const nearbyIssues = useMemo(() => {
    return issueList.filter((i) => i.status !== "Solved")
      .map((i) => ({ ...i, distance: (Math.abs(i.coords.x - currentVol.coords.x) + Math.abs(i.coords.y - currentVol.coords.y)) * 0.15 }))
      .sort((a, b) => a.distance - b.distance);
  }, [issueList]);

  const filtered = useMemo(() => {
    return nearbyIssues.filter((i) => {
      if (search && !i.title.toLowerCase().includes(search.toLowerCase()) && !i.location.toLowerCase().includes(search.toLowerCase())) return false;
      if (urgencyFilter !== "all" && i.urgency !== urgencyFilter) return false;
      if (locationFilter !== "all" && i.location !== locationFilter) return false;
      if (categoryFilter !== "all" && i.category !== categoryFilter) return false;
      return true;
    });
  }, [nearbyIssues, search, urgencyFilter, locationFilter, categoryFilter]);

  const bestMatch = useMemo(() => {
    const skillKeywords: Record<string, string[]> = {
      "First Aid": ["Health", "Disaster"], "Medical": ["Health"],
      "Logistics": ["Food", "Shelter", "Infrastructure"], "Driving": ["Food", "Shelter"],
      "Construction": ["Infrastructure", "Shelter"],
    };
    return nearbyIssues.find((i) => skills.some((s) => skillKeywords[s]?.includes(i.category))) || nearbyIssues[0];
  }, [nearbyIssues, skills]);

  const matchReason = useMemo(() => {
    if (!bestMatch) return "";
    const skillKeywords: Record<string, string[]> = {
      "First Aid": ["Health", "Disaster"], "Medical": ["Health"],
      "Logistics": ["Food", "Shelter", "Infrastructure"],
    };
    const matched = skills.find((s) => skillKeywords[s]?.includes(bestMatch.category));
    return matched ? `Your ${matched} skill matches this ${bestMatch.category} emergency` : "Nearest issue to your location";
  }, [bestMatch, skills]);

  const matchScore = useMemo(() => {
    if (!bestMatch) return 0;
    const base = skills.some(s => ["First Aid", "Medical"].includes(s) && ["Health", "Disaster"].includes(bestMatch.category)) ? 92 : 78;
    return Math.min(100, base + Math.floor(Math.random() * 8));
  }, [bestMatch, skills]);

  const myTasks = useMemo(() => issueList.filter((i) => acceptedTasks.includes(i.id)), [issueList, acceptedTasks]);
  const stats = useMemo(() => ({
    assigned: acceptedTasks.length, completed: completedTasks.length,
    active: acceptedTasks.filter((id) => !completedTasks.includes(id)).length,
    reliability: currentVol.reliabilityScore, badges: 3,
  }), [acceptedTasks, completedTasks]);

  const connectedNgos = useMemo(() => ngos.filter(n => n.volunteerIds.includes(currentVol.id)), []);

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
  const handleDeleteReport = (id: string) => {
    setIssueList((prev) => prev.filter((i) => i.id !== id));
    setAcceptedTasks(prev => prev.filter(t => t !== id));
    toast.success("Report deleted");
  };
  const handleEmergencyJoin = () => {
    const urgent = nearbyIssues.find((i) => i.urgency === "High" && !acceptedTasks.includes(i.id));
    if (urgent) { handleAccept(urgent.id); toast.success("🚨 Joined emergency: " + urgent.title); }
    else { toast.info("No nearby emergencies right now"); }
  };
  const handleNewIssue = (issue: Issue) => {
    setIssueList((prev) => [issue, ...prev]);
    toast.success("Issue reported");
  };
  const handleReply = (ngoId: string, ngoName: string) => {
    const text = replyTexts[ngoId];
    if (!text?.trim()) return;
    setMessages(prev => [...prev, { id: `m-${Date.now()}`, ngoId, ngoName, text, time: "Just now", fromVolunteer: true }]);
    setReplyTexts(prev => ({ ...prev, [ngoId]: "" }));
    toast.success("Reply sent");
  };
  const handleAddSkill = (skill: string) => {
    if (!skills.includes(skill)) { setSkills(prev => [...prev, skill]); toast.success(`Added: ${skill}`); }
  };
  const handleRemoveSkill = (skill: string) => {
    setSkills(prev => prev.filter(s => s !== skill));
    toast.info(`Removed: ${skill}`);
  };

  const selectedNgo = selectedNgoId ? ngos.find(n => n.id === selectedNgoId) || null : null;

  const renderContent = () => {
    switch (section) {
      case "overview":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <MetricCard icon={BarChart3} label="Assigned" value={stats.assigned} delay={0} />
              <MetricCard icon={CheckCircle} label="Completed" value={stats.completed} trend={{ direction: "up", value: "+2" }} delay={80} />
              <MetricCard icon={AlertTriangle} label="Active" value={stats.active} delay={160} />
              <MetricCard icon={Star} label="Reliability" value={stats.reliability} delay={240} />
              <MetricCard icon={Trophy} label="Badges" value={stats.badges} delay={320} />
            </div>

            {bestMatch && !acceptedTasks.includes(bestMatch.id) && (
              <div className="rounded-xl border-2 border-primary/40 bg-primary/5 p-5 transition-all hover:shadow-md">
                <div className="flex items-center gap-2 mb-3">
                  <div className="relative">
                    <Brain className="h-4 w-4 text-primary" />
                    <Sparkles className="absolute -top-1 -right-1 h-2.5 w-2.5 text-primary animate-pulse" />
                  </div>
                  <span className="text-xs font-bold text-primary">AI RECOMMENDED FOR YOU</span>
                  <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary tabular-nums">{matchScore}% match</span>
                </div>
                <h3 className="text-sm font-semibold mb-1">{bestMatch.title}</h3>
                <p className="text-xs text-muted-foreground mb-2">{bestMatch.description}</p>
                <div className="rounded-lg bg-background/60 border border-border/50 p-2 mb-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">Why this task?</p>
                  <p className="text-xs font-medium">{matchReason}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{bestMatch.distance.toFixed(1)} km</span>
                    <UrgencyBadge urgency={bestMatch.urgency} />
                    <StatusBadge status={bestMatch.status} />
                  </div>
                  <Button size="sm" className="active:scale-95" onClick={() => handleAccept(bestMatch.id)}>Accept Task</Button>
                </div>
              </div>
            )}

            <BadgeDisplay tasksCompleted={currentVol.tasksCompleted} reliabilityScore={currentVol.reliabilityScore} />
          </div>
        );

      case "tasks":
        return (
          <div className="space-y-4">
            <h2 className="text-base font-bold">My Tasks ({myTasks.length})</h2>
            {myTasks.length === 0 && <p className="text-sm text-muted-foreground py-8 text-center">No tasks accepted yet. Go to Nearby Issues to find tasks.</p>}
            <div className="grid gap-3 sm:grid-cols-2">
              {myTasks.map((task) => {
                const isComplete = completedTasks.includes(task.id);
                const ngo = ngos.find((n) => n.id === task.assignedNgo);
                const isSelfReported = task.reportedBy === "You" || task.reportedBy === currentVol.name;
                return (
                  <div key={task.id} className={cn("rounded-xl border p-4 transition-all hover:shadow-md", isComplete ? "bg-success/5 border-success/20" : "bg-card")}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-sm font-semibold leading-snug">{task.title}</h3>
                      <StatusBadge status={task.status} />
                    </div>
                    {ngo && <p className="text-[10px] text-muted-foreground mb-2">NGO: {ngo.name}</p>}
                    <div className="flex items-center gap-2 flex-wrap">
                      {!isComplete && (
                        <>
                          <Button size="sm" className="h-7 text-xs active:scale-95" onClick={() => handleComplete(task.id)}>
                            <CheckCircle className="h-3 w-3 mr-1" />Complete
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs gap-1 active:scale-95"><Upload className="h-3 w-3" />Upload Proof</Button>
                        </>
                      )}
                      <Button size="sm" variant="outline" className="h-7 text-xs active:scale-95" onClick={() => setSelectedIssue(task)}>Details</Button>
                      {isSelfReported && (
                        <Button size="sm" variant="destructive" className="h-7 text-xs gap-1 active:scale-95" onClick={() => handleDeleteReport(task.id)}>
                          <Trash2 className="h-3 w-3" /> Delete
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "issues":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold">Nearby Issues</h2>
              <Button size="sm" variant="outline" className="h-8 text-xs gap-1 active:scale-95" onClick={() => setReportOpen(true)}>
                <Plus className="h-3 w-3" /> Report Issue
              </Button>
            </div>
            <FilterBar search={search} onSearchChange={setSearch} filters={[
              { label: "Urgency", value: urgencyFilter, onChange: setUrgencyFilter, options: [{ value: "High", label: "High" }, { value: "Medium", label: "Medium" }, { value: "Low", label: "Low" }] },
              { label: "Location", value: locationFilter, onChange: setLocationFilter, options: locations.map(l => ({ value: l, label: l.split(",")[0] })) },
              { label: "Category", value: categoryFilter, onChange: setCategoryFilter, options: [{ value: "Health", label: "Health" }, { value: "Disaster", label: "Disaster" }, { value: "Food", label: "Food" }, { value: "Infrastructure", label: "Infra" }, { value: "Environment", label: "Environment" }, { value: "Safety", label: "Safety" }] },
            ]} />
            <div className="grid gap-3 sm:grid-cols-2">
              {filtered.slice(0, 12).map((issue) => {
                const accepted = acceptedTasks.includes(issue.id);
                const isSelfReported = issue.reportedBy === "You" || issue.reportedBy === currentVol.name;
                return (
                  <div key={issue.id} className="rounded-xl border bg-card p-4 transition-all hover:shadow-md hover:-translate-y-0.5">
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
                        {!accepted && <Button size="sm" className="h-7 text-xs active:scale-95" onClick={() => handleAccept(issue.id)}>Accept</Button>}
                        <Button size="sm" variant="outline" className="h-7 text-xs active:scale-95" onClick={() => setSelectedIssue(issue)}>View</Button>
                        {isSelfReported && (
                          <Button size="sm" variant="destructive" className="h-7 text-xs active:scale-95" onClick={() => handleDeleteReport(issue.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && <p className="col-span-full text-center text-sm text-muted-foreground py-8">No issues match your filters.</p>}
            </div>
          </div>
        );

      case "map":
        return (
          <div className="space-y-4">
            <h2 className="text-base font-bold">Crisis Map & Navigation</h2>
            <HeatmapPlaceholder issues={issueList} volunteers={[currentVol]} size="lg" onIssueClick={setSelectedIssue} showRoute showStats />
          </div>
        );

      case "messages": {
        const grouped = messages.reduce<Record<string, Message[]>>((acc, m) => {
          if (!acc[m.ngoId]) acc[m.ngoId] = [];
          acc[m.ngoId].push(m);
          return acc;
        }, {});

        return (
          <div className="space-y-4">
            <h2 className="text-base font-bold">Messages from NGOs</h2>
            {Object.entries(grouped).map(([ngoId, msgs]) => {
              const ngoName = msgs[0].ngoName;
              return (
                <div key={ngoId} className="rounded-xl border bg-card p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold">{ngoName}</span>
                    </div>
                    <Button size="sm" variant="ghost" className="h-7 text-xs gap-1" onClick={() => setSelectedNgoId(ngoId)}>
                      <Eye className="h-3 w-3" /> View NGO
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {msgs.map(m => (
                      <div key={m.id} className={cn("rounded-lg p-3 max-w-[85%]", m.fromVolunteer ? "ml-auto bg-primary/10 border border-primary/20" : "bg-muted/50")}>
                        <p className="text-xs">{m.text}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{m.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a reply…"
                      value={replyTexts[ngoId] || ""}
                      onChange={e => setReplyTexts(prev => ({ ...prev, [ngoId]: e.target.value }))}
                      className="h-8 text-xs"
                      onKeyDown={e => e.key === "Enter" && handleReply(ngoId, ngoName)}
                    />
                    <Button size="sm" variant="outline" className="h-8 gap-1" onClick={() => handleReply(ngoId, ngoName)}>
                      <Send className="h-3 w-3" /> Send
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        );
      }

      case "profile":
        return (
          <div className="space-y-6">
            {/* Profile header */}
            <div className="rounded-xl border bg-card p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl">
                  {currentVol.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <h2 className="text-lg font-bold">{currentVol.name}</h2>
                  <p className="text-xs text-muted-foreground">{currentVol.location} • {currentVol.phone}</p>
                  <AvailabilityToggle status={availability} onChange={setAvailability} />
                </div>
              </div>
            </div>

            {/* Editable Skills */}
            <div className="rounded-xl border bg-card p-5">
              <h3 className="text-sm font-bold mb-3 flex items-center gap-1.5"><User className="h-4 w-4 text-primary" /> Skills</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {skills.map(s => (
                  <span key={s} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary flex items-center gap-1.5">
                    {s}
                    <button onClick={() => handleRemoveSkill(s)} className="hover:text-destructive"><X className="h-3 w-3" /></button>
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ALL_SKILLS.filter(s => !skills.includes(s)).slice(0, 8).map(s => (
                  <Button key={s} size="sm" variant="outline" className="h-7 text-[10px] gap-1" onClick={() => handleAddSkill(s)}>
                    <Plus className="h-3 w-3" /> {s}
                  </Button>
                ))}
              </div>
            </div>

            {/* Performance Stats */}
            <div>
              <h3 className="text-sm font-bold mb-3 flex items-center gap-1.5"><Trophy className="h-4 w-4 text-warning" /> Performance</h3>
              <div className="grid gap-3 sm:grid-cols-4">
                <div className="rounded-xl border bg-card p-5 text-center"><p className="text-2xl font-bold tabular-nums">{currentVol.tasksCompleted}</p><p className="text-xs text-muted-foreground">Tasks Done</p></div>
                <div className="rounded-xl border bg-card p-5 text-center"><p className="text-2xl font-bold tabular-nums text-success">{currentVol.responseRate}%</p><p className="text-xs text-muted-foreground">Response Rate</p></div>
                <div className="rounded-xl border bg-card p-5 text-center"><p className="text-2xl font-bold tabular-nums text-primary">{currentVol.reliabilityScore}</p><p className="text-xs text-muted-foreground">Reliability</p></div>
                <div className="rounded-xl border bg-card p-5 text-center"><p className="text-2xl font-bold tabular-nums">#3</p><p className="text-xs text-muted-foreground">Ranking</p></div>
              </div>
            </div>

            {/* Badges */}
            <div>
              <h3 className="text-sm font-bold mb-3 flex items-center gap-1.5"><Star className="h-4 w-4 text-warning" /> Rewards & Badges</h3>
              <BadgeDisplay tasksCompleted={currentVol.tasksCompleted} reliabilityScore={currentVol.reliabilityScore} />
            </div>

            {/* Activity History - Expandable */}
            <div>
              <h3 className="text-sm font-bold mb-3">Activity History</h3>
              <div className="space-y-2">
                {activities.map(a => (
                  <div key={a.id} className="rounded-lg border bg-card overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-muted/30 transition-colors"
                      onClick={() => setExpandedActivity(expandedActivity === a.id ? null : a.id)}
                    >
                      <div className="flex items-center gap-2">
                        <div className={cn("h-2 w-2 rounded-full",
                          a.type === "completed" ? "bg-success" : a.type === "emergency" ? "bg-destructive" : a.type === "assigned" ? "bg-primary" : "bg-warning"
                        )} />
                        <span className="text-xs font-medium">{a.action}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground">{a.time}</span>
                        {expandedActivity === a.id ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                      </div>
                    </button>
                    {expandedActivity === a.id && (
                      <div className="px-3 pb-3 pt-0 border-t">
                        <p className="text-xs text-muted-foreground mt-2">
                          {a.type === "completed" ? "Successfully completed this task. Verified by assigned NGO." :
                           a.type === "emergency" ? "Joined emergency response team. Coordinated with NDRF and local authorities." :
                           a.type === "assigned" ? "Task accepted and work commenced. ETA provided to coordinating NGO." :
                           "Status updated and progress reported to dashboard."}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-1">Category: {a.type} • Logged: {a.time}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Connected NGOs */}
            <div>
              <h3 className="text-sm font-bold mb-3 flex items-center gap-1.5"><Building2 className="h-4 w-4 text-primary" /> Connected NGOs</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {connectedNgos.map(ngo => (
                  <div key={ngo.id} className="rounded-xl border bg-card p-4 transition-all hover:shadow-md">
                    <h4 className="text-sm font-semibold">{ngo.name}</h4>
                    <p className="text-xs text-muted-foreground">{ngo.focusArea} • {ngo.location}</p>
                    <p className="text-xs text-muted-foreground mt-1">{ngo.issuesHandled} issues handled • {ngo.successRate}% success</p>
                    <Button size="sm" variant="outline" className="h-7 text-xs mt-2 gap-1" onClick={() => setSelectedNgoId(ngo.id)}>
                      <Eye className="h-3 w-3" /> View Details
                    </Button>
                  </div>
                ))}
                {connectedNgos.length === 0 && <p className="text-sm text-muted-foreground">Not connected to any NGO yet.</p>}
              </div>
            </div>
          </div>
        );

      case "alerts":
        return (
          <div className="space-y-4">
            <h2 className="text-base font-bold">Active Alerts</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {alerts.map(a => (
                <div key={a.id} className="cursor-pointer" onClick={() => setSelectedAlert(a)}>
                  <AlertCard alert={a} />
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <VolunteerSidebar active={section} onNavigate={setSection} />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
            <div className="flex h-14 items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="mr-1" />
                <Link to="/"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
                <div>
                  <h1 className="text-sm font-bold">{currentVol.name}</h1>
                  <AvailabilityToggle status={availability} onChange={setAvailability} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <NotificationBell notifications={volNotifications} autoToast={{ message: "📋 New task assigned", description: "Food shortage relief near your area", delay: 3000 }} />
                <Button variant="destructive" size="sm" className="gap-1.5 animate-pulse hover:animate-none active:scale-95" onClick={handleEmergencyJoin}>
                  <Zap className="h-3.5 w-3.5" /> Join Emergency
                </Button>
                <ThemeToggle />
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full">
            {renderContent()}
          </main>
        </div>
      </div>

      <IssueReportForm open={reportOpen} onOpenChange={setReportOpen} onSubmit={handleNewIssue} />
      <IssueDetailDialog issue={selectedIssue} open={!!selectedIssue} onOpenChange={(open) => !open && setSelectedIssue(null)} />
      <AlertDetailDialog alert={selectedAlert} open={!!selectedAlert} onOpenChange={(open) => !open && setSelectedAlert(null)} />
      <NGODetailDialog ngo={selectedNgo} open={!!selectedNgo} onOpenChange={(open) => !open && setSelectedNgoId(null)} />
    </SidebarProvider>
  );
}
