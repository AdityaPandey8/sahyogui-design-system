import { useState, useMemo, useEffect } from "react";
import { type Issue, type NGO, type Volunteer, type Alert as AlertType } from "@/data/mockData";
import { getIssues, getNGOs, getVolunteers, getAlerts, createIssue, claimIssue, updateIssueStatus } from "@/lib/supabase-service";
import { AIChatWidget } from "@/components/dashboard/AIChatWidget";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { MapDashboard } from "@/components/dashboard/MapDashboard";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { AIPriorityCard } from "@/components/dashboard/AIPriorityCard";
import { AIInsightsPanel } from "@/components/dashboard/AIInsightsPanel";
import { AIInsightsCard } from "@/components/dashboard/AIInsightsCard";
import { ImpactLeaderboard, ResourceTracker } from "@/components/dashboard/CommunityTools";
import { QuickActionBar } from "@/components/dashboard/QuickActionBar";
import { IssueReportForm } from "@/components/dashboard/IssueReportForm";
import { IssueDetailDialog } from "@/components/dashboard/IssueDetailDialog";
import { TaskAssignDialog } from "@/components/dashboard/TaskAssignDialog";
import { VolunteerDetailDialog } from "@/components/dashboard/VolunteerDetailDialog";
import { NGODetailDialog } from "@/components/dashboard/NGODetailDialog";
import { AlertDetailDialog } from "@/components/dashboard/AlertDetailDialog";
import { VolunteerMatchCard } from "@/components/dashboard/VolunteerMatchCard";
import { ActivityLog, type Activity } from "@/components/dashboard/ActivityLog";
import { NetworkStatusWidget } from "@/components/dashboard/NetworkStatusWidget";
import type { Notification } from "@/components/dashboard/NotificationBell";
import { StatusBadge } from "@/components/StatusBadge";
import { UrgencyBadge } from "@/components/UrgencyBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  BarChart3, Users, AlertTriangle, CheckCircle, Clock,
  Plus, ShieldAlert, Brain, Send, Megaphone, HandHelping,
  Trophy, UserCheck, Handshake, LayoutDashboard, FileText, Building2,
  Bell, Eye, ShieldCheck, ShieldOff, X, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  const [section, setSection] = useState<NgoSection>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [issueList, setIssueList] = useState<Issue[]>([]);
  const [volList, setVolList] = useState<Volunteer[]>([]);
  const [ngoList, setNgoList] = useState<NGO[]>([]);
  const [alertList, setAlertList] = useState<AlertType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [issues, ngos, volunteers, alerts] = await Promise.all([
          getIssues(),
          getNGOs(),
          getVolunteers(),
          getAlerts()
        ]);
        setIssueList(issues);
        setNgoList(ngos);
        setVolList(volunteers);
        setAlertList(alerts);
      } catch (error) {
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const currentNgo = useMemo(() => ngoList[0] || null, [ngoList]);

  const [activities] = useState<Activity[]>([
    { id: "a1", action: "Claimed issue: Flooded road near Sector 14", time: "2h ago", type: "assigned" },
    { id: "a2", action: "Volunteer Priya assigned to medical supply task", time: "3h ago", type: "assigned" },
    { id: "a3", action: "Issue resolved: Road debris blocking evacuation", time: "5h ago", type: "completed" },
    { id: "a4", action: "Emergency alert: Flood warning in Bihar", time: "6h ago", type: "emergency" },
    { id: "a5", action: "Status updated: Water supply — In Progress", time: "8h ago", type: "update" },
  ]);

  const ngoIssues = useMemo(() => {
    if (!currentNgo) return issueList;
    return issueList.filter((i) => i.assignedNgo === currentNgo.id || i.assignedNgo === null);
  }, [issueList, currentNgo]);

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

  const stats = useMemo(() => {
    if (!currentNgo) return { assigned: 0, active: 0, completed: 0, avgResponse: "N/A", activeVols: 0 };
    return {
      assigned: issueList.filter((i) => i.assignedNgo === currentNgo.id).length,
      active: issueList.filter((i) => i.assignedNgo === currentNgo.id && i.status !== "Solved").length,
      completed: issueList.filter((i) => i.assignedNgo === currentNgo.id && i.status === "Solved").length,
      avgResponse: currentNgo.avgResponseTime,
      activeVols: volList.filter((v) => v.available && !v.blocked).length,
    };
  }, [issueList, volList, currentNgo]);

  const topIssue = useMemo(() => [...ngoIssues].sort((a, b) => b.aiPriorityScore - a.aiPriorityScore)[0], [ngoIssues]);

  const handleClaim = async (id: string) => {
    if (!currentNgo) return;
    const success = await claimIssue(id, currentNgo.id);
    if (success) {
      setIssueList((prev) => prev.map((i) => i.id === id ? { ...i, assignedNgo: currentNgo.id, status: "Verified" as const } : i));
      toast.success("Issue claimed by " + currentNgo.name);
    }
  };

  const handleUnclaim = async (id: string) => {
    const success = await claimIssue(id, null); // null means unclaim
    if (success) {
      setIssueList((prev) => prev.map((i) => i.id === id ? { ...i, assignedNgo: null } : i));
      toast("Issue unclaimed");
    }
  };

  const handleStatusUpdate = async (id: string, status: Issue["status"]) => {
    const success = await updateIssueStatus(id, status);
    if (success) {
      setIssueList((prev) => prev.map((i) => i.id === id ? { ...i, status } : i));
      toast.success(`Status updated to ${status}`);
    }
  };

  const handleNewIssue = async (issueData: Issue) => {
    const result = await createIssue(issueData);
    if (result) {
      setIssueList((prev) => [{ ...result, assignedNgo: currentNgo?.id || null }, ...prev]);
      toast.success("Issue reported");
    }
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
    if (isLoading) {
      return (
        <div className="flex h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
    
    switch (section) {
      case "overview":
        return (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <NetworkStatusWidget />
            
            <QuickActionBar actions={[
              { label: "Report Issue", icon: Plus, onClick: () => setReportOpen(true) },
              { label: crisisMode ? "Deactivate Crisis" : "Crisis Mode", icon: ShieldAlert, onClick: () => { setCrisisMode(!crisisMode); toast(crisisMode ? "Crisis mode off" : "🚨 Crisis mode activated!"); }, variant: crisisMode ? "destructive" : "outline" },
            ]} />
            
            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-5">
              <MetricCard icon={BarChart3} label={t('assigned', 'Assigned')} value={stats.assigned} delay={0} />
              <MetricCard icon={AlertTriangle} label={t('active', 'Active')} value={stats.active} trend={{ direction: "up", value: "+1" }} delay={100} />
              <MetricCard icon={CheckCircle} label={t('completed', 'Completed')} value={stats.completed} trend={{ direction: "up", value: "+2" }} delay={200} />
              <MetricCard icon={Clock} label={t('avg_response', 'Avg Response')} value={stats.avgResponse} trend={{ direction: "down", value: "-8m" }} delay={300} />
              <MetricCard icon={Users} label={t('volunteers', 'Volunteers')} value={stats.activeVols} delay={400} />
            </div>
            
            <div className="grid gap-6 lg:grid-cols-6">
              <div className="lg:col-span-2">
                {topIssue && <AIInsightsPanel issue={topIssue} />}
              </div>
              <div className="lg:col-span-2">
                <AIInsightsCard />
              </div>
              <div className="lg:col-span-2">
                {topIssue && <AIPriorityCard issue={topIssue} />}
              </div>
            </div>

            <div className="rounded-2xl border bg-card/40 backdrop-blur-md p-2 shadow-xl shadow-primary/5">
              <MapDashboard
                userRole="ngo"
                issues={ngoIssues}
                onIssueClick={setSelectedIssue}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-6 mt-8">
              <div className="lg:col-span-3">
                <ImpactLeaderboard />
              </div>
              <div className="lg:col-span-3">
                <ResourceTracker />
              </div>
            </div>

            <div className="rounded-2xl border bg-card/40 backdrop-blur-md p-2 shadow-xl shadow-primary/5">
              <MapDashboard
                userRole="ngo"
                issues={ngoIssues}
                onIssueClick={setSelectedIssue}
              />
            </div>
          </motion.div>
        );

      case "issues":
        return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <div className="flex items-center justify-between">
               <div>
                  <h2 className="text-xl font-bold tracking-tight">Mission Management</h2>
                  <p className="text-xs text-muted-foreground mt-1">Review and assign community reports</p>
               </div>
               <Button onClick={() => setReportOpen(true)} size="sm" className="gap-2 rounded-xl font-bold shadow-lg shadow-primary/10 active:scale-95 transition-all">
                  <Plus className="h-4 w-4" /> Log New Issue
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

            <div className="grid gap-4 sm:grid-cols-2">
              <AnimatePresence>
                {filtered.map((issue) => (
                  <motion.div 
                    key={issue.id} 
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="group relative rounded-2xl border bg-card/50 p-5 backdrop-blur-sm transition-all hover:shadow-xl hover:shadow-primary/5"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-bold leading-tight group-hover:text-primary transition-colors truncate">{issue.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 truncate">{issue.location}</p>
                      </div>
                      <UrgencyBadge urgency={issue.urgency} />
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{issue.description}</p>
                    
                    <div className="flex items-center justify-between gap-2 pt-4 border-t border-border/50">
                      <StatusBadge status={issue.status} />
                      <div className="flex gap-1.5">
                        {!issue.assignedNgo && (
                          <Button size="sm" className="rounded-xl font-bold active:scale-95 transition-all" onClick={() => handleClaim(issue.id)}>
                            <HandHelping className="h-3.5 w-3.5 mr-1.5" />Claim
                          </Button>
                        )}
                        {currentNgo && issue.assignedNgo === currentNgo.id && (
                          <Button size="sm" variant="ghost" className="rounded-xl font-bold text-destructive hover:bg-destructive/10 transition-all" onClick={() => handleUnclaim(issue.id)}>
                            <X className="h-3.5 w-3.5 mr-1.5" />Release
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="rounded-xl font-bold active:scale-95" onClick={() => setSelectedIssue(issue)}>Details</Button>
                        {currentNgo && issue.assignedNgo === currentNgo.id && issue.status !== "Solved" && (
                          <Button size="sm" variant="outline" className="rounded-xl font-bold active:scale-95" onClick={() => setAssignIssue(issue)}>
                            <Users className="h-3.5 w-3.5 mr-1.5" />Assign
                          </Button>
                        )}
                      </div>
                    </div>

                    {currentNgo && issue.assignedNgo === currentNgo.id && issue.status !== "Solved" && (
                      <div className="mt-4 pt-3 border-t border-dashed flex gap-1.5 flex-wrap">
                        {(["Verified", "In Progress", "Solved"] as Issue["status"][]).map((s) => (
                          <Button 
                            key={s} 
                            size="sm" 
                            variant={issue.status === s ? "default" : "outline"} 
                            className="h-7 text-[10px] font-bold px-3 rounded-lg active:scale-95 transition-all" 
                            onClick={() => handleStatusUpdate(issue.id, s)}
                          >
                            {s}
                          </Button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
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
              {ngoList.filter(n => n.id !== (currentNgo?.id || '')).map(ngo => (
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
              {alertList.map(a => (
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
            {currentNgo && (
              <div>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Trophy className="h-3.5 w-3.5 text-warning" /> Performance Analytics</h3>
                <div className="grid gap-3 sm:grid-cols-4">
                  <div className="rounded-xl border bg-card p-5 text-center"><p className="text-2xl font-bold tabular-nums">{currentNgo.issuesHandled}</p><p className="text-xs text-muted-foreground">Issues Handled</p></div>
                  <div className="rounded-xl border bg-card p-5 text-center"><p className="text-2xl font-bold tabular-nums text-success">{currentNgo.successRate}%</p><p className="text-xs text-muted-foreground">Success Rate</p></div>
                  <div className="rounded-xl border bg-card p-5 text-center"><p className="text-xl font-bold">{currentNgo.avgResponseTime}</p><p className="text-xs text-muted-foreground">Avg Response</p></div>
                  <div className="rounded-xl border bg-card p-5 text-center"><p className="text-2xl font-bold tabular-nums text-primary">4,200</p><p className="text-xs text-muted-foreground">Lives Impacted</p></div>
                </div>
              </div>
            )}

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
      panelLabel={currentNgo?.name || "NGO Dashboard"}
      sidebarItems={sidebarItems}
      activeSection={section}
      onSectionChange={(s) => setSection(s as NgoSection)}
      sidebarOpen={sidebarOpen}
      onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
      notifications={ngoNotifications}
      
      crisisMode={crisisMode}
    >
      {renderContent()}

      <IssueReportForm open={reportOpen} onOpenChange={setReportOpen} onSubmit={handleNewIssue} />
      <IssueDetailDialog issue={selectedIssue} open={!!selectedIssue} onOpenChange={(open) => !open && setSelectedIssue(null)} showAIInsights />
      <TaskAssignDialog issue={assignIssue} open={!!assignIssue} onOpenChange={(open) => !open && setAssignIssue(null)} />
      <VolunteerDetailDialog volunteer={selectedVol} open={!!selectedVol} onOpenChange={(open) => !open && setSelectedVol(null)} onBlock={handleBlockVol} />
      <NGODetailDialog ngo={selectedNgo} open={!!selectedNgo} onOpenChange={(open) => !open && setSelectedNgo(null)} showManageActions={false} />
      <AlertDetailDialog alert={selectedAlert} open={!!selectedAlert} onOpenChange={(open) => !open && setSelectedAlert(null)} />
      <AIChatWidget />
    </DashboardShell>
  );
}
