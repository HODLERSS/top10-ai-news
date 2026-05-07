import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {
  formatDigestDate,
  getLatestDigest,
  listDigests,
  readDigest,
} from "@/lib/digests";

export const dynamic = "force-static";

export default function Home() {
  const latest = getLatestDigest();
  const all = listDigests();
  const earlier = all.slice(1, 8);

  if (!latest) {
    return (
      <main className="mx-auto w-full max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-semibold">No digests yet</h1>
        <p className="mt-2 text-zinc-600">
          Add a digest to <code className="font-mono">digests/</code> to see it here.
        </p>
      </main>
    );
  }

  const body = readDigest(latest.slug);

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12">
      <header className="mb-8 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          Top 10 News
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Updated {formatDigestDate(latest.date)} &middot; 96-hour rolling window
        </p>
      </header>

      <article className="prose prose-zinc max-w-none dark:prose-invert prose-headings:font-semibold prose-h1:hidden prose-table:text-sm prose-th:bg-zinc-100 prose-th:text-left dark:prose-th:bg-zinc-800 prose-td:align-top prose-a:text-amber-700 dark:prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            a: ({ href, children, ...props }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              >
                {children}
              </a>
            ),
          }}
        >
          {body}
        </ReactMarkdown>
      </article>

      {earlier.length > 0 && (
        <section className="mt-12 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            Earlier digests
          </h2>
          <ul className="space-y-1.5 text-sm">
            {earlier.map((d) => (
              <li key={d.slug}>
                <Link
                  href={`/${d.slug}`}
                  className="text-zinc-700 hover:text-amber-700 dark:text-zinc-300 dark:hover:text-amber-400"
                >
                  {formatDigestDate(d.date)}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="mt-16 border-t border-zinc-200 pt-6 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-500">
        Curated by Minjae Lee. Each cycle pulls from primary sources (company
        press, X tweets, YouTube, analyst posts). Source links open in a new tab.
      </footer>
    </main>
  );
}
