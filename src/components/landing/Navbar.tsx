import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  onGetStarted: () => void;
}

export function Navbar({ onGetStarted }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setIsMobileMenuOpen(false); // Close mobile menu after navigation
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
          <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
            Sahyog<span className="text-primary group-hover:ml-0.5 transition-all">AI</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          <Button variant="ghost" size="sm" className="text-xs font-semibold hover:bg-primary/5 hover:text-primary transition-colors px-2 lg:px-3" onClick={() => scrollTo("features")}>
            Features
          </Button>
          <Button variant="ghost" size="sm" className="text-xs font-semibold hover:bg-primary/5 hover:text-primary transition-colors px-2 lg:px-3" onClick={() => scrollTo("use-cases") }>
            Use Cases
          </Button>
          <Button variant="ghost" size="sm" className="text-xs font-semibold hover:bg-primary/5 hover:text-primary transition-colors px-2 lg:px-3" onClick={() => scrollTo("roadmap") }>
            Roadmap
          </Button>
          <Button variant="ghost" size="sm" className="text-xs font-semibold hover:bg-primary/5 hover:text-primary transition-colors px-2 lg:px-3" onClick={() => scrollTo("map")}>
            Community Map
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:gap-3">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden p-2"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <Button size="sm" onClick={onGetStarted} className="px-3 lg:px-5 font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all text-xs lg:text-sm">
            Get Started
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-background/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm font-semibold hover:bg-primary/5 hover:text-primary transition-colors"
                onClick={() => scrollTo("features")}
              >
                Features
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm font-semibold hover:bg-primary/5 hover:text-primary transition-colors"
                onClick={() => scrollTo("use-cases")}
              >
                Use Cases
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm font-semibold hover:bg-primary/5 hover:text-primary transition-colors"
                onClick={() => scrollTo("roadmap")}
              >
                Roadmap
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm font-semibold hover:bg-primary/5 hover:text-primary transition-colors"
                onClick={() => scrollTo("map")}
              >
                Community Map
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

