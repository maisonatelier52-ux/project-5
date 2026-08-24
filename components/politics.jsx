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
    <section className="bg-[#0A0A0F] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 flex items-center gap-2 sm:mb-6">
          <span className="h-4 w-1 rounded-full bg-violet-400" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Latest in Politics</h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stories.map((story) => (
            <article key={story.slug} className="group">
              <Link href={`/politics/${story.slug}`} className="relative block aspect-[4/3] overflow-hidden rounded-xl border border-white/10">
                <img src={story.image} alt={story.title} className="h-full w-full object-cover transition duration-300 group-hover:scale-105"/>
                <span className="absolute left-3 top-3 rounded bg-black/60 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-rose-300 backdrop-blur">
                  Politics
                </span>
              </Link>

              <div className="mt-3 flex items-start justify-between gap-2">
                <Link href={`/politics/${story.slug}`}>
                  <h3 className="text-base font-semibold leading-snug text-white transition group-hover:text-violet-300">
                    {story.title}
                  </h3>
                </Link>
                <button
                  aria-label="Save story"
                  onClick={(e) => e.preventDefault()}
                  className="mt-0.5 shrink-0 text-white/30 transition hover:text-white"
                >
                  <Bookmark size={16} />
                </button>
              </div>

              <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-white/50">
                {story.dek}
              </p>

              <div className="mt-3 flex items-center gap-2 text-xs text-white/40">
                <span>By {story.author}</span>
                <span className="text-white/20">•</span>
                <span>{formatDate(story.date)}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}