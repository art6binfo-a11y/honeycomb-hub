import { Star } from "lucide-react";
import { Section } from "./FeaturedTutorials";

const reviews = [
  {
    name: "ChatGPT Plus",
    icon: "🤖",
    rating: 4.8,
    verdict: "Editor's Pick",
    verdictColor: "bg-bee-gold text-deep-night",
    summary: "Still the most polished general-purpose AI for beginners.",
    price: "$20/mo",
  },
  {
    name: "Claude 3.5 Sonnet",
    icon: "📝",
    rating: 4.7,
    verdict: "Best for Writing",
    verdictColor: "bg-emerald-500 text-white",
    summary: "Long-form writing and reasoning that feels deeply human.",
    price: "$20/mo",
  },
  {
    name: "Midjourney v6",
    icon: "🎨",
    rating: 4.6,
    verdict: "Best for Art",
    verdictColor: "bg-fuchsia-500 text-white",
    summary: "Stunning visuals, but a learning curve for prompt mastery.",
    price: "$10/mo",
  },
  {
    name: "Perplexity Pro",
    icon: "🔎",
    rating: 4.5,
    verdict: "Best for Research",
    verdictColor: "bg-sky-500 text-white",
    summary: "Cited answers, clean UI, and a real Google replacement.",
    price: "$20/mo",
  },
  {
    name: "Notion AI",
    icon: "📚",
    rating: 4.3,
    verdict: "Productivity Win",
    verdictColor: "bg-amber-brand text-deep-night",
    summary: "Native AI inside the docs you already live in.",
    price: "$10/mo",
  },
];

export function LatestReviews() {
  return (
    <Section eyebrow="Tools Reviewed" title="Honest reviews of the AI tools that matter" cta="All reviews →">
      <div className="-mx-6 px-6 overflow-x-auto pb-2">
        <div className="flex gap-5 min-w-max lg:min-w-0 lg:grid lg:grid-cols-5">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="w-72 lg:w-auto bg-card rounded-2xl border border-border p-5 hover:border-bee-gold hover:shadow-card-hover transition-all hover:-translate-y-1"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-pollen text-2xl">
                  {r.icon}
                </div>
                <div className="min-w-0">
                  <div className="font-700 text-foreground truncate">{r.name}</div>
                  <div className="text-[12px] text-muted-foreground">{r.price}</div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < Math.floor(r.rating)
                          ? "h-3.5 w-3.5 fill-bee-gold text-bee-gold"
                          : "h-3.5 w-3.5 text-border"
                      }
                    />
                  ))}
                </div>
                <span className="text-[12px] font-600 text-foreground">{r.rating}</span>
              </div>
              <p className="mt-3 text-[13px] text-muted-foreground leading-relaxed line-clamp-2">
                {r.summary}
              </p>
              <div className="mt-4">
                <span
                  className={`inline-block rounded-full px-2.5 py-1 text-[10px] font-700 uppercase tracking-wider ${r.verdictColor}`}
                >
                  {r.verdict}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
