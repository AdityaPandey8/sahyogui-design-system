import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Phone, Wrench, CheckCircle, ShieldCheck, ShieldOff, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Volunteer } from "@/data/mockData";

interface VolunteerDetailDialogProps {
  volunteer: Volunteer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBlock?: (id: string) => void;
  onAssignTask?: (volunteer: Volunteer) => void;
  onUnassignTask?: (volunteerId: string, task: string) => void;
  showManageActions?: boolean;
}

export function VolunteerDetailDialog({ volunteer, open, onOpenChange, onBlock, onAssignTask, onUnassignTask, showManageActions = true }: VolunteerDetailDialogProps) {
  if (!volunteer) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">{volunteer.name}</DialogTitle>
          <DialogDescription className="text-xs">{volunteer.skills.join(" · ")}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2">
          <Badge variant={volunteer.blocked ? "destructive" : volunteer.available ? "default" : "secondary"}>
            {volunteer.blocked ? "Blocked" : volunteer.available ? "Available" : "Offline"}
          </Badge>
          {volunteer.skills.map(s => <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>)}
        </div>

        <div className="grid grid-cols-2 gap-y-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{volunteer.location}</span>
          <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{volunteer.phone}</span>
        </div>

        {/* Stats */}
        <div className="rounded-lg border p-3 space-y-3">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Performance</p>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div><p className="text-lg font-bold tabular-nums">{volunteer.tasksCompleted}</p><p className="text-[10px] text-muted-foreground">Tasks Done</p></div>
            <div><p className="text-lg font-bold tabular-nums">{volunteer.responseRate}%</p><p className="text-[10px] text-muted-foreground">Response</p></div>
            <div><p className={cn("text-lg font-bold tabular-nums", volunteer.reliabilityScore >= 85 ? "text-success" : "text-warning")}>{volunteer.reliabilityScore}</p><p className="text-[10px] text-muted-foreground">Reliability</p></div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-muted-foreground"><span>Response Rate</span><span>{volunteer.responseRate}%</span></div>
            <Progress value={volunteer.responseRate} className="h-1.5 [&>div]:bg-primary" />
            <div className="flex justify-between text-[10px] text-muted-foreground"><span>Reliability</span><span>{volunteer.reliabilityScore}%</span></div>
            <Progress value={volunteer.reliabilityScore} className={cn("h-1.5", volunteer.reliabilityScore >= 85 ? "[&>div]:bg-success" : "[&>div]:bg-warning")} />
          </div>
        </div>

        {/* Assigned Tasks */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1"><ClipboardList className="h-3 w-3" /> Assigned Tasks ({volunteer.assignedTasks.length})</p>
          {volunteer.assignedTasks.length > 0 ? (
            volunteer.assignedTasks.map((task, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg bg-muted/50 p-2">
                <p className="text-xs">{task}</p>
                {onUnassignTask && (
                  <Button size="sm" variant="ghost" className="h-6 text-[10px] text-danger" onClick={() => onUnassignTask(volunteer.id, task)}>Unassign</Button>
                )}
              </div>
            ))
          ) : (
            <p className="text-xs text-muted-foreground italic">No tasks assigned</p>
          )}
        </div>

        {showManageActions && (
          <div className="flex gap-2 border-t pt-3">
            <Button size="sm" variant={volunteer.blocked ? "default" : "destructive"} className="gap-1 flex-1" onClick={() => onBlock?.(volunteer.id)}>
              {volunteer.blocked ? <ShieldCheck className="h-3 w-3" /> : <ShieldOff className="h-3 w-3" />}
              {volunteer.blocked ? "Unblock" : "Block"}
            </Button>
            {onAssignTask && (
              <Button size="sm" variant="outline" className="gap-1 flex-1" onClick={() => onAssignTask(volunteer)}>
                <CheckCircle className="h-3 w-3" /> Assign Task
              </Button>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
