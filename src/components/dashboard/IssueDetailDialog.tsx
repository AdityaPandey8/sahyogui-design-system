import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { StatusBadge } from "@/components/StatusBadge";
import { UrgencyBadge } from "@/components/UrgencyBadge";
import { MapPin, Clock, Users, ThumbsUp, MessageSquare, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { ngos, type Issue } from "@/data/mockData";

interface IssueDetailDialogProps {
  issue: Issue | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpvote?: (id: string) => void;
  onComment?: (id: string, text: string) => void;
}

export function IssueDetailDialog({ issue, open, onOpenChange, onUpvote, onComment }: IssueDetailDialogProps) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  if (!issue) return null;
  const ngo = ngos.find((n) => n.id === issue.assignedNgo);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base leading-snug pr-6">{issue.title}</DialogTitle>
          <DialogDescription className="sr-only">Issue details</DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2">
          <StatusBadge status={issue.status} />
          <UrgencyBadge urgency={issue.urgency} />
          <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">{issue.category}</span>
        </div>

        <p className="text-sm text-muted-foreground">{issue.description}</p>

        <div className="grid grid-cols-2 gap-y-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{issue.location}</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{issue.responseTime || "Awaiting"}</span>
          <span className="flex items-center gap-1"><Users className="h-3 w-3" />{issue.affectedPeople} affected</span>
          <span className="flex items-center gap-1">Reported by: {issue.reportedBy}</span>
        </div>

        {ngo && (
          <div className="rounded-md bg-primary/5 border border-primary/20 p-3">
            <p className="text-xs font-medium text-primary">Assigned NGO</p>
            <p className="text-sm font-semibold">{ngo.name}</p>
            <p className="text-xs text-muted-foreground">{ngo.focusArea}</p>
          </div>
        )}

        {/* Progress timeline */}
        <div className="space-y-2">
          <p className="text-xs font-medium">Progress Timeline</p>
          {["Reported", "Verified", "In Progress", "Solved"].map((step, i) => {
            const statusOrder = ["Pending", "Verified", "In Progress", "Solved"];
            const current = statusOrder.indexOf(issue.status);
            const active = i <= current;
            return (
              <div key={step} className="flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${active ? "bg-primary" : "bg-muted"}`} />
                <span className={`text-xs ${active ? "text-foreground font-medium" : "text-muted-foreground"}`}>{step}</span>
              </div>
            );
          })}
        </div>

        {/* Engagement */}
        <div className="flex items-center gap-3 border-t pt-3">
          <Button variant="outline" size="sm" onClick={() => onUpvote?.(issue.id)} className="gap-1">
            <ThumbsUp className="h-3 w-3" /> {issue.upvotes}
          </Button>
          <span className="flex items-center gap-1 text-xs text-muted-foreground"><MessageSquare className="h-3 w-3" />{issue.comments.length} comments</span>
        </div>

        {/* Comments */}
        {issue.comments.length > 0 && (
          <div className="space-y-2">
            {issue.comments.map((c) => (
              <div key={c.id} className="rounded-md bg-muted/50 p-2">
                <p className="text-xs font-medium">{c.author}</p>
                <p className="text-xs text-muted-foreground">{c.text}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Input placeholder="Add a comment…" value={comment} onChange={(e) => setComment(e.target.value)} className="h-8 text-xs" />
          <Button size="sm" variant="outline" onClick={() => { if (comment.trim()) { onComment?.(issue.id, comment); setComment(""); } }}>Post</Button>
        </div>

        {/* Rating */}
        {issue.status === "Solved" && (
          <div className="border-t pt-3">
            <p className="text-xs font-medium mb-1">Rate Response</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} onClick={() => setRating(s)} className="transition-transform hover:scale-110 active:scale-95">
                  <Star className={`h-5 w-5 ${s <= rating ? "fill-warning text-warning" : "text-muted-foreground"}`} />
                </button>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
