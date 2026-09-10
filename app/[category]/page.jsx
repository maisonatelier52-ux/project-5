import Link from "next/link";

// Adjust this path if this file moves relative to /public/data
import articleData from "../../public/data/article.json";

const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/");
  return new Date(year, month - 1, day);
};

const formatDate = (dateStr) =>
  parseDate(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

// Pulls every article for this category from article.json
function getArticles(category) {
  return (articleData[category] || []).map((post) => ({
    slug: post.slug,
    category: post.categorySlug || category,
    title: post.title,
    excerpt: post.dek,
    author: post.author,
    date: formatDate(post.date),
    image: post.image,
  }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  return {
    title: `${category.charAt(0).toUpperCase()}${category.slice(1)} News`,
  };
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const articles = getArticles(category);
  const [featured, ...rest] = articles;

  return (
    <main className="bg-paper px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <nav className="mb-4 font-sans text-xs text-ink-faint">
          <Link href="/" className="hover:text-ink">Home</Link>
          <span className="mx-2">/</span>
          <span className="capitalize text-ink-soft">{category}</span>
        </nav>

        {/* Category header */}
        <div className="mb-10 border-b-2 border-rule-strong pb-6">
          <h1 className="font-serif text-4xl font-semibold capitalize tracking-tight text-ink sm:text-5xl">
            {category}
          </h1>
          <p className="mt-2 font-serif italic text-ink-soft sm:text-lg">
            The latest {category} news, analysis, and in-depth reporting.
          </p>
        </div>

        {!featured ? (
          <p className="py-10 text-center font-sans text-sm text-ink-faint">
            No articles found in this category yet.
          </p>
        ) : (
          <>
            {/* Featured article */}
            <Link href={`/${featured.category}/${featured.slug}`} className="group mb-12 block">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-center lg:gap-10">
                <div className="aspect-[16/10] overflow-hidden border border-rule">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div>
                  <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-masthead-red">
                    Top Story
                  </span>
                  <h2 className="mt-3 font-serif text-2xl font-semibold leading-[1.15] text-ink transition group-hover:text-masthead-red sm:text-3xl">
                    {featured.title}
                  </h2>
                  <p className="mt-3 font-serif italic leading-relaxed text-ink-soft sm:text-lg">
                    {featured.excerpt}
                  </p>
                  <p className="mt-4 font-sans text-xs text-ink-faint">
                    By {featured.author} <span className="mx-1">·</span> {featured.date}
                  </p>
                </div>
              </div>
            </Link>

            {rest.length > 0 && (
              <>
                <div className="mb-6 border-b-2 border-rule-strong pb-2">
                  <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.15em] text-ink">
                    More in {category}
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((article) => (
                    <Link key={article.slug} href={`/${article.category}/${article.slug}`} className="group">
                      <div className="aspect-[4/3] overflow-hidden border border-rule">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                      <h3 className="mt-3 font-serif text-lg font-semibold leading-snug text-ink transition group-hover:text-masthead-red">
                        {article.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 font-serif text-sm leading-relaxed text-ink-soft">
                        {article.excerpt}
                      </p>
                      <p className="mt-3 font-sans text-xs text-ink-faint">
                        By {article.author} <span className="mx-1">·</span> {article.date}
                      </p>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
