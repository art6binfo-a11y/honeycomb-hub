import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Search, Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const guidesGroups = [
  {
    title: "🤖 ChatGPT & OpenAI",
    items: [
      "ChatGPT Beginner Guide",
      "GPT-4 vs GPT-4o: Differences",
      "Custom GPTs Tutorial",
      "OpenAI API for Beginners",
    ],
  },
  {
    title: "🎨 AI for Design",
    items: [
      "Midjourney Step-by-Step",
      "Canva AI Features Guide",
      "Adobe Firefly Tutorial",
      "DALL·E 3 Prompt Guide",
    ],
  },
  {
    title: "💼 AI for Freelancers",
    items: [
      "Fiverr + AI Tools Guide",
      "AI Writing for Clients",
      "AI Video Editing (Runway)",
      "Automate Freelance Work",
    ],
  },
  {
    title: "🎓 AI for Education",
    items: [
      "AI Study Assistant Tips",
      "NotebookLM Tutorial",
      "AI for Essay Writing",
      "Quizlet AI Features",
    ],
  },
  {
    title: "🏢 AI for Office Work",
    items: [
      "Copilot in MS Office",
      "AI for Email Writing",
      "AI Meeting Summarizers",
      "Google Workspace AI",
    ],
  },
  {
    title: "📊 AI Productivity",
    items: [
      "Notion AI Guide",
      "Perplexity AI for Research",
      "AI for Social Media",
      "Automation with Zapier AI",
    ],
  },
];

const dailyLifeGroups = [
  {
    title: "🏠 Home & Lifestyle",
    items: [
      "AI for Meal Planning",
      "AI Home Decor Ideas",
      "AI Travel Planning",
      "AI for Personal Finance",
      "AI Fitness Coaching",
    ],
  },
  {
    title: "💬 Communication & Learning",
    items: [
      "AI Language Learning",
      "AI for Job Hunting",
      "AI Resume Builder Guide",
      "AI for Kids & Parenting",
      "AI Mental Wellness Tools",
    ],
  },
];

