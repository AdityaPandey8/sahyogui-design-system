import { useState, useMemo } from "react";
import { issues as initialIssues, ngos, volunteers as initialVolunteers, alerts, type Issue, type NGO, type Volunteer, type Alert as AlertType } from "@/data/mockData";
import { AIChatWidget } from "@/components/dashboard/AIChatWidget";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { HeatmapPlaceholder } from "@/components/dashboard/HeatmapPlaceholder";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { AIPriorityCard } from "@/components/dashboard/AIPriorityCard";
import { QuickActionBar } from "@/components/dashboard/QuickActionBar";
import { IssueReportForm } from "@/components/dashboard/IssueReportForm";
import { IssueDetailDialog } from "@/components/dashboard/IssueDetailDialog";
import { TaskAssignDialog } from "@/components/dashboard/TaskAssignDialog";
import { VolunteerDetailDialog } from "@/components/dashboard/VolunteerDetailDialog";
import { NGODetailDialog } from "@/components/dashboard/NGODetailDialog";
import { AlertDetailDialog } from "@/components/dashboard/AlertDetailDialog";
import { VolunteerMatchCard } from "@/components/dashboard/VolunteerMatchCard";
import { ActivityLog, type Activity } from "@/components/dashboard/ActivityLog";
import type { Notification } from "@/components/dashboard/NotificationBell";
import { StatusBadge } from "@/components/StatusBadge";
import { UrgencyBadge } from "@/components/UrgencyBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  BarChart3, Users, AlertTriangle, CheckCircle, Clock,
  Plus, ShieldAlert, Brain, Send, Megaphone, HandHelping,
  Trophy, UserCheck, Handshake, LayoutDashboard, FileText, Building2,
  Bell, Eye, ShieldCheck, ShieldOff, X
} from "lucide-react";
import { toast } from "sonner";

const currentNgo = ngos[0];

type NgoSection = "overview" | "issues" | "volunteers" | "otherNgos" | "alerts" | "communication";

const sidebarItems: { id: NgoSection; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "issues", label: "Issues", icon: FileText },
  { id: "volunteers", label: "Volunteers", icon: Users },
  { id: "otherNgos", label: "Other NGOs", icon: Building2 },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "communication", label: "Communication", icon: Megaphone },
];

const ngoNotifications: Notification[] = [
  { id: "n1", title: "New Issue Reported", message: "Flooded road near your area needs attention.", type: "warning", time: "1m ago", read: false },
  { id: "n2", title: "Volunteer Available", message: "Priya Sharma is nearby and ready to help.", type: "info", time: "10m ago", read: false },
  { id: "n3", title: "Issue Resolved", message: "Road debris clearing completed.", type: "success", time: "45m ago", read: true },
];

