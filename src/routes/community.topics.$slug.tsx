import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { QuestionCard } from "@/components/community/QuestionCard";
import { fetchQuestions, fetchUserVotes, type FeedQuestion } from "@/lib/community";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/community/topics/$slug")({
  component: TopicPage,
});

function TopicPage() {
  const { slug } = Route.useParams();
  const { user } = useAuth();
  const [topic, setTopic] = useState<any>(null);
  const [questions, setQuestions] = useState<FeedQuestion[]>([]);
  const [votes, setVotes] = useState<Map<string, number>>(new Map());
  const [following, setFollowing] = useState(false);

  const load = async () => {
    const { data: t } = await supabase.from("topics").select("*").eq("slug", slug).maybeSingle();
    setTopic(t);
    const qs = await fetchQuestions({ topicSlug: slug, sort: "new" });
    setQuestions(qs);
    if (user && t) {
      const { data: f } = await supabase.from("follows_topic").select("topic_id").eq("user_id", user.id).eq("topic_id", t.id).maybeSingle();
      setFollowing(!!f);
      const v = await fetchUserVotes(user.id, "question", qs.map((q) => q.id));
      setVotes(v);
    }
  };

  useEffect(() => { load(); }, [slug, user?.id]);

  const toggleFollow = async () => {
    if (!user) return toast("Sign in to follow");
    if (!topic) return;
    if (following) {
      await supabase.from("follows_topic").delete().eq("user_id", user.id).eq("topic_id", topic.id);
      setFollowing(false);
    } else {
      await supabase.from("follows_topic").insert({ user_id: user.id, topic_id: topic.id });
      setFollowing(true);
    }
  };

  if (!topic) {
    return <SiteLayout><div className="mx-auto max-w-4xl px-6 py-10 text-muted-foreground">Loading…</div></SiteLayout>;
  }

  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
        <Link to="/community/topics" className="text-xs font-600 text-amber-brand hover:underline">← All topics</Link>
        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-700 text-foreground">{topic.icon} {topic.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{topic.description}</p>
            <p className="mt-1 text-xs text-muted-foreground">{topic.questions_count} questions · {topic.followers_count} followers</p>
          </div>
          <button
            onClick={toggleFollow}
            className={`rounded-md px-4 py-2 text-sm font-600 transition ${following ? "bg-card border border-border text-foreground" : "bg-bee-gold text-deep-night shadow-bee"}`}
          >
            {following ? "Following" : "Follow"}
          </button>
        </div>

        <div className="mt-8 space-y-4">
          {questions.map((q) => <QuestionCard key={q.id} q={q} userVote={votes.get(q.id)} />)}
          {questions.length === 0 && (
            <p className="text-sm text-muted-foreground italic">No questions in this topic yet.</p>
          )}
        </div>
      </div>
    </SiteLayout>
  );
}