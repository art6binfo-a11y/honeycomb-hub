import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Goal = "Writing" | "Art" | "Data" | "Coding";
type Budget = "Free only" | "Under $20" | "Unlimited";
type Time = "5 mins" | "1 hour" | "I want to be an expert";

type Recommendation = {
  name: string;
  icon: string;
  tagline: string;
  reason: string;
  price: string;
  rating: number;
  badge: string;
  badgeColor: string;
  href: string;
};

const questions = [
  {
    key: "goal" as const,
    label: "What is your main goal?",
    options: ["Writing", "Art", "Data", "Coding"] as Goal[],
    icons: ["✍️", "🎨", "📊", "💻"],
  },
  {
    key: "budget" as const,
    label: "What is your budget?",
    options: ["Free only", "Under $20", "Unlimited"] as Budget[],
    icons: ["🆓", "💵", "🚀"],
  },
  {
    key: "time" as const,
    label: "How much time do you have to learn?",
    options: ["5 mins", "1 hour", "I want to be an expert"] as Time[],
    icons: ["⚡", "⏱️", "🧠"],
  },
];

function recommend(answers: { goal?: Goal; budget?: Budget; time?: Time }): Recommendation {
  const { goal, budget, time } = answers;

  // Writing
  if (goal === "Writing") {
    if (budget === "Free only")
      return {
        name: "ChatGPT Free",
        icon: "🤖",
        tagline: "The best free starting point for writing",
        reason: `Great for ${time?.toLowerCase()} of practice — drafts, edits, and brainstorms with zero cost.`,
        price: "Free",
        rating: 4.6,
        badge: "Best Free Pick",
        badgeColor: "bg-emerald-500 text-white",
        href: "/reviews",
      };
    return {
      name: "Claude 3.5 Sonnet",
      icon: "📝",
      tagline: "Long-form writing that reads deeply human",
      reason: `For your ${budget?.toLowerCase()} budget and ${time?.toLowerCase()} of focus, Claude is the gold standard for nuanced prose.`,
      price: budget === "Unlimited" ? "$20–$200/mo" : "$20/mo",
      rating: 4.7,
      badge: "Best for Writing",
      badgeColor: "bg-emerald-500 text-white",
      href: "/reviews",
    };
  }

  // Art
  if (goal === "Art") {
    if (budget === "Free only")
      return {
        name: "Microsoft Designer",
        icon: "🖼️",
        tagline: "Free DALL·E-powered image generation",
        reason: `Perfect for ${time?.toLowerCase()} — generate styled visuals without paying a cent.`,
        price: "Free",
        rating: 4.3,
        badge: "Best Free Art",
        badgeColor: "bg-fuchsia-500 text-white",
        href: "/reviews",
      };
    return {
      name: "Midjourney v6",
      icon: "🎨",
      tagline: "Stunning, painterly visuals at scale",
      reason:
        time === "I want to be an expert"
          ? "Worth the learning curve — unmatched quality once you master prompts."
          : `Quick wins in ${time?.toLowerCase()} with the most beautiful default style around.`,
      price: "$10/mo",
      rating: 4.6,
      badge: "Best for Art",
      badgeColor: "bg-fuchsia-500 text-white",
      href: "/reviews",
    };
  }

  // Data
  if (goal === "Data") {
    if (budget === "Free only")
      return {
        name: "Google Gemini",
        icon: "📈",
        tagline: "Free analysis with sheet & doc integration",
        reason: `In ${time?.toLowerCase()}, Gemini turns spreadsheets into insights — no card required.`,
        price: "Free",
        rating: 4.4,
        badge: "Best Free Data",
        badgeColor: "bg-sky-500 text-white",
        href: "/reviews",
      };
    return {
      name: "ChatGPT Plus + Code Interpreter",
      icon: "📊",
      tagline: "Upload CSVs and get charts in seconds",
      reason: `For a ${budget?.toLowerCase()} budget and ${time?.toLowerCase()} of learning, this is the fastest path from raw data to insight.`,
      price: "$20/mo",
      rating: 4.8,
      badge: "Best for Data",
      badgeColor: "bg-sky-500 text-white",
      href: "/reviews",
    };
  }

  // Coding
  if (goal === "Coding") {
    if (budget === "Free only")
      return {
        name: "GitHub Copilot Free",
        icon: "🧑‍💻",
        tagline: "Free tier inline code completions",
        reason: `Even in ${time?.toLowerCase()}, you'll feel the speed boost in your editor.`,
        price: "Free tier",
        rating: 4.5,
        badge: "Best Free Coding",
        badgeColor: "bg-amber-brand text-deep-night",
        href: "/reviews",
      };
    return {
      name: "Cursor",
      icon: "💻",
      tagline: "An AI-native code editor that pairs with you",
      reason:
        time === "I want to be an expert"
          ? "Designed for power users — multi-file edits, agents, and deep context."
          : `In ${time?.toLowerCase()}, Cursor's chat + autocomplete will reshape how you ship code.`,
      price: budget === "Unlimited" ? "$20–$40/mo" : "$20/mo",
      rating: 4.8,
      badge: "Best for Coding",
      badgeColor: "bg-amber-brand text-deep-night",
      href: "/reviews",
    };
  }

  return {
    name: "ChatGPT Plus",
    icon: "🤖",
    tagline: "The most polished general-purpose AI",
    reason: "A safe, versatile default while you explore what AI can do for you.",
    price: "$20/mo",
    rating: 4.8,
    badge: "Editor's Pick",
    badgeColor: "bg-bee-gold text-deep-night",
    href: "/reviews",
  };
}

