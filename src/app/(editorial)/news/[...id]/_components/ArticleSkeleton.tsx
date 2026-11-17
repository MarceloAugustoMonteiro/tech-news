export default function ArticleSkeleton() {
  return (
    <div className="news-article-skeleton" role="status">
      <span className="sr-only">Loading your story…</span>
      <div aria-hidden="true">
        <div className="news-detail-header">
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
          <div className="news-detail-byline">
            <div className="news-skeleton-line news-skeleton-author" />
          </div>
        </div>
        <div className="news-detail-figure news-skeleton-media" />
      </div>
    </div>
  );
}
