const WORD = /^[a-z]+(?:'[a-z]+)?$/i;

export function normalizeWord(value: unknown): string | null {
  if (typeof value !== "string" || value.length > 80) {
    return null;
  }

  const word = value
    .trim()
    .replace(/[’]/g, "'")
    .replace(/^[\s"'“”.,!?;:()[\]{}]+|[\s"'“”.,!?;:()[\]{}]+$/g, "")
    .toLowerCase();

  return word.length <= 60 && WORD.test(word) ? word : null;
}

export function wordAtOffset(text: string, offset: number) {
  for (const match of text.matchAll(/[\p{L}\p{N}]+(?:['’][\p{L}\p{N}]+)?/gu)) {
    const start = match.index;
    const end = start + match[0].length;

    if (offset >= start && offset <= end) {
      const word = normalizeWord(match[0]);

      return word ? { word, start, end } : null;
    }
  }

  return null;
}

export function wordFromPayload(payload: unknown): string | null {
  if (!payload || typeof payload !== "object" || !("word" in payload)) {
    return null;
  }

  return normalizeWord(payload.word);
}
