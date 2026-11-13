import { Suspense } from "react";
import { getArticleById } from "@/services/guardian";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import ArticleView from "./_components/ArticleView";

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

  return <ArticleView article={article} />;
}
