import Link from "next/link";

// Adjust this path if this file moves relative to /public/data
import articleData from "../public/data/article.json";

const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/");
  return new Date(year, month - 1, day);
};

// Rough read-time estimate from how many content blocks the article has
const estimateReadTime = (body) => {
  const blocks = (body || []).filter((b) => b.type !== "image").length;
  return `${Math.max(3, blocks * 4)} min read`;
};

// All Finance articles, newest first, de-duplicated by slug
function getFinanceArticles() {
  const posts = articleData.finance || [];

  const seen = new Set();
  const unique = posts.filter((p) => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });

  return unique.sort((a, b) => parseDate(b.date) - parseDate(a.date));
}

export default function Finance() {
  const articles = getFinanceArticles().slice(0, 6);

  if (articles.length === 0) return null;

  return (
    <section className="border-b border-rule-strong bg-paper-shade px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-end justify-between border-b-2 border-rule-strong pb-2">
          <h2 className="font-sans text-2xl font-semibold uppercase tracking-[0.15em] text-ink">
            Finance
          </h2>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-6">
          {articles.map((item, i) => (
            <Link
              key={item.slug}
              href={`/finance/${item.slug}`}
              className={`group flex w-full gap-4 py-4 sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.334rem)] ${
                i < 3 ? "border-t border-rule" : "border-t border-rule sm:border-t-0 lg:border-t"
              }`}
            >
              <div className="h-24 w-24 shrink-0 overflow-hidden border border-rule sm:h-28 sm:w-28">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-col justify-center">
                <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-masthead-red">
                  {(item.tags && item.tags[0]) || "Finance"}
                </span>
                <h3 className="mt-2 font-serif text-base font-semibold leading-snug text-ink transition group-hover:text-masthead-red">
                  {item.title}
                </h3>
                <span className="mt-2 font-sans text-xs text-ink-faint">
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