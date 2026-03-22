import { Building2 } from "lucide-react";
import type { NGO } from "@/data/mockData";

export function NGOCard({ ngo }: { ngo: NGO }) {
  return (
    <div className="group rounded-lg border bg-card p-5 shadow-sm transition-shadow duration-200 hover:shadow-md active:scale-[0.98]">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Building2 className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-card-foreground">{ngo.name}</h3>
          <span className="text-xs text-muted-foreground">{ngo.focusArea}</span>
        </div>
      </div>
      <p className="mb-3 text-xs leading-relaxed text-muted-foreground">{ngo.description}</p>
      <div className="flex items-center justify-between border-t pt-3">
        <span className="text-xs font-medium text-muted-foreground">Active Issues</span>
        <span className="text-sm font-bold text-primary">{ngo.activeIssues}</span>
      </div>
    </div>
  );
}
