import { useState } from "react";
import { Link } from "react-router-dom";
import { issues as initialIssues } from "@/data/mockData";
import { IssueCard } from "@/components/IssueCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function DashboardPublic() {
  const [issueList] = useState(initialIssues);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
          <Link to="/">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button>
          </Link>
          <h1 className="text-base font-bold">Public Dashboard</h1>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h2 className="mb-4 text-lg font-bold">Community Issues</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {issueList.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      </main>
    </div>
  );
}
