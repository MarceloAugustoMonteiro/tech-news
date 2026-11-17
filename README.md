This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Node version: v20.19.1

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The news home is `src/app/(editorial)/page.tsx`; article pages are served at `/news/[...id]`. The legacy `/news` listing redirects to `/`.

The editorial layout owns the shared header, footer, and styles. `components/news` contains the news list, cards, and shared date formatting. Article-specific presentation and sanitized HTML rendering live in the detail route's private `_components` folder. The route keeps metadata, parameter handling, data loading, and not-found behavior; `services/guardian.ts` owns API access and caching.

## Guardian integration

This is a non-commercial study project. Configure `GUARDIAN_API_KEY` in `.env.local`; the key is read only by the server and must not be exposed through `NEXT_PUBLIC_` variables.

The home requests thumbnails only. Article pages request `body`, `byline`, `standfirst`, `lastModified`, `publication`, and `thumbnail`. HTML is sanitized on the server with `sanitize-html` before rendering. Editorial text, links, figures, captions and notices are preserved; scripts, event handlers, inline styles and iframe embeds are excluded. Interactive embeds may therefore be absent from the reading view. If `body` is unavailable, the page offers the original article link.

Article pages show a text attribution below the reading view, styled with CSS and system fonts. It links to The Guardian, and the original article is linked separately. This text treatment is not the official logo asset; review the [Guardian attribution requirements](https://www.theguardian.com/open-platform/logos) before publishing.

List queries revalidate after 30 minutes, and article queries after one hour. Both have a two-hour blocking expiration. Card prefetching is disabled to avoid fetching full articles that the reader has not opened. These settings reduce requests but do not enforce a shared API quota across processes or deployments; monitor usage against the [Developer plan limits](https://open-platform.theguardian.com/access/).

Cache expiration governs serving behavior, not physical deletion of deployment artifacts, logs or backups. Review storage retention and cache invalidation when deploying, and do not archive API responses in the repository. See the [Open Platform terms](https://www.theguardian.com/open-platform/terms-and-conditions) before changing the project's usage.

## Interactive word translation

On article pages, click or tap an English word to translate it to Brazilian Portuguese. The server-rendered, sanitized HTML is passed as children to a small client boundary; no word wrappers or DOM rewrites are introduced. Click detection hit-tests text ranges inside the clicked element, without depending on browser selection/caret APIs. Native text selection is disabled only in the article body to prevent accidental phrase selection. A collapsible single-word form provides keyboard access. Links and media controls retain their native behavior.

Translation starts only after user interaction. The non-modal result dialog supports Escape and outside-click dismissal, returns focus to the reading area when dismissed from inside the dialog, and is dismissed on scrolling/resizing to avoid stale coordinates. Only the selected word is sent, not the article or its context. Cancelling or switching words aborts the previous client request and prevents late responses from replacing the current result.

`POST /api/translate` accepts `{ "word": "beautiful" }`. It fixes the language pair to `en|pt-BR`, validates English words/contractions up to 60 characters, caps request bodies at 1 KiB, uses an eight-second provider timeout and returns controlled 400/403/429/503 errors. No API key is needed. Responses are rendered as text, never as HTML.

The page caches successful translations for its lifetime; the server caches them with Cache Components (24-hour revalidation, 48-hour blocking expiration). Failed results are not inserted into the client cache. The anonymous [MyMemory plan](https://mymemory.translated.net/doc/usagelimits.php) is limited to 5,000 characters/day; isolated words can have contextually inaccurate translations.

The endpoint also limits requests to 20/minute per forwarded client IP (or a shared bucket if unavailable), plus 120/minute per process. This bounded in-memory protection resets on restart and is not a distributed quota. Hosting must overwrite `X-Forwarded-For` with a trusted value; for a public multi-instance deployment, use a shared limiter or gateway before relying on these limits. Cross-origin browser requests are rejected.

## Validation commands

Formatting uses Prettier with two-space indentation, double quotes, semicolons, and a target line width of 100 characters. Run `npm run format` to format source files and `npm run format:check` to verify them without writing. Generated files, public assets, lockfiles and agent instructions are excluded.

```bash
npm test
npm run lint
npm run build
```

The sanitizer tests cover editorial markup, relative links, malformed HTML, scripts, event handlers and unsafe URL schemes.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
