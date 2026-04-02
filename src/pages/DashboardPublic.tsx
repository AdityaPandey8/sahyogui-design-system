import { useState, useMemo } from "react";
import { issues as initialIssues, alerts, type Issue, type Alert } from "@/data/mockData";
import { IssueCard } from "@/components/IssueCard";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { HeatmapPlaceholder } from "@/components/dashboard/HeatmapPlaceholder";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { AlertDetailDialog } from "@/components/dashboard/AlertDetailDialog";
import { IssueReportForm } from "@/components/dashboard/IssueReportForm";
import { IssueDetailDialog } from "@/components/dashboard/IssueDetailDialog";
import { SafetyTipsAccordion } from "@/components/dashboard/SafetyTipsAccordion";
import { type Notification } from "@/components/dashboard/NotificationBell";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { AIChatWidget } from "@/components/dashboard/AIChatWidget";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Plus, Siren, AlertTriangle, CheckCircle, Flame, User, Shield, ThumbsUp,
  LayoutDashboard, FileText, Bell, Map, UserCircle, Trash2, Award, Star, TrendingUp,
  Heart, Target, Clock
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const publicNotifications: Notification[] = [
  { id: "n1", title: "Flood Warning", message: "Heavy rainfall expected in Bihar. Stay safe.", type: "danger", time: "5m ago", read: false },
  { id: "n2", title: "Relief Camp Open", message: "New camp at Patna — capacity 500 families.", type: "info", time: "30m ago", read: false },
  { id: "n3", title: "Issue Resolved", message: "Road debris near Mussoorie cleared successfully.", type: "success", time: "1h ago", read: true },
];

type Section = "home" | "issues" | "alerts" | "map" | "profile";

const shellSidebarItems: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { label: "Home", id: "home", icon: LayoutDashboard },
  { label: "Issues", id: "issues", icon: FileText },
  { label: "Alerts", id: "alerts", icon: Bell },
  { label: "Map", id: "map", icon: Map },
  { label: "Profile", id: "profile", icon: UserCircle },
];

