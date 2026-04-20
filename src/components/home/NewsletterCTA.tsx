import { Mail, ArrowRight } from "lucide-react";

export function NewsletterCTA() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-bee-gold via-amber-brand to-dark-amber p-10 lg:p-14 shadow-bee">
          <div className="absolute inset-0 bg-honeycomb opacity-20" />
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-deep-night/20 blur-3xl" />
          <div className="relative grid lg:grid-cols-[1.3fr_1fr] gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-deep-night/15 backdrop-blur px-3 py-1 text-[11px] font-700 uppercase tracking-wider text-deep-night">
                <Mail className="h-3.5 w-3.5" /> The Hive Weekly
              </div>
              <h2 className="mt-4 text-3xl sm:text-4xl font-700 text-deep-night leading-tight text-balance">
                One email. Every Sunday. The 5 AI tools beginners actually need.
              </h2>
              <p className="mt-3 text-[14px] text-deep-night/80 max-w-xl">
                Curated tutorials, honest reviews, and the prompts of the week —
                handpicked by our editors. No spam. Always free.
              </p>
            </div>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex flex-col sm:flex-row gap-2 bg-deep-night p-2 rounded-xl shadow-night"
            >
              <input
                type="email"
                placeholder="you@example.com"
                className="flex-1 bg-transparent px-4 py-3 text-[14px] text-honey-lite placeholder:text-dark-amber outline-none"
              />
              <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-bee-gold px-5 py-3 text-[13px] font-700 text-deep-night hover:brightness-105 transition">
                Subscribe <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
