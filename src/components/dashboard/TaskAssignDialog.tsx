import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { volunteers, type Issue } from "@/data/mockData";
import { toast } from "sonner";

interface TaskAssignDialogProps {
  issue: Issue | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssign?: (issueId: string, volunteerId: string, deadline: string, task: string) => void;
}

export function TaskAssignDialog({ issue, open, onOpenChange, onAssign }: TaskAssignDialogProps) {
  const [volunteerId, setVolunteerId] = useState("");
  const [deadline, setDeadline] = useState("");
  const [taskDesc, setTaskDesc] = useState("");

  const availableVols = volunteers.filter((v) => v.available);

  const handleSubmit = () => {
    if (!issue || !volunteerId) return;
    onAssign?.(issue.id, volunteerId, deadline, taskDesc);
    const vol = volunteers.find((v) => v.id === volunteerId);
    toast.success(`Assigned ${vol?.name} to "${issue.title}"`);
    setVolunteerId("");
    setDeadline("");
    setTaskDesc("");
    onOpenChange(false);
  };

  if (!issue) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base">Assign Volunteer</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">Assign a volunteer to: {issue.title}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Volunteer</Label>
            <Select value={volunteerId} onValueChange={setVolunteerId}>
              <SelectTrigger className="h-9 mt-1"><SelectValue placeholder="Select volunteer" /></SelectTrigger>
              <SelectContent>
                {availableVols.map((v) => (
                  <SelectItem key={v.id} value={v.id}>{v.name} — {v.skills.join(", ")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Task Description</Label>
            <Input className="h-9 mt-1" placeholder="e.g. Deliver food to Area A" value={taskDesc} onChange={(e) => setTaskDesc(e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Deadline</Label>
            <Input className="h-9 mt-1" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>
          <Button onClick={handleSubmit} disabled={!volunteerId} className="w-full">Assign Volunteer</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
