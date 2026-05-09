import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { supabase } from "@/integrations/supabase/client";
import { QuestionCard } from "@/components/community/QuestionCard";
import type { FeedQuestion } from "@/lib/community";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/community/u/$username")({
  component: ProfilePage,
});

function ProfilePage() {
  const { username } = Route.useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [questions, setQuestions] = useState<FeedQuestion[]>([]);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: p } = await supabase.from("profiles").select("*").eq("username", username).maybeSingle();
      setProfile(p);
      if (!p) return;
      const { data: qs } = await supabase
        .from("questions")
        .select(`id, title, body, is_anonymous, status, views_count, answers_count, comments_count, score, created_at, author_id,
                 author:profiles!questions_author_id_fkey(id, username, display_name, avatar_url),
                 question_topics(topic:topics(id, slug, name, icon))`.replace(/\s+/g, " "))
        .eq("author_id", p.id)
        .eq("is_anonymous", false)
        .eq("status", "open")
        .order("created_at", { ascending: false });
      setQuestions(((qs as any[]) ?? []).map((q) => ({
        ...q,
        author: q.author ?? null,
        topics: (q.question_topics ?? []).map((qt: any) => qt.topic).filter(Boolean),
      })));
      if (user) {
        const { data: f } = await supabase.from("follows_user").select("followed_id").eq("follower_id", user.id).eq("followed_id", p.id).maybeSingle();
        setFollowing(!!f);
      }
    })();
  }, [username, user?.id]);

  if (!profile) return <SiteLayout><div className="mx-auto max-w-4xl px-6 py-10 text-muted-foreground">Loading…</div></SiteLayout>;

  const toggleFollow = async () => {
    if (!user) return toast("Sign in to follow");
    if (user.id === profile.id) return;
    if (following) {
      await supabase.from("follows_user").delete().eq("follower_id", user.id).eq("followed_id", profile.id);
      setFollowing(false);
    } else {
      await supabase.from("follows_user").insert({ follower_id: user.id, followed_id: profile.id });
      setFollowing(true);
    }
  };

  return (
    <SiteLayout>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bee-gold text-xl font-700 text-deep-night">
            {(profile.display_name || profile.username).slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-700 text-foreground">{profile.display_name || profile.username}</h1>
            <p className="text-sm text-muted-foreground">@{profile.username}</p>
          </div>
          {user && user.id !== profile.id && (
            <button onClick={toggleFollow} className={`rounded-md px-4 py-2 text-sm font-600 ${following ? "bg-card border border-border" : "bg-bee-gold text-deep-night shadow-bee"}`}>
              {following ? "Following" : "Follow"}
            </button>
          )}
        </div>
        {profile.bio && <p className="mt-4 text-sm text-foreground">{profile.bio}</p>}

        <h2 className="mt-8 text-lg font-700 text-foreground">Questions</h2>
        <div className="mt-4 space-y-4">
          {questions.map((q) => <QuestionCard key={q.id} q={q} />)}
          {questions.length === 0 && <p className="text-sm text-muted-foreground italic">No public questions yet.</p>}
        </div>
      </div>
    </SiteLayout>
  );
}