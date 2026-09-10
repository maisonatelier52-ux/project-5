"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";

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

// All Politics articles, newest first, de-duplicated by slug
function getPoliticsArticles() {
  const posts = articleData.politics || [];

  const seen = new Set();
  const unique = posts.filter((p) => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });

  return unique.sort((a, b) => parseDate(b.date) - parseDate(a.date));
}

export default function Politics() {
  const stories = getPoliticsArticles().slice(0, 4);

  if (stories.length === 0) return null;

  return (
    <section className="border-b border-rule-strong bg-paper px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-end justify-between border-b-2 border-rule-strong pb-2">
          <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.15em] text-ink">
            Latest in Politics
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {stories.map((story) => (
            <article key={story.slug} className="group">
              <Link href={`/politics/${story.slug}`} className="relative block aspect-[4/3] overflow-hidden border border-rule">
                <img
                  src={story.image}
                  alt={story.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </Link>

              <div className="mt-3 flex items-start justify-between gap-2">
                <div>
                  <span className="font-sans text-[11px] font-semibold uppercase tracking-wider text-masthead-red">
                    Politics
                  </span>
                  <Link href={`/politics/${story.slug}`}>
                    <h3 className="mt-1 font-serif text-lg font-semibold leading-snug text-ink transition group-hover:text-masthead-red">
                      {story.title}
                    </h3>
                  </Link>
                </div>
                <button
                  aria-label="Save story"
                  onClick={(e) => e.preventDefault()}
                  className="mt-1 shrink-0 text-ink-faint transition hover:text-ink"
                >
                  <Bookmark size={16} />
                </button>
              </div>

              <p className="mt-1.5 line-clamp-2 font-serif text-sm leading-relaxed text-ink-soft">
                {story.dek}
              </p>

              <div className="mt-3 flex items-center gap-2 font-sans text-xs text-ink-faint">
                <span>By {story.author}</span>
                <span>·</span>
                <span>{formatDate(story.date)}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
