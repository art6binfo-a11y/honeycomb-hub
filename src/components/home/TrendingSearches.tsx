import { TrendingUp } from "lucide-react";

const trends = [
  "AI in Digital Governance",
  "Meal Prep Automation",
  "Lifestyle Blog Prompts",
  "Midjourney Logo Design",
];

export function TrendingSearches() {
  return (
    <section className="border-y border-border bg-pollen/30">
      <div className="mx-auto max-w-[1280px] px-6 py-5">
        <div className="flex items-center gap-3 overflow-x-auto">
          <div className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-700 uppercase tracking-[0.18em] text-amber-brand">
            <TrendingUp className="h-3.5 w-3.5" />
            Trending Searches:
          </div>
          <ul className="flex items-center gap-2 min-w-max">
            {trends.map((t) => (
              <li key={t}>
                <a
                  href="#"
                  className="inline-flex items-center rounded-full border border-bee-gold/30 bg-card px-3.5 py-1.5 text-[12.5px] font-600 text-foreground/80 hover:border-bee-gold hover:bg-bee-gold/10 hover:text-amber-brand transition-colors whitespace-nowrap"
                >
                  {t}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}