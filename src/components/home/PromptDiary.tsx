import { Bookmark, Copy } from "lucide-react";
import { Section } from "./FeaturedTutorials";

const prompts = [
  {
    title: "The 'Senior Editor' Writing Prompt",
    tag: "Writing",
    saves: 1284,
    body: `You are a senior editor at The New Yorker. Rewrite the following passage to be tighter, more specific, and more vivid — without losing the original voice.

[paste your text here]`,
  },
  {
    title: "Career Pivot Roadmap (90 days)",
    tag: "Career",
    saves: 942,
    body: `Act as a career coach. Build me a 90-day plan to transition from {current role} to {target role}, with weekly milestones, skills, and one concrete deliverable per week.`,
  },
  {
    title: "Explain Like I'm 12 — But Smart",
    tag: "Learning",
    saves: 1567,
    body: `Explain {topic} as if I'm a smart 12-year-old. Use 1 analogy, 3 short paragraphs, and one surprising fact at the end.`,
  },
];

export function PromptDiary() {
  return (
    <section className="bg-deep-night text-white py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-honeycomb opacity-[0.06]" />
      <div className="absolute -top-32 right-1/4 h-96 w-96 rounded-full bg-bee-gold/10 blur-3xl" />
      <div className="relative mx-auto max-w-[1280px] px-6">
        <div className="flex items-end justify-between mb-8 gap-6">
          <div>
            <div className="text-[11px] font-700 uppercase tracking-[0.2em] mb-2 text-bee-gold">
              Prompt Diary
            </div>
            <h2 className="text-3xl sm:text-4xl font-700 tracking-tight max-w-2xl text-balance">
              Battle-tested prompts, ready to copy.
            </h2>
          </div>
          <button className="hidden sm:inline text-[13px] font-600 text-bee-gold hover:underline underline-offset-4">
            Open the diary →
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {prompts.map((p) => (
            <article
              key={p.title}
              className="group relative rounded-2xl border border-bee-gold/20 bg-card-dark p-6 hover:border-bee-gold transition-all hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-700 uppercase tracking-wider text-bee-gold bg-bee-gold/10 px-2 py-1 rounded-full">
                  {p.tag}
                </span>
                <div className="flex items-center gap-1 text-[12px] text-dark-amber">
                  <Bookmark className="h-3.5 w-3.5" />
                  {p.saves.toLocaleString()}
                </div>
              </div>
              <h3 className="text-lg font-700 text-bee-gold mb-3">{p.title}</h3>
              <pre className="text-[12.5px] leading-relaxed text-honey-lite/80 font-sans whitespace-pre-wrap line-clamp-6">
                {p.body}
              </pre>
              <div className="mt-5 pt-4 border-t border-hive-light/40 flex items-center justify-between">
                <button className="inline-flex items-center gap-1.5 text-[12px] font-600 text-bee-gold hover:text-white transition-colors">
                  <Copy className="h-3.5 w-3.5" /> Copy prompt
                </button>
                <button className="text-[12px] text-dark-amber hover:text-bee-gold">
                  Save
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
