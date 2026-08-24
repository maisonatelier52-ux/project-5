import Link from "next/link";
import { Bookmark, Link as LinkIcon, TrendingUp } from "lucide-react";

// Adjust these paths if this file moves relative to /public/data
import articleData from "../../../public/data/article.json";
import authorData from "../../../public/data/author.json";

const TwitterIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7.1l-5.5-7.2L4.4 22H1.3l8.1-9.3L1 2h7.3l5 6.6L18.9 2Zm-1.2 18h1.9L7.4 4h-2l12.3 16Z" />
  </svg>
);

const LinkedinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
  </svg>
);

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

// Looks up the article matching { category, slug } in article.json, and
// merges in author details (bio, avatar, slug) from author.json by name.
function getArticle(category, slug) {
  const post = (articleData[category] || []).find((p) => p.slug === slug);

  if (!post) {
    return {
      category,
      slug,
      title: "Article not found",
      excerpt: "",
      author: "",
      authorSlug: "",
      authorRole: "",
      authorBio: "",
      authorAvatar: "",
      date: "",
      readTime: "",
      heroImage: "",
      tags: [],
      body: [],
    };
  }

  const authorInfo = authorData[post.author] || {};

  return {
    category: post.categorySlug || category,
    slug: post.slug,
    title: post.title,
    excerpt: post.dek,
    author: post.author,
    authorSlug: authorInfo.slug || "",
    authorRole: authorInfo.role || "",
    authorBio: authorInfo.bio || "",
    authorAvatar: authorInfo.avatar || "",
    date: formatDate(post.date),
    readTime: "6 min read",
    heroImage: post.image,
    tags: post.tags || [post.category],
    body: post.body || [],
  };
}

// Up to 3 other articles from the same category, excluding the current one
function getRelated(category, slug) {
  return (articleData[category] || [])
    .filter((p) => p.slug !== slug)
    .slice(0, 3)
    .map((p) => ({
      href: `/${p.categorySlug || category}/${p.slug}`,
      image: p.image,
      title: p.title,
    }));
}

const TRENDING = [
  { title: "AI tools that are changing how we work", time: "18m ago" },
  { title: "Inside the world's most extreme climates", time: "1h ago" },
  { title: "Elections 2026: Key races to watch", time: "2h ago" },
  { title: "The hidden cost of fast fashion", time: "3h ago" },
];

