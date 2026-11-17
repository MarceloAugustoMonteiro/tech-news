import { cacheLife } from "next/cache";

export class TranslationError extends Error {
  constructor(public readonly limited = false) {
    super("Translation unavailable");
  }
}

export async function fetchTranslation(word: string, fetcher: typeof fetch = fetch) {
  const url = new URL("https://api.mymemory.translated.net/get");

  url.searchParams.set("q", word);
  url.searchParams.set("langpair", "en|pt-BR");

  try {
    const response = await fetcher(url, { signal: AbortSignal.timeout(8000), cache: "no-store" });

    if (response.status === 429) {
      throw new TranslationError(true);
    }

    if (!response.ok) {
      throw new TranslationError();
    }

    const data = await response.json();

    if (
      data.quotaFinished ||
      Number(data.responseStatus) === 429 ||
      Number(data.responseStatus) === 403
    ) {
      throw new TranslationError(true);
    }

    const text = data.responseData?.translatedText;

    if (
      Number(data.responseStatus) !== 200 ||
      typeof text !== "string" ||
      !text.trim() ||
      text.length > 1000
    ) {
      throw new TranslationError();
    }

    return text.trim();
  } catch (error) {
    if (error instanceof TranslationError) {
      throw error;
    }

    throw new TranslationError();
  }
}

export async function translateWord(word: string) {
  "use cache";
  cacheLife({ stale: 3600, revalidate: 86400, expire: 172800 });

  return fetchTranslation(word);
}
