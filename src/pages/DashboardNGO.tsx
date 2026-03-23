import { Link } from "react-router-dom";
import { ngos } from "@/data/mockData";
import { NGOCard } from "@/components/NGOCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function DashboardNGO() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
            </Link>
            <h1 className="text-base font-bold">NGO Dashboard</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h2 className="mb-4 text-lg font-bold">Registered NGOs ({ngos.length})</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ngos.map((ngo) => (
            <NGOCard key={ngo.id} ngo={ngo} />
          ))}
        </div>
      </main>
    </div>
  );
}
