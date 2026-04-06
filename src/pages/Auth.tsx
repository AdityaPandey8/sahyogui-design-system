import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Shield, Building2, Heart, Globe, Loader2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import type { AppRole } from "@/hooks/useAuth";

const roles: { key: AppRole; label: string; icon: typeof Shield; desc: string }[] = [
  { key: "admin", label: "Admin", icon: Shield, desc: "Manage & oversee" },
  { key: "ngo", label: "NGO", icon: Building2, desc: "Coordinate relief" },
  { key: "volunteer", label: "Volunteer", icon: Heart, desc: "Help on ground" },
  { key: "public", label: "Public", icon: Globe, desc: "Report issues" },
];

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">(searchParams.get("role") ? "signup" : "login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<AppRole>(
    (searchParams.get("role") as AppRole) || "public"
  );
  const [loading, setLoading] = useState(false);

  // Check if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()
          .then(({ data }) => {
            if (data) navigate(`/dashboard/${data.role}`, { replace: true });
          });
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role: selectedRole },
        },
      });
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
      toast.success("Account created! Redirecting...");
      // Auto-login after signup (Supabase default for dev)
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
      if (!loginError) {
        navigate(`/dashboard/${selectedRole}`, { replace: true });
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
        setLoading(false);
        return;
      }
      // Fetch role and redirect
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();
        navigate(`/dashboard/${profile?.role || "public"}`, { replace: true });
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-background items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,hsl(var(--primary)/0.08),transparent_70%)]" />
        <div className="relative z-10 max-w-md text-center space-y-8">
          <div className="h-20 w-20 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-3xl shadow-2xl shadow-primary/30 mx-auto">
            S
          </div>
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">SahyogAI</h1>
            <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
              AI-powered disaster response & community coordination platform
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4">
            {roles.map(r => (
              <div key={r.key} className="rounded-xl border bg-card/50 backdrop-blur-sm p-4 text-center">
                <r.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-semibold text-foreground">{r.label}</p>
                <p className="text-[10px] text-muted-foreground">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right auth form */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <ThemeToggle />
        </div>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md space-y-8">
            {/* Logo for mobile */}
            <div className="lg:hidden text-center">
              <div className="h-14 w-14 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-2xl shadow-xl shadow-primary/20 mx-auto mb-4">
                S
              </div>
              <h1 className="text-2xl font-bold tracking-tight">SahyogAI</h1>
            </div>

            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold tracking-tight">
                {mode === "login" ? "Welcome back" : "Create your account"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {mode === "login"
                  ? "Sign in to access your dashboard"
                  : "Sign up to get started with SahyogAI"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="h-11 rounded-xl"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="h-11 rounded-xl"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                />
              </div>

              {mode === "signup" && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Select your role</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {roles.map(r => (
                      <button
                        key={r.key}
                        type="button"
                        onClick={() => setSelectedRole(r.key)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border p-3 text-left transition-all",
                          selectedRole === r.key
                            ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                            : "border-border hover:border-primary/40"
                        )}
                      >
                        <r.icon className={cn("h-5 w-5 shrink-0", selectedRole === r.key ? "text-primary" : "text-muted-foreground")} />
                        <div>
                          <p className="text-sm font-semibold">{r.label}</p>
                          <p className="text-[10px] text-muted-foreground">{r.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full h-11 rounded-xl font-bold shadow-lg shadow-primary/10" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {mode === "login" ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="text-sm text-primary hover:underline font-medium"
              >
                {mode === "login" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>

            <p className="text-center text-[10px] text-muted-foreground">
              Development mode — any email & password (6+ chars) accepted
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
