import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { issues as initialIssues, ngos, volunteers, alerts, type Issue } from "@/data/mockData";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { HeatmapPlaceholder } from "@/components/dashboard/HeatmapPlaceholder";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { AIPriorityCard } from "@/components/dashboard/AIPriorityCard";
import { QuickActionBar } from "@/components/dashboard/QuickActionBar";
import { IssueReportForm } from "@/components/dashboard/IssueReportForm";
import { IssueDetailDialog } from "@/components/dashboard/IssueDetailDialog";
import { TaskAssignDialog } from "@/components/dashboard/TaskAssignDialog";
import { VolunteerMatchCard } from "@/components/dashboard/VolunteerMatchCard";
import { ActivityLog, type Activity } from "@/components/dashboard/ActivityLog";
import { NotificationBell, type Notification } from "@/components/dashboard/NotificationBell";
import { StatusBadge } from "@/components/StatusBadge";
import { UrgencyBadge } from "@/components/UrgencyBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  ArrowLeft, BarChart3, Users, AlertTriangle, CheckCircle, Clock,
  Plus, ShieldAlert, Brain, Send, Megaphone, HandHelping, Activity as ActivityIcon,
  Trophy, UserCheck, Handshake
} from "lucide-react";
import { toast } from "sonner";

const currentNgo = ngos[0];

const ngoNotifications: Notification[] = [
  { id: "n1", title: "New Issue Reported", message: "Flooded road near your area needs attention.", type: "warning", time: "1m ago", read: false },
  { id: "n2", title: "Volunteer Available", message: "Priya Sharma is nearby and ready to help.", type: "info", time: "10m ago", read: false },
  { id: "n3", title: "Issue Resolved", message: "Road debris clearing completed.", type: "success", time: "45m ago", read: true },
];

