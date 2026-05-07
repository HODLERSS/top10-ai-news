import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {
  formatDigestDate,
  listDigests,
  readDigest,
} from "@/lib/digests";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return listDigests().map((d) => ({ timestamp: d.slug }));
}

type Props = { params: Promise<{ timestamp: string }> };

export default async function DigestPage({ params }: Props) {
  const { timestamp } = await params;
  const all = listDigests();
  const meta = all.find((d) => d.slug === timestamp);
  if (!meta) notFound();

  const body = readDigest(timestamp);
  const earlier = all.filter((d) => d.slug !== timestamp).slice(0, 7);

  return (
    <main className="mx-auto w-full max-w-4xl px-6 py-12">
      <header className="mb-8 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          Top 10 News
        </h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Snapshot from {formatDigestDate(meta.date)}
        </p>
        <Link
          href="/"
          className="mt-4 inline-block text-sm text-amber-700 hover:underline dark:text-amber-400"
        >
          &larr; Latest digest
        </Link>
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
            Other digests
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
    </main>
  );
}
