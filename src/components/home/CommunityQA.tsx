import { ArrowUp, MessageCircle } from "lucide-react";
import { Section } from "./FeaturedTutorials";

const questions = [
  {
    q: "What's the best AI tool for translating long PDFs accurately?",
    by: "Mariam K.",
    initials: "MK",
    tag: "Productivity",
    votes: 38,
    answers: 12,
    time: "2h ago",
  },
  {
    q: "How do I write a Midjourney prompt that gives consistent characters?",
    by: "Diego P.",
    initials: "DP",
    tag: "Design",
    votes: 54,
    answers: 21,
    time: "4h ago",
  },
  {
    q: "Is ChatGPT Plus worth it in 2025 if I already use Claude?",
    by: "Hassan A.",
    initials: "HA",
    tag: "Reviews",
    votes: 27,
    answers: 9,
    time: "6h ago",
  },
  {
    q: "Best free AI tool to summarize long YouTube lectures?",
    by: "Lin Z.",
    initials: "LZ",
    tag: "Education",
    votes: 42,
    answers: 15,
    time: "8h ago",
  },
];

export function CommunityQA() {
  return (
    <Section eyebrow="Community" title="Hot questions from the hive" cta="See all questions →">
      <div className="grid lg:grid-cols-2 gap-4">
        {questions.map((q) => (
          <article
            key={q.q}
            className="group flex gap-4 rounded-xl bg-card border border-border p-5 hover:border-bee-gold hover:shadow-card-hover transition-all"
          >
            <div className="flex flex-col items-center gap-1 shrink-0">
              <button className="h-8 w-8 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:bg-bee-gold hover:text-deep-night hover:border-bee-gold transition">
                <ArrowUp className="h-4 w-4" />
              </button>
              <span className="text-[13px] font-700 text-foreground">{q.votes}</span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-bee-gold text-[10px] font-700 text-deep-night">
                  {q.initials}
                </span>
                <span className="text-[12px] font-500 text-foreground">{q.by}</span>
                <span className="text-[11px] text-muted-foreground">· {q.time}</span>
              </div>
              <h3 className="text-[15px] font-600 text-foreground leading-snug group-hover:text-amber-brand transition-colors">
                {q.q}
              </h3>
              <div className="mt-3 flex items-center gap-3">
                <span className="rounded-full bg-pollen px-2.5 py-0.5 text-[11px] font-600 text-dark-amber">
                  {q.tag}
                </span>
                <span className="inline-flex items-center gap-1 text-[12px] text-muted-foreground">
                  <MessageCircle className="h-3.5 w-3.5" /> {q.answers} answers
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