export async function generateMetadata({ params }) {
  const { category, slug } = await params;
  const article = getArticle(category, slug);
  return {
    title: article.title,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }) {
  const { category, slug } = await params;
  const article = getArticle(category, slug);
  const related = getRelated(category, slug);

  return (
    <main className="bg-[#0A0A0F]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[1fr_340px] lg:items-start lg:px-10">
        {/* Article */}
        <article className="mx-auto w-full max-w-3xl lg:mx-0">
          {/* Breadcrumb */}
          <nav className="mb-5 text-xs text-white/40">
            <Link href="/" className="hover:text-white/70">Home</Link>
            <span className="mx-2">/</span>
            <Link href={`/${article.category}`} className="capitalize hover:text-white/70">
              {article.category}
            </Link>
          </nav>

          {/* Header */}
          <span className="inline-block rounded bg-violet-500/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider text-violet-300 capitalize">
            {article.category}
          </span>

          <h1 className="mt-4 text-3xl font-black leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>

          <p className="mt-4 text-base leading-relaxed text-white/60 sm:text-lg">
            {article.excerpt}
          </p>

          {/* Byline row */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-white/10 py-4">
            <div className="flex items-center gap-3">
              {article.authorAvatar ? (
                <img src={article.authorAvatar} alt={article.author} className="h-10 w-10 shrink-0 rounded-full object-cover"/>
              ) : (
                <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-violet-400 to-violet-700" />
              )}
              <div>
                <p className="text-sm font-medium text-white">
                  {article.authorSlug ? (
                    <Link href={`/authors/${article.authorSlug}`} className="transition hover:text-violet-300">
                      {article.author}
                    </Link>
                  ) : (
                    article.author
                  )}
                </p>
                <p className="text-xs text-white/40">{article.authorRole}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-white/40">
              <span>{article.date}</span>
              <span className="text-white/20">•</span>
              <span>{article.readTime}</span>
            </div>

            <div className="flex items-center gap-1">
              <button aria-label="Share on Twitter" className="rounded-full p-2 text-white/50 transition hover:bg-white/5 hover:text-white">
                <TwitterIcon className="h-4 w-4" />
              </button>
              <button aria-label="Share on LinkedIn" className="rounded-full p-2 text-white/50 transition hover:bg-white/5 hover:text-white">
                <LinkedinIcon className="h-4 w-4" />
              </button>
              <button aria-label="Copy link" className="rounded-full p-2 text-white/50 transition hover:bg-white/5 hover:text-white">
                <LinkIcon size={16} />
              </button>
              <button aria-label="Save article" className="rounded-full p-2 text-white/50 transition hover:bg-white/5 hover:text-white">
                <Bookmark size={16} />
              </button>
            </div>
          </div>

          {/* Hero image */}
          {article.heroImage && (
            <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
              <img src={article.heroImage} alt={article.title} className="aspect-[16/9] w-full object-cover"/>
            </div>
          )}

          {/* Body — rendered from JSON content blocks */}
          <div className="mt-8 space-y-6 text-[17px] leading-[1.8] text-white/80">
            {article.body.map((block, i) => {
              if (block.type === "paragraph") {
                return <p key={i}>{block.text}</p>;
              }
              if (block.type === "heading") {
                return (
                  <h2 key={i} className="pt-2 text-2xl font-bold text-white">
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "quote") {
                return (
                  <blockquote
                    key={i}
                    className="border-l-2 border-violet-400 pl-5 text-xl font-medium italic text-white/90"
                  >
                    "{block.text}"
                  </blockquote>
                );
              }
              if (block.type === "image") {
                return (
                  <figure key={i} className="overflow-hidden rounded-xl border border-white/10">
                    <img src={block.src} alt="" className="w-full object-cover" />
                    {block.caption && (
                      <figcaption className="border-t border-white/10 px-4 py-2 text-xs text-white/40">
                        {block.caption}
                      </figcaption>
                    )}
                  </figure>
                );
              }
              return null;
            })}
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2 border-t border-white/10 pt-6">
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${tag.toLowerCase()}`}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/50 transition hover:border-violet-400/40 hover:text-violet-300"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </article>

        {/* Sticky sidebar */}
        <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
          {/* Trending mini list */}
          <div className="rounded-xl border border-white/10 p-5">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-violet-400" />
              <h2 className="text-xs font-semibold uppercase tracking-wider text-white">Trending Now</h2>
            </div>
            <ol className="flex flex-col divide-y divide-white/10">
              {TRENDING.map((item, i) => (
                <li key={item.title} className={i !== 0 ? "pt-3" : ""}>
                  <a href="#" className="group flex gap-3 pb-3 last:pb-0">
                    <span className="text-sm font-bold text-white/25">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-sm font-medium leading-snug text-white transition group-hover:text-violet-300">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-white/40">{item.time}</p>
                    </div>
                  </a>
                </li>
              ))}
            </ol>
          </div>

          {/* Ad slot */}
          <div className="overflow-hidden rounded-xl border border-white/10">
            <span className="block px-3 pt-2 text-[10px] uppercase tracking-wider text-white/30">Advertisement</span>
            <a href="#" className="block">
              <img
                src="https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?q=80&w=600&auto=format&fit=crop"
                alt="Advertisement"
                className="mt-2 aspect-[3/4] w-full object-cover"
              />
            </a>
          </div>

          {/* Author info card */}
          {article.author && (
            <div className="rounded-xl border border-white/10 p-5">
              <div className="flex items-center gap-3">
                {article.authorAvatar ? (
                  <img
                    src={article.authorAvatar}
                    alt={article.author}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-violet-400/40"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-400 to-violet-700" />
                )}
                <div>
                  <p className="text-sm font-semibold text-white">
                    {article.authorSlug ? (
                      <Link href={`/authors/${article.authorSlug}`} className="transition hover:text-violet-300">
                        {article.author}
                      </Link>
                    ) : (
                      article.author
                    )}
                  </p>
                  <p className="text-xs text-white/40">{article.authorRole}</p>
                </div>
              </div>

              {article.authorBio && (
                <p className="mt-4 text-sm leading-relaxed text-white/60">
                  {article.authorBio}
                </p>
              )}

              <div className="mt-4 flex items-center gap-2">
                <a href="#" aria-label="Twitter" className="rounded-full border border-white/10 p-2 text-white/50 transition hover:border-violet-400/40 hover:text-violet-300">
                  <TwitterIcon className="h-3.5 w-3.5" />
                </a>
                <a href="#" aria-label="LinkedIn" className="rounded-full border border-white/10 p-2 text-white/50 transition hover:border-violet-400/40 hover:text-violet-300">
                  <LinkedinIcon className="h-3.5 w-3.5" />
                </a>
                <a href="#" aria-label="Website" className="rounded-full border border-white/10 p-2 text-white/50 transition hover:border-violet-400/40 hover:text-violet-300">
                  <LinkIcon size={14} />
                </a>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="border-t border-white/10 px-4 py-10 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">Related Stories</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              {related.map((item) => (
                <Link key={item.href} href={item.href} className="group overflow-hidden rounded-xl border border-white/10">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105"/>
                  </div>
                  <div className="p-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-violet-300 capitalize">
                      {article.category}
                    </span>
                    <h3 className="mt-1.5 text-sm font-semibold leading-snug text-white transition group-hover:text-violet-300">
                      {item.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}