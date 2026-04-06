import { useState, useMemo } from "react";
import { issues as initialIssues, ngos as initialNgos, volunteers as initialVolunteers, alerts, pastCrises, type Issue, type NGO, type Volunteer } from "@/data/mockData";
import { AIChatWidget } from "@/components/dashboard/AIChatWidget";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { MapDashboard } from "@/components/dashboard/MapDashboard";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { AIPriorityCard } from "@/components/dashboard/AIPriorityCard";
import { AIInsightsPanel } from "@/components/dashboard/AIInsightsPanel";
import { QuickActionBar } from "@/components/dashboard/QuickActionBar";
import { AIAnalyticsCharts } from "@/components/dashboard/AIAnalyticsCharts";
import { IssueReportForm } from "@/components/dashboard/IssueReportForm";
import { IssueDetailDialog } from "@/components/dashboard/IssueDetailDialog";
import { NGODetailDialog } from "@/components/dashboard/NGODetailDialog";
import { VolunteerDetailDialog } from "@/components/dashboard/VolunteerDetailDialog";
import { CrisisDetailDialog } from "@/components/dashboard/CrisisDetailDialog";
import { AlertDetailDialog } from "@/components/dashboard/AlertDetailDialog";
import { TaskAssignDialog } from "@/components/dashboard/TaskAssignDialog";
import { NetworkStatusWidget } from "@/components/dashboard/NetworkStatusWidget";
import type { Notification } from "@/components/dashboard/NotificationBell";
import { StatusBadge } from "@/components/StatusBadge";
import { UrgencyBadge } from "@/components/UrgencyBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  BarChart3, Users, AlertTriangle, CheckCircle, Clock, Plus, Megaphone,
  ShieldAlert, Brain, Send, Flag, Activity, LayoutDashboard, FileText,
  Building2, UserCheck, Bell, History, Settings, ShieldCheck, ShieldOff, Trash2, Eye, Handshake, Sparkles
} from "lucide-react";
import { toast } from "sonner";
import type { PastCrisis, Alert as AlertType } from "@/data/mockData";

type AdminSection = "overview" | "issues" | "analytics" | "ngos" | "volunteers" | "alerts" | "history" | "settings";

const sidebarItems: { id: AdminSection; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "issues", label: "Issues", icon: FileText },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "ngos", label: "NGOs", icon: Building2 },
  { id: "volunteers", label: "Volunteers", icon: Users },
  { id: "alerts", label: "Alerts", icon: Bell },
  { id: "history", label: "History", icon: History },
  { id: "settings", label: "Settings", icon: Settings },
];

const adminNotifications: Notification[] = [
  { id: "n1", title: "Issue Pending Verification", message: "3 new issues need verification.", type: "warning", time: "2m ago", read: false },
  { id: "n2", title: "Crisis Mode Available", message: "Bihar flood situation escalating.", type: "danger", time: "15m ago", read: false },
  { id: "n3", title: "NGO Performance Update", message: "CareLine Initiative resolved 5 issues today.", type: "success", time: "1h ago", read: true },
];

