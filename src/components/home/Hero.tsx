import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-deep-night text-white">
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-deep-night via-hive-dark to-deep-night" />
      <div className="absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full bg-bee-gold/20 blur-3xl" />
      <div className="absolute -bottom-40 left-1/3 h-[420px] w-[420px] rounded-full bg-amber-brand/15 blur-3xl" />
      <div className="absolute inset-0 bg-honeycomb opacity-[0.06]" />

      <div className="relative mx-auto max-w-[1280px] px-6 py-20 lg:py-28 grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-bee-gold/30 bg-bee-gold/10 px-3 py-1 text-[11px] font-600 uppercase tracking-[0.18em] text-bee-gold">
            <Sparkles className="h-3 w-3" /> Your AI Learning Hub
          </div>
          <h1 className="mt-5 text-4xl sm:text-5xl lg:text-6xl font-700 leading-[1.05] text-balance">
            Master AI Tools,
            <br />
            <span className="text-bee-gold">One Step at a Time.</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15px] sm:text-base leading-relaxed text-honey-lite/70">
            Step-by-step tutorials, honest reviews, and a community of AI learners
            — built for beginners who want to keep up with the future.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button className="group inline-flex items-center gap-2 rounded-lg bg-bee-gold px-6 py-3 text-[14px] font-600 text-deep-night shadow-bee hover:brightness-105 active:translate-y-px transition">
              Explore AI Guides
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-bee-gold/40 px-6 py-3 text-[14px] font-500 text-bee-gold hover:bg-bee-gold/10 transition">
              Ask the Community
            </button>
          </div>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-bee-gold/15">
            {[
              ["240+", "AI Tool Tutorials"],
              ["50K+", "Monthly Readers"],
              ["1.2K", "Q&A Answers"],
              ["Free", "Always Free"],
            ].map(([num, label]) => (
              <div key={label}>
                <div className="text-2xl font-700 text-bee-gold">{num}</div>
                <div className="text-[11px] uppercase tracking-wider text-dark-amber mt-1">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating bee scene */}
        <div className="relative hidden lg:block h-[460px]">
          <div className="absolute inset-0 flex items-center justify-center">
            <Honeycomb />
          </div>
          <div className="absolute top-10 right-10 animate-bee-float">
            <BeeMark size={120} />
          </div>
          <div className="absolute bottom-12 left-6 animate-bee-float [animation-delay:-2s]">
            <BeeMark size={80} />
          </div>
        </div>
      </div>
    </section>
  );
}

function BeeMark({ size = 100 }: { size?: number }) {
  return (
    <div
      className="rounded-full bg-bee-gold flex items-center justify-center shadow-bee animate-pulse-glow"
      style={{ width: size, height: size, fontSize: size * 0.55 }}
    >
      🐝
    </div>
  );
}

function Honeycomb() {
  const cells = Array.from({ length: 19 });
  return (
    <div
      className="grid gap-2 opacity-90"
      style={{ gridTemplateColumns: "repeat(5, 70px)" }}
    >
      {cells.map((_, i) => {
        const accent = [3, 7, 11, 15].includes(i);
        const offset = Math.floor(i / 5) % 2 === 1;
        return (
          <div
            key={i}
            className={
              "h-[80px] w-[70px] [clip-path:polygon(25%_5%,75%_5%,100%_50%,75%_95%,25%_95%,0%_50%)] " +
              (accent
                ? "bg-bee-gold shadow-bee"
                : "bg-hive-light/60 border border-bee-gold/10")
            }
            style={{ transform: offset ? "translateX(35px)" : undefined }}
          />
        );
      })}
    </div>
  );
}
