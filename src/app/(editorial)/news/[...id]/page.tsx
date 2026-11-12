import { Suspense } from "react";
import { getArticleById } from "@/services/guardian";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import NewsDate from "@/components/news/NewsDate";
interface NewsDetailsProps {
  params: Promise<{ id: string[] }>;
}

export async function generateMetadata({
  params,
}: NewsDetailsProps): Promise<Metadata> {
  const { id } = await params;

  const article = await getArticleById(id.join("/"));

  if (!article) {
    return {
      title: "Article not found | Tech News",
    };
  }

  return {
    title: `${article.webTitle} | Tech News`,
    description: `Read ${article.webTitle} on Tech News.`,
    openGraph: {
      title: article.webTitle,
      description: `Read ${article.webTitle} on Tech News.`,
      type: "article",
      images: article.fields?.thumbnail
        ? [article.fields.thumbnail]
        : [],
    },
  };
}

export default function NewsDetails({ params }: NewsDetailsProps) {
  return (
    <main id="news-content" className="news-container news-detail-main">
      <Link href="/" className="news-back-link"><span aria-hidden="true">←</span> All stories</Link>
      <Suspense fallback={<div className="news-loading" role="status">Loading your story…</div>}>
        <ArticleContent params={params} />
      </Suspense>
    </main>
  );
}

async function ArticleContent({ params }: NewsDetailsProps) {
  const { id } = await params;

  const article = await getArticleById(id.join("/"));

  if (!article) {
    notFound();
  }

  return (
    <article className="news-detail">
      <header className="news-detail-header">
      <p className="news-eyebrow"><span aria-hidden="true" /> Technology / The Guardian</p>
      <h1>
        {article.webTitle}
      </h1>

      <div className="news-detail-byline">
        <span className="news-source-icon" aria-hidden="true">G</span>
        <div><span className="news-source-name">The Guardian</span><span className="news-published">Published <NewsDate value={article.webPublicationDate} /></span></div>
        <span className="news-detail-category">Technology</span>
      </div>
      </header>
      {article.fields?.thumbnail && (
        <figure className="news-detail-figure">
          <Image src={article.fields.thumbnail} alt={article.webTitle} width={500} height={400}
            sizes="(max-width: 539px) calc(100vw - 40px), 500px"
            loading="eager" fetchPriority="high" className="news-detail-image" />
          <figcaption>Image accompanying the original story on The Guardian.</figcaption>
        </figure>
      )}
      <section className="news-source-panel" aria-labelledby="original-story-heading">
        <div><p className="news-eyebrow">Go deeper</p><h2 id="original-story-heading">Read the full story.</h2><p>Explore the complete reporting and context from The Guardian.</p></div>
      <a
        href={article.webUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="news-source-button"
      >
        Continue to The Guardian <span aria-hidden="true">↗</span>
      </a>
      </section>
    </article>
  );
}
