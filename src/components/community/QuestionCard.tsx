import { Link } from "@tanstack/react-router";
import { MessageCircle, Eye } from "lucide-react";
import type { FeedQuestion } from "@/lib/community";
import { timeAgo } from "@/lib/community";
import { VoteButtons } from "./VoteButtons";
import { AuthorChip } from "./AuthorChip";

export function QuestionCard({ q, userVote }: { q: FeedQuestion; userVote?: number }) {
  return (
    <article className="group flex gap-4 rounded-xl bg-card border border-border p-5 hover:border-bee-gold hover:shadow-card-hover transition-all">
      <VoteButtons targetType="question" targetId={q.id} initialScore={q.score} initialVote={userVote} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          <AuthorChip author={q.author} isAnonymous={q.is_anonymous} />
          <span className="text-[11px] text-muted-foreground">· {timeAgo(q.created_at)}</span>
        </div>
        <Link to="/community/q/$questionId" params={{ questionId: q.id }} className="block">
          <h3 className="text-[16px] font-600 text-foreground leading-snug group-hover:text-amber-brand transition-colors">
            {q.title}
          </h3>
          {q.body && (
            <p className="mt-1 text-[13.5px] text-muted-foreground line-clamp-2">{stripHtml(q.body)}</p>
          )}
        </Link>
        <div className="mt-3 flex items-center gap-3 flex-wrap">
          {q.topics.map((t) => (
            <Link
              key={t.id}
              to="/community/topics/$slug"
              params={{ slug: t.slug }}
              className="rounded-full bg-pollen px-2.5 py-0.5 text-[11px] font-600 text-dark-amber hover:bg-bee-gold transition"
            >
              {t.icon} {t.name}
            </Link>
          ))}
          <span className="inline-flex items-center gap-1 text-[12px] text-muted-foreground">
            <MessageCircle className="h-3.5 w-3.5" /> {q.answers_count} answers
          </span>
          <span className="inline-flex items-center gap-1 text-[12px] text-muted-foreground">
            <Eye className="h-3.5 w-3.5" /> {q.views_count}
          </span>
        </div>
      </div>
    </article>
  );
}

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").slice(0, 240);
}