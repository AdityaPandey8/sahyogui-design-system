import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Mail, Users, Trophy, Clock, ShieldCheck, ShieldOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { volunteers, issues, type NGO } from "@/data/mockData";

interface NGODetailDialogProps {
  ngo: NGO | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBlock?: (id: string) => void;
  onAssignTask?: (ngo: NGO) => void;
  showManageActions?: boolean;
}

export function NGODetailDialog({ ngo, open, onOpenChange, onBlock, onAssignTask, showManageActions = true }: NGODetailDialogProps) {
  if (!ngo) return null;

  const ngoVolunteers = volunteers.filter(v => ngo.volunteerIds.includes(v.id));
  const ngoIssues = issues.filter(i => i.assignedNgo === ngo.id);
  const solvedIssues = ngoIssues.filter(i => i.status === "Solved");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">{ngo.name}</DialogTitle>
          <DialogDescription className="text-xs">{ngo.focusArea}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2">
          <Badge variant={ngo.blocked ? "destructive" : "secondary"}>{ngo.blocked ? "Blocked" : "Active"}</Badge>
          <Badge variant="outline">{ngo.focusArea}</Badge>
        </div>

        <p className="text-sm text-muted-foreground">{ngo.description}</p>

        <div className="grid grid-cols-2 gap-y-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{ngo.location}</span>
          <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{ngo.contactEmail}</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Avg: {ngo.avgResponseTime}</span>
          <span className="flex items-center gap-1"><Users className="h-3 w-3" />{ngoVolunteers.length} volunteers</span>
        </div>

        {/* Performance */}
        <div className="rounded-lg border p-3 space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Performance</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div><p className="text-lg font-bold tabular-nums">{ngo.issuesHandled}</p><p className="text-[10px] text-muted-foreground">Handled</p></div>
            <div><p className={cn("text-lg font-bold tabular-nums", ngo.successRate >= 90 ? "text-success" : "text-warning")}>{ngo.successRate}%</p><p className="text-[10px] text-muted-foreground">Success</p></div>
            <div><p className="text-lg font-bold">{ngo.activeIssues}</p><p className="text-[10px] text-muted-foreground">Active</p></div>
          </div>
          <Progress value={ngo.successRate} className={cn("h-1.5", ngo.successRate >= 90 ? "[&>div]:bg-success" : "[&>div]:bg-warning")} />
        </div>

        {/* Volunteers */}
        {ngoVolunteers.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Volunteers ({ngoVolunteers.length})</p>
            {ngoVolunteers.map(v => (
              <div key={v.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-2">
                <div>
                  <p className="text-xs font-medium">{v.name}</p>
                  <p className="text-[10px] text-muted-foreground">{v.skills.join(", ")}</p>
                </div>
                <span className={cn("text-[10px] font-medium", v.available ? "text-success" : "text-muted-foreground")}>{v.available ? "Available" : "Offline"}</span>
              </div>
            ))}
          </div>
        )}

        {/* Recent Issues */}
        {ngoIssues.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Assigned Issues ({ngoIssues.length})</p>
            {ngoIssues.slice(0, 4).map(i => (
              <div key={i.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-2">
                <p className="text-xs font-medium truncate flex-1">{i.title}</p>
                <Badge variant="outline" className="text-[10px] ml-2">{i.status}</Badge>
              </div>
            ))}
          </div>
        )}

        {showManageActions && (
          <div className="flex gap-2 border-t pt-3">
            <Button size="sm" variant={ngo.blocked ? "default" : "destructive"} className="gap-1 flex-1" onClick={() => onBlock?.(ngo.id)}>
              {ngo.blocked ? <ShieldCheck className="h-3 w-3" /> : <ShieldOff className="h-3 w-3" />}
              {ngo.blocked ? "Unblock" : "Block"}
            </Button>
            {onAssignTask && (
              <Button size="sm" variant="outline" className="gap-1 flex-1" onClick={() => onAssignTask(ngo)}>
                <Trophy className="h-3 w-3" /> Assign Task
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
