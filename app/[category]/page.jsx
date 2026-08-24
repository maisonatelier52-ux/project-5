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
    <main className="bg-[#0A0A0F] px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <nav className="mb-4 text-xs text-white/40">
          <Link href="/" className="hover:text-white/70">Home</Link>
          <span className="mx-2">/</span>
          <span className="capitalize text-white/60">{category}</span>
        </nav>

        {/* Category header */}
        <div className="mb-8 border-b border-white/10 pb-6">
          <h1 className="text-3xl font-black capitalize tracking-tight text-white sm:text-4xl">
            {category}
          </h1>
          <p className="mt-2 text-sm text-white/50 sm:text-base">
            The latest {category} news, analysis, and in-depth reporting.
          </p>
        </div>

        {!featured ? (
          <p className="py-10 text-center text-sm text-white/40">No articles found in this category yet.</p>
        ) : (
          <>
            {/* Featured article */}
            <Link href={`/${featured.category}/${featured.slug}`} className="group mb-10 block">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-center">
                <div className="aspect-[16/10] overflow-hidden rounded-2xl border border-white/10">
                  <img src={featured.image} alt={featured.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105"/>
                </div>
                <div>
                  <span className="rounded bg-violet-500/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-violet-300">
                    Top Story
                  </span>
                  <h2 className="mt-4 text-2xl font-black leading-[1.15] text-white transition group-hover:text-violet-300 sm:text-3xl">
                    {featured.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/50 sm:text-base">
                    {featured.excerpt}
                  </p>
                  <p className="mt-4 text-xs text-white/40">
                    By {featured.author} <span className="mx-1">•</span>{" "}
                    {featured.date}
                  </p>
                </div>
              </div>
            </Link>

            {rest.length > 0 && (
              <>
                {/* Article grid */}
                <div className="mb-4 flex items-center gap-2">
                  <span className="h-4 w-1 rounded-full bg-violet-400" />
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
                    More in {category}
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map((article) => (
                    <Link
                      key={article.slug}
                      href={`/${article.category}/${article.slug}`}
                      className="group"
                    >
                      <div className="aspect-[4/3] overflow-hidden rounded-xl border border-white/10">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      </div>
                      <h3 className="mt-3 text-base font-semibold leading-snug text-white transition group-hover:text-violet-300">
                        {article.title}
                      </h3>
                      <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-white/50">
                        {article.excerpt}
                      </p>
                      <p className="mt-3 text-xs text-white/40">
                        By {article.author} <span className="mx-1">•</span>{" "}
                        {article.date}
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