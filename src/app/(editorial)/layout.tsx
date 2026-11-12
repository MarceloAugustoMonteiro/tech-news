import Link from "next/link";
import "./news.css";

export default function EditorialLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="news-site">
      <a className="news-skip-link" href="#news-content">Skip to content</a>
      <header className="news-header">
        <div className="news-container news-header-inner">
          <Link href="/" className="news-brand" aria-label="Tech News home">
            <span className="news-brand-mark" aria-hidden="true">t<span>.</span></span>
            <span>tech<span className="news-brand-light">news</span></span>
          </Link>
          <nav aria-label="News navigation">
            <Link href="/" className="news-nav-link">Technology <span aria-hidden="true">↗</span></Link>
          </nav>
          <span className="news-header-note">A closer look at what’s next.</span>
        </div>
      </header>
      {children}
      <footer className="news-footer news-container">
        <Link href="/" className="news-footer-brand">technews<span>.</span></Link>
        <p>Technology, in perspective.</p>
        <a href="https://www.theguardian.com/technology" target="_blank" rel="noopener noreferrer">News from The Guardian <span aria-hidden="true">↗</span></a>
      </footer>
    </div>
  );
}
