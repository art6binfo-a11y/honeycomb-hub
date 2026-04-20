import { Link } from "@tanstack/react-router";

const cols = [
  {
    title: "Learn",
    links: ["AI Tools & Guides", "Tutorials", "Beginner Path", "AI Glossary"],
  },
  {
    title: "Community",
    links: ["Q&A Forum", "Prompt Diary", "Newsletter", "Discord"],
  },
  {
    title: "Reviews",
    links: ["ChatGPT", "Midjourney", "Claude", "Notion AI", "Perplexity"],
  },
  {
    title: "Company",
    links: ["About", "Contact", "Editorial Policy", "Privacy", "Terms"],
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-deep-night text-honey-lite/80 mt-24">
      <div className="mx-auto max-w-[1280px] px-6 py-14 grid gap-10 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-bee-gold text-lg shadow-bee">
              🐝
            </span>
            <span className="text-lg font-700 text-white">askyourbee</span>
          </Link>
          <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-dark-amber">
            Your AI Learning Hub for Beginners. Tutorials, honest reviews, and a
            community of learners — built to help you keep up with the future.
          </p>
          <div className="mt-5 flex gap-2">
            {["X", "YT", "IG", "in"].map((s) => (
              <button
                key={s}
                className="h-9 w-9 rounded-full border border-bee-gold/30 text-bee-gold text-[11px] font-600 hover:bg-bee-gold hover:text-deep-night transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {cols.map((c) => (
          <div key={c.title}>
            <div className="text-[12px] font-600 uppercase tracking-wider text-bee-gold mb-3">
              {c.title}
            </div>
            <ul className="space-y-2">
              {c.links.map((l) => (
                <li key={l}>
                  <a
                    href="#"
                    className="text-[13px] text-honey-lite/70 hover:text-bee-gold transition-colors"
                  >
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-hive-light/40">
        <div className="mx-auto max-w-[1280px] px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-dark-amber">
          <div>© {new Date().getFullYear()} askyourbee.com — Made with 🍯 for AI beginners.</div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-bee-gold">Privacy</a>
            <a href="#" className="hover:text-bee-gold">Terms</a>
            <a href="#" className="hover:text-bee-gold">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
