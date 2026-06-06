import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — askyourbee" },
      { name: "description", content: "The rules for using askyourbee." },
    ],
    links: [{ rel: "canonical", href: "https://askyourbee-website-builder.lovable.app/terms" }],
  }),
  component: () => (
    <SiteLayout>
      <article className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-700 text-foreground">Terms of Service</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-foreground/90">
          <p>By using askyourbee you agree to use the service lawfully, respect other members, and not post spam, hateful, or infringing content.</p>
          <p>Content you post may be moderated or removed. You retain ownership of your contributions and grant askyourbee a non-exclusive license to display them on the site.</p>
          <p>The service is provided "as is" without warranty.</p>
        </div>
      </article>
    </SiteLayout>
  ),
});