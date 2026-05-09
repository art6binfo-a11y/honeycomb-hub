import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUp, MessageCircle, PlusCircle } from "lucide-react";
import { Section } from "./FeaturedTutorials";
import { fetchQuestions, timeAgo, authorLabel, type FeedQuestion } from "@/lib/community";

export function CommunityQA() {
  const [questions, setQuestions] = useState<FeedQuestion[]>([]);
  useEffect(() => {
    fetchQuestions({ sort: "top", limit: 4 }).then(setQuestions).catch(() => {});
  }, []);

  return (
    <Section eyebrow="Community" title="Hot questions from the hive" cta={<Link to="/community" className="text-amber-brand font-600 hover:underline">See all questions →</Link> as any}>
      {questions.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <div className="text-3xl">🐝</div>
          <h3 className="mt-2 text-lg font-700 text-foreground">The hive is quiet</h3>
          <p className="mt-1 text-sm text-muted-foreground">Be the first to ask a question.</p>
          <Link to="/community/ask" className="mt-4 inline-flex items-center gap-2 rounded-md bg-bee-gold px-4 py-2 text-sm font-600 text-deep-night shadow-bee">
            <PlusCircle className="h-4 w-4" /> Ask a question
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {questions.map((q) => {
            const a = authorLabel(q.author, q.is_anonymous);
            return (
              <Link
                key={q.id}
                to="/community/q/$questionId"
                params={{ questionId: q.id }}
                className="group flex gap-4 rounded-xl bg-card border border-border p-5 hover:border-bee-gold hover:shadow-card-hover transition-all"
              >
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <span className="h-8 w-8 rounded-md border border-border flex items-center justify-center text-muted-foreground">
                    <ArrowUp className="h-4 w-4" />
                  </span>
                  <span className="text-[13px] font-700 text-foreground">{q.score}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-bee-gold text-[10px] font-700 text-deep-night">
                      {a.initials}
                    </span>
                    <span className="text-[12px] font-500 text-foreground">{a.name}</span>
                    <span className="text-[11px] text-muted-foreground">· {timeAgo(q.created_at)}</span>
                  </div>
                  <h3 className="text-[15px] font-600 text-foreground leading-snug group-hover:text-amber-brand transition-colors">
                    {q.title}
                  </h3>
                  <div className="mt-3 flex items-center gap-3 flex-wrap">
                    {q.topics[0] && (
                      <span className="rounded-full bg-pollen px-2.5 py-0.5 text-[11px] font-600 text-dark-amber">
                        {q.topics[0].icon} {q.topics[0].name}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-[12px] text-muted-foreground">
                      <MessageCircle className="h-3.5 w-3.5" /> {q.answers_count} answers
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </Section>
  );
}
