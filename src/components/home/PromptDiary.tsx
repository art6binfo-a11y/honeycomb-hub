import { useMemo, useState } from "react";
import { Bookmark, Check, Copy } from "lucide-react";

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

type Token = { type: "text"; value: string } | { type: "var"; name: string };

function tokenize(body: string): Token[] {
  const tokens: Token[] = [];
  const regex = /\{([^{}\n]+)\}/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(body)) !== null) {
    if (m.index > last) tokens.push({ type: "text", value: body.slice(last, m.index) });
    tokens.push({ type: "var", name: m[1].trim() });
    last = m.index + m[0].length;
  }
  if (last < body.length) tokens.push({ type: "text", value: body.slice(last) });
  return tokens;
}

function PromptCard({ prompt }: { prompt: (typeof prompts)[number] }) {
  const tokens = useMemo(() => tokenize(prompt.body), [prompt.body]);
  const variables = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const t of tokens) {
      if (t.type === "var" && !seen.has(t.name)) {
        seen.add(t.name);
        list.push(t.name);
      }
    }
    return list;
  }, [tokens]);

  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const filledText = useMemo(
    () =>
      tokens
        .map((t) =>
          t.type === "text" ? t.value : values[t.name]?.trim() ? values[t.name] : `{${t.name}}`,
        )
        .join(""),
    [tokens, values],
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(filledText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore
    }
  };

  return (
    <article className="group relative flex flex-col rounded-2xl border border-bee-gold/20 bg-card-dark p-6 hover:border-bee-gold transition-all hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-700 uppercase tracking-wider text-bee-gold bg-bee-gold/10 px-2 py-1 rounded-full">
          {prompt.tag}
        </span>
        <div className="flex items-center gap-1 text-[12px] text-dark-amber">
          <Bookmark className="h-3.5 w-3.5" />
          {prompt.saves.toLocaleString()}
        </div>
      </div>
      <h3 className="text-lg font-700 text-bee-gold mb-3">{prompt.title}</h3>

      <div className="text-[12.5px] leading-relaxed text-honey-lite/80 font-sans whitespace-pre-wrap break-words">
        {tokens.map((t, i) => {
          if (t.type === "text") return <span key={i}>{t.value}</span>;
          const v = values[t.name] ?? "";
          const display = v.length > 0 ? v : t.name;
          return (
            <span key={i} className="relative inline-block align-baseline mx-0.5">
              <span
                aria-hidden
                className="invisible whitespace-pre px-2 text-[12.5px] font-600"
              >
                {display}
              </span>
              <input
                type="text"
                value={v}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, [t.name]: e.target.value }))
                }
                placeholder={t.name}
                aria-label={t.name}
                spellCheck={false}
                className="absolute inset-0 w-full rounded-md border border-bee-gold/40 bg-bee-gold/10 px-2 text-[12.5px] font-600 text-bee-gold placeholder:text-bee-gold/50 placeholder:italic outline-none transition-colors focus:border-bee-gold focus:bg-bee-gold/20"
              />
            </span>
          );
        })}
      </div>

      {variables.length > 0 && (
        <p className="mt-3 text-[10.5px] uppercase tracking-wider text-dark-amber/80">
          Tip: fill the {variables.length} highlighted field{variables.length > 1 ? "s" : ""} to customize.
        </p>
      )}

      <div className="mt-auto pt-5">
        <div className="pt-5 mt-2 border-t border-hive-light/40 flex items-center justify-between gap-4">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-[12px] font-600 text-bee-gold hover:text-white hover:bg-bee-gold/10 transition-colors"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" /> Copied!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" /> Copy prompt
              </>
            )}
          </button>
          <button className="rounded-md px-3 py-2 text-[12px] text-dark-amber hover:text-bee-gold hover:bg-bee-gold/5 transition-colors">Save</button>
        </div>
      </div>
    </article>
  );
}

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
            <PromptCard key={p.title} prompt={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
