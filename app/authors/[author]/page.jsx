import Link from "next/link";
import { Link as LinkIcon } from "lucide-react";

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

// Finds the author whose slug matches the route param (author.json is keyed by name, not slug)
function getAuthor(slug) {
  const entry = Object.entries(authorData).find(
    ([, info]) => info.slug === slug
  );

  if (!entry) return null;

  const [name, info] = entry;
  return {
    name,
    slug: info.slug,
    category: info.category || "",
    role: info.role || "",
    avatar: info.avatar || "",
    bio: info.bio || "",
    joined: info.joined || "",
  };
}

// Gets this author's articles from their assigned category in article.json
function getArticlesByAuthor(authorName, category) {
  const posts = articleData[category] || [];

  return posts
    .filter((post) => post.author === authorName)
    .map((post) => ({
      slug: post.slug,
      category: post.categorySlug || category,
      title: post.title,
      excerpt: post.dek,
      image: post.image,
      date: formatDate(post.date),
    }));
}

export async function generateMetadata({ params }) {
  const { author } = await params;
  const authorInfo = getAuthor(author);
  return {
    title: authorInfo ? authorInfo.name : "Author",
  };
}

export default async function AuthorPage({ params }) {
  const { author } = await params;
  const authorInfo = getAuthor(author);

  if (!authorInfo) {
    return (
      <main className="bg-[#0A0A0F] px-4 py-16 text-center">
        <p className="text-sm text-white/40">Author not found.</p>
      </main>
    );
  }

  const articles = getArticlesByAuthor(authorInfo.name, authorInfo.category);

  return (
    <main className="bg-[#0A0A0F] px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <nav className="mb-6 text-xs text-white/40">
          <Link href="/" className="hover:text-white/70">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-white/60">Authors</span>
          <span className="mx-2">/</span>
          <span className="text-white/60">{authorInfo.name}</span>
        </nav>

        {/* Author header */}
        <div className="flex flex-col items-start gap-6 border-b border-white/10 pb-8 sm:flex-row sm:items-center">
          {authorInfo.avatar ? (
            <img
              src={authorInfo.avatar}
              alt={authorInfo.name}
              className="h-20 w-20 shrink-0 rounded-full object-cover ring-4 ring-violet-400/20 sm:h-24 sm:w-24"
            />
          ) : (
            <div className="h-20 w-20 shrink-0 rounded-full bg-gradient-to-br from-violet-400 to-violet-700 ring-4 ring-violet-400/20 sm:h-24 sm:w-24" />
          )}

          <div className="flex-1">
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              {authorInfo.name}
            </h1>
            {authorInfo.role && (
              <div className="mt-1 flex items-center gap-2">
                <p className="text-sm text-violet-300">{authorInfo.role}</p>
                {authorInfo.category && (
                  <span className="rounded bg-violet-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-violet-300 capitalize">
                    {authorInfo.category}
                  </span>
                )}
              </div>
            )}
            {authorInfo.bio && (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/50 sm:text-base">
                {authorInfo.bio}
              </p>
            )}

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-white/40">
              <span>
                <span className="font-semibold text-white">
                  {articles.length}
                </span>{" "}
                articles
              </span>
              {authorInfo.joined && (
                <>
                  <span className="text-white/20">•</span>
                  <span>Joined {authorInfo.joined}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <a href="#" aria-label="Twitter" className="rounded-full border border-white/10 p-2.5 text-white/50 transition hover:border-violet-400/40 hover:text-violet-300">
              <TwitterIcon className="h-4 w-4" />
            </a>
            <a href="#" aria-label="LinkedIn" className="rounded-full border border-white/10 p-2.5 text-white/50 transition hover:border-violet-400/40 hover:text-violet-300">
              <LinkedinIcon className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Website" className="rounded-full border border-white/10 p-2.5 text-white/50 transition hover:border-violet-400/40 hover:text-violet-300">
              <LinkIcon size={16} />
            </a>
          </div>
        </div>

        {/* Articles by author */}
        <div className="mb-5 mt-8 flex items-center gap-2">
          <span className="h-4 w-1 rounded-full bg-violet-400" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Articles by {authorInfo.name}</h2>
        </div>

        {articles.length === 0 ? (
          <p className="py-10 text-center text-sm text-white/40">No articles from this author yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {articles.map((article) => (
              <Link key={article.slug} href={`/${article.category}/${article.slug}`} className="group">
                <div className="aspect-[4/3] overflow-hidden rounded-xl border border-white/10">
                  <img src={article.image} alt={article.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105"/>
                </div>
                <span className="mt-3 inline-block text-xs font-semibold uppercase tracking-wider text-violet-300 capitalize">
                  {article.category}
                </span>
                <h3 className="mt-1 text-sm font-semibold leading-snug text-white transition group-hover:text-violet-300">
                  {article.title}
                </h3>
                <p className="mt-3 text-xs text-white/40">{article.date}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}