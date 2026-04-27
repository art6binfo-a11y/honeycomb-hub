import { ArrowUpRight, Info, Star } from "lucide-react";
import { Section } from "./FeaturedTutorials";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Review = {
  name: string;
  icon: string;
  rating: number;
  verdict: string;
  verdictColor: string;
  summary: string;
  price: string;
  bestFor: string;
  visitUrl: string;
  reviewUrl: string;
};

const reviews: Review[] = [
  {
    name: "ChatGPT Plus",
    icon: "🤖",
    rating: 4.8,
    verdict: "Editor's Pick",
    verdictColor: "bg-bee-gold text-deep-night",
    summary: "Still the most polished general-purpose AI for beginners.",
    price: "$20/mo",
    bestFor: "Best for Everyday Use",
    visitUrl: "https://chat.openai.com",
    reviewUrl: "/reviews",
  },
  {
    name: "Claude 3.5 Sonnet",
    icon: "📝",
    rating: 4.7,
    verdict: "Best for Writing",
    verdictColor: "bg-emerald-500 text-white",
    summary: "Long-form writing and reasoning that feels deeply human.",
    price: "$20/mo",
    bestFor: "Best for Solo-founders",
    visitUrl: "https://claude.ai",
    reviewUrl: "/reviews",
  },
  {
    name: "Midjourney v6",
    icon: "🎨",
    rating: 4.6,
    verdict: "Best for Art",
    verdictColor: "bg-fuchsia-500 text-white",
    summary: "Stunning visuals, but a learning curve for prompt mastery.",
    price: "$10/mo",
    bestFor: "Best for Designers",
    visitUrl: "https://midjourney.com",
    reviewUrl: "/reviews",
  },
  {
    name: "Perplexity Pro",
    icon: "🔎",
    rating: 4.5,
    verdict: "Best for Research",
    verdictColor: "bg-sky-500 text-white",
    summary: "Cited answers, clean UI, and a real Google replacement.",
    price: "$20/mo",
    bestFor: "Best for Researchers",
    visitUrl: "https://perplexity.ai",
    reviewUrl: "/reviews",
  },
  {
    name: "Notion AI",
    icon: "📚",
    rating: 4.3,
    verdict: "Productivity Win",
    verdictColor: "bg-amber-brand text-deep-night",
    summary: "Native AI inside the docs you already live in.",
    price: "$10/mo",
    bestFor: "Best for Teams",
    visitUrl: "https://notion.so/product/ai",
    reviewUrl: "/reviews",
  },
];

export function LatestReviews() {
  return (
    <Section eyebrow="Tools Reviewed" title="Honest reviews of the AI tools that matter" cta="All reviews →">
      <TooltipProvider delayDuration={150}>
        <div className="-mx-6 px-6 overflow-x-auto pb-2">
          <div className="flex gap-5 min-w-max lg:min-w-0 lg:grid lg:grid-cols-5">
            {reviews.map((r) => (
              <div
                key={r.name}
                className="relative flex w-72 lg:w-auto flex-col bg-card rounded-2xl border border-border p-5 hover:border-bee-gold hover:shadow-card-hover transition-all hover:-translate-y-1"
              >
                {/* Pricing badge */}
                <div className="absolute -top-2.5 right-4 inline-flex items-center gap-1 rounded-full bg-deep-night px-2.5 py-1 text-[10px] font-700 uppercase tracking-wider text-bee-gold border border-bee-gold/40 shadow-sm">
                  {r.price}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pollen text-2xl">
                    {r.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="font-700 text-foreground truncate">{r.name}</div>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={
                              i < Math.floor(r.rating)
                                ? "h-3 w-3 fill-bee-gold text-bee-gold"
                                : "h-3 w-3 text-border"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-600 text-muted-foreground">
                        {r.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Best For tag */}
                <div className="mt-4">
                  <span className="inline-flex items-center gap-1 rounded-md bg-pollen/70 px-2 py-1 text-[10.5px] font-700 uppercase tracking-wider text-amber-brand border border-bee-gold/30">
                    ⭐ {r.bestFor}
                  </span>
                </div>

                <p className="mt-3 text-[13px] text-muted-foreground leading-relaxed line-clamp-2">
                  {r.summary}
                </p>

                <div className="mt-3">
                  <span
                    className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-700 uppercase tracking-wider ${r.verdictColor}`}
                  >
                    {r.verdict}
                  </span>
                </div>

                {/* CTAs */}
                <div className="mt-auto pt-4 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <a
                      href={r.visitUrl}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className="group/cta inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-bee-gold px-3 py-2.5 text-[13px] font-700 text-deep-night hover:bg-amber-brand transition-colors shadow-sm"
                    >
                      Visit {r.name}
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
                    </a>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          type="button"
                          aria-label="Affiliate link disclosure"
                          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-amber-brand hover:border-bee-gold/60 transition-colors"
                        >
                          <Info className="h-3.5 w-3.5" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent
                        side="top"
                        className="max-w-[220px] text-[11.5px] leading-relaxed"
                      >
                        <p className="font-700 mb-1">Affiliate link</p>
                        <p className="text-muted-foreground">
                          We may earn a small commission if you sign up — at no extra cost to you. It helps keep our reviews free.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <a
                    href={r.reviewUrl}
                    className="block w-full text-center text-[12px] font-600 text-muted-foreground hover:text-amber-brand transition-colors py-1"
                  >
                    Read full review →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </TooltipProvider>
    </Section>
  );
}
