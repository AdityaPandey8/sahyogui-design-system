import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ImagePlus, Brain, Loader2, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { analyzeIssue } from "@/lib/ai";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import type { Urgency, Category, Issue } from "@/data/mockData";

interface IssueReportFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (issue: Issue) => void;
  prefill?: Partial<{ title: string; location: string; urgency: Urgency }>;
}

const categories: Category[] = ["Health", "Disaster", "Food", "Infrastructure", "Environment", "Safety", "Communication", "Shelter"];

export function IssueReportForm({ open, onOpenChange, onSubmit, prefill }: IssueReportFormProps) {
  const [title, setTitle] = useState(prefill?.title || "");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState(prefill?.location || "");
  const [urgency, setUrgency] = useState<Urgency>(prefill?.urgency || "Medium");
  const [category, setCategory] = useState<Category>("Disaster");
  const [anonymous, setAnonymous] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [aiResult, setAiResult] = useState<{ priority: number; suggestedCategory: string; responderType: string; summary: string } | null>(null);

  const steps = ["Analyzing keywords...", "Categorizing incident...", "Calculating priority...", "Finalizing insights..."];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (analyzing && analysisStep < steps.length - 1) {
      timer = setTimeout(() => setAnalysisStep(s => s + 1), 800);
    }
    return () => clearTimeout(timer);
  }, [analyzing, analysisStep]);

  const handleAnalyze = async () => {
    if (!title.trim() || !description.trim()) {
      toast.error("Please enter title and description first");
      return;
    }
    setAnalyzing(true);
    setAnalysisStep(0);
    setAiResult(null);
    try {
      // Simulate real processing time for effect
      const [result] = await Promise.all([
        analyzeIssue({ title, description, category }),
        new Promise(resolve => setTimeout(resolve, 3200))
      ]);
      setAiResult(result);
      setUrgency(result.priority > 80 ? "High" : result.priority > 40 ? "Medium" : "Low");
      setCategory(result.suggestedCategory as Category);
      toast.success("AI Analysis Complete");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    const newIssue: Issue = {
      id: `ISS-${Date.now().toString(36).toUpperCase()}`,
      title,
      description,
      urgency,
      status: "Pending",
      location: location || "Auto-detected location",
      category,
      images: [],
      reportedBy: anonymous ? "Anonymous" : "You",
      assignedNgo: null,
      responseTime: null,
      createdAt: new Date().toISOString(),
      upvotes: 0,
      comments: [],
      aiPriorityScore: aiResult?.priority ?? Math.floor(Math.random() * 40) + 50,
      affectedPeople: Math.floor(Math.random() * 500) + 10,
      isAnonymous: anonymous,
      isFake: false,
      coords: { x: Math.random() * 70 + 15, y: Math.random() * 70 + 15 },
      assignedVolunteers: [],
      photos: [],
    };
    onSubmit(newIssue);
    setTitle(""); setDescription(""); setLocation(""); setUrgency("Medium"); setCategory("Disaster"); setAnonymous(false); setAiResult(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden rounded-2xl border-white/10 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold tracking-tight">Report Incident</DialogTitle>
          <DialogDescription>Our AI will analyze your report to ensure rapid response coordination.</DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Title</Label>
            <Input 
              placeholder="e.g., Heavy flooding at Sector 4" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="rounded-xl bg-background/50 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Description</Label>
            <Textarea 
              placeholder="What is happening? Who is affected?" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              rows={3} 
              className="rounded-xl bg-background/50 resize-none focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Location</Label>
            <Input 
              placeholder="Street, City, Landmark" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
              className="rounded-xl bg-background/50 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Urgency</Label>
              <Select value={urgency} onValueChange={(v) => setUrgency(v as Urgency)}>
                <SelectTrigger className="rounded-xl bg-background/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="High">🚨 High</SelectItem>
                  <SelectItem value="Medium">⚠️ Medium</SelectItem>
                  <SelectItem value="Low">✅ Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Category</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
                <SelectTrigger className="rounded-xl bg-background/50"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!aiResult && !analyzing ? (
              <motion.div key="analyze-btn" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <Button
                  type="button"
                  variant="outline"
                  className="group w-full gap-2 rounded-xl border-primary/30 bg-primary/5 font-bold text-primary hover:bg-primary hover:text-white transition-all duration-300 shadow-sm"
                  onClick={handleAnalyze}
                  disabled={!title.trim() || !description.trim()}
                >
                  <Brain className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                  AI Analyze Issue
                </Button>
              </motion.div>
            ) : analyzing ? (
              <motion.div 
                key="analyzing" 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-xs font-bold text-primary uppercase tracking-wider">{steps[analysisStep]}</span>
                   </div>
                   <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                </div>
                <Progress value={(analysisStep + 1) * 25} className="h-1.5 [&>div]:bg-primary" />
              </motion.div>
            ) : (
              <motion.div 
                key="ai-result" 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border border-success/30 bg-success/5 p-4 space-y-3 relative overflow-hidden"
              >
                <div className="flex items-center gap-2 font-bold text-success text-xs uppercase tracking-widest">
                  <CheckCircle2 className="h-4 w-4" /> AI Analysis Optimized
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="text-center p-2 rounded-lg bg-background/50 border border-border/50">
                    <p className="text-[8px] font-bold text-muted-foreground uppercase">Priority</p>
                    <p className="text-sm font-bold text-success">{aiResult!.priority}%</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-background/50 border border-border/50">
                    <p className="text-[8px] font-bold text-muted-foreground uppercase">Category</p>
                    <p className="text-xs font-bold truncate">{aiResult!.suggestedCategory}</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-background/50 border border-border/50">
                    <p className="text-[8px] font-bold text-muted-foreground uppercase">Responder</p>
                    <p className="text-xs font-bold truncate">{aiResult!.responderType}</p>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed italic">{aiResult!.summary}</p>
                
                {/* Visual feedback that fields were auto-filled */}
                <div className="absolute -right-4 -bottom-4 opacity-5">
                   <Brain className="h-20 w-20" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2">
              <Switch id="anon" checked={anonymous} onCheckedChange={setAnonymous} />
              <Label htmlFor="anon" className="text-xs font-medium cursor-pointer">Post anonymously</Label>
            </div>
            <Button 
              onClick={handleSubmit} 
              className="flex-1 rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all" 
              disabled={!title.trim() || analyzing}
            >
              Submit Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

