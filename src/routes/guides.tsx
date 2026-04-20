import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/PageHero";

export const Route = createFileRoute("/guides")({
  head: () => ({
    meta: [
      { title: "AI Tools & Guides — askyourbee" },
      {
        name: "description",
        content:
          "Beginner-friendly guides for ChatGPT, Midjourney, Claude, Notion AI and every modern AI tool.",
      },
      { property: "og:title", content: "AI Tools & Guides — askyourbee" },
      {
        property: "og:description",
        content: "Step-by-step AI tutorials, hand-curated for beginners.",
      },
    ],
  }),
  component: () => (
    <StubPage
      eyebrow="AI Tools & Guides"
      title="Step-by-step guides for every AI tool that matters"
      description="From your first ChatGPT prompt to building your own custom GPTs — taught the simple way, with screenshots and zero jargon."
    />
  ),
});
