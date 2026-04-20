import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-deep-night text-white">
      <div className="absolute inset-0 bg-honeycomb opacity-[0.06]" />
      <div className="absolute -top-32 right-0 h-96 w-96 rounded-full bg-bee-gold/20 blur-3xl" />
      <div className="relative mx-auto max-w-[1280px] px-6 py-20 lg:py-24">
        <div className="text-[11px] font-700 uppercase tracking-[0.22em] text-bee-gold">
          {eyebrow}
        </div>
        <h1 className="mt-3 text-4xl sm:text-5xl font-700 max-w-3xl text-balance">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-[15px] text-honey-lite/70 leading-relaxed">
          {description}
        </p>
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}

export function ComingSoon({ label }: { label: string }) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-[760px] px-6 text-center">
        <div className="mx-auto h-16 w-16 rounded-full bg-pollen flex items-center justify-center text-3xl shadow-bee">
          🐝
        </div>
        <h2 className="mt-6 text-2xl font-700 text-foreground">
          {label} is buzzing in soon
        </h2>
        <p className="mt-3 text-muted-foreground">
          We're polishing the honey. In the meantime, head back to the homepage
          for tutorials, reviews, and prompts.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-bee-gold px-5 py-3 text-[13px] font-700 text-deep-night shadow-bee hover:brightness-105"
        >
          ← Back home
        </Link>
      </div>
    </section>
  );
}

export function StubPage({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <SiteLayout>
      <PageHero eyebrow={eyebrow} title={title} description={description} />
      <ComingSoon label={eyebrow} />
    </SiteLayout>
  );
}
