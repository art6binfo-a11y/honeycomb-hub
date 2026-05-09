import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "askyourbee — Your AI Learning Hub for Beginners" },
      {
        name: "description",
        content:
          "Step-by-step AI tutorials, honest tool reviews, prompt library, and a friendly Q&A community — built for AI beginners.",
      },
      { name: "author", content: "askyourbee" },
      { name: "theme-color", content: "#1a1200" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:title", content: "askyourbee — Your AI Learning Hub for Beginners" },
      { name: "twitter:title", content: "askyourbee — Your AI Learning Hub for Beginners" },
      { name: "description", content: "A modern AI learning hub website for beginners, featuring a warm, honeycomb-inspired design." },
      { property: "og:description", content: "A modern AI learning hub website for beginners, featuring a warm, honeycomb-inspired design." },
      { name: "twitter:description", content: "A modern AI learning hub website for beginners, featuring a warm, honeycomb-inspired design." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/2e9fa9d3-9405-4eb7-ba9b-8f4b5f55e5a0/id-preview-e66c1133--c017ab1a-cad5-44fa-8ef2-502adaf653e8.lovable.app-1777468398822.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/2e9fa9d3-9405-4eb7-ba9b-8f4b5f55e5a0/id-preview-e66c1133--c017ab1a-cad5-44fa-8ef2-502adaf653e8.lovable.app-1777468398822.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <AuthProvider>
      <Outlet />
      <Toaster />
    </AuthProvider>
  );
}
