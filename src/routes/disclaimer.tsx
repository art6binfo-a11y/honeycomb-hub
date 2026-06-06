import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer & Disclosures — askyourbee" },
      { name: "description", content: "Editorial promise, affiliate disclosure, and content disclaimer." },
    ],
    links: [{ rel: "canonical", href: "https://askyourbee-website-builder.lovable.app/disclaimer" }],
  }),
  component: () => (
    <SiteLayout>
      <article className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-700 text-foreground">Disclaimer &amp; Disclosures</h1>
        <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-foreground/90">
          <h2 className="text-xl font-700 mt-6">Editorial promise</h2>
          <p>Every tool we review is tested by a human. We are not paid by vendors for positive coverage.</p>
          <h2 className="text-xl font-700 mt-6">Affiliate disclosure</h2>
          <p>Some outbound links may be affiliate links. We may earn a commission at no cost to you. This never influences our scoring.</p>
          <h2 className="text-xl font-700 mt-6">No professional advice</h2>
          <p>Content here is for educational purposes only and is not legal, medical, or financial advice.</p>
        </div>
      </article>
    </SiteLayout>
  ),
});