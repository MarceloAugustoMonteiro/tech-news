import { Suspense } from "react";
import type { Metadata } from "next";
import NewsList from "@/components/news/NewsList";

export const metadata: Metadata = {
  title: "Technology News | Tech News",
  description: "Latest technology news from around the world.",
};

export default function HomePage() {
  return (
    <main id="news-content" className="news-container news-main">
      <header className="news-intro">
        <div>
          <p className="news-eyebrow"><span aria-hidden="true" /> The technology briefing</p>
          <h1>Tomorrow starts <span>here.</span></h1>
        </div>
        <p className="news-intro-description">The ideas, people and breakthroughs shaping our digital world. Stay curious. Stay informed.</p>
      </header>
      <Suspense fallback={<div className="news-loading" role="status">Bringing you the latest technology news…</div>}>
        <NewsList />
      </Suspense>
    </main>
  );
}
