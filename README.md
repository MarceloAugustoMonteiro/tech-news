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

## Guardian integration

This is a non-commercial study project. Configure `GUARDIAN_API_KEY` in `.env.local`; the key is read only by the server and must not be exposed through `NEXT_PUBLIC_` variables.

The home requests thumbnails only. Article pages request `body`, `byline`, `standfirst`, `lastModified`, `publication`, and `thumbnail`. HTML is sanitized on the server with `sanitize-html` before rendering. Editorial text, links, figures, captions and notices are preserved; scripts, event handlers, inline styles and iframe embeds are excluded. Interactive embeds may therefore be absent from the reading view. If `body` is unavailable, the page offers the original article link.

Article pages show a text attribution below the reading view, styled with CSS and system fonts. It links to The Guardian, and the original article is linked separately. This text treatment is not the official logo asset; review the [Guardian attribution requirements](https://www.theguardian.com/open-platform/logos) before publishing.

List queries revalidate after 30 minutes, and article queries after one hour. Both have a two-hour blocking expiration. Card prefetching is disabled to avoid fetching full articles that the reader has not opened. These settings reduce requests but do not enforce a shared API quota across processes or deployments; monitor usage against the [Developer plan limits](https://open-platform.theguardian.com/access/).

Cache expiration governs serving behavior, not physical deletion of deployment artifacts, logs or backups. Review storage retention and cache invalidation when deploying, and do not archive API responses in the repository. See the [Open Platform terms](https://www.theguardian.com/open-platform/terms-and-conditions) before changing the project's usage.

## Validation

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
