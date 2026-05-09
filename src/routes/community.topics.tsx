import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteLayout } from "@/components/SiteLayout";
import { fetchTopics } from "@/lib/community";

export const Route = createFileRoute("/community/topics")({
  head: () => ({ meta: [{ title: "Topics — askyourbee" }] }),
  component: TopicsPage,
});

function TopicsPage() {
  const [topics, setTopics] = useState<any[]>([]);
  useEffect(() => { fetchTopics().then(setTopics); }, []);

  return (
    <SiteLayout>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10">
        <h1 className="text-3xl font-700 text-foreground">Topics</h1>
        <p className="mt-1 text-sm text-muted-foreground">Follow what you care about.</p>
        <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topics.map((t) => (
            <Link
              key={t.id}
              to="/community/topics/$slug"
              params={{ slug: t.slug }}
              className="rounded-xl border border-border bg-card p-5 hover:border-bee-gold transition"
            >
              <div className="text-2xl">{t.icon}</div>
              <div className="mt-2 font-700 text-foreground">{t.name}</div>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{t.description}</p>
              <div className="mt-3 text-[11px] text-muted-foreground">{t.questions_count} questions · {t.followers_count} followers</div>
            </Link>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}