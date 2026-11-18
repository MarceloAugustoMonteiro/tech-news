import styles from "./ArticleView.module.css";

export default function ArticleSkeleton() {
  return (
    <div className="news-article-skeleton" role="status">
      <span className="sr-only">Loading your story…</span>
      <div aria-hidden="true">
        <div className={styles.header}>
          <div className="news-skeleton-line news-skeleton-eyebrow" />
          <div className="news-skeleton-title">
            <div className="news-skeleton-line" />
            <div className="news-skeleton-line" />
            <div className="news-skeleton-line news-skeleton-short" />
          </div>
          <div className="news-skeleton-summary">
            <div className="news-skeleton-line" />
            <div className="news-skeleton-line news-skeleton-short" />
          </div>
          <div className={styles.byline}>
            <div className="news-skeleton-line news-skeleton-author" />
          </div>
        </div>
        <div className={`${styles.figure} news-skeleton-media`} />
      </div>
    </div>
  );
}
