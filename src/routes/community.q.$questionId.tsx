import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { EyeOff, MessageCircle, Flag } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import {
  fetchQuestion, fetchAnswers, fetchComments, fetchUserVotes,
  timeAgo, type FeedQuestion, type FeedAnswer, type FeedComment,
} from "@/lib/community";
import { VoteButtons } from "@/components/community/VoteButtons";
import { AuthorChip } from "@/components/community/AuthorChip";
import { toast } from "sonner";

export const Route = createFileRoute("/community/q/$questionId")({
  component: QuestionDetail,
});

function QuestionDetail() {
  const { questionId } = Route.useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState<FeedQuestion | null>(null);
  const [answers, setAnswers] = useState<FeedAnswer[]>([]);
  const [qVote, setQVote] = useState<number>(0);
  const [aVotes, setAVotes] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(true);

  // Answer composer
  const [answerBody, setAnswerBody] = useState("");
  const [answerAnon, setAnswerAnon] = useState(false);
  const [posting, setPosting] = useState(false);

  const load = async () => {
    setLoading(true);
    const [qd, ad] = await Promise.all([fetchQuestion(questionId), fetchAnswers(questionId, "top")]);
    setQ(qd);
    setAnswers(ad);
    if (user && qd) {
      const [qv, av] = await Promise.all([
        fetchUserVotes(user.id, "question", [qd.id]),
        fetchUserVotes(user.id, "answer", ad.map((a) => a.id)),
      ]);
      setQVote(qv.get(qd.id) ?? 0);
      setAVotes(av);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [questionId, user?.id]);

  const submitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate({ to: "/login", search: { redirect: window.location.pathname } });
      return;
    }
    if (answerBody.trim().length < 1) {
      toast.error("Write something first");
      return;
    }
    setPosting(true);
    const { error } = await supabase.from("answers").insert({
      question_id: questionId,
      author_id: user.id,
      body: answerBody.trim(),
      is_anonymous: answerAnon,
    });
    setPosting(false);
    if (error) { toast.error(error.message); return; }
    setAnswerBody(""); setAnswerAnon(false);
    toast.success("Answer posted");
    load();
  };

  if (loading || !q) {
    return (
      <SiteLayout>
        <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
          <div className="h-32 rounded-xl bg-muted/40 animate-pulse" />
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
        <Link to="/community" className="text-xs font-600 text-amber-brand hover:underline">← Back to the Hive</Link>

        <article className="mt-4 rounded-2xl border border-border bg-card p-6">
          <div className="flex gap-5">
            <VoteButtons targetType="question" targetId={q.id} initialScore={q.score} initialVote={qVote} />
            <div className="min-w-0 flex-1">
              <h1 className="text-2xl font-700 text-foreground leading-tight">{q.title}</h1>
              <div className="mt-3 flex items-center gap-3 flex-wrap text-[12px] text-muted-foreground">
                <AuthorChip author={q.author} isAnonymous={q.is_anonymous} />
                <span>· {timeAgo(q.created_at)}</span>
                {q.topics.map((t) => (
                  <Link key={t.id} to="/community/topics/$slug" params={{ slug: t.slug }} className="rounded-full bg-pollen px-2.5 py-0.5 text-[11px] font-600 text-dark-amber">
                    {t.icon} {t.name}
                  </Link>
                ))}
              </div>
              {q.body && (
                <div className="mt-4 prose prose-sm max-w-none whitespace-pre-wrap text-[14.5px] text-foreground leading-relaxed">
                  {q.body}
                </div>
              )}
              <div className="mt-5 flex items-center gap-4 text-[12px] text-muted-foreground border-t border-border pt-3">
                <span>{q.answers_count} answers</span>
                <ReportButton targetType="question" targetId={q.id} />
              </div>
            </div>
          </div>

          <CommentsSection parentType="question" parentId={q.id} />
        </article>

        <div className="mt-8">
          <h2 className="text-xl font-700 text-foreground">{answers.length} {answers.length === 1 ? "Answer" : "Answers"}</h2>
          <div className="mt-4 space-y-4">
            {answers.map((a) => (
              <AnswerCard key={a.id} a={a} userVote={aVotes.get(a.id) ?? 0} onChanged={load} />
            ))}
            {answers.length === 0 && (
              <p className="text-sm text-muted-foreground italic">No answers yet. Be the first to help.</p>
            )}
          </div>
        </div>

        {/* Answer composer */}
        <div className="mt-10 rounded-2xl border border-border bg-card p-6">
          <h3 className="text-lg font-700 text-foreground">Your answer</h3>
          {!user ? (
            <div className="mt-3 text-sm text-muted-foreground">
              <Link to="/login" search={{ redirect: window.location.pathname }} className="text-amber-brand font-600 hover:underline">Sign in</Link> to share what you know.
            </div>
          ) : (
            <form onSubmit={submitAnswer} className="mt-3 space-y-3">
              <textarea
                value={answerBody}
                onChange={(e) => setAnswerBody(e.target.value)}
                rows={6}
                placeholder="Share your knowledge…"
                className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm"
              />
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input type="checkbox" checked={answerAnon} onChange={(e) => setAnswerAnon(e.target.checked)} />
                <EyeOff className="h-3.5 w-3.5" /> Answer anonymously
              </label>
              <div className="flex justify-end">
                <button type="submit" disabled={posting} className="rounded-md bg-bee-gold px-5 py-2.5 text-sm font-600 text-deep-night shadow-bee disabled:opacity-60">
                  {posting ? "Posting…" : "Post answer"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}

function AnswerCard({ a, userVote, onChanged }: { a: FeedAnswer; userVote: number; onChanged: () => void }) {
  return (
    <article className="flex gap-4 rounded-xl border border-border bg-card p-5">
      <VoteButtons targetType="answer" targetId={a.id} initialScore={a.score} initialVote={userVote} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <AuthorChip author={a.author} isAnonymous={a.is_anonymous} />
          <span>· {timeAgo(a.created_at)}</span>
        </div>
        <div className="mt-2 whitespace-pre-wrap text-[14.5px] text-foreground leading-relaxed">{a.body}</div>
        <div className="mt-3 flex items-center gap-4 text-[12px] text-muted-foreground border-t border-border pt-2">
          <ReportButton targetType="answer" targetId={a.id} />
        </div>
        <CommentsSection parentType="answer" parentId={a.id} onChanged={onChanged} />
      </div>
    </article>
  );
}

function CommentsSection({ parentType, parentId, onChanged }: { parentType: "question" | "answer"; parentId: string; onChanged?: () => void }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [text, setText] = useState("");
  const [anon, setAnon] = useState(false);

  const load = async () => setComments(await fetchComments(parentType, parentId));

  useEffect(() => {
    if (open) load();
  }, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate({ to: "/login", search: { redirect: window.location.pathname } });
      return;
    }
    if (!text.trim()) return;
    const { error } = await supabase.from("comments").insert({
      parent_type: parentType, parent_id: parentId, author_id: user.id, body: text.trim(), is_anonymous: anon,
    });
    if (error) { toast.error(error.message); return; }
    setText(""); setAnon(false);
    load(); onChanged?.();
  };

  return (
    <div className="mt-3">
      <button onClick={() => setOpen((v) => !v)} className="inline-flex items-center gap-1 text-[12px] font-600 text-muted-foreground hover:text-foreground">
        <MessageCircle className="h-3.5 w-3.5" /> {open ? "Hide comments" : "Comments"}
      </button>
      {open && (
        <div className="mt-2 space-y-2 border-l-2 border-border pl-3">
          {comments.map((c) => (
            <div key={c.id} className="text-[13px]">
              <span className="font-600 text-foreground">
                <AuthorChip author={c.author} isAnonymous={c.is_anonymous} />
              </span>{" "}
              <span className="text-foreground">{c.body}</span>{" "}
              <span className="text-[11px] text-muted-foreground">· {timeAgo(c.created_at)}</span>
            </div>
          ))}
          <form onSubmit={submit} className="pt-1 flex flex-col gap-2">
            <input
              value={text} onChange={(e) => setText(e.target.value)} maxLength={5000}
              placeholder="Add a comment…"
              className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-[13px]"
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground cursor-pointer">
                <input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} />
                Anonymous
              </label>
              <button type="submit" className="rounded-md bg-deep-night px-3 py-1 text-[12px] font-600 text-bee-gold">
                Comment
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function ReportButton({ targetType, targetId }: { targetType: "question" | "answer" | "comment"; targetId: string }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const handle = async () => {
    if (!user) {
      navigate({ to: "/login", search: { redirect: window.location.pathname } });
      return;
    }
    const reason = window.prompt("Why are you reporting this? (spam, abuse, off-topic, other)", "spam");
    if (!reason) return;
    const { error } = await supabase.from("reports").insert({
      reporter_id: user.id, target_type: targetType, target_id: targetId, reason,
    });
    if (error) toast.error(error.message);
    else toast.success("Thanks — moderators have been notified.");
  };
  return (
    <button onClick={handle} className="inline-flex items-center gap-1 hover:text-destructive transition">
      <Flag className="h-3 w-3" /> Report
    </button>
  );
}