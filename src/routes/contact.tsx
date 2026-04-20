import { createFileRoute } from "@tanstack/react-router";
import { StubPage } from "@/components/PageHero";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — askyourbee" },
      {
        name: "description",
        content:
          "Got a question, story, partnership idea, or correction? Reach the askyourbee team.",
      },
      { property: "og:title", content: "Contact — askyourbee" },
      {
        property: "og:description",
        content: "Say hi to the askyourbee team.",
      },
    ],
  }),
  component: () => (
    <StubPage
      eyebrow="Contact"
      title="Send a message into the hive."
      description="Whether you have a tutorial idea, a tool to suggest, or a partnership in mind — we'd love to hear from you."
    />
  ),
});
