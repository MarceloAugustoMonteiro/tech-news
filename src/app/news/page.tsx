import { Suspense } from "react";
import Link from "next/link";
import { getTechnologyNews } from "@/services/guardian";
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Technology News | Tech News",
  description: "Latest technology news from around the world.",
};

export default function NewsPage() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-8 text-3xl font-bold">
        Technology News
      </h1>

      <Suspense fallback={<p>Loading news...</p>}>
        <NewsList />
      </Suspense>
    </main>
  );
}

async function NewsList() {
  const news = await getTechnologyNews();
  const firstImageIndex = news.findIndex(
    (article) => Boolean(article.fields?.thumbnail),
  );

  return (
    <div className="grid gap-6">
      {news.map((article, index) => (
        <article key={article.id}>
          <h2 className="text-xl font-semibold">
            <Link href={`/news/${article.id}`}>
              {article.webTitle}
            </Link>
          </h2>
          {article.fields?.thumbnail && (
            <Image
              src={article.fields.thumbnail}
              alt={article.webTitle}
              width={500}
              height={400}
              sizes="(max-width: 564px) calc(100vw - 64px), 500px"
              loading={index === firstImageIndex ? "eager" : "lazy"}
              className="h-auto w-full max-w-[500px] rounded-lg"
            />
          )}
          <time dateTime={article.webPublicationDate}>
            {new Date(article.webPublicationDate)
              .toLocaleDateString("pt-BR")}
          </time>
        </article>
      ))}
    </div>
  );
}
