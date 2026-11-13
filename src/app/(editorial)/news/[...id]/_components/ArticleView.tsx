import Image from "next/image";
import type { ArticleDetails } from "@/services/guardian";
import NewsDate from "@/components/news/NewsDate";
import ArticleHtml from "./ArticleHtml";

interface ArticleViewProps {
  article: ArticleDetails;
}

export default function ArticleView({ article }: ArticleViewProps) {
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
        <a
          className="news-guardian-attribution"
          href="https://www.theguardian.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="news-guardian-label">Powered by</span>
          <span className="news-guardian-name">The Guardian</span>
        </a>
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
