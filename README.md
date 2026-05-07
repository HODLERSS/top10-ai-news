# Top 10 AI News

Single-page site that surfaces the latest "Top 10 AI infrastructure news" digest. Built with Next.js 16 + Tailwind 4, deployed on Vercel.

Live: `https://top10-ai-news.vercel.app`

## Where digests come from

Each digest lives in `digests/` as a markdown file named `YYYYMMDD_HHMM.md` (e.g. `20260506_1913.md`). The build:

1. Reads all matching files at build time via `src/lib/digests.ts`
2. Picks the most recent timestamp as the homepage content
3. Pre-renders every digest as a static page at `/<timestamp>`

Markdown is rendered with `react-markdown` + `remark-gfm` (for tables) inside a Tailwind `prose` container. All source links open in a new tab.

## Publishing a new digest

```bash
cp /path/to/new_digest.md digests/
git add digests/
git commit -m "digest: cycle YYYY-MM-DD HH:MM"
git push
```

Vercel auto-deploys within ~60 seconds.

## Local dev

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Stack

- Next.js 16 (App Router) + React 19
- Tailwind CSS 4 + `@tailwindcss/typography`
- `react-markdown` + `remark-gfm`
- TypeScript

## File map

```
digests/                       markdown digests, one per cycle
src/
  lib/digests.ts               filesystem helper (listDigests, readDigest)
  app/
    layout.tsx                 minimal shell + Inter font
    page.tsx                   root: latest digest
    [timestamp]/page.tsx       past digest (static-pre-rendered)
    globals.css                Tailwind + typography + table polish
```
