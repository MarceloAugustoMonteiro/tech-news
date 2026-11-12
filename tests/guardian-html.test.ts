import assert from "node:assert/strict";
import { test } from "node:test";
import { sanitizeGuardianHtml } from "../src/lib/guardian-html";

test("preserves article paragraphs, links, figures, credits and corrections", () => {
  const html = '<h2>Background</h2><p>First <strong>paragraph</strong>.</p><blockquote>A quotation.</blockquote><p><a href="https://www.theguardian.com/story">Related reporting</a></p><figure><img src="https://media.guim.co.uk/photo.jpg" width="500" height="400" alt="A photo"><figcaption>Photograph: Author</figcaption></figure><p id="correction">Correction and copyright notice.</p>';
  const result = sanitizeGuardianHtml(html);

  assert.match(result, /<h2>Background<\/h2>/);
  assert.match(result, /<strong>paragraph<\/strong>/);
  assert.match(result, /href="https:\/\/www.theguardian.com\/story"/);
  assert.match(result, /<figcaption>Photograph: Author<\/figcaption>/);
  assert.match(result, /id="correction"/);
  assert.match(result, /Correction and copyright notice\./);
  assert.match(result, /loading="lazy"/);
});

test("removes scripts, event handlers, styles and unsafe embeds", () => {
  const html = '<script>alert(1)</script><style>body{display:none}</style><p onclick="alert(1)">Keep this</p><img src="https://example.com/photo.jpg" onerror="alert(1)"><iframe src="https://evil.example"></iframe><svg onload="alert(1)"></svg>';
  const result = sanitizeGuardianHtml(html);

  assert.match(result, /<p>Keep this<\/p>/);
  assert.doesNotMatch(result, /script|alert|onclick|onerror|<style|<iframe|<svg/);
});

test("blocks dangerous and obfuscated URL schemes", () => {
  const html = '<a href="javascript:alert(1)">A</a><a href="java&#x73;cript:alert(1)">B</a><img src="data:image/svg+xml,evil"><a href="//evil.example">C</a>';
  const result = sanitizeGuardianHtml(html);

  assert.doesNotMatch(result, /href=|src=/);
  assert.match(result, /<a>A<\/a>/);
  assert.match(result, /<a>B<\/a>/);
});

test("resolves Guardian-relative links while preserving local anchors", () => {
  const html = '<a href="/profile/reporter">Reporter</a><a href="#correction">Correction</a>';
  const result = sanitizeGuardianHtml(html);

  assert.match(result, /href="https:\/\/www.theguardian.com\/profile\/reporter"/);
  assert.match(result, /href="#correction"/);
});

test("handles empty and malformed HTML without exposing executable markup", () => {
  assert.equal(sanitizeGuardianHtml(""), "");
  const result = sanitizeGuardianHtml('<p>Text<strong>bold<img src=x onerror="alert(1)">');
  assert.match(result, /Text<strong>bold/);
  assert.doesNotMatch(result, /onerror|alert/);
});
