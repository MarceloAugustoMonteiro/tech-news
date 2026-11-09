import 'server-only';
import { cacheLife } from 'next/cache';

export interface Article {
  id: string;
  webTitle: string;
  webUrl: string;
  webPublicationDate: string;
  fields?: {
    thumbnail?: string;
  };
}

export interface ArticleDetails extends Article {
  fields?: {
    thumbnail?: string;
    body?: string;
  };
}

interface GuardianResponse<T> {
  response: {
    results?: T[];
    content?: T;
  };
}

export async function getTechnologyNews(): Promise<Article[]> {
  'use cache';

  cacheLife({
    stale: 60,
    revalidate: 300,
    expire: 3600,
  });

  const apiKey = process.env.GUARDIAN_API_KEY;

  if (!apiKey) {
    throw new Error('GUARDIAN_API_KEY is missing');
  }

  const url = new URL('https://content.guardianapis.com/search');

  url.searchParams.set('section', 'technology');
  url.searchParams.set('show-fields', 'thumbnail');
  url.searchParams.set('page-size', '10');
  url.searchParams.set('order-by', 'newest');
  url.searchParams.set('api-key', apiKey);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Failed to fetch technology news');
  }

  const data: GuardianResponse<Article> = await response.json();

  return data.response.results ?? [];
}

export async function getArticleById(
  id: string
): Promise<ArticleDetails | null> {
  'use cache';

  cacheLife({
    stale: 60,
    revalidate: 300,
    expire: 3600,
  });

  const apiKey = process.env.GUARDIAN_API_KEY;

  if (!apiKey) {
    throw new Error('GUARDIAN_API_KEY is missing');
  }

  const url = new URL(
    `https://content.guardianapis.com/${id}`
  );

  url.searchParams.set('show-fields', 'body,thumbnail');
  url.searchParams.set('api-key', apiKey);

  const response = await fetch(url);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error('Failed to fetch article');
  }

  const data: GuardianResponse<ArticleDetails> = await response.json();

  return data.response.content ?? null;
}