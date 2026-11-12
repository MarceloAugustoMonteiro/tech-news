import { Suspense } from "react";
import { getArticleById } from "@/services/guardian";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import NewsDate from "@/components/news/NewsDate";
import ArticleHtml from "@/components/news/ArticleHtml";
import GuardianAttribution from "@/components/news/GuardianAttribution";
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

  const fields = article.fields;
  const hasBody = Boolean(fields?.body?.trim());

  return (
    <article className="news-detail">
      <header className="news-detail-header">
        <p className="news-eyebrow">
          <span aria-hidden="true" /> Technology / The Guardian
        </p>
        <h1>{article.webTitle}</h1>
        {fields?.standfirst && (
          <ArticleHtml html={fields.standfirst} className="news-standfirst" />
        )}
        <div className="news-detail-byline">
          <div>
            {fields?.byline ? (
              <ArticleHtml html={fields.byline} className="news-source-name" />
            ) : (
              <span className="news-source-name">The Guardian</span>
            )}
            <span className="news-published">
              Published <NewsDate value={article.webPublicationDate} />
            </span>
            {fields?.lastModified &&
              new Date(fields.lastModified).getTime() >
                new Date(article.webPublicationDate).getTime() && (
                <span className="news-published">
                  Updated <NewsDate value={fields.lastModified} />
                </span>
              )}
          </div>
          <span className="news-detail-category">Technology</span>
        </div>
      </header>
      {fields?.thumbnail && (
        <figure className="news-detail-figure">
          <Image
            src={fields.thumbnail}
            alt={article.webTitle}
            width={500}
            height={400}
            sizes="(max-width: 539px) calc(100vw - 40px), 500px"
            loading="eager"
            fetchPriority="high"
            className="news-detail-image"
          />
          <figcaption>
            Image accompanying the original story on The Guardian.
          </figcaption>
        </figure>
      )}
      {hasBody && fields?.body ? (
        <ArticleHtml html={fields.body} className="news-article-body" />
      ) : (
        <p className="news-article-unavailable" role="status">
          The article text is not available here. You can read the original
          story on The Guardian using the link below.
        </p>
      )}
      <footer className="news-article-credit">
        <GuardianAttribution />
        <p>Original reporting by The Guardian.</p>
        <p>© Guardian News &amp; Media Limited. All rights reserved.</p>
        <a
          href={article.webUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="news-original-link"
        >
          View the original article <span aria-hidden="true">↗</span>
        </a>
      </footer>
    </article>
  );
}
