import { ArrowRight, Check, Lock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type Milestone = {
  title: string;
  duration: string;
  href: string;
  status?: "done" | "active" | "locked";
};

type Path = {
  id: string;
  name: string;
  audience: string;
  emoji: string;
  description: string;
  accent: string; // tailwind text color class for accents
  ringTint: string; // bg tint for the path column
  gradient: string; // gradient for the cta button
  milestones: Milestone[];
};

const paths: Path[] = [
  {
    id: "scout",
    name: "The Scout",
    audience: "Total Beginner",
    emoji: "🐝",
    description: "Brand new to AI? Start here. By the end you'll be using AI confidently every day.",
    accent: "text-emerald-600",
    ringTint: "bg-emerald-50",
    gradient: "from-emerald-500 to-emerald-600",
    milestones: [
      { title: "What is AI, really?", duration: "5 min read", href: "/guides", status: "done" },
      { title: "Set up ChatGPT in 10 minutes", duration: "10 min", href: "/guides", status: "active" },
      { title: "Your first 5 prompts", duration: "8 min", href: "/guides", status: "locked" },
      { title: "Daily AI habits that stick", duration: "6 min", href: "/daily-life", status: "locked" },
    ],
  },
  {
    id: "creative",
    name: "The Creative Bee",
    audience: "AI for Art & Design",
    emoji: "🎨",
    description: "Turn ideas into stunning visuals — from logos to illustrations to full ad campaigns.",
    accent: "text-fuchsia-600",
    ringTint: "bg-fuchsia-50",
    gradient: "from-fuchsia-500 to-pink-500",
    milestones: [
      { title: "Image AI 101: tools that matter", duration: "7 min", href: "/guides", status: "active" },
      { title: "Master Midjourney prompts", duration: "12 min", href: "/guides", status: "locked" },
      { title: "Edit & upscale like a pro", duration: "9 min", href: "/guides", status: "locked" },
      { title: "Build a brand visual system", duration: "15 min", href: "/guides", status: "locked" },
    ],
  },
  {
    id: "busy",
    name: "The Busy Bee",
    audience: "AI for Productivity",
    emoji: "⚡",
    description: "Reclaim 5+ hours a week by automating email, notes, research, and meeting prep.",
    accent: "text-amber-brand",
    ringTint: "bg-pollen",
    gradient: "from-bee-gold to-amber-brand",
    milestones: [
      { title: "Inbox zero with AI in 30 days", duration: "8 min", href: "/daily-life", status: "active" },
      { title: "Auto-summarize meetings", duration: "6 min", href: "/daily-life", status: "locked" },
      { title: "Research 10x faster", duration: "10 min", href: "/guides", status: "locked" },
    ],
  },
];

function MilestoneNode({
  milestone,
  index,
  accent,
  ringTint,
}: {
  milestone: Milestone;
  index: number;
  accent: string;
  ringTint: string;
}) {
  // Zig-zag: even indexes lean left, odd indexes lean right
  const isRight = index % 2 === 1;
  const status = milestone.status ?? "locked";

  return (
    <li
      className={cn(
        "relative flex w-full items-center gap-4",
        isRight ? "flex-row-reverse text-right" : "text-left",
      )}
    >
      {/* Circle (positioned half-on the center line via the parent grid) */}
      <div className="relative z-10 flex w-1/2 justify-center shrink-0">
        <Link
          to={milestone.href}
          aria-label={milestone.title}
          className={cn(
            "group/node relative flex h-14 w-14 items-center justify-center rounded-full border-4 bg-card transition-all hover:scale-110",
            status === "done" && "border-emerald-500 bg-emerald-500 text-white shadow-card-hover",
            status === "active" &&
              "border-bee-gold bg-bee-gold text-deep-night shadow-card-hover ring-4 ring-bee-gold/20 animate-pulse",
            status === "locked" && "border-border bg-card text-muted-foreground",
          )}
        >
          {status === "done" ? (
            <Check className="h-5 w-5" strokeWidth={3} />
          ) : status === "locked" ? (
            <Lock className="h-4 w-4" />
          ) : (
            <span className="text-base font-700">{index + 1}</span>
          )}
        </Link>
      </div>

      {/* Content card on the opposite side */}
      <div className="w-1/2">
        <Link
          to={milestone.href}
          className={cn(
            "block rounded-xl border bg-card p-3 transition-all hover:-translate-y-0.5",
            status === "locked"
              ? "border-border opacity-70 hover:opacity-100"
              : "border-border hover:border-bee-gold hover:shadow-card-hover",
          )}
        >
          <div className={cn("text-[10px] font-700 uppercase tracking-wider mb-1", accent)}>
            Milestone {index + 1}
          </div>
          <h4 className="text-[13.5px] font-700 text-foreground leading-snug">
            {milestone.title}
          </h4>
          <div className="mt-1.5 text-[11.5px] text-muted-foreground">{milestone.duration}</div>
        </Link>
      </div>

      {/* Subtle tint badge behind circle */}
      <span
        aria-hidden
        className={cn(
          "absolute left-1/2 top-1/2 -z-10 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 blur-xl",
          ringTint,
        )}
      />
    </li>
  );
}

function FlightPathColumn({ path }: { path: Path }) {
  return (
    <article className="relative flex flex-col rounded-3xl border border-border bg-card p-6 lg:p-7 shadow-sm hover:shadow-card-hover transition-shadow">
      {/* Header */}
      <header className="text-center">
        <div
          className={cn(
            "mx-auto flex h-16 w-16 items-center justify-center rounded-2xl text-3xl",
            path.ringTint,
          )}
        >
          {path.emoji}
        </div>
        <div className={cn("mt-3 text-[11px] font-700 uppercase tracking-[0.18em]", path.accent)}>
          {path.audience}
        </div>
        <h3 className="mt-1 text-2xl font-700 text-foreground">{path.name}</h3>
        <p className="mt-2 text-[13.5px] text-muted-foreground leading-relaxed text-balance">
          {path.description}
        </p>
      </header>

      {/* Roadmap */}
      <div className="relative mt-8 flex-1">
        {/* Dotted center line */}
        <div
          aria-hidden
          className="absolute left-1/2 top-2 bottom-2 w-0 -translate-x-1/2 border-l-[3px] border-dotted border-bee-gold/40"
        />

        <ol className="relative space-y-7">
          {path.milestones.map((m, i) => (
            <MilestoneNode
              key={m.title}
              milestone={m}
              index={i}
              accent={path.accent}
              ringTint={path.ringTint}
            />
          ))}
        </ol>

        {/* Destination flag */}
        <div className="relative z-10 mt-7 flex flex-col items-center">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br text-xl shadow-card-hover",
              path.gradient,
            )}
          >
            🏆
          </div>
          <div className="mt-2 text-[11px] font-700 uppercase tracking-wider text-muted-foreground">
            You arrive
          </div>
        </div>
      </div>

      {/* CTA */}
      <Link
        to={path.milestones[0]?.href ?? "/guides"}
        className={cn(
          "group/cta mt-7 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r px-5 py-3 text-[14px] font-700 text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-card-hover",
          path.gradient,
        )}
      >
        Start Journey
        <ArrowRight className="h-4 w-4 transition-transform group-hover/cta:translate-x-1" />
      </Link>
    </article>
  );
}

export function FlightPaths() {
  return (
    <section className="relative overflow-hidden py-20 bg-background">
      <div className="absolute inset-0 bg-honeycomb opacity-[0.04] pointer-events-none" />
      <div className="relative mx-auto max-w-[1280px] px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-[11px] font-700 uppercase tracking-[0.2em] mb-2 text-amber-brand">
            Learning Flight Paths
          </div>
          <h2 className="text-3xl sm:text-4xl font-700 tracking-tight text-foreground text-balance">
            Pick your path. Follow the dotted line.
          </h2>
          <p className="mt-3 text-[15px] text-muted-foreground">
            Choose the journey that fits where you are today. Every milestone is a bite-sized tutorial — finish them in order and you'll never feel lost again.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {paths.map((p) => (
            <FlightPathColumn key={p.id} path={p} />
          ))}
        </div>
      </div>
    </section>
  );
}