import ArrowUpRightIcon from "@/components/icons/ArrowUpRightIcon";
import styles from "./ArticleView.module.css";
import Image from "next/image";
import type { ArticleDetails } from "@/services/guardian";
import NewsDate from "@/components/news/NewsDate";
import ArticleHtml from "./ArticleHtml";
import InteractiveArticle from "@/components/translation/InteractiveArticle";

interface ArticleViewProps {
  article: ArticleDetails;
}

export default function ArticleView({ article }: ArticleViewProps) {
  const fields = article.fields;
  const hasBody = Boolean(fields?.body?.trim());

  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <p className="news-eyebrow">
          <span aria-hidden="true" /> Technology / The Guardian
        </p>
        <h1>{article.webTitle}</h1>
        {fields?.standfirst && (
          <ArticleHtml html={fields.standfirst} className={styles.standfirst} />
        )}
        <div className={styles.byline}>
          <div>
            {fields?.byline ? (
              <ArticleHtml html={fields.byline} className={styles.sourceName} />
            ) : (
              <span className={styles.sourceName}>The Guardian</span>
            )}
            <span className={styles.published}>
              Published <NewsDate value={article.webPublicationDate} />
            </span>
            {fields?.lastModified &&
              new Date(fields.lastModified).getTime() >
                new Date(article.webPublicationDate).getTime() && (
                <span className={styles.published}>
                  Updated <NewsDate value={fields.lastModified} />
                </span>
              )}
          </div>
          <span className={styles.category}>Technology</span>
        </div>
      </header>
      {fields?.thumbnail && (
        <figure className={styles.figure}>
          <Image
            src={fields.thumbnail}
            alt={article.webTitle}
            width={500}
            height={400}
            sizes="(max-width: 539px) calc(100vw - 40px), 500px"
            loading="eager"
            fetchPriority="high"
            className={styles.image}
          />
          <figcaption>Image accompanying the original story on The Guardian.</figcaption>
        </figure>
      )}
      {hasBody && fields?.body ? (
        <InteractiveArticle>
          <ArticleHtml html={fields.body} className={styles.body} />
        </InteractiveArticle>
      ) : (
        <p className={styles.unavailable} role="status">
          The article text is not available here. You can read the original story on The Guardian
          using the link below.
        </p>
      )}
      <footer className={styles.credit}>
        <a
          className={styles.attribution}
          href="https://www.theguardian.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className={styles.attributionLabel}>Powered by</span>
          <span className={styles.attributionName}>The Guardian</span>
        </a>
        <p>Original reporting by The Guardian.</p>
        <p>© Guardian News &amp; Media Limited. All rights reserved.</p>
        <a
          href={article.webUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.originalLink}
        >
          View the original article <ArrowUpRightIcon />
        </a>
      </footer>
    </article>
  );
}
