import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { EyeOff } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { fetchTopics } from "@/lib/community";
import { toast } from "sonner";

export const Route = createFileRoute("/community/ask")({
  head: () => ({ meta: [{ title: "Ask a question — askyourbee" }] }),
  component: AskPage,
});

const schema = z.object({
  title: z.string().trim().min(10, "Title must be at least 10 characters").max(300),
  body: z.string().trim().max(50000),
  topicIds: z.array(z.string().uuid()).max(5),
  isAnonymous: z.boolean(),
});

function AskPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [topics, setTopics] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [topicIds, setTopicIds] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/login", search: { redirect: "/community/ask" } });
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    fetchTopics().then(setTopics);
  }, []);

  if (!user) return null;

  const toggleTopic = (id: string) => {
    setTopicIds((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : cur.length >= 5 ? cur : [...cur, id]));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse({ title, body, topicIds, isAnonymous });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message || "Check your input");
      return;
    }
    setSubmitting(true);
    const { data: q, error } = await supabase
      .from("questions")
      .insert({ author_id: user.id, title: parsed.data.title, body: parsed.data.body, is_anonymous: parsed.data.isAnonymous })
      .select("id")
      .single();
    if (error || !q) {
      setSubmitting(false);
      toast.error(error?.message ?? "Failed to post");
      return;
    }
    if (topicIds.length > 0) {
      await supabase.from("question_topics").insert(topicIds.map((tid) => ({ question_id: q.id, topic_id: tid })));
    }
    toast.success("Your question is live!");
    navigate({ to: "/community/q/$questionId", params: { questionId: q.id } });
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-700 text-foreground">Ask the Hive</h1>
        <p className="mt-1 text-sm text-muted-foreground">Be specific. Imagine asking a friend.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6 rounded-2xl border border-border bg-card p-6">
          <div>
            <label className="text-sm font-600 text-foreground">Title</label>
            <p className="text-xs text-muted-foreground mb-2">Phrase as a question (10–300 chars)</p>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={300}
              placeholder="e.g. What's the best AI tool for translating PDFs accurately?"
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-600 text-foreground">Details (optional)</label>
            <p className="text-xs text-muted-foreground mb-2">Add context, what you've tried, links</p>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              maxLength={50000}
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm font-mono"
            />
          </div>

          <div>
            <label className="text-sm font-600 text-foreground">Topics</label>
            <p className="text-xs text-muted-foreground mb-2">Pick up to 5</p>
            <div className="flex flex-wrap gap-2">
              {topics.map((t) => {
                const active = topicIds.includes(t.id);
                return (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => toggleTopic(t.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-600 border transition ${
                      active ? "bg-bee-gold border-bee-gold text-deep-night" : "bg-background border-border text-foreground hover:border-bee-gold"
                    }`}
                  >
                    {t.icon} {t.name}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="flex items-start gap-3 rounded-lg border border-border bg-background p-4 cursor-pointer">
            <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className="mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm font-600 text-foreground">
                <EyeOff className="h-4 w-4" /> Post anonymously
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Your name won't be shown publicly. Moderators can still see who posted to handle abuse.
              </p>
            </div>
          </label>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate({ to: "/community" })}
              className="px-4 py-2 text-sm font-500 text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-bee-gold px-5 py-2.5 text-sm font-600 text-deep-night shadow-bee hover:brightness-105 disabled:opacity-60"
            >
              {submitting ? "Posting…" : "Post question"}
            </button>
          </div>
        </form>
      </div>
    </SiteLayout>
  );
}