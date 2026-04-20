import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/PageHero";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — askyourbee" },
      {
        name: "description",
        content:
          "askyourbee is a friendly hub teaching beginners how to use AI tools — built by humans, powered by curiosity.",
      },
      { property: "og:title", content: "About — askyourbee" },
      {
        property: "og:description",
        content: "The team and mission behind askyourbee.com.",
      },
    ],
  }),
  component: () => (
    <StubPage
      eyebrow="About"
      title="A friendly hive teaching the world to use AI."
      description="We believe AI should feel approachable, not intimidating. Our editors translate every new tool into something a complete beginner can master in a single day."
    />
  ),
});
