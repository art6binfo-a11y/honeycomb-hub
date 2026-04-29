import { ShieldCheck, Scale, Sprout } from "lucide-react";

const promises = [
  {
    icon: ShieldCheck,
    title: "Human-Verified Testing",
    desc: "Every tool is tested by real editors, not bots.",
  },
  {
    icon: Scale,
    title: "Unbiased Reviews",
    desc: "We disclose affiliate links and never trade scores.",
  },
  {
    icon: Sprout,
    title: "Built for Beginners",
    desc: "Plain-English guides, no jargon, no gatekeeping.",
  },
];

export function EditorialPromise() {
  return (
    <section aria-labelledby="editorial-promise-title" className="border-y border-border bg-pollen/30">
      <div className="mx-auto max-w-[1280px] px-6 py-12">
        <div className="text-center">
          <h2
            id="editorial-promise-title"
            className="text-[11px] font-700 uppercase tracking-[0.22em] text-amber-brand"
          >
            Our Editorial Promise
          </h2>
        </div>
        <ul className="mt-6 grid gap-6 sm:grid-cols-3">
          {promises.map(({ icon: Icon, title, desc }) => (
            <li
              key={title}
              className="flex items-start gap-3 rounded-xl bg-card border border-border p-4"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bee-gold/15 text-amber-brand">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <div className="text-[14px] font-700 text-foreground">{title}</div>
                <p className="mt-0.5 text-[12.5px] text-muted-foreground leading-relaxed">
                  {desc}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}