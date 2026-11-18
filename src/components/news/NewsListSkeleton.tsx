import styles from "./NewsCard.module.css";

export default function NewsListSkeleton() {
  return (
    <div className="news-list-skeleton" role="status">
      <span className="sr-only">Loading the latest technology news…</span>
      <div className="news-grid" aria-hidden="true">
        {Array.from({ length: 10 }, (_, index) => (
          <div key={index} className={`${styles.card}${index === 0 ? ` ${styles.featured}` : ""}`}>
            <div className={styles.link}>
              <div className={styles.media} />
              <div className={styles.content}>
                <div className="news-skeleton-line news-skeleton-eyebrow" />
                <div className={styles.skeletonTitle}>
                  <div className="news-skeleton-line" />
                  <div className="news-skeleton-line" />
                  <div className="news-skeleton-line news-skeleton-short" />
                </div>
                <div className={styles.bottom}>
                  <div className={`news-skeleton-line ${styles.skeletonSource}`} />
                  <div className={`news-skeleton-line ${styles.skeletonSource}`} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
