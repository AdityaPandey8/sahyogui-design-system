import { useState, useEffect, useRef } from "react";
import { Search, Command, X, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export function SearchBar() {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.querySelector("input")?.focus();
      }
      if (e.key === "Escape") {
        setIsFocused(false);
        searchRef.current?.querySelector("input")?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div ref={searchRef} className="relative w-full max-w-[120px] sm:max-w-xs md:max-w-sm">
      <div className={cn(
        "group relative flex items-center transition-all duration-300",
        isFocused ? "scale-[1.02]" : "scale-100"
      )}>
        <Search className={cn(
          "absolute left-3 h-4 w-4 transition-colors",
          isFocused ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
        )} />
        <Input
          placeholder={t("search_placeholder", "Search issues, volunteers...")}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsSearching(true);
            setTimeout(() => setIsSearching(false), 500);
          }}
          onFocus={() => setIsFocused(true)}
          className={cn(
            "h-9 w-full rounded-xl bg-muted/50 pl-10 pr-10 border-none transition-all focus:ring-1 ring-primary/20",
            isFocused && "bg-background shadow-lg shadow-primary/5 ring-1 ring-primary/30"
          )}
        />
        <div className="absolute right-3 flex items-center gap-1">
          {query ? (
            <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isFocused && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.98 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-2xl border border-border/50 bg-background/80 p-2 backdrop-blur-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-2">Quick Results</p>
              {isSearching ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-5 w-5 animate-spin text-primary/50" />
                </div>
              ) : query.length > 0 ? (
                <div className="space-y-1">
                  <div className="flex items-center justify-between p-2 rounded-lg hover:bg-primary/5 cursor-pointer group transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Command className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold tracking-tight">Search for "{query}"</p>
                        <p className="text-[10px] text-muted-foreground">Find all related incidents</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </div>
                </div>
              ) : (
                <div className="py-4 text-center">
                   <p className="text-xs text-muted-foreground">Start typing to search across the platform</p>
                </div>
              )}
            </div>
            
            <div className="mt-2 border-t border-border/50 p-2 bg-muted/30">
              <div className="flex items-center justify-between px-2">
                 <div className="flex items-center gap-3">
                   <div className="flex items-center gap-1">
                      <kbd className="rounded border bg-background px-1 text-[10px] font-medium">↑↓</kbd>
                      <span className="text-[10px] text-muted-foreground">Navigate</span>
                   </div>
                   <div className="flex items-center gap-1">
                      <kbd className="rounded border bg-background px-1 text-[10px] font-medium">↵</kbd>
                      <span className="text-[10px] text-muted-foreground">Select</span>
                   </div>
                 </div>
                 <span className="text-[10px] text-primary font-bold">AI ENHANCED</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
