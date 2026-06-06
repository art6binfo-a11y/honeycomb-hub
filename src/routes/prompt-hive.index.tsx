import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { SiteLayout } from "@/components/SiteLayout";
import { fetchQuestions, fetchTopics, type FeedQuestion } from "@/lib/community";
import { PromptCard } from "@/components/prompt-hive/PromptCard";

export const Route = createFileRoute("/prompt-hive/")({
  component: PromptHiveIndex,
});

function PromptHiveIndex() {
  const [prompts, setPrompts] = useState<FeedQuestion[]>([]);
  const [topics, setTopics] = useState<any[]>([]);
  const [sort, setSort] = useState<"top" | "new">("top");
  const [topicSlug, setTopicSlug] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopics().then((all) =>
      setTopics((all as any[]).filter((t) => t.slug?.startsWith("prompt-"))),
    );
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchQuestions({ kind: "prompt", sort, topicSlug, limit: 60 })
      .then(setPrompts)
      .finally(() => setLoading(false));
  }, [sort, topicSlug]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return prompts;
    return prompts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.body.toLowerCase().includes(q),
    );
  }, [prompts, search]);

  return (
    <SiteLayout>
      <section className="bg-deep-night text-white py-16">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="text-[11px] font-700 uppercase tracking-[0.2em] mb-2 text-bee-gold">
            Prompt Hive
          </div>
          <h1 className="text-4xl sm:text-5xl font-700 tracking-tight max-w-3xl">
            Battle-tested AI prompts from the hive.
          </h1>
          <p className="mt-3 max-w-2xl text-honey-lite/80 text-[15px]">
            Browse, copy, and customize prompts shared by the community. Logged-in
            members can post their own — anonymously if they prefer.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/prompt-hive/submit"
              className="rounded-md bg-bee-gold px-4 py-2 text-[13px] font-700 text-deep-night shadow-bee hover:brightness-105"
            >
              Submit a prompt
            </Link>
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-bee-gold/70" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search prompts…"
                className="w-full rounded-md border border-bee-gold/30 bg-card-dark pl-9 pr-3 py-2 text-[13px] text-honey-lite placeholder:text-dark-amber/70 focus:border-bee-gold outline-none"
              />
            </div>
            <div className="ml-auto flex rounded-md border border-bee-gold/30 overflow-hidden text-[12px]">
              {(["top", "new"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSort(s)}
                  className={`px-3 py-2 font-600 ${sort === s ? "bg-bee-gold text-deep-night" : "text-bee-gold hover:bg-bee-gold/10"}`}
                >
                  {s === "top" ? "Top" : "Newest"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-10">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setTopicSlug(undefined)}
              className={`rounded-full px-3 py-1.5 text-[12px] font-600 border transition ${
                !topicSlug ? "bg-bee-gold border-bee-gold text-deep-night" : "border-border text-foreground hover:border-bee-gold"
              }`}
            >
              All categories
            </button>
            {topics.map((t) => (
              <button
                key={t.id}
                onClick={() => setTopicSlug(t.slug)}
                className={`rounded-full px-3 py-1.5 text-[12px] font-600 border transition ${
                  topicSlug === t.slug ? "bg-bee-gold border-bee-gold text-deep-night" : "border-border text-foreground hover:border-bee-gold"
                }`}
              >
                {t.icon} {t.name.replace(/ Prompts$/, "")}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-center text-muted-foreground py-16">Loading prompts…</p>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <h2 className="text-xl font-700 text-foreground">No prompts here yet</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Be the first to share a prompt in this category.
              </p>
              <Link
                to="/prompt-hive/submit"
                className="mt-4 inline-block rounded-md bg-bee-gold px-4 py-2 text-[13px] font-700 text-deep-night shadow-bee"
              >
                Submit a prompt
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6">
              {filtered.map((p) => (
                <PromptCard key={p.id} prompt={p} />
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
}