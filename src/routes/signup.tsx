import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { SiteLayout } from "@/components/SiteLayout";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  validateSearch: (s: Record<string, unknown>) => ({
    redirect: (s.redirect as string) || "/community",
  }),
  head: () => ({ meta: [{ title: "Join the Hive — askyourbee" }] }),
  component: SignupPage,
});

const schema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(8).max(72),
  username: z
    .string()
    .trim()
    .min(3)
    .max(30)
    .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers, and underscores only"),
  display_name: z.string().trim().min(1).max(60),
});

function SignupPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const [form, setForm] = useState({ email: "", password: "", username: "", display_name: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Invalid input");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}${search.redirect}`,
        data: { username: parsed.data.username, display_name: parsed.data.display_name },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Check your email to confirm your account.");
    navigate({ to: "/login", search: { redirect: search.redirect } });
  };

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + search.redirect,
    });
    if (result.error) toast.error("Google sign-in failed");
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-md px-6 py-16">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
          <h1 className="text-2xl font-700 text-foreground">Join the Hive</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Ask, answer, and learn AI with thousands of beginners.
          </p>

          <button
            onClick={handleGoogle}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-500 text-foreground hover:bg-pollen transition"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <div className="h-px flex-1 bg-border" /> or <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Field label="Display name">
              <input className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} required maxLength={60} />
            </Field>
            <Field label="Username">
              <input className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required maxLength={30} />
            </Field>
            <Field label="Email">
              <input type="email" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </Field>
            <Field label="Password">
              <input type="password" className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={8} />
            </Field>
            <button type="submit" disabled={loading} className="w-full rounded-md bg-bee-gold px-4 py-2.5 text-sm font-600 text-deep-night shadow-bee hover:brightness-105 disabled:opacity-60">
              {loading ? "Creating…" : "Create account"}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-muted-foreground">
            Already a bee?{" "}
            <Link to="/login" search={{ redirect: search.redirect }} className="text-amber-brand font-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </SiteLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-500 text-foreground block mb-1">{label}</label>
      {children}
    </div>
  );
}