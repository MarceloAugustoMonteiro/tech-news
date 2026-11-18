# Tech News

A study project for reading technology news from The Guardian, with word translation from English to Brazilian Portuguese. Built with Next.js and TypeScript, rendered on the server and deployed on Vercel.

**Live site:** [technews-marcelo.vercel.app](https://technews-marcelo.vercel.app/)

## Features

- News listing and article pages with dynamic metadata.
- Word translation through clicks, taps or a keyboard-accessible form.
- Responsive layout, system-based light and dark themes, and loading skeletons.
- Server-side sanitization of article HTML before rendering.

## Tech stack

Next.js App Router, React, TypeScript, CSS Modules and Tailwind CSS. Content and translation provided by Guardian Open Platform and MyMemory. Testing uses the Node.js test runner with `tsx`; code quality uses ESLint and Prettier; CI runs on GitHub Actions.

## Getting started

Requirements: Node.js 22, npm and a [Guardian Open Platform API key](https://open-platform.theguardian.com/access/).

```bash
git clone https://github.com/MarceloAugustoMonteiro/tech-news.git
cd tech-news
nvm install
nvm use
npm ci
```

The `nvm` commands are optional if Node.js 22 is already installed. The project version is defined in [`.nvmrc`](.nvmrc).

Create a `.env.local` file in the project root:

```dotenv
GUARDIAN_API_KEY=your_api_key_here
```

The key is used only on the server. Do not prefix it with `NEXT_PUBLIC_` or commit `.env.local`. The current MyMemory integration does not require an API key.

Start the development server:

```bash
npm run dev
```

Open [localhost:3000](http://localhost:3000). To run in production mode:

```bash
npm run build
npm run start
```

The build queries Guardian to prerender the home page and downloads the font used by `next/font`. It requires a valid API key and network access.

## Commands

| Command                | Purpose                                          |
| ---------------------- | ------------------------------------------------ |
| `npm run dev`          | Start the development server                     |
| `npm run build`        | Create the production build and check TypeScript |
| `npm run start`        | Serve the production build                       |
| `npm test`             | Run sanitization, translation and endpoint tests |
| `npm run lint`         | Check code with ESLint                           |
| `npm run format:check` | Check formatting                                 |
| `npm run format`       | Format files with Prettier                       |

## Project structure

| Directory        | Responsibility                                             |
| ---------------- | ---------------------------------------------------------- |
| `src/app`        | Routes, layouts, metadata and the translation endpoint     |
| `src/components` | News listing and interactive translation components        |
| `src/services`   | Guardian and MyMemory integrations and cache configuration |
| `src/lib`        | HTML sanitization and word validation                      |
| `tests`          | Automated tests                                            |

The home page is served at `/`; articles are served at `/news/[...id]`. The legacy `/news` listing redirects to `/`. Article-specific components live in the route's `_components` directory.

Component styles use CSS Modules. `globals.css` contains application-wide base styles; `editorial.css` defines the shared theme and layout. Keep one blank line between CSS rules, including rules inside media queries. The Tailwind loader processes only `globals.css`, preserving Next.js's native CSS Modules processing.

## CI and deployment

The [CI workflow](.github/workflows/ci.yml) runs lint and tests, followed by a production build, on pull requests targeting `main`, pushes to `main` and manual runs. The build requires the `GUARDIAN_API_KEY` repository secret, configured under **Settings → Secrets and variables → Actions** on GitHub. Fork and Dependabot pull requests run only lint and tests because they do not receive this secret.

Deployment uses Vercel's GitHub integration: `main` is the production branch, and other branches generate previews. To reproduce the deployment, import the repository with the **Next.js** preset, root directory `./`, Node.js **22.x**, and set `GUARDIAN_API_KEY` for **Production** and **Preview**. GitHub Actions secrets and Vercel environment variables are configured separately.

The workflow does not enforce merge requirements or block Vercel releases by itself. Those controls depend on branch protection and deployment settings.

## Integrations and limitations

- **Guardian:** this is a non-commercial study project. Content belongs to The Guardian and includes attribution and a link to the original. Article text availability depends on the API; when unavailable, the page provides the external link. Review the [terms of use](https://www.theguardian.com/open-platform/terms-and-conditions) and [attribution requirements](https://www.theguardian.com/open-platform/logos) before changing how content is used or distributed.
- **Caching:** the news listing revalidates every 30 minutes and articles every hour. Caching reduces requests but does not enforce provider quotas.
- **Translation:** MyMemory translates individual words, with result caching and request limits. Translations may not reflect context; provider outages and quotas can prevent requests. See the [service limits](https://mymemory.translated.net/doc/usagelimits.php).
- **Endpoint protection:** request limits are held in memory per process and do not provide a shared quota across instances.
