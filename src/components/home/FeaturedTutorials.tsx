import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type Tutorial = {
  category: string;
  badge: string;
  title: string;
  excerpt?: string;
  author: string;
  initials: string;
  readTime: string;
  hue: string;
};

const featured: Tutorial[] = [
  {
    category: "🤖 ChatGPT",
    badge: "Featured",
    title: "Complete ChatGPT Beginner Guide 2025: From Zero to Productive in One Day",
    excerpt:
      "Everything a brand-new user needs — accounts, prompts, custom GPTs, and 12 daily workflows that actually save time.",
    author: "Ayesha R.",
    initials: "AR",
    readTime: "8 min read",
    hue: "from-bee-gold via-amber-brand to-dark-amber",
  },
  {
    category: "🎨 Design",
    badge: "New",
    title: "Midjourney v6 Tutorial for Beginners",
    author: "Rahul S.",
    initials: "RS",
    readTime: "5 min",
    hue: "from-fuchsia-400 via-pink-500 to-amber-brand",
  },
  {
    category: "💼 Freelance",
    badge: "Trending",
    title: "Earn More with AI Writing Tools",
    author: "Nadia K.",
    initials: "NK",
    readTime: "6 min",
    hue: "from-emerald-400 via-teal-500 to-bee-gold",
  },
  {
    category: "🎓 Education",
    badge: "Guide",
    title: "NotebookLM: Your AI Study Partner",
    author: "Faisal M.",
    initials: "FM",
    readTime: "4 min",
    hue: "from-sky-400 via-indigo-500 to-bee-gold",
  },
];

export function FeaturedTutorials() {
  const [hero, ...rest] = featured;
  return (
    <Section
      eyebrow="Featured"
      title="Tutorials hand-picked for AI beginners"
      cta="View all tutorials →"
    >
      <div className="grid lg:grid-cols-3 gap-6">
        <ArticleCard tutorial={hero} large />
        <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6 lg:col-span-1">
          {rest.slice(0, 2).map((t) => (
            <ArticleCard key={t.title} tutorial={t} />
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-6 lg:col-span-1">
          {rest.slice(1).map((t) => (
            <ArticleCard key={t.title} tutorial={t} />
          ))}
        </div>
      </div>
    </Section>
  );
}

function ArticleCard({ tutorial, large = false }: { tutorial: Tutorial; large?: boolean }) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-card border border-border shadow-card hover:shadow-card-hover hover:border-bee-gold transition-all duration-300 hover:-translate-y-1",
        large && "lg:row-span-2 flex flex-col",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-gradient-to-br",
          tutorial.hue,
          large ? "h-72" : "h-44",
        )}
      >
        <div className="absolute inset-0 bg-honeycomb opacity-20" />
        <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-deep-night/80 backdrop-blur px-3 py-1 text-[11px] font-600 text-bee-gold">
          {tutorial.category}
        </div>
        <div className="absolute top-3 right-3 inline-flex rounded-full bg-bee-gold px-2.5 py-1 text-[10px] font-700 text-deep-night uppercase tracking-wider">
          {tutorial.badge}
        </div>
      </div>
      <div className={cn("p-5 flex flex-col gap-3", large && "flex-1")}>
        <h3
          className={cn(
            "font-700 text-foreground leading-snug group-hover:text-amber-brand transition-colors",
            large ? "text-2xl" : "text-lg",
          )}
        >
          {tutorial.title}
        </h3>
        {tutorial.excerpt && (
          <p className="text-[14px] text-muted-foreground leading-relaxed">
            {tutorial.excerpt}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-bee-gold text-[10px] font-700 text-deep-night">
              {tutorial.initials}
            </span>
            <span className="text-[12px] font-500 text-foreground">
              {tutorial.author}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[12px] text-muted-foreground">
            <Clock className="h-3 w-3" /> {tutorial.readTime}
          </div>
        </div>
      </div>
    </article>
  );
}

export function Section({
  eyebrow,
  title,
  cta,
  children,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  cta?: string;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <section className={cn("py-16 lg:py-20", dark && "bg-deep-night text-white")}>
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="flex items-end justify-between mb-8 gap-6">
          <div>
            <div
              className={cn(
                "text-[11px] font-700 uppercase tracking-[0.2em] mb-2",
                dark ? "text-bee-gold" : "text-amber-brand",
              )}
            >
              {eyebrow}
            </div>
            <h2
              className={cn(
                "text-3xl sm:text-4xl font-700 tracking-tight max-w-2xl text-balance",
                dark ? "text-white" : "text-foreground",
              )}
            >
              {title}
            </h2>
          </div>
          {cta && (
            <button
              className={cn(
                "hidden sm:inline shrink-0 text-[13px] font-600 hover:underline underline-offset-4",
                dark ? "text-bee-gold" : "text-amber-brand",
              )}
            >
              {cta}
            </button>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}
