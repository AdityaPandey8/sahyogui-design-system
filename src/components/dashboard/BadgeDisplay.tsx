import { Award, Shield, Zap, Heart, Star, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  earned: boolean;
  color: string;
}

const defaultBadges: Badge[] = [
  { id: "b1", name: "First Responder", description: "Completed first task", icon: Zap, earned: true, color: "text-warning" },
  { id: "b2", name: "Reliable Hero", description: "90%+ reliability score", icon: Shield, earned: true, color: "text-primary" },
  { id: "b3", name: "Community Star", description: "Completed 25+ tasks", icon: Star, earned: true, color: "text-warning" },
  { id: "b4", name: "Emergency Expert", description: "Joined 5 emergencies", icon: Target, earned: false, color: "text-danger" },
  { id: "b5", name: "Lifesaver", description: "Helped 100+ people", icon: Heart, earned: false, color: "text-success" },
  { id: "b6", name: "Elite Volunteer", description: "Completed 50+ tasks", icon: Award, earned: false, color: "text-primary" },
];

interface BadgeDisplayProps {
  tasksCompleted?: number;
  reliabilityScore?: number;
}

export function BadgeDisplay({ tasksCompleted = 0, reliabilityScore = 0 }: BadgeDisplayProps) {
  const badges = defaultBadges.map((b) => {
    let earned = b.earned;
    if (b.id === "b3") earned = tasksCompleted >= 25;
    if (b.id === "b2") earned = reliabilityScore >= 90;
    if (b.id === "b6") earned = tasksCompleted >= 50;
    return { ...b, earned };
  });

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
      {badges.map((badge) => {
        const Icon = badge.icon;
        return (
          <div
            key={badge.id}
            className={`flex flex-col items-center gap-1 rounded-lg border p-3 text-center transition-opacity ${badge.earned ? "" : "opacity-35"}`}
            title={badge.description}
          >
            <Icon className={`h-6 w-6 ${badge.earned ? badge.color : "text-muted-foreground"}`} />
            <span className="text-[10px] font-semibold leading-tight">{badge.name}</span>
          </div>
        );
      })}
    </div>
  );
}
