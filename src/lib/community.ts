import { supabase } from "@/integrations/supabase/client";

export type TargetType = "question" | "answer" | "comment";

export type AuthorRef = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
} | null;

export type FeedQuestion = {
  id: string;
  title: string;
  body: string;
  is_anonymous: boolean;
  status: "open" | "closed" | "removed";
  views_count: number;
  answers_count: number;
  comments_count: number;
  score: number;
  created_at: string;
  author_id: string | null;
  author: AuthorRef;
  topics: { id: string; slug: string; name: string; icon: string | null }[];
};

/**
 * Strip author identity for anonymous posts. Anonymous fields are still stored
 * in the DB (for moderation), but never exposed in the UI.
 */
function maskAuthor<T extends { is_anonymous: boolean; author_id: string | null; author: AuthorRef }>(row: T): T {
  if (row.is_anonymous) {
    return { ...row, author_id: null, author: null };
  }
  return row;
}

export async function fetchQuestions(opts: { sort?: "top" | "new"; topicSlug?: string; limit?: number; kind?: "question" | "prompt" } = {}) {
  const { sort = "new", topicSlug, limit = 20, kind = "question" } = opts;
  let query = supabase
    .from("questions")
    .select(
      `id, title, body, is_anonymous, status, views_count, answers_count, comments_count, score, created_at, author_id,
       author:profiles!questions_author_id_fkey(id, username, display_name, avatar_url),
       question_topics!inner(topic:topics(id, slug, name, icon))`
        .replace(/\s+/g, " "),
    )
    .eq("status", "open")
    .eq("kind", kind)
    .limit(limit);

  if (sort === "top") query = query.order("score", { ascending: false }).order("created_at", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  if (topicSlug) {
    // join filter via topic slug
    query = query.eq("question_topics.topic.slug", topicSlug);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((q: any) => {
    const topics = (q.question_topics ?? []).map((qt: any) => qt.topic).filter(Boolean);
    return maskAuthor({ ...q, author: q.author ?? null, topics }) as FeedQuestion;
  });
}

export async function fetchQuestion(id: string) {
  const { data, error } = await supabase
    .from("questions")
    .select(
      `id, title, body, is_anonymous, status, views_count, answers_count, comments_count, score, created_at, author_id,
       author:profiles!questions_author_id_fkey(id, username, display_name, avatar_url),
       question_topics(topic:topics(id, slug, name, icon))`
        .replace(/\s+/g, " "),
    )
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const topics = ((data as any).question_topics ?? []).map((qt: any) => qt.topic).filter(Boolean);
  return maskAuthor({ ...(data as any), author: (data as any).author ?? null, topics }) as FeedQuestion;
}

export type FeedAnswer = {
  id: string;
  body: string;
  is_anonymous: boolean;
  score: number;
  created_at: string;
  author_id: string | null;
  author: AuthorRef;
  comments_count: number;
};

export async function fetchAnswers(questionId: string, sort: "top" | "new" = "top") {
  let query = supabase
    .from("answers")
    .select(
      `id, body, is_anonymous, score, created_at, author_id, comments_count,
       author:profiles!answers_author_id_fkey(id, username, display_name, avatar_url)`
        .replace(/\s+/g, " "),
    )
    .eq("question_id", questionId)
    .eq("status", "open");
  query = sort === "top"
    ? query.order("score", { ascending: false }).order("created_at", { ascending: false })
    : query.order("created_at", { ascending: false });
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((a: any) => maskAuthor({ ...a, author: a.author ?? null }) as FeedAnswer);
}

export type FeedComment = {
  id: string;
  body: string;
  is_anonymous: boolean;
  score: number;
  created_at: string;
  reply_to_comment_id: string | null;
  author_id: string | null;
  author: AuthorRef;
};

export async function fetchComments(parentType: TargetType, parentId: string) {
  const { data, error } = await supabase
    .from("comments")
    .select(
      `id, body, is_anonymous, score, created_at, reply_to_comment_id, author_id,
       author:profiles!comments_author_id_fkey(id, username, display_name, avatar_url)`
        .replace(/\s+/g, " "),
    )
    .eq("parent_type", parentType)
    .eq("parent_id", parentId)
    .eq("status", "open")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((c: any) => maskAuthor({ ...c, author: c.author ?? null }) as FeedComment);
}

export async function fetchTopics() {
  const { data, error } = await supabase
    .from("topics")
    .select("id, slug, name, description, icon, followers_count, questions_count")
    .order("questions_count", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchUserVotes(userId: string, targetType: TargetType, ids: string[]) {
  if (ids.length === 0) return new Map<string, number>();
  const { data } = await supabase
    .from("votes")
    .select("target_id, value")
    .eq("user_id", userId)
    .eq("target_type", targetType)
    .in("target_id", ids);
  const map = new Map<string, number>();
  (data ?? []).forEach((v: any) => map.set(v.target_id, v.value));
  return map;
}

export async function castVote(userId: string, targetType: TargetType, targetId: string, value: 1 | -1) {
  // Toggle: if same value exists, remove. If different, upsert.
  const { data: existing } = await supabase
    .from("votes")
    .select("id, value")
    .eq("user_id", userId)
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .maybeSingle();

  if (existing && existing.value === value) {
    await supabase.from("votes").delete().eq("id", existing.id);
    return 0;
  }
  if (existing) {
    await supabase.from("votes").update({ value }).eq("id", existing.id);
    return value;
  }
  await supabase.from("votes").insert({ user_id: userId, target_type: targetType, target_id: targetId, value });
  return value;
}

export function authorLabel(a: AuthorRef, isAnonymous: boolean) {
  if (isAnonymous || !a) return { name: "Anonymous", initials: "A?", username: null as string | null };
  const name = a.display_name || a.username;
  const initials = name.slice(0, 2).toUpperCase();
  return { name, initials, username: a.username };
}

export function timeAgo(iso: string) {
  const sec = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (sec < 60) return `${sec}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  if (sec < 2592000) return `${Math.floor(sec / 86400)}d ago`;
  return new Date(iso).toLocaleDateString();
}