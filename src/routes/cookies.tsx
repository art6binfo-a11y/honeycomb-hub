import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — askyourbee" },
      { name: "description", content: "How askyourbee uses cookies." },
    ],
    links: [{ rel: "canonical", href: "https://askyourbee-website-builder.lovable.app/cookies" }],
  }),
  component: () => (
    <SiteLayout>
      <article className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-700 text-foreground">Cookie Policy</h1>
        <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-foreground/90">
          <p>We use strictly necessary cookies to keep you signed in. With consent, we also use analytics and advertising cookies.</p>
          <p>You can clear cookies anytime in your browser settings.</p>
        </div>
      </article>
    </SiteLayout>
  ),
});