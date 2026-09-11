import Link from "next/link";

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

// All US articles, newest first, de-duplicated by slug
function getUSArticles() {
  const posts = articleData.us || [];

  const seen = new Set();
  const unique = posts.filter((p) => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });

  return unique.sort((a, b) => parseDate(b.date) - parseDate(a.date));
}

export default function US() {
  const articles = getUSArticles();

  if (articles.length === 0) return null;

  return (
    <section className="border-b border-rule-strong bg-paper px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-end justify-between border-b-2 border-rule-strong pb-2">
          <h2 className="font-sans text-2xl font-semibold uppercase tracking-[0.15em] text-ink">
            U.S.
          </h2>
          <Link href="/us" className="font-sans text-xs font-medium text-ink-soft transition hover:text-ink">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-x-10 lg:grid-cols-2">
          {articles.map((item, i) => (
            <Link
              key={item.slug}
              href={`/us/${item.slug}`}
              className={`group flex items-center gap-4 py-4 ${
                i < articles.length - 2 ? "border-b border-rule" : ""
              } ${i === 1 || i === 3 || i === 5 ? "lg:pl-10" : ""}`}
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden border border-rule sm:h-20 sm:w-20">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="min-w-0 flex-1">
                <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-masthead-red">
                  U.S.
                  {i === 0 && <span className="ml-2 text-gold">· Just In</span>}
                </span>
                <p className="mt-1 line-clamp-2 font-serif text-base font-semibold leading-snug text-ink transition group-hover:text-masthead-red">
                  {item.title}
                </p>
                <span className="mt-1.5 flex items-center gap-1.5 font-sans text-xs text-ink-faint">
                  {formatDate(item.date)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}