export default function DashboardAdmin() {
  const [section, setSection] = useState<AdminSection>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [issueList, setIssueList] = useState<Issue[]>(initialIssues);
  const [ngoList, setNgoList] = useState<NGO[]>(initialNgos);
  const [volList, setVolList] = useState<Volunteer[]>(initialVolunteers);
  const [search, setSearch] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [selectedNgo, setSelectedNgo] = useState<NGO | null>(null);
  const [selectedVol, setSelectedVol] = useState<Volunteer | null>(null);
  const [selectedCrisis, setSelectedCrisis] = useState<PastCrisis | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<AlertType | null>(null);
  const [assignIssue, setAssignIssue] = useState<Issue | null>(null);
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [crisisMode, setCrisisMode] = useState(false);

  const locations = useMemo(() => [...new Set(issueList.map(i => i.location))], [issueList]);
  const categories = useMemo(() => [...new Set(issueList.map(i => i.category))], [issueList]);

  const filtered = useMemo(() => {
    return issueList.filter((i) => {
      if (search && !i.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (urgencyFilter !== "all" && i.urgency !== urgencyFilter) return false;
      if (statusFilter !== "all" && i.status !== statusFilter) return false;
      if (locationFilter !== "all" && i.location !== locationFilter) return false;
      if (categoryFilter !== "all" && i.category !== categoryFilter) return false;
      return true;
    });
  }, [issueList, search, urgencyFilter, statusFilter, locationFilter, categoryFilter]);

  const stats = useMemo(() => ({
    total: issueList.length,
    active: issueList.filter((i) => i.urgency === "High" && i.status !== "Solved").length,
    resolved: issueList.filter((i) => i.status === "Solved").length,
    avgResponse: "3h 12m",
    activeVols: volList.filter((v) => v.available && !v.blocked).length,
  }), [issueList, volList]);

  const topIssue = useMemo(() => [...issueList].sort((a, b) => b.aiPriorityScore - a.aiPriorityScore)[0], [issueList]);
  const pendingIssues = useMemo(() => issueList.filter((i) => i.status === "Pending"), [issueList]);
  const prioritySorted = useMemo(() => [...filtered].sort((a, b) => b.aiPriorityScore - a.aiPriorityScore), [filtered]);

  const handleVerify = (id: string) => {
    setIssueList((prev) => prev.map((i) => i.id === id ? { ...i, status: "Verified" as const } : i));
    toast.success("Issue verified");
  };
  const handleReject = (id: string) => {
    setIssueList((prev) => prev.filter((i) => i.id !== id));
    toast("Issue rejected and removed");
  };
  const handleDelete = (id: string) => {
    setIssueList((prev) => prev.filter((i) => i.id !== id));
    setSelectedIssue(null);
    toast.success("Issue deleted");
  };
  const handleEscalate = (id: string) => {
    setIssueList((prev) => prev.map((i) => i.id === id ? { ...i, urgency: "High" as const, aiPriorityScore: Math.min(i.aiPriorityScore + 15, 100) } : i));
    toast.warning("Issue escalated");
  };
  const handleNewIssue = (issue: Issue) => {
    setIssueList((prev) => [issue, ...prev]);
    toast.success("Issue added");
  };
  const handleBlockNgo = (id: string) => {
    setNgoList(prev => prev.map(n => n.id === id ? { ...n, blocked: !n.blocked } : n));
    const ngo = ngoList.find(n => n.id === id);
    toast.success(`${ngo?.name} ${ngo?.blocked ? "unblocked" : "blocked"}`);
  };
  const handleBlockVol = (id: string) => {
    setVolList(prev => prev.map(v => v.id === id ? { ...v, blocked: !v.blocked } : v));
    const vol = volList.find(v => v.id === id);
    toast.success(`${vol?.name} ${vol?.blocked ? "unblocked" : "blocked"}`);
  };
  const handleBroadcast = () => {
    if (!broadcastMsg.trim()) return;
    toast.success("🔔 Alert broadcasted", { description: broadcastMsg });
    setBroadcastMsg("");
  };

  const renderContent = () => {
    switch (section) {
      case "overview":
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <NetworkStatusWidget />
            
            <QuickActionBar actions={[
              { label: "Add Issue", icon: Plus, onClick: () => setReportOpen(true) },
              { label: crisisMode ? "Deactivate Crisis" : "Activate Crisis", icon: ShieldAlert, onClick: () => { setCrisisMode(!crisisMode); toast(crisisMode ? "Crisis mode deactivated" : "🚨 Crisis mode activated!"); }, variant: crisisMode ? "destructive" : "outline" },
            ]} />
            
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <MetricCard icon={BarChart3} label="Total Issues" value={stats.total} trend={{ direction: "up", value: "+3" }} delay={0} />
              <MetricCard icon={AlertTriangle} label="Active Crises" value={stats.active} trend={{ direction: "up", value: "+1" }} delay={100} />
              <MetricCard icon={CheckCircle} label="Resolved" value={stats.resolved} trend={{ direction: "up", value: "+2" }} delay={200} />
              <MetricCard icon={Clock} label="Avg Response" value={stats.avgResponse} trend={{ direction: "down", value: "-12m" }} delay={300} />
              <MetricCard icon={Users} label="Active Volunteers" value={stats.activeVols} delay={400} />
            </div>
            
            <div className="grid gap-6 lg:grid-cols-2">
              {topIssue && <AIInsightsPanel issue={topIssue} />}
              <div className="rounded-2xl border bg-card/40 backdrop-blur-md p-2 shadow-xl shadow-primary/5">
                <MapDashboard
                  userRole="admin"
                  issues={issueList}
                  onIssueClick={setSelectedIssue}
                />
              </div>
            </div>

            {/* Verification quick view */}
            {pendingIssues.length > 0 && (
              <div className="pt-4">
                <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                  <Flag className="h-4 w-4 text-warning" /> Verification Queue ({pendingIssues.length})
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <AnimatePresence>
                    {pendingIssues.slice(0, 4).map((issue) => (
                      <motion.div 
                        key={issue.id} 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="flex items-center justify-between rounded-2xl border bg-card/50 p-4 backdrop-blur-sm transition-all hover:shadow-lg"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate tracking-tight">{issue.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{issue.location}</p>
                        </div>
                        <div className="flex gap-1.5 shrink-0 ml-4">
                          <Button size="sm" className="h-8 rounded-lg font-bold active:scale-95 transition-all" onClick={() => handleVerify(issue.id)}>Verify</Button>
                          <Button size="sm" variant="destructive" className="h-8 rounded-lg font-bold active:scale-95 transition-all" onClick={() => handleReject(issue.id)}>Reject</Button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </motion.div>
        );

      case "issues":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center justify-between">
               <h2 className="text-xl font-bold tracking-tight flex items-center gap-2.5">
                  <Brain className="h-5 w-5 text-primary" /> Central Issue Repository
               </h2>
               <Button onClick={() => setReportOpen(true)} size="sm" className="gap-2 rounded-xl font-bold shadow-lg shadow-primary/10 active:scale-95 transition-all">
                  <Plus className="h-4 w-4" /> Add Manual Entry
               </Button>
            </div>

            <div className="rounded-2xl border bg-card/40 p-4 backdrop-blur-md">
              <FilterBar search={search} onSearchChange={setSearch} filters={[
                { label: "Urgency", value: urgencyFilter, onChange: setUrgencyFilter, options: [{ value: "High", label: "High" }, { value: "Medium", label: "Medium" }, { value: "Low", label: "Low" }] },
                { label: "Status", value: statusFilter, onChange: setStatusFilter, options: [{ value: "Pending", label: "Pending" }, { value: "Verified", label: "Verified" }, { value: "In Progress", label: "In Progress" }, { value: "Solved", label: "Solved" }] },
                { label: "Location", value: locationFilter, onChange: setLocationFilter, options: locations.map(l => ({ value: l, label: l })) },
                { label: "Category", value: categoryFilter, onChange: setCategoryFilter, options: categories.map(c => ({ value: c, label: c })) },
              ]} />
            </div>

            <div className="rounded-2xl border bg-card/40 backdrop-blur-md overflow-hidden shadow-xl shadow-primary/5">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[60px] font-bold text-xs uppercase tracking-widest text-muted-foreground">AI Score</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Issue Details</TableHead>
                    <TableHead className="hidden sm:table-cell font-bold text-xs uppercase tracking-widest text-muted-foreground">Urgency</TableHead>
                    <TableHead className="font-bold text-xs uppercase tracking-widest text-muted-foreground">Status</TableHead>
                    <TableHead className="hidden md:table-cell font-bold text-xs uppercase tracking-widest text-muted-foreground">Impacted</TableHead>
                    <TableHead className="text-right font-bold text-xs uppercase tracking-widest text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {prioritySorted.map((issue) => (
                    <TableRow key={issue.id} className="transition-colors hover:bg-primary/5 border-border/50">
                      <TableCell>
                         <div className={cn(
                           "flex h-8 w-8 items-center justify-center rounded-lg font-bold text-xs tabular-nums shadow-sm",
                           issue.aiPriorityScore > 80 ? "bg-destructive/10 text-destructive border border-destructive/20" : 
                           issue.aiPriorityScore > 50 ? "bg-warning/10 text-warning border border-warning/20" : 
                           "bg-primary/10 text-primary border border-primary/20"
                         )}>
                           {issue.aiPriorityScore}
                         </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[240px]">
                           <p className="font-bold text-sm truncate tracking-tight">{issue.title}</p>
                           <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{issue.location} · {issue.category}</p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell"><UrgencyBadge urgency={issue.urgency} /></TableCell>
                      <TableCell><StatusBadge status={issue.status} /></TableCell>
                      <TableCell className="hidden md:table-cell tabular-nums text-xs font-semibold">{issue.affectedPeople.toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1.5">
                          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors" onClick={() => setSelectedIssue(issue)}><Eye className="h-4 w-4" /></Button>
                          {issue.status === "Pending" && <Button size="sm" className="h-8 rounded-lg font-bold px-3 active:scale-95 transition-all" onClick={() => handleVerify(issue.id)}>Verify</Button>}
                          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-warning/10 hover:text-warning transition-colors" onClick={() => handleEscalate(issue.id)}><Sparkles className="h-4 w-4" /></Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors" onClick={() => handleDelete(issue.id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </motion.div>
        );


      case "ngos":
        return (
          <div className="space-y-6">
            <h2 className="text-base font-bold flex items-center gap-2"><Building2 className="h-4 w-4 text-primary" /> NGO Management</h2>
            <div className="rounded-xl border overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Focus Area</TableHead>
                    <TableHead>Handled</TableHead>
                    <TableHead>Success</TableHead>
                    <TableHead>Avg Time</TableHead>
                    <TableHead>Volunteers</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ngoList.map(ngo => (
                    <TableRow key={ngo.id} className="transition-colors hover:bg-muted/50">
                      <TableCell className="font-medium text-sm">{ngo.name}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{ngo.focusArea}</TableCell>
                      <TableCell className="tabular-nums">{ngo.issuesHandled}</TableCell>
                      <TableCell className={cn("tabular-nums font-medium", ngo.successRate >= 90 ? "text-success" : "text-warning")}>{ngo.successRate}%</TableCell>
                      <TableCell className="text-xs">{ngo.avgResponseTime}</TableCell>
                      <TableCell className="tabular-nums">{ngo.volunteerIds.length}</TableCell>
                      <TableCell>
                        <span className={cn("text-xs font-medium", ngo.blocked ? "text-danger" : "text-success")}>{ngo.blocked ? "Blocked" : "Active"}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setSelectedNgo(ngo)}><Eye className="h-3 w-3 mr-1" />Details</Button>
                          <Button size="sm" variant={ngo.blocked ? "default" : "destructive"} className="h-7 text-xs" onClick={() => handleBlockNgo(ngo.id)}>
                            {ngo.blocked ? <ShieldCheck className="h-3 w-3" /> : <ShieldOff className="h-3 w-3" />}
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast.success(`Task assigned to ${ngo.name}`)}><Handshake className="h-3 w-3" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Joint Operations */}
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Handshake className="h-3.5 w-3.5 text-primary" /> Coordinate Joint Operations</h3>
              <div className="grid gap-2 sm:grid-cols-3">
                {ngoList.filter(n => !n.blocked).map(ngo => (
                  <div key={ngo.id} className="rounded-xl border bg-card p-4 transition-all hover:shadow-md">
                    <p className="text-sm font-semibold">{ngo.name}</p>
                    <p className="text-xs text-muted-foreground mb-2">{ngo.focusArea} · {ngo.volunteerIds.length} volunteers</p>
                    <Button size="sm" variant="outline" className="h-7 text-xs w-full" onClick={() => toast.success(`Joint operation initiated with ${ngo.name}`)}>
                      <Handshake className="h-3 w-3 mr-1" /> Coordinate
                    </Button>
                  </div>
                ))}
              </div>
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
                    <TableHead>Response</TableHead>
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
                      <TableCell className="tabular-nums">{vol.responseRate}%</TableCell>
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
          </div>
        );

      case "alerts":
        return (
          <div className="space-y-6">
            <h2 className="text-base font-bold flex items-center gap-2"><Bell className="h-4 w-4 text-warning" /> Active Alerts</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {alerts.map(a => (
                <div key={a.id} className="cursor-pointer" onClick={() => setSelectedAlert(a)}>
                  <AlertCard alert={a} />
                </div>
              ))}
            </div>
          </div>
        );

      case "history":
        return (
          <div className="space-y-6">
            <h2 className="text-base font-bold flex items-center gap-2"><History className="h-4 w-4 text-primary" /> Past Crises</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {pastCrises.map(crisis => {
                const ngo = initialNgos.find(n => n.id === crisis.resolvedByNgo);
                return (
                  <div key={crisis.id} className="rounded-xl border bg-card p-5 transition-all hover:shadow-md cursor-pointer" onClick={() => setSelectedCrisis(crisis)}>
                    <h3 className="text-sm font-semibold mb-1">{crisis.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{crisis.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Building2 className="h-3 w-3" />{ngo?.name}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{crisis.responseTime}</span>
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{crisis.livesImpacted.toLocaleString()} lives</span>
                      <span className="flex items-center gap-1"><Flag className="h-3 w-3" />{crisis.category}</span>
                    </div>
                    {crisis.photos.length > 0 && (
                      <p className="text-[10px] text-primary mt-2">{crisis.photos.length} photos available</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-6">
            <h2 className="text-base font-bold flex items-center gap-2"><Settings className="h-4 w-4 text-primary" /> Settings</h2>
            {/* Broadcast */}
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Megaphone className="h-3.5 w-3.5 text-primary" /> Broadcast Alert</h3>
              <div className="flex gap-2">
                <Input placeholder="Type emergency broadcast message…" value={broadcastMsg} onChange={(e) => setBroadcastMsg(e.target.value)} className="h-9" />
                <Button size="sm" onClick={handleBroadcast} className="gap-1.5 shrink-0"><Send className="h-3.5 w-3.5" /> Send</Button>
              </div>
            </div>
            {/* Fraud Detection */}
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><ShieldAlert className="h-3.5 w-3.5 text-danger" /> Fraud Detection</h3>
              <div className="rounded-xl border bg-success/5 border-success/30 p-4 text-center text-sm text-success">
                <CheckCircle className="mx-auto h-5 w-5 mb-1" /> No suspicious activity detected
              </div>
            </div>
            {/* Resource Allocation */}
            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Activity className="h-3.5 w-3.5 text-primary" /> Resource Allocation</h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border bg-card p-5 text-center"><p className="text-2xl font-bold tabular-nums">{volList.filter(v => v.available && !v.blocked).length}</p><p className="text-xs text-muted-foreground">Available Volunteers</p></div>
                <div className="rounded-xl border bg-card p-5 text-center"><p className="text-2xl font-bold tabular-nums">{ngoList.filter(n => !n.blocked).length}</p><p className="text-xs text-muted-foreground">Active NGOs</p></div>
                <div className="rounded-xl border bg-warning/10 border-warning/30 p-5 text-center"><p className="text-2xl font-bold tabular-nums text-warning">2</p><p className="text-xs text-muted-foreground">Areas need more volunteers</p></div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <DashboardShell
      panelLabel="Admin Panel"
      sidebarItems={sidebarItems}
      activeSection={section}
      onSectionChange={(s) => setSection(s as AdminSection)}
      sidebarOpen={sidebarOpen}
      onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
      notifications={adminNotifications}
      
      crisisMode={crisisMode}
    >
      {renderContent()}

      {/* Dialogs */}
      <IssueReportForm open={reportOpen} onOpenChange={setReportOpen} onSubmit={handleNewIssue} />
      <IssueDetailDialog issue={selectedIssue} open={!!selectedIssue} onOpenChange={(open) => !open && setSelectedIssue(null)} showAIInsights showDelete onDelete={handleDelete} />
      <NGODetailDialog ngo={selectedNgo} open={!!selectedNgo} onOpenChange={(open) => !open && setSelectedNgo(null)} onBlock={handleBlockNgo} />
      <VolunteerDetailDialog volunteer={selectedVol} open={!!selectedVol} onOpenChange={(open) => !open && setSelectedVol(null)} onBlock={handleBlockVol} />
      <CrisisDetailDialog crisis={selectedCrisis} open={!!selectedCrisis} onOpenChange={(open) => !open && setSelectedCrisis(null)} />
      <AlertDetailDialog alert={selectedAlert} open={!!selectedAlert} onOpenChange={(open) => !open && setSelectedAlert(null)} />
      <TaskAssignDialog issue={assignIssue} open={!!assignIssue} onOpenChange={(open) => !open && setAssignIssue(null)} />
      <AIChatWidget />
    </DashboardShell>
  );
}
