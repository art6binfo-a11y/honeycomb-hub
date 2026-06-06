import { Link } from "@tanstack/react-router";

const cols = [
  {
    title: "Learn",
    links: [
      { label: "AI Tools & Guides", to: "/guides" },
      { label: "Prompt Hive", to: "/prompt-hive" },
      { label: "Beginner Path", to: "/guides" },
      { label: "AI Glossary", to: "/guides" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Q&A Forum", to: "/community" },
      { label: "Prompt Hive", to: "/prompt-hive" },
      { label: "Ask a Question", to: "/community/ask" },
      { label: "Topics", to: "/community/topics" },
    ],
  },
  {
    title: "Reviews",
    links: [
      { label: "ChatGPT", to: "/reviews" },
      { label: "Midjourney", to: "/reviews" },
      { label: "Claude", to: "/reviews" },
      { label: "Notion AI", to: "/reviews" },
      { label: "Perplexity", to: "/reviews" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Contact", to: "/contact" },
      { label: "Privacy", to: "/privacy" },
      { label: "Terms", to: "/terms" },
    ],
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
          <p className="mt-5 text-[12px] text-dark-amber/80">
            Social channels coming soon.
          </p>
        </div>

        {cols.map((c) => (
          <div key={c.title}>
            <div className="text-[12px] font-600 uppercase tracking-wider text-bee-gold mb-3">
              {c.title}
            </div>
            <ul className="space-y-2">
              {c.links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to as any}
                    className="text-[13px] text-honey-lite/70 hover:text-bee-gold transition-colors"
                  >
                    {l.label}
                  </Link>
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
            <Link to="/privacy" className="hover:text-bee-gold">Privacy</Link>
            <Link to="/terms" className="hover:text-bee-gold">Terms</Link>
            <Link to="/disclaimer" className="hover:text-bee-gold">Disclaimer &amp; Disclosures</Link>
            <Link to="/cookies" className="hover:text-bee-gold">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
