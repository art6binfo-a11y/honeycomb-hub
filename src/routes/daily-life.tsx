import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/PageHero";

export const Route = createFileRoute("/daily-life")({
  head: () => ({
    meta: [
      { title: "AI For Daily Life — askyourbee" },
      {
        name: "description",
        content:
          "How to use AI for meal planning, travel, finance, learning, parenting, and more — everyday wins.",
      },
      { property: "og:title", content: "AI For Daily Life — askyourbee" },
      {
        property: "og:description",
        content: "Practical AI for the things you actually do every day.",
      },
    ],
  }),
  component: () => (
    <StubPage
      eyebrow="AI For Daily Life"
      title="Make AI useful in the moments you live in"
      description="Meal planning, travel, money, learning, and family — real-world AI workflows you can copy today."
    />
  ),
});
