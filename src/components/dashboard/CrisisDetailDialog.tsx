import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Calendar, Image } from "lucide-react";
import { ngos, volunteers, type PastCrisis } from "@/data/mockData";

interface CrisisDetailDialogProps {
  crisis: PastCrisis | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CrisisDetailDialog({ crisis, open, onOpenChange }: CrisisDetailDialogProps) {
  if (!crisis) return null;

  const ngo = ngos.find(n => n.id === crisis.resolvedByNgo);
  const crisisVolunteers = volunteers.filter(v => crisis.resolvedByVolunteers.includes(v.id));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base">{crisis.title}</DialogTitle>
          <DialogDescription className="sr-only">Past crisis details</DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{crisis.category}</Badge>
          <Badge variant="outline" className="text-success border-success/30">Resolved</Badge>
        </div>

        <p className="text-sm text-muted-foreground">{crisis.description}</p>

        <div className="grid grid-cols-2 gap-y-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{crisis.location}</span>
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(crisis.date).toLocaleDateString()}</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Response: {crisis.responseTime}</span>
          <span className="flex items-center gap-1"><Users className="h-3 w-3" />{crisis.livesImpacted.toLocaleString()} lives impacted</span>
        </div>

        {/* Resolved by */}
        {ngo && (
          <div className="rounded-lg bg-primary/5 border border-primary/20 p-3">
            <p className="text-xs font-bold text-primary mb-1">Resolved by NGO</p>
            <p className="text-sm font-semibold">{ngo.name}</p>
            <p className="text-xs text-muted-foreground">{ngo.focusArea}</p>
          </div>
        )}

        {crisisVolunteers.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Volunteers Involved ({crisisVolunteers.length})</p>
            {crisisVolunteers.map(v => (
              <div key={v.id} className="flex items-center justify-between rounded-lg bg-muted/50 p-2">
                <div>
                  <p className="text-xs font-medium">{v.name}</p>
                  <p className="text-[10px] text-muted-foreground">{v.skills.join(", ")}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Photos */}
        {crisis.photos.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1"><Image className="h-3 w-3" /> Photos ({crisis.photos.length})</p>
            <div className="grid grid-cols-3 gap-2">
              {crisis.photos.map((photo, idx) => (
                <div key={idx} className="aspect-video rounded-lg bg-muted border overflow-hidden">
                  <img src={photo} alt={`Crisis photo ${idx + 1}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
