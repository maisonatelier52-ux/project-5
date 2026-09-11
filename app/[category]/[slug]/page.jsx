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

// Turns a DD/MM/YYYY date into a relative "time ago" label for the
// Trending sidebar (day-level granularity, since that's all article.json has).
const timeAgo = (dateStr) => {
  const then = parseDate(dateStr).getTime();
  const diffMs = Date.now() - then;
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
};

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

// Most recent N articles across every category in article.json, excluding
// the article currently being viewed, de-duplicated by slug, newest first.
function getTrending(currentCategory, currentSlug, limit = 4) {
  const all = Object.entries(articleData).flatMap(([catKey, posts]) =>
    (posts || []).map((p) => ({ ...p, catKey }))
  );

  const seen = new Set();
  const unique = all.filter((p) => {
    if (p.catKey === currentCategory && p.slug === currentSlug) return false;
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });

  return unique
    .sort((a, b) => parseDate(b.date) - parseDate(a.date))
    .slice(0, limit)
    .map((p) => ({
      href: `/${p.categorySlug || p.catKey}/${p.slug}`,
      title: p.title,
      time: timeAgo(p.date),
    }));
}

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
  const trending = getTrending(category, slug);

  let firstParagraphUsed = false;

  return (
    <main className="bg-paper">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-[1fr_340px] lg:items-start lg:px-10">
        {/* Article */}
        <article className="mx-auto w-full max-w-3xl lg:mx-0">
          {/* Breadcrumb */}
          <nav className="mb-5 font-sans text-xs text-ink-faint">
            <Link href="/" className="hover:text-ink">Home</Link>
            <span className="mx-2">/</span>
            <Link href={`/${article.category}`} className="capitalize hover:text-ink">
              {article.category}
            </Link>
          </nav>

          {/* Header */}
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-masthead-red">
            {article.category}
          </span>

          <h1 className="mt-4 font-serif text-3xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-4xl lg:text-5xl">
            {article.title}
          </h1>

          <p className="mt-4 font-serif text-lg italic leading-relaxed text-ink-soft sm:text-xl">
            {article.excerpt}
          </p>

          {/* Byline row */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-rule-strong py-4">
            <div className="flex items-center gap-3">
              {article.authorAvatar ? (
                <img src={article.authorAvatar} alt={article.author} className="h-10 w-10 shrink-0 rounded-full object-cover" />
              ) : (
                <div className="h-10 w-10 shrink-0 rounded-full bg-paper-shade" />
              )}
              <div>
                <p className="font-sans text-sm font-medium text-ink">
                  {article.authorSlug ? (
                    <Link href={`/authors/${article.authorSlug}`} className="transition hover:text-masthead-red">
                      {article.author}
                    </Link>
                  ) : (
                    article.author
                  )}
                </p>
                <p className="font-sans text-xs text-ink-faint">{article.authorRole}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 font-sans text-xs text-ink-faint">
              <span>{article.date}</span>
              <span>·</span>
              <span>{article.readTime}</span>
            </div>

            <div className="flex items-center gap-1">
              <button aria-label="Share on Twitter" className="p-2 text-ink-faint transition hover:text-ink">
                <TwitterIcon className="h-4 w-4" />
              </button>
              <button aria-label="Share on LinkedIn" className="p-2 text-ink-faint transition hover:text-ink">
                <LinkedinIcon className="h-4 w-4" />
              </button>
              <button aria-label="Copy link" className="p-2 text-ink-faint transition hover:text-ink">
                <LinkIcon size={16} />
              </button>
              <button aria-label="Save article" className="p-2 text-ink-faint transition hover:text-ink">
                <Bookmark size={16} />
              </button>
            </div>
          </div>

          {/* Hero image */}
          {article.heroImage && (
            <figure className="mt-8 overflow-hidden border border-rule">
              <img src={article.heroImage} alt={article.title} className="aspect-[16/9] w-full object-cover" />
            </figure>
          )}

          {/* Body — rendered from JSON content blocks */}
          <div className="mt-8 space-y-6 font-serif text-[19px] leading-[1.75] text-ink">
            {article.body.map((block, i) => {
              if (block.type === "paragraph") {
                const isFirst = !firstParagraphUsed;
                if (isFirst) firstParagraphUsed = true;
                return (
                  <p key={i} className={isFirst ? "drop-cap" : undefined}>
                    {block.text}
                  </p>
                );
              }
              if (block.type === "heading") {
                return (
                  <h2 key={i} className="pt-2 font-serif text-2xl font-semibold text-ink">
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "quote") {
                return (
                  <blockquote key={i} className="border-l-2 border-masthead-red py-1 pl-6 font-serif text-2xl italic leading-snug text-ink">
                    {block.text}
                  </blockquote>
                );
              }
              if (block.type === "image") {
                return (
                  <figure key={i} className="overflow-hidden border border-rule">
                    <img src={block.src} alt="" className="w-full object-cover" />
                    {block.caption && (
                      <figcaption className="border-t border-rule px-4 py-2 font-sans text-xs text-ink-faint">
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
            <div className="mt-10 flex flex-wrap gap-2 border-t border-rule pt-6">
              {article.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/tags/${tag.toLowerCase()}`}
                  className="border border-rule px-3 py-1 font-sans text-xs text-ink-soft transition hover:border-ink hover:text-ink"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </article>

        {/* Sticky sidebar */}
        <aside className="flex flex-col gap-8 lg:sticky lg:top-8">
          {/* Trending mini list */}
          <div className="border border-rule-strong p-5">
            <div className="mb-4 flex items-center gap-2 border-b border-rule pb-3">
              <TrendingUp size={15} className="text-masthead-red" />
              <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-ink">Trending Now</h2>
            </div>
            <ol className="flex flex-col divide-y divide-rule">
              {trending.map((item, i) => (
                <li key={item.href} className={i !== 0 ? "pt-3" : ""}>
                  <Link href={item.href} className="group flex gap-3 pb-3 last:pb-0">
                    <span className="font-serif text-lg font-semibold leading-none text-ink-faint">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-serif text-sm font-semibold leading-snug text-ink transition group-hover:text-masthead-red">
                        {item.title}
                      </p>
                      <p className="mt-1 font-sans text-xs text-ink-faint">{item.time}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          {/* Ad slot */}
          <div className="overflow-hidden border border-rule">
            <span className="block px-3 pt-2 font-sans text-[10px] uppercase tracking-wider text-ink-faint">
              Advertisement
            </span>
            <a href="#" className="block">
              <img src="https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?q=80&w=600&auto=format&fit=crop" alt="Advertisement" className="mt-2 aspect-[3/4] w-full object-cover"/>
            </a>
          </div>

          {/* Author info card */}
          {article.author && (
            <div className="border border-rule-strong p-5">
              <div className="flex items-center gap-3">
                {article.authorAvatar ? (
                  <img src={article.authorAvatar} alt={article.author} className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-paper-shade" />
                )}
                <div>
                  <p className="font-serif text-base font-semibold text-ink">
                    {article.authorSlug ? (
                      <Link href={`/authors/${article.authorSlug}`} className="transition hover:text-masthead-red">
                        {article.author}
                      </Link>
                    ) : (
                      article.author
                    )}
                  </p>
                  <p className="font-sans text-xs text-ink-faint">{article.authorRole}</p>
                </div>
              </div>

              {article.authorBio && (
                <p className="mt-4 font-serif text-sm leading-relaxed text-ink-soft">
                  {article.authorBio}
                </p>
              )}

              <div className="mt-4 flex items-center gap-2">
                <a href="#" aria-label="Twitter" className="border border-rule p-2 text-ink-soft transition hover:border-ink hover:text-ink">
                  <TwitterIcon className="h-3.5 w-3.5" />
                </a>
                <a href="#" aria-label="LinkedIn" className="border border-rule p-2 text-ink-soft transition hover:border-ink hover:text-ink">
                  <LinkedinIcon className="h-3.5 w-3.5" />
                </a>
                <a href="#" aria-label="Website" className="border border-rule p-2 text-ink-soft transition hover:border-ink hover:text-ink">
                  <LinkIcon size={14} />
                </a>
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="border-t border-rule-strong px-4 py-12 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-6 border-b-2 border-rule-strong pb-2 font-sans text-sm font-semibold uppercase tracking-[0.15em] text-ink">
              Related Stories
            </h2>
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-3">
              {related.map((item) => (
                <Link key={item.href} href={item.href} className="group block">
                  <div className="aspect-[4/3] overflow-hidden border border-rule">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/>
                  </div>
                  <span className="mt-3 block font-sans text-[11px] font-semibold uppercase tracking-wider text-masthead-red capitalize">
                    {article.category}
                  </span>
                  <h3 className="mt-1 font-serif text-base font-semibold leading-snug text-ink transition group-hover:text-masthead-red">
                    {item.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}