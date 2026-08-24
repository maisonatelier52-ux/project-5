import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";

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

// Rough read-time estimate from how many paragraph/quote blocks the article has
const estimateReadTime = (body) => {
  const blocks = (body || []).filter((b) => b.type !== "image").length;
  return `${Math.max(3, blocks * 2)} min read`;
};

// All World articles, newest first, de-duplicated by slug
function getWorldArticles() {
  const posts = articleData.world || [];

  const seen = new Set();
  const unique = posts.filter((p) => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });

  return unique.sort(
    (a, b) => parseDate(b.date) - parseDate(a.date)
  );
}

export default function World() {
  const articles = getWorldArticles();
  const [featured, ...rest] = articles;

  if (!featured) return null;

  const trending = rest.slice(0, 5);

  return (
    <section className="bg-[#0A0A0F] px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <div className="mx-auto grid max-w-7xl gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Top story card */}
        <Link
          href={`/world/${featured.slug}`}
          className="group relative lg:col-span-2 aspect-[3/4] overflow-hidden rounded-xl border border-white/10 sm:aspect-[16/9] lg:rounded-2xl"
        >
          <img
            src={featured.image}
            alt={featured.title}
            className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />

          <div className="relative flex h-full flex-col justify-end p-4 sm:p-6 lg:p-10">
            <span className="mb-2.5 inline-block w-fit rounded bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur sm:mb-4 sm:px-3 sm:text-[11px]">
              Top Story
            </span>

            <h1 className="max-w-lg text-xl font-extrabold leading-[1.25] tracking-tight text-white sm:text-2xl sm:leading-[1.2] lg:text-3xl">
              {featured.title}
            </h1>

            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70 sm:mt-4 sm:text-[15px] lg:text-base">
              {featured.dek}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-white/60 sm:mt-5 sm:gap-3 sm:text-sm">
              <span>By {featured.author}</span>
              <span className="text-white/30">•</span>
              <span>{estimateReadTime(featured.body)}</span>
            </div>

            <span className="mt-5 flex w-fit items-center gap-2 rounded-lg bg-violet-500 px-4 py-2 text-xs font-semibold text-white transition group-hover:bg-violet-400 sm:mt-6 sm:px-5 sm:py-2.5 sm:text-sm">
              Read Story
              <ArrowRight size={16} />
            </span>
          </div>
        </Link>

        {/* Trending sidebar — remaining World articles, newest first, no repeats */}
        <div className="rounded-xl border border-white/10 p-5 sm:p-6 lg:rounded-2xl">
          <div className="mb-4 flex items-center gap-2 sm:mb-5">
            <TrendingUp size={18} className="text-violet-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">More World News</h2>
          </div>

          <ol className="flex flex-col">
            {trending.map((item, i) => (
              <li
                key={item.slug}
                className={`flex gap-3 py-3.5 sm:gap-4 sm:py-4 ${
                  i !== 0 ? "border-t border-white/10" : "pt-0"
                }`}
              >
                <span className="w-6 shrink-0 text-base font-bold text-white/25 sm:text-lg">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Link href={`/world/${item.slug}`} className="group min-w-0">
                  <p className="text-[13px] font-medium leading-snug text-white transition group-hover:text-violet-300 sm:text-sm">
                    {item.title}
                  </p>
                  <p className="mt-1.5 text-xs text-white/40">
                    World <span className="mx-1">•</span> {formatDate(item.date)}
                  </p>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}