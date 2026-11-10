import { Suspense } from "react";
import { getArticleById } from "@/services/guardian";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
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
    <main className="mx-auto max-w-4xl p-8">
      <Suspense fallback={<p>Loading article...</p>}>
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
    <article>
      <h1 className="text-3xl font-bold">
        {article.webTitle}
      </h1>

      <time dateTime={article.webPublicationDate}>
        {new Date(article.webPublicationDate).toLocaleDateString("pt-BR")}
      </time>

      <a
        href={article.webUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 block underline"
      >
        Read full article on The Guardian
      </a>
    </article>
  );
}