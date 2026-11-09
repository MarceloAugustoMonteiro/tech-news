import { Suspense } from 'react';
import Link from 'next/link';
import { getTechnologyNews } from '@/services/guardian';

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

  return (
    <div className="grid gap-6">
      {news.map((article) => (
        <article key={article.id}>
          <h2 className="text-xl font-semibold">
            <Link href={`/news/${article.id}`}>
              {article.webTitle}
            </Link>
          </h2>

          <time dateTime={article.webPublicationDate}>
            {new Date(article.webPublicationDate)
              .toLocaleDateString('pt-BR')}
          </time>
        </article>
      ))}
    </div>
  );
}