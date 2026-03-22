import type { Volunteer } from "@/data/mockData";

export function VolunteerCard({ volunteer }: { volunteer: Volunteer }) {
  const initials = volunteer.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="group rounded-lg border bg-card p-4 shadow-sm transition-shadow duration-200 hover:shadow-md active:scale-[0.98]">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
          {initials}
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-card-foreground">{volunteer.name}</h3>
          <span className={`text-xs font-medium ${volunteer.available ? "text-success" : "text-muted-foreground"}`}>
            {volunteer.available ? "Available" : "Unavailable"}
          </span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {volunteer.skills.map((skill) => (
          <span key={skill} className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
