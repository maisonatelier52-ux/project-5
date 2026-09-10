import Link from "next/link";

// Adjust this path if this file moves relative to /public/data
import articleData from "../public/data/article.json";

const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/");
  return new Date(year, month - 1, day);
};

const formatDate = (dateStr) =>
  parseDate(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

// All Culture articles, newest first, de-duplicated by slug
function getCultureArticles() {
  const posts = articleData.culture || [];

  const seen = new Set();
  const unique = posts.filter((p) => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });

  return unique.sort((a, b) => parseDate(b.date) - parseDate(a.date));
}

export default function Culture() {
  const articles = getCultureArticles();
  const [featured, ...rest] = articles;

  if (!featured) return null;

  const sideStories = rest.slice(0, 3);

  return (
    <section className="bg-paper px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 border-b-2 border-rule-strong pb-2">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.15em] text-ink">
            Culture
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:items-stretch lg:gap-12">
          {/* Featured story */}
          <Link href={`/culture/${featured.slug}`} className="group lg:col-span-2">
            <div className="aspect-[4/3] overflow-hidden border border-rule">
              <img
                src={featured.image}
                alt={featured.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <h3 className="mt-4 font-serif text-2xl font-semibold leading-[1.15] text-ink transition group-hover:text-masthead-red sm:text-3xl">
              {featured.title}
            </h3>
            <p className="mt-3 font-serif text-base italic leading-relaxed text-ink-soft sm:text-lg">
              {featured.dek}
            </p>
            <p className="mt-4 font-sans text-xs text-ink-faint sm:text-sm">
              <span className="font-semibold text-ink">Culture</span> · By{" "}
              <span className="font-semibold text-gold">{featured.author}</span> ·{" "}
              {formatDate(featured.date)}
            </p>
          </Link>

          {/* Side stories */}
          {sideStories.length > 0 && (
            <div className="flex flex-col divide-y divide-rule lg:col-span-3">
              {sideStories.map((story, i) => (
                <Link
                  key={story.slug}
                  href={`/culture/${story.slug}`}
                  className={`group flex flex-col-reverse gap-5 sm:flex-row sm:items-start sm:justify-between ${
                    i === 0 ? "pb-6" : i === sideStories.length - 1 ? "pt-6" : "py-6"
                  }`}
                >
                  <div className="flex-1">
                    <h3 className="font-serif text-xl font-semibold leading-[1.15] text-ink transition group-hover:text-masthead-red sm:text-2xl">
                      {story.title}
                    </h3>
                    <p className="mt-3 font-serif leading-relaxed text-ink-soft">{story.dek}</p>
                    <p className="mt-4 font-sans text-xs text-ink-faint sm:text-sm">
                      <span className="font-semibold text-ink">Culture</span> · By{" "}
                      <span className="font-semibold text-gold">{story.author}</span> ·{" "}
                      {formatDate(story.date)}
                    </p>
                  </div>

                  <div className="aspect-[4/3] w-full shrink-0 overflow-hidden border border-rule sm:w-48 lg:w-56">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
