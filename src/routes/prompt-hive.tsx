import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/prompt-hive")({
  head: () => ({
    meta: [
      { title: "Prompt Hive — Sample AI prompts you can copy" },
      {
        name: "description",
        content:
          "Browse battle-tested AI prompts by category. Copy, customize, and contribute your own to the askyourbee Prompt Hive.",
      },
      { property: "og:title", content: "Prompt Hive — askyourbee" },
      {
        property: "og:description",
        content:
          "A community library of AI prompts — copy, customize, and post your own.",
      },
      { property: "og:url", content: "https://askyourbee-website-builder.lovable.app/prompt-hive" },
    ],
    links: [
      { rel: "canonical", href: "https://askyourbee-website-builder.lovable.app/prompt-hive" },
    ],
  }),
  component: () => <Outlet />,
});