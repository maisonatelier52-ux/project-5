import Link from "next/link";

// Adjust this path if this file moves relative to /public/data
import articleData from "../public/data/article.json";

const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/");
  return new Date(year, month - 1, day);
};

// Cycles through a small palette so cards still read as visually varied,
// even though every article here is Tech.
const TAG_PALETTE = [
  "text-violet-300 bg-violet-500/10",
  "text-sky-300 bg-sky-500/10",
  "text-rose-300 bg-rose-500/10",
  "text-emerald-300 bg-emerald-500/10",
  "text-amber-300 bg-amber-500/10",
];

// Rough read-time estimate from how many content blocks the article has
const estimateReadTime = (body) => {
  const blocks = (body || []).filter((b) => b.type !== "image").length;
  return `${Math.max(3, blocks * 4)} min read`;
};

// All Technology articles, newest first, de-duplicated by slug
function getTechArticles() {
  const posts = articleData.tech || [];

  const seen = new Set();
  const unique = posts.filter((p) => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });

  return unique.sort((a, b) => parseDate(b.date) - parseDate(a.date));
}

export default function Technology() {
  const articles = getTechArticles().slice(0, 5);

  if (articles.length === 0) return null;

  return (
    <section className="bg-[#0A0A0F] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-center gap-2 sm:mb-6">
          <span className="h-4 w-1 rounded-full bg-violet-400" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Technology</h2>
        </div>

        <div className="flex flex-wrap justify-center gap-5">
          {articles.map((item, i) => (
            <Link
              key={item.slug}
              href={`/tech/${item.slug}`}
              className="group flex w-full gap-4 rounded-xl border border-white/10 p-4 transition hover:border-white/20 sm:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-0.834rem)]"
            >
              <div className="h-24 w-24 shrink-0 overflow-hidden rounded-lg sm:h-28 sm:w-28">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105"/>
              </div>

              <div className="flex flex-col justify-center">
                <span
                  className={`w-fit rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                    TAG_PALETTE[i % TAG_PALETTE.length]
                  }`}
                >
                  {(item.tags && item.tags[0]) || "Tech"}
                </span>
                <h3 className="mt-2 text-sm font-semibold leading-snug text-white transition group-hover:text-violet-300 sm:text-base">
                  {item.title}
                </h3>
                <span className="mt-2 text-xs text-white/40">
                  {estimateReadTime(item.body)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}