import assert from "node:assert/strict";
import { test } from "node:test";
import { normalizeWord, wordAtOffset, wordFromPayload } from "../src/lib/translation-word";
import { fetchTranslation, TranslationError } from "../src/services/translation";
import { POST } from "../src/app/api/translate/route";

test("normalizes punctuation and contractions, rejects sentences, URLs and non-English tokens", () => {
  assert.equal(normalizeWord(" “Beautiful,” "), "beautiful");
  assert.equal(normalizeWord("don’t"), "don't");
  for (const value of [
    null,
    3,
    {},
    "",
    "two words",
    "https://evil.test",
    "3rd",
    "café",
    "a".repeat(61),
  ]) {
    assert.equal(normalizeWord(value), null);
  }
  assert.equal(wordFromPayload({ word: "Beautiful!" }), "beautiful");
  for (const value of [null, [], "hello", {}, { word: false }]) {
    assert.equal(wordFromPayload(value), null);
  }
});

test("identifies exact offsets without punctuation or neighbouring words", () => {
  assert.deepEqual(wordAtOffset("A beautiful, world.", 5), {
    word: "beautiful",
    start: 2,
    end: 11,
  });
  assert.equal(wordAtOffset("don't stop", 3)?.word, "don't");
  assert.equal(wordAtOffset("café 3rd", 2), null);
  assert.equal(wordAtOffset("café 3rd", 7), null);
  assert.equal(wordAtOffset("hello   world", 7), null);
});

const provider = (body: unknown, status = 200) =>
  (async (url: URL | RequestInfo) => {
    assert.equal(new URL(String(url)).origin, "https://api.mymemory.translated.net");
    assert.equal(new URL(String(url)).searchParams.get("langpair"), "en|pt-BR");
    return Response.json(body, { status });
  }) as typeof fetch;

test("provider success and controlled HTTP, empty, quota and network errors", async () => {
  assert.equal(
    await fetchTranslation(
      "beautiful",
      provider({ responseStatus: 200, responseData: { translatedText: "bonito" } }),
    ),
    "bonito",
  );
  for (const fetcher of [
    provider({}, 500),
    provider({ responseStatus: 200, responseData: { translatedText: " " } }),
    provider(null),
    (async () => {
      throw new Error("internal secret");
    }) as typeof fetch,
  ]) {
    await assert.rejects(
      fetchTranslation("word", fetcher),
      (error: unknown) =>
        error instanceof TranslationError && !error.limited && !error.message.includes("secret"),
    );
  }
  for (const fetcher of [
    provider({}, 429),
    provider({ responseStatus: 403 }),
    provider({ quotaFinished: true }),
  ]) {
    await assert.rejects(
      fetchTranslation("word", fetcher),
      (error: unknown) => error instanceof TranslationError && error.limited,
    );
  }
});

test("endpoint rejects invalid JSON, oversized payloads, invalid words and cross-origin calls", async () => {
  for (const body of [
    "{",
    JSON.stringify({ word: "two words" }),
    JSON.stringify({ word: 5 }),
    "x".repeat(2000),
  ]) {
    const response = await POST(
      new Request("http://localhost/api/translate", { method: "POST", body }),
    );
    assert.equal(response.status, 400);
  }
  const response = await POST(
    new Request("http://localhost/api/translate", {
      method: "POST",
      headers: { origin: "https://evil.test" },
      body: '{"word":"beautiful"}',
    }),
  );
  assert.equal(response.status, 403);
});

test("endpoint rate limit is independent of provider cache", async () => {
  let status = 0;
  for (let i = 0; i < 21; i++) {
    status = (
      await POST(
        new Request("http://localhost/api/translate", {
          method: "POST",
          headers: { "x-forwarded-for": "test-client" },
          body: "{}",
        }),
      )
    ).status;
  }
  assert.equal(status, 429);
});
