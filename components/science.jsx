import Link from "next/link";
import { Clock } from "lucide-react";

// Adjust this path if this file moves relative to /public/data
import articleData from "../public/data/article.json";

const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/");
  return new Date(year, month - 1, day);
};

const formatDate = (dateStr) =>
  parseDate(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

// All Science articles, newest first, de-duplicated by slug
function getScienceArticles() {
  const posts = articleData.science || [];

  const seen = new Set();
  const unique = posts.filter((p) => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });

  return unique.sort((a, b) => parseDate(b.date) - parseDate(a.date));
}

export default function Science() {
  const articles = getScienceArticles();

  if (articles.length === 0) return null;

  return (
    <section className="bg-[#0A0A0F] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-center justify-between sm:mb-6">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 animate-pulse rounded-full bg-violet-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Science</h2>
          </div>
          <Link href="/science" className="text-xs font-medium text-white/40 transition hover:text-white">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {articles.map((item, i) => (
            <Link
              key={item.slug}
              href={`/science/${item.slug}`}
              className="group flex items-center gap-4 rounded-xl border border-white/10 p-3 transition hover:border-white/20 hover:bg-white/[0.03]"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg sm:h-20 sm:w-20">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>

              <div className="min-w-0 flex-1">
                <span className="inline-block rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                  Science
                </span>
                <p className="mt-1.5 line-clamp-2 text-sm font-medium leading-snug text-white transition group-hover:text-violet-300">
                  {item.title}
                </p>
                <span className="mt-1.5 flex items-center gap-1.5 text-xs text-white/40">
                  <Clock size={11} />
                  {formatDate(item.date)}
                  {i === 0 && (
                    <span className="ml-1.5 rounded-full bg-violet-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-violet-300">
                      JUST IN
                    </span>
                  )}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}