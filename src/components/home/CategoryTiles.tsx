import { Section } from "./FeaturedTutorials";

const tiles = [
  { icon: "🤖", label: "ChatGPT", count: "42 guides" },
  { icon: "🎨", label: "Design", count: "28 guides" },
  { icon: "🏢", label: "Office", count: "31 guides" },
  { icon: "🎓", label: "Education", count: "19 guides" },
  { icon: "💼", label: "Freelance", count: "24 guides" },
  { icon: "📊", label: "Productivity", count: "37 guides" },
];

export function CategoryTiles() {
  return (
    <Section eyebrow="Browse" title="Pick a path. Start your AI journey." cta="All categories →">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {tiles.map((t) => (
          <button
            key={t.label}
            className="group relative overflow-hidden rounded-2xl bg-deep-night text-white p-6 border border-bee-gold/20 hover:border-bee-gold hover:-translate-y-1 transition-all duration-300 shadow-card-hover"
          >
            <div className="absolute inset-0 bg-honeycomb opacity-[0.08] group-hover:opacity-20 transition-opacity" />
            <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-bee-gold/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex flex-col items-center gap-2 text-center">
              <span className="text-3xl group-hover:scale-110 transition-transform">{t.icon}</span>
              <div className="font-600 text-bee-gold">{t.label}</div>
              <div className="text-[11px] text-dark-amber">{t.count}</div>
            </div>
          </button>
        ))}
      </div>
    </Section>
  );
}
