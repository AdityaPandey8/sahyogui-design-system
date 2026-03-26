import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ImagePlus } from "lucide-react";
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
      aiPriorityScore: Math.floor(Math.random() * 40) + 50,
      affectedPeople: Math.floor(Math.random() * 500) + 10,
      isAnonymous: anonymous,
      isFake: false,
      coords: { x: Math.random() * 70 + 15, y: Math.random() * 70 + 15 },
      assignedVolunteers: [],
      photos: [],
    };
    onSubmit(newIssue);
    setTitle(""); setDescription(""); setLocation(""); setUrgency("Medium"); setCategory("Disaster"); setAnonymous(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Report an Issue</DialogTitle>
          <DialogDescription>Provide details about the issue you've observed.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Input placeholder="Issue title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="Describe the issue…" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          <Input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
          <div className="grid grid-cols-2 gap-2">
            <Select value={urgency} onValueChange={(v) => setUrgency(v as Urgency)}>
              <SelectTrigger><SelectValue placeholder="Urgency" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={category} onValueChange={(v) => setCategory(v as Category)}>
              <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <button type="button" className="flex h-20 w-full items-center justify-center gap-2 rounded-md border border-dashed text-sm text-muted-foreground transition-colors hover:bg-muted/50">
            <ImagePlus className="h-4 w-4" /> Upload images (simulated)
          </button>
          <div className="flex items-center gap-2">
            <Switch id="anon" checked={anonymous} onCheckedChange={setAnonymous} />
            <Label htmlFor="anon" className="text-sm">Report anonymously</Label>
          </div>
          <Button onClick={handleSubmit} className="w-full" disabled={!title.trim()}>Submit Report</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