// Profile achievement badges
const profileBadges = [
  { id: "pb1", name: "First Report", desc: "Filed your first report", icon: FileText, earned: true, color: "text-primary" },
  { id: "pb2", name: "10 Upvotes", desc: "Received 10 upvotes", icon: ThumbsUp, earned: true, color: "text-success" },
  { id: "pb3", name: "Emergency Reporter", desc: "Filed an emergency", icon: Siren, earned: false, color: "text-destructive" },
  { id: "pb4", name: "Community Hero", desc: "5+ resolved reports", icon: Award, earned: false, color: "text-warning" },
  { id: "pb5", name: "Trusted Voice", desc: "Trust score 9+", icon: Shield, earned: false, color: "text-primary" },
  { id: "pb6", name: "Watchdog", desc: "20+ reports filed", icon: Target, earned: false, color: "text-warning" },
];

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [section, setSection] = useState<Section>("home");
  const [issueList, setIssueList] = useState<Issue[]>(initialIssues);
  const [search, setSearch] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const locations = useMemo(() => [...new Set(issueList.map(i => i.location))], [issueList]);

  const filtered = useMemo(() => {
    return issueList.filter((i) => {
      if (search && !i.title.toLowerCase().includes(search.toLowerCase()) && !i.location.toLowerCase().includes(search.toLowerCase())) return false;
      if (urgencyFilter !== "all" && i.urgency !== urgencyFilter) return false;
      if (statusFilter !== "all" && i.status !== statusFilter) return false;
      if (categoryFilter !== "all" && i.category !== categoryFilter) return false;
      if (locationFilter !== "all" && i.location !== locationFilter) return false;
      return true;
    });
  }, [issueList, search, urgencyFilter, statusFilter, categoryFilter, locationFilter]);

  const stats = useMemo(() => ({
    total: issueList.length,
    resolved: issueList.filter((i) => i.status === "Solved").length,
    active: issueList.filter((i) => i.status !== "Solved").length,
    high: issueList.filter((i) => i.urgency === "High" && i.status !== "Solved").length,
  }), [issueList]);

  const myReports = useMemo(() => issueList.filter(i => i.reportedBy === "You"), [issueList]);
  const totalUpvotesReceived = useMemo(() => myReports.reduce((s, i) => s + i.upvotes, 0), [myReports]);
  const resolvedByComm = useMemo(() => issueList.filter(i => i.status === "Solved").length, [issueList]);
  const trustScore = 8.5;
  const contributionPoints = 42 + myReports.length * 10 + totalUpvotesReceived;

  const handleNewIssue = (issue: Issue) => {
    setIssueList((prev) => [issue, ...prev]);
    toast.success("Issue reported successfully!", { description: `ID: ${issue.id}` });
  };

  const handleEmergency = () => {
    const issue: Issue = {
      id: `EMG-${Date.now().toString(36).toUpperCase()}`,
      title: "Emergency reported at your location",
      description: "One-tap emergency report. Auto-detected location.",
      urgency: "High", status: "Pending", location: "Auto-detected: Your Area",
      category: "Disaster", images: [], reportedBy: "You", assignedNgo: null,
      responseTime: null, createdAt: new Date().toISOString(), upvotes: 0,
      comments: [], aiPriorityScore: 90, affectedPeople: 100,
      isAnonymous: false, isFake: false, coords: { x: 45, y: 50 },
      assignedVolunteers: [], photos: [],
    };
    setIssueList((prev) => [issue, ...prev]);
    toast.success("🚨 Emergency reported!", { description: "Help is on the way. Stay safe." });
  };

  const handleUpvote = (id: string) => {
    setIssueList((prev) => prev.map((i) => i.id === id ? { ...i, upvotes: i.upvotes + 1 } : i));
    if (selectedIssue?.id === id) setSelectedIssue((prev) => prev ? { ...prev, upvotes: prev.upvotes + 1 } : null);
  };

  const handleComment = (id: string, text: string) => {
    const comment = { id: `c-${Date.now()}`, author: "You", text, createdAt: new Date().toISOString() };
    setIssueList((prev) => prev.map((i) => i.id === id ? { ...i, comments: [...i.comments, comment] } : i));
    if (selectedIssue?.id === id) setSelectedIssue((prev) => prev ? { ...prev, comments: [...prev.comments, comment] } : null);
    toast.success("Comment added");
  };

  const handleDeleteReport = (id: string) => {
    setIssueList(prev => prev.filter(i => i.id !== id));
    toast.success("Report deleted");
  };

  const renderContent = () => {
    switch (section) {
      case "home":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <MetricCard icon={AlertTriangle} label="Total Issues" value={stats.total} trend={{ direction: "up", value: "+3" }} delay={0} />
              <MetricCard icon={CheckCircle} label="Resolved" value={stats.resolved} trend={{ direction: "up", value: "+1" }} delay={80} />
              <MetricCard icon={Flame} label="Active Emergencies" value={stats.high} delay={160} />
              <MetricCard icon={User} label="Your Reports" value={myReports.length} delay={240} />
            </div>

            {/* Live Alerts */}
            <div>
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Siren className="h-3.5 w-3.5 text-destructive" /> Live Alerts</h2>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {alerts.map((a) => (
                  <div key={a.id} className="min-w-[280px] shrink-0 cursor-pointer" onClick={() => setSelectedAlert(a)}>
                    <AlertCard alert={a} />
                  </div>
                ))}
              </div>
            </div>

            <SafetyTipsAccordion />
          </div>
        );

      case "issues":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="text-base font-bold">Community Issues ({filtered.length})</h2>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setReportOpen(true)} className="gap-1.5 active:scale-95">
                  <Plus className="h-3.5 w-3.5" /> Report Issue
                </Button>
                <Button size="sm" variant="destructive" onClick={handleEmergency} className="gap-1.5 animate-pulse hover:animate-none active:scale-95">
                  <Siren className="h-3.5 w-3.5" /> Emergency
                </Button>
              </div>
            </div>
            <FilterBar
              search={search}
              onSearchChange={setSearch}
              filters={[
                { label: "Urgency", value: urgencyFilter, onChange: setUrgencyFilter, options: [{ value: "High", label: "High" }, { value: "Medium", label: "Medium" }, { value: "Low", label: "Low" }] },
                { label: "Status", value: statusFilter, onChange: setStatusFilter, options: [{ value: "Pending", label: "Pending" }, { value: "Verified", label: "Verified" }, { value: "In Progress", label: "In Progress" }, { value: "Solved", label: "Solved" }] },
                { label: "Category", value: categoryFilter, onChange: setCategoryFilter, options: [{ value: "Health", label: "Health" }, { value: "Disaster", label: "Disaster" }, { value: "Food", label: "Food" }, { value: "Infrastructure", label: "Infra" }] },
                { label: "Location", value: locationFilter, onChange: setLocationFilter, options: locations.map(l => ({ value: l, label: l.split(",")[0] })) },
              ]}
            />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((issue) => {
                const isOwn = issue.reportedBy === "You";
                return (
                  <div key={issue.id} className="relative">
                    <div onClick={() => setSelectedIssue(issue)} className="cursor-pointer">
                      <IssueCard issue={issue} />
                    </div>
                    {isOwn && (
                      <Button size="sm" variant="destructive" className="absolute top-2 right-2 h-7 text-xs gap-1" onClick={() => handleDeleteReport(issue.id)}>
                        <Trash2 className="h-3 w-3" /> Delete
                      </Button>
                    )}
                  </div>
                );
              })}
              {filtered.length === 0 && <p className="col-span-full text-center text-sm text-muted-foreground py-8">No issues match your filters.</p>}
            </div>
          </div>
        );

      case "alerts":
        return (
          <div className="space-y-4">
            <h2 className="text-base font-bold">Active Alerts & Notifications</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {alerts.map(a => (
                <div key={a.id} className="cursor-pointer" onClick={() => setSelectedAlert(a)}>
                  <AlertCard alert={a} />
                </div>
              ))}
            </div>
          </div>
        );

      case "map":
        return (
          <div className="space-y-4">
            <h2 className="text-base font-bold">Community Heatmap</h2>
            <HeatmapPlaceholder issues={issueList} size="lg" onIssueClick={setSelectedIssue} />
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            {/* Profile Header */}
            <div className="rounded-2xl border bg-gradient-to-br from-primary/5 to-primary/10 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-2xl shadow-lg">
                  JD
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">Jane Doe</h2>
                    <span className="rounded-full bg-success/10 border border-success/30 px-2.5 py-0.5 text-[10px] font-bold text-success">Active Reporter</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Member since March 2025</p>
                </div>
              </div>

              {/* Trust Score Bar */}
              <div className="mt-4 rounded-xl bg-background/60 border p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold flex items-center gap-1"><Shield className="h-3.5 w-3.5 text-primary" /> Trust Score</span>
                  <span className="text-lg font-bold text-primary tabular-nums">{trustScore}/10</span>
                </div>
                <Progress value={trustScore * 10} className="h-2.5 [&>div]:bg-primary" />
                <p className="text-[10px] text-muted-foreground mt-1">Based on report accuracy, community engagement, and verification rate</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border bg-card p-4 text-center transition-all hover:shadow-md">
                <FileText className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-2xl font-bold tabular-nums">{myReports.length}</p>
                <p className="text-[10px] text-muted-foreground">Issues Reported</p>
              </div>
              <div className="rounded-xl border bg-card p-4 text-center transition-all hover:shadow-md">
                <CheckCircle className="h-5 w-5 text-success mx-auto mb-1" />
                <p className="text-2xl font-bold tabular-nums">{resolvedByComm}</p>
                <p className="text-[10px] text-muted-foreground">Resolved (Community)</p>
              </div>
              <div className="rounded-xl border bg-card p-4 text-center transition-all hover:shadow-md">
                <ThumbsUp className="h-5 w-5 text-warning mx-auto mb-1" />
                <p className="text-2xl font-bold tabular-nums">{totalUpvotesReceived}</p>
                <p className="text-[10px] text-muted-foreground">Upvotes Received</p>
              </div>
              <div className="rounded-xl border bg-card p-4 text-center transition-all hover:shadow-md">
                <TrendingUp className="h-5 w-5 text-primary mx-auto mb-1" />
                <p className="text-2xl font-bold tabular-nums">#{Math.max(1, 25 - myReports.length * 3)}</p>
                <p className="text-[10px] text-muted-foreground">Community Rank</p>
              </div>
              <div className="rounded-xl border bg-card p-4 text-center transition-all hover:shadow-md">
                <Star className="h-5 w-5 text-warning mx-auto mb-1" />
                <p className="text-2xl font-bold tabular-nums">{contributionPoints}</p>
                <p className="text-[10px] text-muted-foreground">Contribution Points</p>
              </div>
              <div className="rounded-xl border bg-card p-4 text-center transition-all hover:shadow-md">
                <Siren className="h-5 w-5 text-destructive mx-auto mb-1" />
                <p className="text-2xl font-bold tabular-nums">{myReports.filter(i => i.urgency === "High").length}</p>
                <p className="text-[10px] text-muted-foreground">Emergency Reports</p>
              </div>
            </div>

            {/* Achievement Badges */}
            <div>
              <h3 className="text-sm font-bold mb-3 flex items-center gap-1.5"><Award className="h-4 w-4 text-warning" /> Achievement Badges</h3>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                {profileBadges.map(b => {
                  const Icon = b.icon;
                  return (
                    <div
                      key={b.id}
                      className={cn("flex flex-col items-center gap-1 rounded-lg border p-3 text-center transition-all", b.earned ? "hover:shadow-md" : "opacity-35")}
                      title={b.desc}
                    >
                      <Icon className={cn("h-6 w-6", b.earned ? b.color : "text-muted-foreground")} />
                      <span className="text-[10px] font-semibold leading-tight">{b.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Your Reports */}
            <div>
              <h3 className="text-sm font-bold mb-3">Your Reports ({myReports.length})</h3>
              {myReports.length === 0 ? (
                <div className="rounded-xl border bg-muted/30 p-8 text-center">
                  <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">No reports filed yet.</p>
                  <Button size="sm" className="mt-3 gap-1" onClick={() => { setSection("issues"); setReportOpen(true); }}>
                    <Plus className="h-3 w-3" /> File Your First Report
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {myReports.map(issue => (
                    <div key={issue.id} className="rounded-xl border bg-card p-4 flex items-center justify-between hover:shadow-md transition-all">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold truncate">{issue.title}</h4>
                          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold",
                            issue.status === "Solved" ? "bg-success/10 text-success" :
                            issue.status === "In Progress" ? "bg-primary/10 text-primary" :
                            issue.status === "Verified" ? "bg-warning/10 text-warning" :
                            "bg-muted text-muted-foreground"
                          )}>
                            {issue.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                          <Clock className="h-3 w-3" /> {new Date(issue.createdAt).toLocaleDateString()}
                          <span>•</span>
                          <ThumbsUp className="h-3 w-3" /> {issue.upvotes}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => setSelectedIssue(issue)}>View</Button>
                        <Button size="sm" variant="destructive" className="h-7 text-xs gap-1" onClick={() => handleDeleteReport(issue.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <DashboardShell
        panelLabel="Public Dashboard"
        sidebarItems={shellSidebarItems}
        activeSection={section}
        onSectionChange={(s) => setSection(s as Section)}
        sidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen(p => !p)}
        notifications={publicNotifications}
        autoToast={{ message: "🔴 Flood warning in your area", description: "Heavy rainfall expected in Bihar and Jharkhand", delay: 3000 }}
      >
        {renderContent()}
      </DashboardShell>

      <IssueReportForm open={reportOpen} onOpenChange={setReportOpen} onSubmit={handleNewIssue} />
      <IssueDetailDialog issue={selectedIssue} open={!!selectedIssue} onOpenChange={(open) => !open && setSelectedIssue(null)} onUpvote={handleUpvote} onComment={handleComment} />
      <AlertDetailDialog alert={selectedAlert} open={!!selectedAlert} onOpenChange={(open) => !open && setSelectedAlert(null)} />
      <AIChatWidget />
    </>
  );
}
