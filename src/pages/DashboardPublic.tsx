import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { issues as initialIssues, alerts, type Issue } from "@/data/mockData";
import { IssueCard } from "@/components/IssueCard";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { HeatmapPlaceholder } from "@/components/dashboard/HeatmapPlaceholder";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { AlertCard } from "@/components/dashboard/AlertCard";
import { IssueReportForm } from "@/components/dashboard/IssueReportForm";
import { IssueDetailDialog } from "@/components/dashboard/IssueDetailDialog";
import { SafetyTipsAccordion } from "@/components/dashboard/SafetyTipsAccordion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus, Siren, AlertTriangle, CheckCircle, Flame, User, Shield, ThumbsUp } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPublic() {
  const [issueList, setIssueList] = useState<Issue[]>(initialIssues);
  const [search, setSearch] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [reportOpen, setReportOpen] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  const filtered = useMemo(() => {
    return issueList.filter((i) => {
      if (search && !i.title.toLowerCase().includes(search.toLowerCase()) && !i.location.toLowerCase().includes(search.toLowerCase())) return false;
      if (urgencyFilter !== "all" && i.urgency !== urgencyFilter) return false;
      if (statusFilter !== "all" && i.status !== statusFilter) return false;
      if (categoryFilter !== "all" && i.category !== categoryFilter) return false;
      return true;
    });
  }, [issueList, search, urgencyFilter, statusFilter, categoryFilter]);

  const stats = useMemo(() => ({
    total: issueList.length,
    resolved: issueList.filter((i) => i.status === "Solved").length,
    active: issueList.filter((i) => i.status !== "Solved").length,
    high: issueList.filter((i) => i.urgency === "High" && i.status !== "Solved").length,
  }), [issueList]);

  const handleNewIssue = (issue: Issue) => {
    setIssueList((prev) => [issue, ...prev]);
    toast.success("Issue reported successfully!", { description: `ID: ${issue.id}` });
  };

  const handleEmergency = () => {
    const issue: Issue = {
      id: `EMG-${Date.now().toString(36).toUpperCase()}`,
      title: "Emergency reported at your location",
      description: "One-tap emergency report. Auto-detected location.",
      urgency: "High",
      status: "Pending",
      location: "Auto-detected: Your Area",
      category: "Disaster",
      images: [],
      reportedBy: "You",
      assignedNgo: null,
      responseTime: null,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      comments: [],
      aiPriorityScore: 90,
      affectedPeople: 100,
      isAnonymous: false,
      isFake: false,
      coords: { x: 45, y: 50 },
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link to="/"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
            <h1 className="text-base font-bold">Public Dashboard</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => setReportOpen(true)} className="gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Report Issue
            </Button>
            <Button size="sm" variant="destructive" onClick={handleEmergency} className="gap-1.5 animate-pulse">
              <Siren className="h-3.5 w-3.5" /> Emergency
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <MetricCard icon={AlertTriangle} label="Total Issues" value={stats.total} trend={{ direction: "up", value: "+3" }} />
          <MetricCard icon={CheckCircle} label="Resolved" value={stats.resolved} trend={{ direction: "up", value: "+1" }} />
          <MetricCard icon={Flame} label="Active Emergencies" value={stats.high} />
          <MetricCard icon={User} label="Your Reports" value={1} />
        </div>

        {/* Live Alerts */}
        <div>
          <h2 className="mb-2 text-sm font-bold flex items-center gap-1.5"><Siren className="h-4 w-4 text-danger" /> Live Alerts</h2>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {alerts.map((a) => <div key={a.id} className="min-w-[260px] shrink-0"><AlertCard alert={a} /></div>)}
          </div>
        </div>

        {/* Heatmap */}
        <div>
          <h2 className="mb-2 text-sm font-bold">Community Heatmap</h2>
          <HeatmapPlaceholder issues={issueList} size="lg" />
        </div>

        {/* Filter + Issues */}
        <div>
          <h2 className="mb-3 text-sm font-bold">Community Issues ({filtered.length})</h2>
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            filters={[
              { label: "Urgency", value: urgencyFilter, onChange: setUrgencyFilter, options: [{ value: "High", label: "High" }, { value: "Medium", label: "Medium" }, { value: "Low", label: "Low" }] },
              { label: "Status", value: statusFilter, onChange: setStatusFilter, options: [{ value: "Pending", label: "Pending" }, { value: "Verified", label: "Verified" }, { value: "In Progress", label: "In Progress" }, { value: "Solved", label: "Solved" }] },
              { label: "Category", value: categoryFilter, onChange: setCategoryFilter, options: [{ value: "Health", label: "Health" }, { value: "Disaster", label: "Disaster" }, { value: "Food", label: "Food" }, { value: "Infrastructure", label: "Infra" }] },
            ]}
          />
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((issue) => (
              <div key={issue.id} onClick={() => setSelectedIssue(issue)} className="cursor-pointer">
                <IssueCard issue={issue} />
              </div>
            ))}
            {filtered.length === 0 && <p className="col-span-full text-center text-sm text-muted-foreground py-8">No issues match your filters.</p>}
          </div>
        </div>

        {/* Reporter Profile */}
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">Your Profile</p>
              <p className="text-xs text-muted-foreground">Active Reporter</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-md bg-muted/50 p-2">
              <p className="text-lg font-bold tabular-nums">1</p>
              <p className="text-[10px] text-muted-foreground">Reports</p>
            </div>
            <div className="rounded-md bg-muted/50 p-2">
              <p className="text-lg font-bold tabular-nums">42</p>
              <p className="text-[10px] text-muted-foreground">Contribution</p>
            </div>
            <div className="rounded-md bg-muted/50 p-2">
              <div className="flex items-center justify-center gap-0.5">
                <Shield className="h-3.5 w-3.5 text-success" />
                <p className="text-lg font-bold tabular-nums">8.5</p>
              </div>
              <p className="text-[10px] text-muted-foreground">Trust Score</p>
            </div>
          </div>
        </div>

        {/* Safety Tips */}
        <SafetyTipsAccordion />
      </main>

      {/* Dialogs */}
      <IssueReportForm open={reportOpen} onOpenChange={setReportOpen} onSubmit={handleNewIssue} />
      <IssueDetailDialog issue={selectedIssue} open={!!selectedIssue} onOpenChange={(open) => !open && setSelectedIssue(null)} onUpvote={handleUpvote} onComment={handleComment} />
    </div>
  );
}
