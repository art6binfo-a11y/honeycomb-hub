import { createFileRoute } from "@tanstack/react-router";

// Neutralizes any cached/fingerprinting backlinks to /login.php by
// permanently redirecting to the real auth route. This route exists
// only to defuse the "login.php exposed" finding — nothing else uses it.
export const Route = createFileRoute("/api/login.php")({
  server: {
    handlers: {
      GET: async () =>
        new Response(null, {
          status: 301,
          headers: { Location: "/login" },
        }),
    },
  },
});