import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — askyourbee" },
      { name: "description", content: "How askyourbee collects, uses, and protects your information." },
    ],
    links: [{ rel: "canonical", href: "https://askyourbee-website-builder.lovable.app/privacy" }],
  }),
  component: () => (
    <SiteLayout>
      <article className="mx-auto max-w-3xl px-6 py-16 prose prose-invert">
        <h1 className="text-4xl font-700 text-foreground">Privacy Policy</h1>
        <p className="mt-3 text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        <div className="mt-8 space-y-4 text-[15px] leading-relaxed text-foreground/90">
          <p>askyourbee respects your privacy. We collect the minimum data needed to run the site: account email, profile details you provide, and basic usage analytics.</p>
          <p>We do not sell personal data. We use cookies for session management and (where consented) for advertising and analytics.</p>
          <p>For questions, contact us via the Contact page.</p>
        </div>
      </article>
    </SiteLayout>
  ),
});