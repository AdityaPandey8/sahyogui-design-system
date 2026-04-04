import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";

interface NavbarProps {
  onGetStarted: () => void;
}

export function Navbar({ onGetStarted }: NavbarProps) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background/60 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-2 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">
            S
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            Sahyog<span className="text-primary group-hover:ml-0.5 transition-all">AI</span>
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-xs font-semibold hover:bg-primary/5 hover:text-primary transition-colors" onClick={() => scrollTo("features")}>
            Features
          </Button>
          <Button variant="ghost" size="sm" className="text-xs font-semibold hover:bg-primary/5 hover:text-primary transition-colors" onClick={() => scrollTo("how-it-works")}>
            How It Works
          </Button>
          <Button variant="ghost" size="sm" className="text-xs font-semibold hover:bg-primary/5 hover:text-primary transition-colors" onClick={() => scrollTo("map")}>
            Community Map
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button size="sm" onClick={onGetStarted} className="px-5 font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all">
            Get Started
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}

