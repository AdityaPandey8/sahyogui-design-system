import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { UrgencyBadge } from "@/components/UrgencyBadge";
import { MapPin, Clock, Image, AlertTriangle } from "lucide-react";
import type { Alert } from "@/data/mockData";

interface AlertDetailDialogProps {
  alert: Alert | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AlertDetailDialog({ alert, open, onOpenChange }: AlertDetailDialogProps) {
  if (!alert) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-warning" />
            {alert.title}
          </DialogTitle>
          <DialogDescription className="sr-only">Alert details</DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2">
          <UrgencyBadge urgency={alert.severity} />
          <Badge variant="outline">{alert.type}</Badge>
        </div>

        <p className="text-sm text-muted-foreground">{alert.message}</p>

        <div className="grid grid-cols-2 gap-y-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{alert.affectedArea}</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(alert.createdAt).toLocaleString()}</span>
        </div>

        {/* Detailed Report */}
        <div className="rounded-lg border p-3">
          <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Detailed Report</p>
          <p className="text-sm text-foreground">{alert.details}</p>
        </div>

        {/* Photos */}
        {alert.photos.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Image className="h-3 w-3" /> Photos ({alert.photos.length})</p>
            <div className="grid grid-cols-3 gap-2">
              {alert.photos.map((photo, idx) => (
                <div key={idx} className="aspect-video rounded-lg bg-muted border overflow-hidden">
                  <img src={photo} alt={`Alert photo ${idx + 1}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
