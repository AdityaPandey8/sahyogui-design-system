import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";

interface NavbarProps {
  onGetStarted: () => void;
}

export function Navbar({ onGetStarted }: NavbarProps) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <span className="text-lg font-bold tracking-tight text-foreground">
          Sahyog<span className="text-primary">AI</span>
        </span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-xs" onClick={() => scrollTo("features")}>
            Features
          </Button>
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-xs" onClick={() => scrollTo("how-it-works")}>
            How It Works
          </Button>
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex text-xs" onClick={() => scrollTo("map")}>
            Map
          </Button>
          <ThemeToggle />
          <Button size="sm" onClick={onGetStarted}>
            Get Started
          </Button>
        </div>
      </div>
    </nav>
  );
}
