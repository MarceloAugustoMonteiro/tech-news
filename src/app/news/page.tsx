import { Suspense } from "react";
import Link from "next/link";
import { getTechnologyNews } from "@/services/guardian";
import type { Metadata } from "next";
import Image from "next/image";
import NewsDate from "@/components/NewsDate";

export const metadata: Metadata = {
  title: "Technology News | Tech News",
  description: "Latest technology news from around the world.",
};

export default function NewsPage() {
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

async function NewsList() {
  const news = await getTechnologyNews();
  const firstImageIndex = news.findIndex(
    (article) => Boolean(article.fields?.thumbnail),
  );

  return (
    <div className="news-grid">
      {news.length === 0 && <p className="news-loading">No stories available right now. Please check back soon.</p>}
      {news.map((article, index) => (
        <article key={article.id} className={`news-card${index === 0 ? " news-card-featured" : ""}`}>
          <Link href={`/news/${article.id}`} className="news-card-link">
          <div className="news-card-media">
          {article.fields?.thumbnail && (
            <Image
              src={article.fields.thumbnail}
              alt={article.webTitle}
              width={500}
              height={400}
              sizes={index === 0
                ? "(max-width: 541px) calc(100vw - 42px), 500px"
                : "(max-width: 639px) calc(100vw - 40px), (max-width: 899px) calc((100vw - 88px) / 2), (max-width: 1215px) calc((100vw - 112px) / 3), 368px"}
              loading={index === firstImageIndex ? "eager" : "lazy"}
              fetchPriority={index === firstImageIndex ? "high" : "auto"}
              className="news-card-image"
            />
          )}
          {!article.fields?.thumbnail && <span className="news-image-placeholder" aria-hidden="true">technews.</span>}
          {index === 0 && <span className="news-featured-label">In focus</span>}
          </div>
          <div className="news-card-content">
            <div className="news-card-meta"><span>Technology</span><span aria-hidden="true">/</span><NewsDate value={article.webPublicationDate} /></div>
            <h2>{article.webTitle}</h2>
            <div className="news-card-bottom"><span>The Guardian</span><span className="news-read-link">Read story <span aria-hidden="true">↗</span></span></div>
          </div>
          </Link>
        </article>
      ))}
    </div>
  );
}
