export default function NewsListSkeleton() {
  return (
    <div className="news-list-skeleton" role="status">
      <span className="sr-only">Loading the latest technology news…</span>
      <div className="news-grid" aria-hidden="true">
        {Array.from({ length: 10 }, (_, index) => (
          <div key={index} className={`news-card${index === 0 ? " news-card-featured" : ""}`}>
            <div className="news-card-link">
              <div className="news-card-media" />
              <div className="news-card-content">
                <div className="news-skeleton-line news-skeleton-eyebrow" />
                <div className="news-list-skeleton-title">
                  <div className="news-skeleton-line" />
                  <div className="news-skeleton-line" />
                  <div className="news-skeleton-line news-skeleton-short" />
                </div>
                <div className="news-card-bottom">
                  <div className="news-skeleton-line news-list-skeleton-source" />
                  <div className="news-skeleton-line news-list-skeleton-source" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