const navItems = [
  { label: "Home", to: "/" as const },
  { label: "AI Tools & Guides", to: "/guides" as const, dropdown: "guides" as const },
  { label: "AI For Daily Life", to: "/daily-life" as const, dropdown: "daily" as const },
  { label: "AI Tools Review", to: "/reviews" as const },
  { label: "About", to: "/about" as const },
  { label: "Contact", to: "/contact" as const },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileGroup, setMobileGroup] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 bg-deep-night text-honey-lite transition-shadow",
        scrolled && "shadow-night",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center px-6 md:h-16">
        <Link to="/" className="mr-8 flex items-center gap-2 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-bee-gold text-lg shadow-bee transition-transform group-hover:rotate-12">
            🐝
          </span>
          <span className="text-base font-700 tracking-tight text-white hidden sm:inline">
            askyourbee
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center h-16">
          {navItems.map((item) => {
            const isActive =
              item.to === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.to);
            return (
              <div
                key={item.label}
                className="relative h-full"
                onMouseEnter={() => item.dropdown && setOpenDropdown(item.dropdown)}
                onMouseLeave={() => item.dropdown && setOpenDropdown(null)}
              >
                <Link
                  to={item.to}
                  className={cn(
                    "flex items-center gap-1 h-full px-4 text-[13px] font-500 text-dark-amber hover:text-bee-gold transition-colors",
                    isActive && "text-bee-gold",
                  )}
                >
                  {item.label}
                  {item.dropdown && <ChevronDown className="h-3 w-3 opacity-70" />}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-bee-gold rounded-full" />
                  )}
                </Link>

                {item.dropdown === "guides" && openDropdown === "guides" && (
                  <GuidesMega />
                )}
                {item.dropdown === "daily" && openDropdown === "daily" && (
                  <DailyMega />
                )}
              </div>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button
            aria-label="Search"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-bee-gold/40 px-3 py-1.5 text-[12px] text-bee-gold hover:bg-bee-gold/10 transition-colors"
          >
            <Search className="h-3.5 w-3.5" /> Search
          </button>
          <button className="hidden sm:inline-flex rounded-md border border-bee-gold/40 px-3 py-1.5 text-[12px] text-bee-gold hover:bg-bee-gold/10 transition-colors">
            Login
          </button>
          <button className="rounded-md bg-bee-gold px-3.5 py-1.5 text-[12px] font-600 text-deep-night shadow-bee hover:brightness-105 active:translate-y-px transition">
            Ask a Question
          </button>
          <button
            className="lg:hidden ml-1 text-bee-gold"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-hive-light/40 bg-deep-night max-h-[calc(100dvh-4rem)] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const groups =
                item.dropdown === "guides"
                  ? guidesGroups
                  : item.dropdown === "daily"
                    ? dailyLifeGroups
                    : null;
              const isOpen = mobileGroup === item.label;
              return (
                <div key={item.label} className="border-b border-hive-light/30 last:border-0">
                  {groups ? (
                    <button
                      onClick={() => setMobileGroup(isOpen ? null : item.label)}
                      className="flex w-full items-center justify-between py-3 text-[14px] text-honey-lite"
                    >
                      {item.label}
                      <ChevronDown
                        className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
                      />
                    </button>
                  ) : (
                    <Link
                      to={item.to}
                      className="block py-3 text-[14px] text-honey-lite hover:text-bee-gold"
                    >
                      {item.label}
                    </Link>
                  )}
                  {groups && isOpen && (
                    <div className="pb-3 space-y-3">
                      {groups.map((g) => (
                        <div key={g.title}>
                          <div className="text-[11px] font-600 text-dark-amber uppercase tracking-wider mb-1">
                            {g.title}
                          </div>
                          <ul className="space-y-1">
                            {g.items.map((it) => (
                              <li
                                key={it}
                                className="text-[13px] text-honey-lite/80 pl-2 py-1"
                              >
                                {it}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}

function GuidesMega() {
  return (
    <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2 w-[min(960px,90vw)] animate-in fade-in slide-in-from-top-1 duration-150">
      <div className="rounded-xl border border-bee-gold/30 bg-card p-5 shadow-night grid grid-cols-3 gap-5">
        {guidesGroups.map((g) => (
          <div key={g.title}>
            <div className="text-[10px] font-600 uppercase tracking-wider text-dark-amber mb-2">
              {g.title}
            </div>
            <ul className="space-y-0.5">
              {g.items.map((it) => (
                <li key={it}>
                  <button className="w-full text-left rounded-md px-2 py-1.5 text-[12.5px] text-foreground hover:bg-pollen hover:text-deep-night transition-colors">
                    {it}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="col-span-3 mt-1 flex items-center gap-3 rounded-lg border border-bee-gold bg-pollen p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-bee-gold text-base">
            🔥
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-600 text-dark-amber">
              Most Popular This Week
            </div>
            <div className="text-[13px] font-500 text-deep-night truncate">
              How to Use Claude AI for Complete Beginners — Step-by-Step
            </div>
          </div>
          <button className="ml-auto rounded-md bg-bee-gold px-3 py-1.5 text-[11px] font-600 text-deep-night whitespace-nowrap hover:brightness-105">
            Read →
          </button>
        </div>
      </div>
    </div>
  );
}

function DailyMega() {
  return (
    <div className="absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2 w-[min(640px,90vw)] animate-in fade-in slide-in-from-top-1 duration-150">
      <div className="rounded-xl border border-bee-gold/30 bg-card p-5 shadow-night grid grid-cols-2 gap-5">
        {dailyLifeGroups.map((g) => (
          <div key={g.title}>
            <div className="text-[10px] font-600 uppercase tracking-wider text-dark-amber mb-2">
              {g.title}
            </div>
            <ul className="space-y-0.5">
              {g.items.map((it) => (
                <li key={it}>
                  <button className="w-full text-left rounded-md px-2 py-1.5 text-[12.5px] text-foreground hover:bg-pollen hover:text-deep-night transition-colors">
                    {it}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
