import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community Q&A — askyourbee" },
      { name: "description", content: "Ask questions, get answers, and learn AI together. Anonymous posting allowed." },
    ],
  }),
  component: () => <Outlet />,
});