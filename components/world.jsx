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

  return unique.sort((a, b) => parseDate(b.date) - parseDate(a.date));
}

export default function World() {
  const articles = getWorldArticles();
  const [featured, ...rest] = articles;

  if (!featured) return null;

  const trending = rest.slice(0, 5);

  return (
    <section className="border-b border-rule-strong bg-paper px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_360px] lg:gap-14">
        {/* Lead story */}
        <Link href={`/world/${featured.slug}`} className="group block">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-masthead-red">
            World — Top Story
          </span>

          <h1 className="mt-3 font-serif text-3xl font-semibold leading-[1.1] tracking-tight text-ink transition group-hover:text-masthead-red sm:text-4xl lg:text-5xl">
            {featured.title}
          </h1>

          <p className="mt-4 max-w-2xl font-serif text-lg italic leading-snug text-ink-soft sm:text-xl">
            {featured.dek}
          </p>

          <div className="mt-6 aspect-[16/10] w-full overflow-hidden border border-rule sm:aspect-[16/9]">
            <img
              src={featured.image}
              alt={featured.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 font-sans text-sm text-ink-soft">
            <span>By {featured.author}</span>
            <span className="text-ink-faint">·</span>
            <span>{estimateReadTime(featured.body)}</span>
          </div>
        </Link>

        {/* More World News */}
        <div className="lg:border-l lg:border-rule lg:pl-10">
          <div className="mb-5 flex items-center justify-between border-b-2 border-rule-strong pb-2">
            <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.15em] text-ink">
              More World News
            </h2>
          </div>

          <ol className="flex flex-col">
            {trending.map((item, i) => (
              <li
                key={item.slug}
                className={`flex gap-4 py-4 ${i !== 0 ? "border-t border-rule" : "pt-0"}`}
              >
                <span className="font-serif text-2xl font-semibold leading-none text-ink-faint">
                  {i + 1}
                </span>
                <Link href={`/world/${item.slug}`} className="group min-w-0">
                  <p className="font-serif text-base font-semibold leading-snug text-ink transition group-hover:text-masthead-red">
                    {item.title}
                  </p>
                  <p className="mt-1.5 font-sans text-xs text-ink-faint">
                    World <span className="mx-1">·</span> {formatDate(item.date)}
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