export function Pollinator() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<{ goal?: Goal; budget?: Budget; time?: Time }>({});

  const isDone = step >= questions.length;
  const recommendation = useMemo(() => (isDone ? recommend(answers) : null), [isDone, answers]);
  const progress = isDone ? 100 : Math.round((step / questions.length) * 100);

  const handleSelect = (key: "goal" | "budget" | "time", value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setStep((s) => s + 1);
  };

  const reset = () => {
    setAnswers({});
    setStep(0);
  };

  const current = !isDone ? questions[step] : null;
  const currentValue = current ? (answers as Record<string, string | undefined>)[current.key] : undefined;

  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-b from-pollen/40 via-background to-background">
      <div className="absolute inset-0 bg-honeycomb opacity-[0.04] pointer-events-none" />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-bee-gold/40 bg-bee-gold/10 px-3 py-1 text-[11px] font-700 uppercase tracking-[0.2em] text-amber-brand">
          <Sparkles className="h-3.5 w-3.5" />
          The Pollinator
        </div>
        <h2 className="mt-4 text-3xl sm:text-4xl font-700 tracking-tight text-foreground text-balance">
          Find your perfect AI tool in 3 quick taps.
        </h2>
        <p className="mt-3 text-[15px] text-muted-foreground max-w-xl mx-auto">
          Answer three short questions and we'll match you with the tool that best fits your goal, budget, and learning style.
        </p>

        <div className="mt-10 rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-card-hover text-left">
          {/* Progress */}
          <div className="flex items-center justify-between text-[12px] text-muted-foreground mb-5">
            <span className="font-600">
              {isDone ? "Done!" : `Step ${step + 1} of ${questions.length}`}
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-pollen overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-bee-gold to-amber-brand transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Question or result */}
          {!isDone && current ? (
            <div className="mt-8">
              <h3 className="text-xl sm:text-2xl font-700 text-foreground text-center">
                {current.label}
              </h3>
              <div
                className={cn(
                  "mt-6 grid gap-3",
                  current.options.length === 4
                    ? "grid-cols-2 sm:grid-cols-4"
                    : "grid-cols-1 sm:grid-cols-3",
                )}
              >
                {current.options.map((opt, i) => {
                  const selected = currentValue === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => handleSelect(current.key, opt)}
                      className={cn(
                        "group flex flex-col items-center justify-center gap-2 rounded-2xl border-2 px-5 py-7 text-center transition-all hover:-translate-y-0.5",
                        selected
                          ? "border-bee-gold bg-bee-gold/10 shadow-card-hover"
                          : "border-border bg-background hover:border-bee-gold/60 hover:bg-pollen/40",
                      )}
                    >
                      <span className="text-2xl" aria-hidden>
                        {current.icons[i]}
                      </span>
                      <span className="text-[13px] font-600 text-foreground">{opt}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="inline-flex items-center gap-1.5 text-[13px] font-600 text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:hover:text-muted-foreground transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <div className="text-[12px] text-muted-foreground">
                  Tap an option to continue <ArrowRight className="inline h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          ) : recommendation ? (
            <div className="mt-8">
              <div className="text-center">
                <div className="text-[11px] font-700 uppercase tracking-[0.2em] text-amber-brand">
                  Recommended for you
                </div>
                <h3 className="mt-2 text-2xl sm:text-3xl font-700 text-foreground">
                  {recommendation.name}
                </h3>
                <p className="mt-1 text-[14px] text-muted-foreground">
                  {recommendation.tagline}
                </p>
              </div>

              <div className="mt-6 rounded-2xl border border-bee-gold/40 bg-gradient-to-br from-pollen/60 via-background to-background p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-pollen text-3xl">
                    {recommendation.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={cn(
                          "inline-block rounded-full px-2.5 py-1 text-[10px] font-700 uppercase tracking-wider",
                          recommendation.badgeColor,
                        )}
                      >
                        {recommendation.badge}
                      </span>
                      <span className="text-[12px] font-600 text-muted-foreground">
                        {recommendation.price}
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-3.5 w-3.5",
                              i < Math.floor(recommendation.rating)
                                ? "fill-bee-gold text-bee-gold"
                                : "text-border",
                            )}
                          />
                        ))}
                      </div>
                      <span className="text-[12px] font-600 text-foreground">
                        {recommendation.rating}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-[14px] leading-relaxed text-foreground/80">
                  {recommendation.reason}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-5">
                  <a
                    href={recommendation.href}
                    className="inline-flex items-center gap-1.5 rounded-full bg-deep-night px-6 py-3 text-[13px] font-700 text-bee-gold hover:bg-hive-light transition-colors"
                  >
                    Read full review <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                  <button
                    type="button"
                    onClick={reset}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-[13px] font-600 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Start over
                  </button>
                </div>
              </div>

              <div className="mt-5 text-center text-[11px] text-muted-foreground">
                Based on: <span className="font-600 text-foreground">{answers.goal}</span> ·{" "}
                <span className="font-600 text-foreground">{answers.budget}</span> ·{" "}
                <span className="font-600 text-foreground">{answers.time}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}