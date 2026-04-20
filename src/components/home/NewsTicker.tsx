const headlines = [
  "OpenAI launches GPT-5 with real-time voice mode",
  "Google Gemini 2.5 Flash reviewed for beginners",
  "Meta's new AI assistant goes open-source",
  "Claude 4 features explained step-by-step",
  "Midjourney v7 alpha leaks: what's new",
  "Notion AI adds full database automation",
];

export function NewsTicker() {
  const loop = [...headlines, ...headlines];
  return (
    <div className="border-y border-bee-gold/30 bg-pollen">
      <div className="mx-auto max-w-[1280px] px-6 py-3 flex items-center gap-4 overflow-hidden">
        <div className="shrink-0 rounded-md bg-bee-gold px-2.5 py-1 text-[10px] font-700 text-deep-night tracking-wider">
          🔥 AI NEWS
        </div>
        <div className="flex-1 overflow-hidden relative">
          <div className="flex gap-12 whitespace-nowrap animate-marquee w-max">
            {loop.map((h, i) => (
              <span key={i} className="text-[13px] text-beeswax font-500">
                <span className="text-bee-gold mr-2">●</span>
                {h}
              </span>
            ))}
          </div>
        </div>
        <button className="hidden sm:inline shrink-0 text-[12px] font-600 text-dark-amber hover:text-bee-gold">
          View all →
        </button>
      </div>
    </div>
  );
}
