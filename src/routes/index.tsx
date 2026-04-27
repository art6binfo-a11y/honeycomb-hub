import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Hero } from "@/components/home/Hero";
import { NewsTicker } from "@/components/home/NewsTicker";
import { FeaturedTutorials } from "@/components/home/FeaturedTutorials";
import { CategoryTiles } from "@/components/home/CategoryTiles";
import { FlightPaths } from "@/components/home/FlightPaths";
import { LatestReviews } from "@/components/home/LatestReviews";
import { PromptDiary } from "@/components/home/PromptDiary";
import { CommunityQA } from "@/components/home/CommunityQA";
import { NewsletterCTA } from "@/components/home/NewsletterCTA";
import { Pollinator } from "@/components/home/Pollinator";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "askyourbee — Your AI Learning Hub for Beginners" },
      {
        name: "description",
        content:
          "Step-by-step AI tutorials, honest tool reviews, prompt library, and a friendly Q&A community — built for AI beginners.",
      },
      { property: "og:title", content: "askyourbee — Your AI Learning Hub for Beginners" },
      {
        property: "og:description",
        content:
          "Master AI tools one step at a time. Tutorials, reviews, prompts, and a hive of learners.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <SiteLayout>
      <Hero />
      <NewsTicker />
      <FeaturedTutorials />
      <FlightPaths />
      <CategoryTiles />
      <Pollinator />
      <LatestReviews />
      <PromptDiary />
      <CommunityQA />
      <NewsletterCTA />
    </SiteLayout>
  );
}
