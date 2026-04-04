import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  search: string;
  onSearchChange: (val: string) => void;
  filters: { label: string; value: string; options: { value: string; label: string }[]; onChange: (val: string) => void }[];
  className?: string;
}

export function FilterBar({ search, onSearchChange, filters, className }: FilterBarProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <div className="relative flex-1 min-w-[220px]">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
        <Input
          placeholder="Search by title, location or category..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 h-10 rounded-xl border-white/10 bg-background/50 backdrop-blur-sm focus:ring-primary/20 transition-all"
        />
      </div>
      {filters.map((f) => (
        <Select key={f.label} value={f.value} onValueChange={f.onChange}>
          <SelectTrigger className="h-10 w-[140px] rounded-xl border-white/10 bg-background/50 backdrop-blur-sm focus:ring-primary/20 transition-all font-medium text-xs">
            <SelectValue placeholder={f.label} />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-white/10 bg-card/95 backdrop-blur-xl">
            <SelectItem value="all" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">All {f.label}</SelectItem>
            {f.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value} className="text-xs font-medium">{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  );
}
