import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { EyeOff } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { fetchTopics } from "@/lib/community";
import { toast } from "sonner";

export const Route = createFileRoute("/prompt-hive/submit")({
  head: () => ({ meta: [{ title: "Submit a prompt — Prompt Hive" }] }),
  component: SubmitPromptPage,
});

const schema = z.object({
  title: z.string().trim().min(8, "Title must be at least 8 characters").max(200),
  body: z.string().trim().min(20, "Prompt must be at least 20 characters").max(8000),
  topicId: z.string().uuid("Pick a category"),
  isAnonymous: z.boolean(),
});

function SubmitPromptPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [topics, setTopics] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [topicId, setTopicId] = useState<string>("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/login", search: { redirect: "/prompt-hive/submit" } as any });
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    fetchTopics().then((all) =>
      setTopics((all as any[]).filter((t) => t.slug?.startsWith("prompt-"))),
    );
  }, []);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ title, body, topicId, isAnonymous });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Check your input");
      return;
    }
    setSubmitting(true);
    const { data: q, error } = await supabase
      .from("questions")
      .insert({
        author_id: user.id,
        title: parsed.data.title,
        body: parsed.data.body,
        is_anonymous: parsed.data.isAnonymous,
        kind: "prompt",
      } as any)
      .select("id")
      .single();
    if (error || !q) {
      setSubmitting(false);
      toast.error(error?.message ?? "Failed to submit");
      return;
    }
    await supabase.from("question_topics").insert({ question_id: q.id, topic_id: parsed.data.topicId });
    toast.success("Prompt shared!");
    navigate({ to: "/prompt-hive" });
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-700 text-foreground">Share a prompt</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Use <code className="px-1 rounded bg-muted">{`{variable}`}</code> placeholders for fields people can customize.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-2xl border border-border bg-card p-6">
          <div>
            <label className="text-sm font-600 text-foreground">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
              placeholder="e.g. The 'Senior Editor' Writing Prompt"
              className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-600 text-foreground">Prompt body</label>
            <p className="text-xs text-muted-foreground mb-2">
              Wrap user-fillable parts in curly braces, e.g. <code>{`{topic}`}</code>.
            </p>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={9}
              maxLength={8000}
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm font-mono"
            />
          </div>

          <div>
            <label className="text-sm font-600 text-foreground">Category</label>
            <div className="mt-2 flex flex-wrap gap-2">
              {topics.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setTopicId(t.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-600 border transition ${
                    topicId === t.id ? "bg-bee-gold border-bee-gold text-deep-night" : "bg-background border-border text-foreground hover:border-bee-gold"
                  }`}
                >
                  {t.icon} {t.name.replace(/ Prompts$/, "")}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-start gap-3 rounded-lg border border-border bg-background p-4 cursor-pointer">
            <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className="mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm font-600 text-foreground">
                <EyeOff className="h-4 w-4" /> Post anonymously
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your name won't be shown publicly.
              </p>
            </div>
          </label>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate({ to: "/prompt-hive" })}
              className="px-4 py-2 text-sm font-500 text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-bee-gold px-5 py-2.5 text-sm font-600 text-deep-night shadow-bee hover:brightness-105 disabled:opacity-60"
            >
              {submitting ? "Sharing…" : "Share prompt"}
            </button>
          </div>
        </form>
      </div>
    </SiteLayout>
  );
}