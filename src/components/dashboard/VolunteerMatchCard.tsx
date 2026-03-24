import { User, MapPin, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Volunteer } from "@/data/mockData";

interface VolunteerMatchCardProps {
  volunteer: Volunteer;
  matchScore: number;
  distance: string;
  onAssign?: () => void;
  highlight?: boolean;
}

export function VolunteerMatchCard({ volunteer, matchScore, distance, onAssign, highlight }: VolunteerMatchCardProps) {
  return (
    <div className={`rounded-lg border p-3 transition-colors ${highlight ? "border-primary/50 bg-primary/5" : "bg-card"}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {volunteer.name.split(" ").map((n) => n[0]).join("")}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{volunteer.name}</p>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-0.5"><MapPin className="h-2.5 w-2.5" />{distance}</span>
              <span className="flex items-center gap-0.5"><Star className="h-2.5 w-2.5" />{volunteer.reliabilityScore}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${matchScore >= 80 ? "bg-success/15 text-success" : matchScore >= 50 ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground"}`}>
            <Zap className="inline h-3 w-3 mr-0.5" />{matchScore}%
          </span>
          {onAssign && <Button size="sm" className="h-7 text-xs" onClick={onAssign}>Assign</Button>}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {volunteer.skills.map((s) => (
          <span key={s} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">{s}</span>
        ))}
      </div>
    </div>
  );
}
