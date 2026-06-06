import { useMemo, useState } from "react";
import { Bookmark, Check, Copy } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { authorLabel, timeAgo, type FeedQuestion } from "@/lib/community";

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

export function PromptCard({ prompt }: { prompt: FeedQuestion }) {
  const tokens = useMemo(() => tokenize(prompt.body || ""), [prompt.body]);
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const variables = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const t of tokens) {
      if (t.type === "var" && !seen.has(t.name)) {
        seen.add(t.name);
        out.push(t.name);
      }
    }
    return out;
  }, [tokens]);

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

  const a = authorLabel(prompt.author, prompt.is_anonymous);
  const topic = prompt.topics[0];

  return (
    <article className="group relative flex flex-col rounded-2xl border border-bee-gold/20 bg-card-dark p-6 hover:border-bee-gold transition-all hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-700 uppercase tracking-wider text-bee-gold bg-bee-gold/10 px-2 py-1 rounded-full">
          {topic?.icon} {topic?.name?.replace(/ Prompts$/, "") ?? "Prompt"}
        </span>
        <div className="flex items-center gap-1 text-[12px] text-dark-amber">
          <Bookmark className="h-3.5 w-3.5" />
          {prompt.score.toLocaleString()}
        </div>
      </div>
      <h3 className="text-lg font-700 text-bee-gold mb-3">{prompt.title}</h3>

      <div className="text-[12.5px] leading-relaxed text-honey-lite/80 whitespace-pre-wrap break-words">
        {tokens.map((t, i) => {
          if (t.type === "text") return <span key={i}>{t.value}</span>;
          const v = values[t.name] ?? "";
          const display = v.length > 0 ? v : t.name;
          return (
            <span key={i} className="relative inline-block align-baseline mx-0.5">
              <span aria-hidden className="invisible whitespace-pre px-2 text-[12.5px] font-600">{display}</span>
              <input
                type="text"
                value={v}
                onChange={(e) => setValues((p) => ({ ...p, [t.name]: e.target.value }))}
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
          Tip: fill the {variables.length} highlighted field{variables.length > 1 ? "s" : ""}.
        </p>
      )}

      <div className="mt-auto pt-5">
        <div className="pt-5 mt-2 border-t border-hive-light/40 flex items-center justify-between gap-4 text-[11px] text-dark-amber">
          <span>by {a.name} · {timeAgo(prompt.created_at)}</span>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-[12px] font-600 text-bee-gold hover:text-white hover:bg-bee-gold/10 transition-colors"
          >
            {copied ? (<><Check className="h-3.5 w-3.5" /> Copied!</>) : (<><Copy className="h-3.5 w-3.5" /> Copy</>)}
          </button>
        </div>
        <Link
          to="/community/q/$questionId"
          params={{ questionId: prompt.id }}
          className="mt-2 inline-block text-[11px] text-bee-gold/80 hover:underline"
        >
          Discuss this prompt →
        </Link>
      </div>
    </article>
  );
}