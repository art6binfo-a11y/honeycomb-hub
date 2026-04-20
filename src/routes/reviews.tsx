import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/PageHero";

export const Route = createFileRoute("/reviews")({
  head: () => ({
    meta: [
      { title: "AI Tools Reviews — askyourbee" },
      {
        name: "description",
        content:
          "Honest, beginner-friendly reviews of ChatGPT, Claude, Midjourney, Perplexity, Notion AI and more.",
      },
      { property: "og:title", content: "AI Tools Reviews — askyourbee" },
      {
        property: "og:description",
        content: "We use the tools, then write the truth — so you don't waste your money.",
      },
    ],
  }),
  component: () => (
    <StubPage
      eyebrow="AI Tools Review"
      title="No hype. No affiliate bait. Just honest AI reviews."
      description="Pros, cons, pricing, real beginner workflows, and a clear verdict for every popular AI tool."
    />
  ),
});
