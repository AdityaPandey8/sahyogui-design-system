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
import { NotificationBell, type Notification } from "@/components/dashboard/NotificationBell";
import { StatusBadge } from "@/components/StatusBadge";
import { UrgencyBadge } from "@/components/UrgencyBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowLeft, BarChart3, Users, AlertTriangle, CheckCircle, Clock, Plus, Megaphone, ShieldAlert, Trophy, Brain, Send, Flag, Activity } from "lucide-react";
import { toast } from "sonner";

const adminNotifications: Notification[] = [
  { id: "n1", title: "Issue Pending Verification", message: "3 new issues need verification.", type: "warning", time: "2m ago", read: false },
  { id: "n2", title: "Crisis Mode Available", message: "Bihar flood situation escalating.", type: "danger", time: "15m ago", read: false },
  { id: "n3", title: "NGO Performance Update", message: "CareLine Initiative resolved 5 issues today.", type: "success", time: "1h ago", read: true },
  { id: "n4", title: "Resource Gap Alert", message: "Area B needs 3 more volunteers.", type: "warning", time: "2h ago", read: true },
];

export default function DashboardAdmin() {
  const [issueList, setIssueList] = useState<Issue[]>(initialIssues);
  const [search, setSearch] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [crisisMode, setCrisisMode] = useState(false);

  const filtered = useMemo(() => {
    return issueList.filter((i) => {
      if (search && !i.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (urgencyFilter !== "all" && i.urgency !== urgencyFilter) return false;
      if (statusFilter !== "all" && i.status !== statusFilter) return false;
      return true;
    });
  }, [issueList, search, urgencyFilter, statusFilter]);

  const stats = useMemo(() => ({
    total: issueList.length,
    active: issueList.filter((i) => i.urgency === "High" && i.status !== "Solved").length,
    resolved: issueList.filter((i) => i.status === "Solved").length,
    avgResponse: "3h 12m",
    activeVols: volunteers.filter((v) => v.available).length,
  }), [issueList]);

  const topIssue = useMemo(() => [...issueList].sort((a, b) => b.aiPriorityScore - a.aiPriorityScore)[0], [issueList]);
  const pendingIssues = useMemo(() => issueList.filter((i) => i.status === "Pending"), [issueList]);
  const suspiciousIssues = useMemo(() => issueList.filter((i) => i.isFake), [issueList]);
  const prioritySorted = useMemo(() => [...filtered].sort((a, b) => b.aiPriorityScore - a.aiPriorityScore), [filtered]);

  const handleVerify = (id: string) => {
    setIssueList((prev) => prev.map((i) => i.id === id ? { ...i, status: "Verified" as const } : i));
    toast.success("Issue verified");
  };
  const handleReject = (id: string) => {
    setIssueList((prev) => prev.filter((i) => i.id !== id));
    toast("Issue rejected and removed");
  };
  const handleEscalate = (id: string) => {
    setIssueList((prev) => prev.map((i) => i.id === id ? { ...i, urgency: "High" as const, aiPriorityScore: Math.min(i.aiPriorityScore + 15, 100) } : i));
    toast.warning("Issue escalated");
  };
  const handleNewIssue = (issue: Issue) => {
    setIssueList((prev) => [issue, ...prev]);
    toast.success("Issue added");
  };
  const handleBroadcast = () => {
    if (!broadcastMsg.trim()) return;
    toast.success("🔔 Alert broadcasted", { description: broadcastMsg });
    setBroadcastMsg("");
  };

  return (
    <div className={`min-h-screen bg-background ${crisisMode ? "ring-2 ring-danger ring-inset" : ""}`}>
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link to="/"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
            <h1 className="text-base font-bold">Admin Dashboard</h1>
            {crisisMode && <span className="rounded-full bg-danger px-2.5 py-0.5 text-[10px] font-bold text-danger-foreground animate-pulse">CRISIS MODE</span>}
          </div>
          <div className="flex items-center gap-2">
            <NotificationBell
              notifications={adminNotifications}
              autoToast={{ message: "⚠️ Issue pending verification", description: "3 new issues need your review", delay: 4000 }}
            />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        <QuickActionBar actions={[
          { label: "Add Issue", icon: Plus, onClick: () => setReportOpen(true) },
          { label: "Broadcast Alert", icon: Megaphone, onClick: () => toast.info("Use broadcast panel below") },
          { label: crisisMode ? "Deactivate Crisis" : "Activate Crisis", icon: ShieldAlert, onClick: () => { setCrisisMode(!crisisMode); toast(crisisMode ? "Crisis mode deactivated" : "🚨 Crisis mode activated!"); }, variant: crisisMode ? "destructive" : "outline" },
        ]} />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <MetricCard icon={BarChart3} label="Total Issues" value={stats.total} trend={{ direction: "up", value: "+3" }} delay={0} />
          <MetricCard icon={AlertTriangle} label="Active Crises" value={stats.active} trend={{ direction: "up", value: "+1" }} delay={80} />
          <MetricCard icon={CheckCircle} label="Resolved" value={stats.resolved} trend={{ direction: "up", value: "+2" }} delay={160} />
          <MetricCard icon={Clock} label="Avg Response" value={stats.avgResponse} trend={{ direction: "down", value: "-12m" }} delay={240} />
          <MetricCard icon={Users} label="Active Volunteers" value={stats.activeVols} delay={320} />
        </div>

        {/* AI Panel + Map */}
        <div className="grid gap-4 lg:grid-cols-2">
          {topIssue && <AIPriorityCard issue={topIssue} />}
          <HeatmapPlaceholder issues={issueList} volunteers={volunteers} size="lg" onIssueClick={setSelectedIssue} showStats />
        </div>

        {/* Priority Queue */}
        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Brain className="h-3.5 w-3.5 text-primary" /> Priority Issue Queue</h2>
          <FilterBar search={search} onSearchChange={setSearch} filters={[
            { label: "Urgency", value: urgencyFilter, onChange: setUrgencyFilter, options: [{ value: "High", label: "High" }, { value: "Medium", label: "Medium" }, { value: "Low", label: "Low" }] },
            { label: "Status", value: statusFilter, onChange: setStatusFilter, options: [{ value: "Pending", label: "Pending" }, { value: "Verified", label: "Verified" }, { value: "In Progress", label: "In Progress" }, { value: "Solved", label: "Solved" }] },
          ]} />
          <div className="mt-2 rounded-xl border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Score</TableHead>
                  <TableHead>Issue</TableHead>
                  <TableHead className="hidden sm:table-cell">Location</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Affected</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prioritySorted.slice(0, 8).map((issue) => (
                  <TableRow key={issue.id} className="transition-colors hover:bg-muted/50">
                    <TableCell className="font-bold tabular-nums">{issue.aiPriorityScore}</TableCell>
                    <TableCell className="font-medium text-xs max-w-[180px] truncate">{issue.title}</TableCell>
                    <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">{issue.location}</TableCell>
                    <TableCell><UrgencyBadge urgency={issue.urgency} /></TableCell>
                    <TableCell><StatusBadge status={issue.status} /></TableCell>
                    <TableCell className="hidden md:table-cell tabular-nums text-xs">{issue.affectedPeople.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="outline" className="h-7 text-xs active:scale-95" onClick={() => setSelectedIssue(issue)}>View</Button>
                        <Button size="sm" variant="outline" className="h-7 text-xs active:scale-95" onClick={() => handleEscalate(issue.id)}>Escalate</Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Verification */}
        {pendingIssues.length > 0 && (
          <div>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Flag className="h-3.5 w-3.5 text-warning" /> Issue Verification ({pendingIssues.length})</h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {pendingIssues.map((issue) => (
                <div key={issue.id} className="flex items-center justify-between rounded-xl border p-4 transition-all hover:shadow-sm">
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{issue.title}</p>
                    <p className="text-xs text-muted-foreground">Source: {issue.isAnonymous ? "Anonymous" : issue.reportedBy}</p>
                  </div>
                  <div className="flex gap-1 shrink-0 ml-2">
                    <Button size="sm" className="h-7 text-xs active:scale-95" onClick={() => handleVerify(issue.id)}>Verify</Button>
                    <Button size="sm" variant="destructive" className="h-7 text-xs active:scale-95" onClick={() => handleReject(issue.id)}>Reject</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NGO Performance */}
        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Trophy className="h-3.5 w-3.5 text-warning" /> NGO Performance</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {ngos.sort((a, b) => b.successRate - a.successRate).map((ngo, i) => (
              <div key={ngo.id} className="rounded-xl border bg-card p-5 transition-all hover:shadow-md hover:-translate-y-0.5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">#{i + 1}</span>
                  <p className="text-sm font-semibold">{ngo.name}</p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div><p className="text-lg font-bold tabular-nums">{ngo.issuesHandled}</p><p className="text-[10px] text-muted-foreground">Handled</p></div>
                  <div><p className="text-lg font-bold tabular-nums text-success">{ngo.successRate}%</p><p className="text-[10px] text-muted-foreground">Success</p></div>
                  <div><p className="text-sm font-bold">{ngo.avgResponseTime}</p><p className="text-[10px] text-muted-foreground">Avg Time</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Volunteer Performance */}
        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-primary" /> Top Volunteers</h2>
          <div className="rounded-xl border overflow-auto">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Name</TableHead><TableHead>Tasks</TableHead><TableHead>Response</TableHead><TableHead>Reliability</TableHead><TableHead>Status</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {[...volunteers].sort((a, b) => b.tasksCompleted - a.tasksCompleted).slice(0, 5).map((vol) => (
                  <TableRow key={vol.id} className="transition-colors hover:bg-muted/50">
                    <TableCell className="font-medium text-sm">{vol.name}</TableCell>
                    <TableCell className="tabular-nums">{vol.tasksCompleted}</TableCell>
                    <TableCell className="tabular-nums">{vol.responseRate}%</TableCell>
                    <TableCell className="tabular-nums">{vol.reliabilityScore}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 text-xs ${vol.available ? "text-success" : "text-muted-foreground"}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${vol.available ? "bg-success" : "bg-muted-foreground"}`} />
                        {vol.available ? "Active" : "Offline"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Fraud Detection */}
        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><ShieldAlert className="h-3.5 w-3.5 text-danger" /> Fraud & Anomaly Detection</h2>
          {suspiciousIssues.length > 0 ? (
            <div className="space-y-2">{suspiciousIssues.map((i) => (
              <div key={i.id} className="rounded-xl border border-danger/30 bg-danger/5 p-3 text-sm">{i.title}</div>
            ))}</div>
          ) : (
            <div className="rounded-xl border bg-success/5 border-success/30 p-4 text-center text-sm text-success">
              <CheckCircle className="mx-auto h-5 w-5 mb-1" /> No suspicious activity detected
            </div>
          )}
        </div>

        {/* Broadcast */}
        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Megaphone className="h-3.5 w-3.5 text-primary" /> Broadcast Alert</h2>
          <div className="flex gap-2">
            <Input placeholder="Type emergency broadcast message…" value={broadcastMsg} onChange={(e) => setBroadcastMsg(e.target.value)} className="h-9" />
            <Button size="sm" onClick={handleBroadcast} className="gap-1.5 shrink-0 active:scale-95"><Send className="h-3.5 w-3.5" /> Send</Button>
          </div>
        </div>

        {/* Resource Allocation */}
        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Activity className="h-3.5 w-3.5 text-primary" /> Resource Allocation</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border bg-card p-5 text-center transition-all hover:shadow-md"><p className="text-2xl font-bold tabular-nums">{volunteers.filter((v) => v.available).length}</p><p className="text-xs text-muted-foreground">Available Volunteers</p></div>
            <div className="rounded-xl border bg-card p-5 text-center transition-all hover:shadow-md"><p className="text-2xl font-bold tabular-nums">{ngos.length}</p><p className="text-xs text-muted-foreground">Active NGOs</p></div>
            <div className="rounded-xl border bg-warning/10 border-warning/30 p-5 text-center"><p className="text-2xl font-bold tabular-nums text-warning">2</p><p className="text-xs text-muted-foreground">Areas need more volunteers</p></div>
          </div>
        </div>

        {/* Alerts */}
        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Active Alerts</h2>
          <div className="grid gap-2 sm:grid-cols-2">{alerts.map((a) => <AlertCard key={a.id} alert={a} />)}</div>
        </div>

        {/* Historical */}
        <div>
          <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Historical Insights</h2>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border bg-card p-5 text-center transition-all hover:shadow-md"><p className="text-2xl font-bold tabular-nums">47</p><p className="text-xs text-muted-foreground">Past Crises Handled</p></div>
            <div className="rounded-xl border bg-card p-5 text-center transition-all hover:shadow-md"><p className="text-2xl font-bold tabular-nums text-success">↓ 18%</p><p className="text-xs text-muted-foreground">Response Time Improvement</p></div>
            <div className="rounded-xl border bg-card p-5 text-center transition-all hover:shadow-md"><p className="text-2xl font-bold tabular-nums">12,480</p><p className="text-xs text-muted-foreground">Lives Impacted</p></div>
          </div>
        </div>
      </main>

      <IssueReportForm open={reportOpen} onOpenChange={setReportOpen} onSubmit={handleNewIssue} />
      <IssueDetailDialog issue={selectedIssue} open={!!selectedIssue} onOpenChange={(open) => !open && setSelectedIssue(null)} showAIInsights />
    </div>
  );
}
