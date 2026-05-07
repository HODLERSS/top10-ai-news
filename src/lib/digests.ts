import fs from "fs";
import path from "path";

const DIGESTS_DIR = path.join(process.cwd(), "digests");
const FILENAME_RE = /^(\d{8})_(\d{4})\.md$/;

export type DigestMeta = {
  slug: string;
  filename: string;
  date: Date;
};

function parseDate(filename: string): Date {
  const m = filename.match(FILENAME_RE)!;
  const [, ymd, hm] = m;
  return new Date(
    `${ymd.slice(0, 4)}-${ymd.slice(4, 6)}-${ymd.slice(6, 8)}T${hm.slice(0, 2)}:${hm.slice(2, 4)}:00`
  );
}

export function listDigests(): DigestMeta[] {
  if (!fs.existsSync(DIGESTS_DIR)) return [];
  return fs
    .readdirSync(DIGESTS_DIR)
    .filter((f) => FILENAME_RE.test(f))
    .sort()
    .reverse()
    .map((filename) => ({
      slug: filename.replace(/\.md$/, ""),
      filename,
      date: parseDate(filename),
    }));
}

export function readDigest(slug: string): string {
  const filename = `${slug}.md`;
  if (!FILENAME_RE.test(filename)) {
    throw new Error(`Invalid digest slug: ${slug}`);
  }
  return fs.readFileSync(path.join(DIGESTS_DIR, filename), "utf-8");
}

export function getLatestDigest(): DigestMeta | null {
  return listDigests()[0] ?? null;
}

export function formatDigestDate(date: Date): string {
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