export default function DashboardNGO() {
  const [section, setSection] = useState<NgoSection>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [issueList, setIssueList] = useState<Issue[]>(initialIssues);
  const [volList, setVolList] = useState<Volunteer[]>(initialVolunteers);
  const [search, setSearch] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [assignIssue, setAssignIssue] = useState<Issue | null>(null);
  const [selectedVol, setSelectedVol] = useState<Volunteer | null>(null);
  const [selectedNgo, setSelectedNgo] = useState<NGO | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [crisisMode, setCrisisMode] = useState(false);

  const [activities] = useState<Activity[]>([
    { id: "a1", action: "Claimed issue: Flooded road near Sector 14", time: "2h ago", type: "assigned" },
    { id: "a2", action: "Volunteer Priya assigned to medical supply task", time: "3h ago", type: "assigned" },
    { id: "a3", action: "Issue resolved: Road debris blocking evacuation", time: "5h ago", type: "completed" },
    { id: "a4", action: "Emergency alert: Flood warning in Bihar", time: "6h ago", type: "emergency" },
    { id: "a5", action: "Status updated: Water supply — In Progress", time: "8h ago", type: "update" },
  ]);

  const ngoIssues = useMemo(() => issueList.filter((i) => i.assignedNgo === currentNgo.id || i.assignedNgo === null), [issueList]);
  const locations = useMemo(() => [...new Set(ngoIssues.map(i => i.location))], [ngoIssues]);
  const categories = useMemo(() => [...new Set(ngoIssues.map(i => i.category))], [ngoIssues]);

  const filtered = useMemo(() => {
    return ngoIssues.filter((i) => {
      if (search && !i.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (urgencyFilter !== "all" && i.urgency !== urgencyFilter) return false;
      if (statusFilter !== "all" && i.status !== statusFilter) return false;
      if (locationFilter !== "all" && i.location !== locationFilter) return false;
      if (categoryFilter !== "all" && i.category !== categoryFilter) return false;
      return true;
    });
  }, [ngoIssues, search, urgencyFilter, statusFilter, locationFilter, categoryFilter]);

  const stats = useMemo(() => ({
    assigned: issueList.filter((i) => i.assignedNgo === currentNgo.id).length,
    active: issueList.filter((i) => i.assignedNgo === currentNgo.id && i.status !== "Solved").length,
    completed: issueList.filter((i) => i.assignedNgo === currentNgo.id && i.status === "Solved").length,
    avgResponse: currentNgo.avgResponseTime,
    activeVols: volList.filter((v) => v.available && !v.blocked).length,
  }), [issueList, volList]);

  const topIssue = useMemo(() => [...ngoIssues].sort((a, b) => b.aiPriorityScore - a.aiPriorityScore)[0], [ngoIssues]);

  const handleClaim = (id: string) => {
    setIssueList((prev) => prev.map((i) => i.id === id ? { ...i, assignedNgo: currentNgo.id, status: "Verified" as const } : i));
    toast.success("Issue claimed by " + currentNgo.name);
  };
  const handleUnclaim = (id: string) => {
    setIssueList((prev) => prev.map((i) => i.id === id ? { ...i, assignedNgo: null } : i));
    toast("Issue unclaimed");
  };
  const handleStatusUpdate = (id: string, status: Issue["status"]) => {
    setIssueList((prev) => prev.map((i) => i.id === id ? { ...i, status } : i));
    toast.success(`Status updated to ${status}`);
  };
  const handleNewIssue = (issue: Issue) => {
    setIssueList((prev) => [{ ...issue, assignedNgo: currentNgo.id }, ...prev]);
    toast.success("Issue reported");
  };
  const handleBlockVol = (id: string) => {
    setVolList(prev => prev.map(v => v.id === id ? { ...v, blocked: !v.blocked } : v));
    const vol = volList.find(v => v.id === id);
    toast.success(`${vol?.name} ${vol?.blocked ? "unblocked" : "blocked"}`);
  };
  const handleBroadcast = () => {
    if (!broadcastMsg.trim()) return;
    toast.success("📢 Message sent to all volunteers", { description: broadcastMsg });
    setBroadcastMsg("");
  };

  const matchedVolunteers = useMemo(() =>
    volList.filter((v) => v.available && !v.blocked).map((v) => ({
      volunteer: v,
      matchScore: Math.min(100, v.reliabilityScore + Math.floor(Math.random() * 15)),
      distance: `${(Math.random() * 8 + 0.5).toFixed(1)} km`,
    })).sort((a, b) => b.matchScore - a.matchScore),
    [volList]
  );

  const renderContent = () => {
    switch (section) {
      case "overview":
        return (
          <div className="space-y-8">
            <QuickActionBar actions={[
              { label: "Report Issue", icon: Plus, onClick: () => setReportOpen(true) },
              { label: crisisMode ? "Deactivate Crisis" : "Crisis Mode", icon: ShieldAlert, onClick: () => { setCrisisMode(!crisisMode); toast(crisisMode ? "Crisis mode off" : "🚨 Crisis mode activated!"); }, variant: crisisMode ? "destructive" : "outline" },
            ]} />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <MetricCard icon={BarChart3} label="Assigned" value={stats.assigned} delay={0} />
              <MetricCard icon={AlertTriangle} label="Active" value={stats.active} trend={{ direction: "up", value: "+1" }} delay={80} />
              <MetricCard icon={CheckCircle} label="Completed" value={stats.completed} trend={{ direction: "up", value: "+2" }} delay={160} />
              <MetricCard icon={Clock} label="Avg Response" value={stats.avgResponse} trend={{ direction: "down", value: "-8m" }} delay={240} />
              <MetricCard icon={Users} label="Volunteers" value={stats.activeVols} delay={320} />
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              {topIssue && <AIPriorityCard issue={topIssue} />}
              <HeatmapPlaceholder issues={ngoIssues} volunteers={volList} size="lg" onIssueClick={setSelectedIssue} showStats />
            </div>
          </div>
        );

      case "issues":
        return (
          <div className="space-y-6">
            <h2 className="text-base font-bold flex items-center gap-2"><Brain className="h-4 w-4 text-primary" /> Issue Management</h2>
            <FilterBar search={search} onSearchChange={setSearch} filters={[
              { label: "Urgency", value: urgencyFilter, onChange: setUrgencyFilter, options: [{ value: "High", label: "High" }, { value: "Medium", label: "Medium" }, { value: "Low", label: "Low" }] },
              { label: "Status", value: statusFilter, onChange: setStatusFilter, options: [{ value: "Pending", label: "Pending" }, { value: "Verified", label: "Verified" }, { value: "In Progress", label: "In Progress" }, { value: "Solved", label: "Solved" }] },
              { label: "Location", value: locationFilter, onChange: setLocationFilter, options: locations.map(l => ({ value: l, label: l })) },
              { label: "Category", value: categoryFilter, onChange: setCategoryFilter, options: categories.map(c => ({ value: c, label: c })) },
            ]} />
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {filtered.map((issue) => (
                <div key={issue.id} className="rounded-xl border bg-card p-4 transition-all hover:shadow-md hover:-translate-y-0.5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="text-sm font-semibold leading-snug">{issue.title}</h3>
                    <UrgencyBadge urgency={issue.urgency} />
                  </div>
                  <p className="text-xs text-muted-foreground mb-1">{issue.location}</p>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{issue.description}</p>
                  <div className="flex items-center justify-between gap-2">
                    <StatusBadge status={issue.status} />
                    <div className="flex gap-1">
                      {!issue.assignedNgo && (
                        <Button size="sm" className="h-7 text-xs" onClick={() => handleClaim(issue.id)}>
                          <HandHelping className="h-3 w-3 mr-1" />Claim
                        </Button>
                      )}
                      {issue.assignedNgo === currentNgo.id && (
                        <Button size="sm" variant="ghost" className="h-7 text-xs text-danger" onClick={() => handleUnclaim(issue.id)}>
                          <X className="h-3 w-3 mr-1" />Unclaim
                        </Button>
                      )}
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setSelectedIssue(issue)}>Details</Button>
                      {issue.assignedNgo === currentNgo.id && issue.status !== "Solved" && (
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setAssignIssue(issue)}>
                          <Users className="h-3 w-3 mr-1" />Assign
                        </Button>
                      )}
                    </div>
                  </div>
                  {issue.assignedNgo === currentNgo.id && issue.status !== "Solved" && (
                    <div className="mt-2 pt-2 border-t flex gap-1 flex-wrap">
                      {(["Verified", "In Progress", "Solved"] as Issue["status"][]).map((s) => (
                        <Button key={s} size="sm" variant={issue.status === s ? "default" : "outline"} className="h-6 text-[10px] px-2" onClick={() => handleStatusUpdate(issue.id, s)}>
                          {s}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "volunteers":
        return (
          <div className="space-y-6">
            <h2 className="text-base font-bold flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Volunteer Management</h2>
            <div className="rounded-xl border overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Tasks</TableHead>
                    <TableHead>Reliability</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {volList.map(vol => (
                    <TableRow key={vol.id} className="transition-colors hover:bg-muted/50">
                      <TableCell className="font-medium text-sm">{vol.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[120px] truncate">{vol.skills.join(", ")}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{vol.location}</TableCell>
                      <TableCell className="tabular-nums">{vol.tasksCompleted}</TableCell>
                      <TableCell className="tabular-nums">{vol.reliabilityScore}</TableCell>
                      <TableCell>
                        <span className={cn("text-xs font-medium", vol.blocked ? "text-danger" : vol.available ? "text-success" : "text-muted-foreground")}>
                          {vol.blocked ? "Blocked" : vol.available ? "Active" : "Offline"}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setSelectedVol(vol)}><Eye className="h-3 w-3 mr-1" />Details</Button>
                          <Button size="sm" variant={vol.blocked ? "default" : "destructive"} className="h-7 text-xs" onClick={() => handleBlockVol(vol.id)}>
                            {vol.blocked ? <ShieldCheck className="h-3 w-3" /> : <ShieldOff className="h-3 w-3" />}
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success(`Task assigned to ${vol.name}`)}><UserCheck className="h-3 w-3" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Smart Matching */}
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><UserCheck className="h-3.5 w-3.5 text-primary" /> Smart Volunteer Matching</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {matchedVolunteers.slice(0, 4).map((m, i) => (
                  <VolunteerMatchCard key={m.volunteer.id} volunteer={m.volunteer} matchScore={m.matchScore} distance={m.distance} highlight={i === 0} onAssign={() => toast.success(`${m.volunteer.name} assigned!`)} />
                ))}
              </div>
            </div>
          </div>
        );

      case "otherNgos":
        return (
          <div className="space-y-6">
            <h2 className="text-base font-bold flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /> Other NGOs</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {ngos.filter(n => n.id !== currentNgo.id).map(ngo => (
                <div key={ngo.id} className="rounded-xl border bg-card p-5 transition-all hover:shadow-md">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold">{ngo.name}</p>
                      <p className="text-xs text-muted-foreground">{ngo.focusArea}</p>
                    </div>
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setSelectedNgo(ngo)}>
                      <Eye className="h-3 w-3 mr-1" />Details
                    </Button>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center mb-3">
                    <div><p className="text-lg font-bold tabular-nums">{ngo.volunteerIds.length}</p><p className="text-[10px] text-muted-foreground">Volunteers</p></div>
                    <div><p className="text-lg font-bold tabular-nums">{ngo.issuesHandled}</p><p className="text-[10px] text-muted-foreground">Handled</p></div>
                    <div><p className={cn("text-lg font-bold tabular-nums", ngo.successRate >= 90 ? "text-success" : "text-warning")}>{ngo.successRate}%</p><p className="text-[10px] text-muted-foreground">Success</p></div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" className="h-7 text-xs flex-1" onClick={() => toast.success(`Help requested from ${ngo.name}`)}>
                      <Handshake className="h-3 w-3 mr-1" /> Request Help
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs flex-1" onClick={() => toast.success(`Resources shared with ${ngo.name}`)}>Share Resources</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "alerts":
        return (
          <div className="space-y-6">
            <h2 className="text-base font-bold flex items-center gap-2"><Bell className="h-4 w-4 text-warning" /> Alerts & Notifications</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {alerts.map(a => (
                <div key={a.id} className="cursor-pointer" onClick={() => setSelectedAlert(a)}>
                  <AlertCard alert={a} />
                </div>
              ))}
            </div>
          </div>
        );

      case "communication":
        return (
          <div className="space-y-6">
            {/* Broadcast */}
            <div>
              <h2 className="text-base font-bold flex items-center gap-2 mb-3"><Send className="h-4 w-4 text-primary" /> Broadcast to Volunteers</h2>
              <div className="flex gap-2">
                <Input placeholder="Type message for all volunteers…" value={broadcastMsg} onChange={(e) => setBroadcastMsg(e.target.value)} className="h-9" />
                <Button size="sm" onClick={handleBroadcast} className="gap-1.5 shrink-0"><Send className="h-3.5 w-3.5" /> Send</Button>
              </div>
            </div>

            {/* Analytics */}
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Trophy className="h-3.5 w-3.5 text-warning" /> Performance Analytics</h3>
              <div className="grid gap-3 sm:grid-cols-4">
                <div className="rounded-xl border bg-card p-5 text-center"><p className="text-2xl font-bold tabular-nums">{currentNgo.issuesHandled}</p><p className="text-xs text-muted-foreground">Issues Handled</p></div>
                <div className="rounded-xl border bg-card p-5 text-center"><p className="text-2xl font-bold tabular-nums text-success">{currentNgo.successRate}%</p><p className="text-xs text-muted-foreground">Success Rate</p></div>
                <div className="rounded-xl border bg-card p-5 text-center"><p className="text-xl font-bold">{currentNgo.avgResponseTime}</p><p className="text-xs text-muted-foreground">Avg Response</p></div>
                <div className="rounded-xl border bg-card p-5 text-center"><p className="text-2xl font-bold tabular-nums text-primary">4,200</p><p className="text-xs text-muted-foreground">Lives Impacted</p></div>
              </div>
            </div>

            {/* Activity Log */}
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Recent Activity</h3>
              <div className="rounded-xl border bg-card p-4"><ActivityLog activities={activities} /></div>
            </div>
          </div>
        );
    }
  };

  return (
    <DashboardShell
      panelLabel={currentNgo.name}
      sidebarItems={sidebarItems}
      activeSection={section}
      onSectionChange={(s) => setSection(s as NgoSection)}
      sidebarOpen={sidebarOpen}
      onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
      notifications={ngoNotifications}
      autoToast={{ message: "📋 New issue reported in your area", description: "Flooded road near Sector 14 needs immediate attention", delay: 3500 }}
      crisisMode={crisisMode}
    >
      {renderContent()}

      <IssueReportForm open={reportOpen} onOpenChange={setReportOpen} onSubmit={handleNewIssue} />
      <IssueDetailDialog issue={selectedIssue} open={!!selectedIssue} onOpenChange={(open) => !open && setSelectedIssue(null)} showAIInsights />
      <TaskAssignDialog issue={assignIssue} open={!!assignIssue} onOpenChange={(open) => !open && setAssignIssue(null)} />
      <VolunteerDetailDialog volunteer={selectedVol} open={!!selectedVol} onOpenChange={(open) => !open && setSelectedVol(null)} onBlock={handleBlockVol} />
      <NGODetailDialog ngo={selectedNgo} open={!!selectedNgo} onOpenChange={(open) => !open && setSelectedNgo(null)} showManageActions={false} />
      <AlertDetailDialog alert={selectedAlert} open={!!selectedAlert} onOpenChange={(open) => !open && setSelectedAlert(null)} />
    </DashboardShell>
  );
}