export default function DashboardNGO() {
  const [issueList, setIssueList] = useState<Issue[]>(initialIssues);
  const [search, setSearch] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [assignIssue, setAssignIssue] = useState<Issue | null>(null);
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [crisisMode, setCrisisMode] = useState(false);

  const [activities] = useState<Activity[]>([
    { id: "a1", action: "Claimed issue: Flooded road near Sector 14", time: "2h ago", type: "assigned" },
    { id: "a2", action: "Volunteer Priya assigned to medical supply task", time: "3h ago", type: "assigned" },
    { id: "a3", action: "Issue resolved: Road debris blocking evacuation", time: "5h ago", type: "completed" },
    { id: "a4", action: "Emergency alert: Flood warning in Bihar", time: "6h ago", type: "emergency" },
    { id: "a5", action: "Status updated: Water supply — In Progress", time: "8h ago", type: "update" },
    { id: "a6", action: "Requested help from GreenHands Trust", time: "10h ago", type: "update" },
  ]);

  const ngoIssues = useMemo(() => issueList.filter((i) => i.assignedNgo === currentNgo.id || i.assignedNgo === null), [issueList]);

  const filtered = useMemo(() => {
    return ngoIssues.filter((i) => {
      if (search && !i.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (urgencyFilter !== "all" && i.urgency !== urgencyFilter) return false;
      if (statusFilter !== "all" && i.status !== statusFilter) return false;
      return true;
    });
  }, [ngoIssues, search, urgencyFilter, statusFilter]);

  const stats = useMemo(() => ({
    assigned: issueList.filter((i) => i.assignedNgo === currentNgo.id).length,
    active: issueList.filter((i) => i.assignedNgo === currentNgo.id && i.status !== "Solved").length,
    completed: issueList.filter((i) => i.assignedNgo === currentNgo.id && i.status === "Solved").length,
    avgResponse: currentNgo.avgResponseTime,
    activeVols: volunteers.filter((v) => v.available).length,
  }), [issueList]);

  const topIssue = useMemo(() => [...ngoIssues].sort((a, b) => b.aiPriorityScore - a.aiPriorityScore)[0], [ngoIssues]);

  const handleClaim = (id: string) => {
    setIssueList((prev) => prev.map((i) => i.id === id ? { ...i, assignedNgo: currentNgo.id, status: "Verified" as const } : i));
    toast.success("Issue claimed by " + currentNgo.name);
  };
  const handleStatusUpdate = (id: string, status: Issue["status"]) => {
    setIssueList((prev) => prev.map((i) => i.id === id ? { ...i, status } : i));
    toast.success(`Status updated to ${status}`);
  };
  const handleNewIssue = (issue: Issue) => {
    setIssueList((prev) => [{ ...issue, assignedNgo: currentNgo.id }, ...prev]);
    toast.success("Issue reported");
  };
  const handleAutoAssign = () => {
    const available = volunteers.filter((v) => v.available);
    const unassigned = issueList.filter((i) => i.assignedNgo === null);
    if (unassigned.length === 0) { toast.info("No unassigned issues"); return; }
    const randomVol = available[Math.floor(Math.random() * available.length)];
    setIssueList((prev) => prev.map((i) => i.id === unassigned[0].id ? { ...i, assignedNgo: currentNgo.id, status: "Verified" as const } : i));
    toast.success(`Auto-assigned ${randomVol?.name} to "${unassigned[0].title}"`);
  };
  const handleBroadcast = () => {
    if (!broadcastMsg.trim()) return;
    toast.success("📢 Message sent to all volunteers", { description: broadcastMsg });
    setBroadcastMsg("");
  };

  const matchedVolunteers = useMemo(() =>
    volunteers.filter((v) => v.available).map((v) => ({
      volunteer: v,
      matchScore: Math.min(100, v.reliabilityScore + Math.floor(Math.random() * 15)),
      distance: `${(Math.random() * 8 + 0.5).toFixed(1)} km`,
    })).sort((a, b) => b.matchScore - a.matchScore),
    []
  );

  return (
    <div className={`min-h-screen bg-background ${crisisMode ? "ring-2 ring-danger ring-inset" : ""}`}>
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link to="/"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
            <h1 className="text-base font-bold">{currentNgo.name}</h1>
            {crisisMode && <span className="rounded-full bg-danger px-2.5 py-0.5 text-[10px] font-bold text-danger-foreground animate-pulse">CRISIS MODE</span>}
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell
              notifications={ngoNotifications}
              autoToast={{ message: "📋 New issue reported in your area", description: "Flooded road near Sector 14 needs immediate attention", delay: 3500 }}
            />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        <QuickActionBar actions={[
          { label: "Report Issue", icon: Plus, onClick: () => setReportOpen(true) },
          { label: "Auto Assign", icon: UserCheck, onClick: handleAutoAssign },
          { label: "Broadcast", icon: Megaphone, onClick: () => toast.info("Use broadcast panel below") },
          { label: crisisMode ? "Deactivate Crisis" : "Crisis Mode", icon: ShieldAlert, onClick: () => { setCrisisMode(!crisisMode); toast(crisisMode ? "Crisis mode off" : "🚨 Crisis mode activated!"); }, variant: crisisMode ? "destructive" : "outline" },
        ]} />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <MetricCard icon={BarChart3} label="Assigned" value={stats.assigned} delay={0} />
          <MetricCard icon={AlertTriangle} label="Active" value={stats.active} trend={{ direction: "up", value: "+1" }} delay={80} />
          <MetricCard icon={CheckCircle} label="Completed" value={stats.completed} trend={{ direction: "up", value: "+2" }} delay={160} />
          <MetricCard icon={Clock} label="Avg Response" value={stats.avgResponse} trend={{ direction: "down", value: "-8m" }} delay={240} />
          <MetricCard icon={Users} label="Volunteers" value={stats.activeVols} delay={320} />
        </div>

        {/* AI + Map */}
        <div className="grid gap-4 lg:grid-cols-2">
          {topIssue && <AIPriorityCard issue={topIssue} />}
          <HeatmapPlaceholder issues={ngoIssues} volunteers={volunteers} size="lg" onIssueClick={setSelectedIssue} showStats />
        </div>

        {/* Issue Management */}
        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Brain className="h-3.5 w-3.5 text-primary" /> Issue Management</h2>
          <FilterBar search={search} onSearchChange={setSearch} filters={[
            { label: "Urgency", value: urgencyFilter, onChange: setUrgencyFilter, options: [{ value: "High", label: "High" }, { value: "Medium", label: "Medium" }, { value: "Low", label: "Low" }] },
            { label: "Status", value: statusFilter, onChange: setStatusFilter, options: [{ value: "Pending", label: "Pending" }, { value: "Verified", label: "Verified" }, { value: "In Progress", label: "In Progress" }, { value: "Solved", label: "Solved" }] },
          ]} />
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {filtered.map((issue) => (
              <div key={issue.id} className="rounded-xl border bg-card p-4 transition-all hover:shadow-md hover:-translate-y-0.5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-semibold leading-snug">{issue.title}</h3>
                  <UrgencyBadge urgency={issue.urgency} />
                </div>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{issue.description}</p>
                <div className="flex items-center justify-between gap-2">
                  <StatusBadge status={issue.status} />
                  <div className="flex gap-1">
                    {!issue.assignedNgo && (
                      <Button size="sm" className="h-7 text-xs active:scale-95" onClick={() => handleClaim(issue.id)}>
                        <HandHelping className="h-3 w-3 mr-1" />Claim
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="h-7 text-xs active:scale-95" onClick={() => setSelectedIssue(issue)}>Details</Button>
                    {issue.assignedNgo === currentNgo.id && issue.status !== "Solved" && (
                      <Button size="sm" variant="outline" className="h-7 text-xs active:scale-95" onClick={() => setAssignIssue(issue)}>
                        <Users className="h-3 w-3 mr-1" />Assign
                      </Button>
                    )}
                  </div>
                </div>
                {issue.assignedNgo === currentNgo.id && issue.status !== "Solved" && (
                  <div className="mt-2 pt-2 border-t flex gap-1 flex-wrap">
                    {(["Verified", "In Progress", "Solved"] as Issue["status"][]).map((s) => (
                      <Button key={s} size="sm" variant={issue.status === s ? "default" : "outline"} className="h-6 text-[10px] px-2 active:scale-95" onClick={() => handleStatusUpdate(issue.id, s)}>
                        {s}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Volunteer Matching */}
        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><UserCheck className="h-3.5 w-3.5 text-primary" /> Smart Volunteer Matching</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {matchedVolunteers.slice(0, 4).map((m, i) => (
              <VolunteerMatchCard key={m.volunteer.id} volunteer={m.volunteer} matchScore={m.matchScore} distance={m.distance} highlight={i === 0} onAssign={() => toast.success(`${m.volunteer.name} assigned!`)} />
            ))}
          </div>
        </div>

        {/* Collaboration */}
        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Handshake className="h-3.5 w-3.5 text-primary" /> Collaboration</h2>
          <div className="grid gap-2 sm:grid-cols-3">
            {ngos.filter((n) => n.id !== currentNgo.id).map((ngo) => (
              <div key={ngo.id} className="rounded-xl border bg-card p-4 transition-all hover:shadow-md hover:-translate-y-0.5">
                <p className="text-sm font-semibold">{ngo.name}</p>
                <p className="text-xs text-muted-foreground mb-2">{ngo.focusArea}</p>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" className="h-7 text-xs active:scale-95" onClick={() => toast.success(`Help requested from ${ngo.name}`)}>Request Help</Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs active:scale-95" onClick={() => toast.success(`Resources shared with ${ngo.name}`)}>Share Resources</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Communication */}
        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Send className="h-3.5 w-3.5 text-primary" /> Broadcast to Volunteers</h2>
          <div className="flex gap-2">
            <Input placeholder="Type message for all volunteers…" value={broadcastMsg} onChange={(e) => setBroadcastMsg(e.target.value)} className="h-9" />
            <Button size="sm" onClick={handleBroadcast} className="gap-1.5 shrink-0 active:scale-95"><Send className="h-3.5 w-3.5" /> Send</Button>
          </div>
        </div>

        {/* Analytics */}
        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Trophy className="h-3.5 w-3.5 text-warning" /> Performance Analytics</h2>
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-xl border bg-card p-5 text-center transition-all hover:shadow-md"><p className="text-2xl font-bold tabular-nums">{currentNgo.issuesHandled}</p><p className="text-xs text-muted-foreground">Issues Handled</p></div>
            <div className="rounded-xl border bg-card p-5 text-center transition-all hover:shadow-md"><p className="text-2xl font-bold tabular-nums text-success">{currentNgo.successRate}%</p><p className="text-xs text-muted-foreground">Success Rate</p></div>
            <div className="rounded-xl border bg-card p-5 text-center transition-all hover:shadow-md"><p className="text-xl font-bold">{currentNgo.avgResponseTime}</p><p className="text-xs text-muted-foreground">Avg Response</p></div>
            <div className="rounded-xl border bg-card p-5 text-center transition-all hover:shadow-md"><p className="text-2xl font-bold tabular-nums text-primary">4,200</p><p className="text-xs text-muted-foreground">Lives Impacted</p></div>
          </div>
        </div>

        {/* Resource Allocation */}
        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><ActivityIcon className="h-3.5 w-3.5 text-primary" /> Resource Status</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border bg-card p-5 text-center transition-all hover:shadow-md"><p className="text-2xl font-bold tabular-nums">{volunteers.filter((v) => v.available).length}</p><p className="text-xs text-muted-foreground">Available Volunteers</p></div>
            <div className="rounded-xl border bg-card p-5 text-center transition-all hover:shadow-md"><p className="text-2xl font-bold tabular-nums">{ngoIssues.filter((i) => i.status !== "Solved").length}</p><p className="text-xs text-muted-foreground">Open Issues</p></div>
            <div className="rounded-xl border bg-warning/10 border-warning/30 p-5 text-center"><p className="text-sm font-bold text-warning">Need 3 more volunteers in Area B</p><p className="text-xs text-muted-foreground">Resource Gap</p></div>
          </div>
        </div>

        {/* Activity Log */}
        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Recent Activity</h2>
          <div className="rounded-xl border bg-card p-4"><ActivityLog activities={activities} /></div>
        </div>

        {/* Alerts */}
        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Notifications</h2>
          <div className="grid gap-2 sm:grid-cols-2">{alerts.slice(0, 3).map((a) => <AlertCard key={a.id} alert={a} />)}</div>
        </div>
      </main>

      <IssueReportForm open={reportOpen} onOpenChange={setReportOpen} onSubmit={handleNewIssue} />
      <IssueDetailDialog issue={selectedIssue} open={!!selectedIssue} onOpenChange={(open) => !open && setSelectedIssue(null)} showAIInsights />
      <TaskAssignDialog issue={assignIssue} open={!!assignIssue} onOpenChange={(open) => !open && setAssignIssue(null)} />
    </div>
  );
}
