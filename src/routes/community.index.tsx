import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Flame, Sparkles, PlusCircle } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { QuestionCard } from "@/components/community/QuestionCard";
import { fetchQuestions, fetchTopics, fetchUserVotes, type FeedQuestion } from "@/lib/community";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/community/")({
  validateSearch: (s: Record<string, unknown>) => ({
    sort: (s.sort as "top" | "new") || "new",
  }),
  component: CommunityFeed,
});

function CommunityFeed() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { sort } = Route.useSearch();
  const [questions, setQuestions] = useState<FeedQuestion[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [votes, setVotes] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchQuestions({ sort }), fetchTopics()])
      .then(async ([qs, ts]) => {
        setQuestions(qs);
        setTopics(ts);
        if (user) {
          const v = await fetchUserVotes(user.id, "question", qs.map((q) => q.id));
          setVotes(v);
        }
      })
      .finally(() => setLoading(false));
  }, [sort, user?.id]);

  const handleAsk = () => {
    if (!user) navigate({ to: "/login", search: { redirect: "/community/ask" } });
    else navigate({ to: "/community/ask" });
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-[1fr_280px] gap-8">
          <div>
            <div className="flex items-center justify-between gap-3 mb-5">
              <div>
                <h1 className="text-3xl font-700 text-foreground">The Hive</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Ask anything about AI. Anonymous posts welcome.
                </p>
              </div>
              <button
                onClick={handleAsk}
                className="inline-flex items-center gap-2 rounded-md bg-bee-gold px-4 py-2 text-sm font-600 text-deep-night shadow-bee hover:brightness-105"
              >
                <PlusCircle className="h-4 w-4" /> Ask a question
              </button>
            </div>

            <div className="flex items-center gap-1 mb-5 border-b border-border">
              <SortTab active={sort === "new"} icon={<Sparkles className="h-3.5 w-3.5" />} label="New" to="/community" search={{ sort: "new" }} />
              <SortTab active={sort === "top"} icon={<Flame className="h-3.5 w-3.5" />} label="Top" to="/community" search={{ sort: "top" }} />
            </div>

            {loading ? (
              <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />)}</div>
            ) : questions.length === 0 ? (
              <EmptyState onAsk={handleAsk} />
            ) : (
              <div className="space-y-4">
                {questions.map((q) => (
                  <QuestionCard key={q.id} q={q} userVote={votes.get(q.id)} />
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-5">
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="text-sm font-700 text-foreground mb-3">Browse topics</h3>
              <ul className="space-y-1">
                {topics.slice(0, 12).map((t) => (
                  <li key={t.id}>
                    <Link
                      to="/community/topics/$slug"
                      params={{ slug: t.slug }}
                      className="flex items-center justify-between rounded-md px-2 py-1.5 text-[13px] text-foreground hover:bg-pollen transition"
                    >
                      <span>{t.icon} {t.name}</span>
                      <span className="text-xs text-muted-foreground">{t.questions_count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link to="/community/topics" className="mt-3 block text-xs font-600 text-amber-brand hover:underline">
                See all topics →
              </Link>
            </div>

            <div className="rounded-xl border border-bee-gold/40 bg-pollen p-5">
              <h3 className="text-sm font-700 text-deep-night">Hive guidelines</h3>
              <ul className="mt-2 space-y-1.5 text-[12.5px] text-deep-night/80">
                <li>• Be kind. Beginners welcome.</li>
                <li>• Use anonymous mode if you're unsure.</li>
                <li>• Upvote answers that helped you.</li>
                <li>• Report spam or rude content.</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </SiteLayout>
  );
}

function SortTab({
  active, icon, label, to, search,
}: { active: boolean; icon: React.ReactNode; label: string; to: string; search: { sort: "top" | "new" } }) {
  return (
    <Link
      to={to as any}
      search={search as any}
      className={cn(
        "inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-600 border-b-2 -mb-px transition",
        active ? "border-bee-gold text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
      )}
    >
      {icon} {label}
    </Link>
  );
}

function Skeleton() {
  return <div className="h-32 rounded-xl bg-muted/40 animate-pulse" />;
}

function EmptyState({ onAsk }: { onAsk: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
      <div className="text-4xl">🐝</div>
      <h3 className="mt-3 text-lg font-700 text-foreground">No questions yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">Be the first to ask the hive.</p>
      <button onClick={onAsk} className="mt-5 inline-flex items-center gap-2 rounded-md bg-bee-gold px-4 py-2 text-sm font-600 text-deep-night shadow-bee">
        <PlusCircle className="h-4 w-4" /> Ask the first question
      </button>
    </div>
  );
}