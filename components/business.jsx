"use client";

import { useState } from "react";
import Link from "next/link";

// Adjust this path if this file moves relative to /public/data
import articleData from "../public/data/article.json";

const parseDate = (dateStr) => {
  const [day, month, year] = dateStr.split("/");
  return new Date(year, month - 1, day);
};

// Rough read-time estimate from how many content blocks the article has
const estimateReadTime = (body) => {
  const blocks = (body || []).filter((b) => b.type !== "image").length;
  return `${Math.max(3, blocks * 4)} min read`;
};

// All Business articles, newest first, de-duplicated by slug
function getBusinessArticles() {
  const posts = articleData.business || [];

  const seen = new Set();
  const unique = posts.filter((p) => {
    if (seen.has(p.slug)) return false;
    seen.add(p.slug);
    return true;
  });

  return unique.sort((a, b) => parseDate(b.date) - parseDate(a.date));
}

export default function Business() {
  const [email, setEmail] = useState("");
  const articles = getBusinessArticles();
  const [featured, ...restArticles] = articles;
  const spotlights = restArticles.slice(0, 2);

  if (!featured) return null;

  return (
    <section className="border-b border-rule-strong bg-paper px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_320px] lg:gap-14">
        {/* Featured Business article */}
        <div>
          <div className="mb-5 border-b-2 border-rule-strong pb-2">
            <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.15em] text-ink">
              Business
            </h2>
          </div>

          <Link href={`/business/${featured.slug}`} className="group relative block aspect-[16/9] overflow-hidden border border-rule sm:aspect-[2/1]">
            <img
              src={featured.image}
              alt={featured.title}
              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
            />
          </Link>

          <Link href={`/business/${featured.slug}`} className="group mt-5 block">
            <h3 className="max-w-xl font-serif text-2xl font-semibold leading-snug text-ink transition group-hover:text-masthead-red sm:text-4xl">
              {featured.title}
            </h3>
            <p className="mt-3 max-w-lg font-serif text-lg italic leading-relaxed text-ink-soft">
              {featured.dek}
            </p>
          </Link>

          <p className="mt-4 font-sans text-xs text-ink-faint">
            By {featured.author} · {estimateReadTime(featured.body)}
          </p>
        </div>

        {/* Daily Brief + latest Business spotlights */}
        <div className="flex flex-col gap-8 lg:border-l lg:border-rule lg:pl-10">
          <div className="border border-rule-strong p-5">
            <h2 className="font-serif text-lg font-semibold text-ink">The Market Brief</h2>
            <p className="mt-2 font-sans text-sm text-ink-soft">
              The biggest stories, straight to your inbox every morning.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="mt-4 flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="border border-rule bg-paper px-3 py-2.5 font-sans text-sm text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none"
              />
              <button
                type="submit"
                className="border border-ink bg-ink px-3 py-2.5 font-sans text-sm font-semibold text-paper transition hover:bg-masthead-red hover:border-masthead-red"
              >
                Subscribe
              </button>
            </form>
          </div>

          {spotlights.map((story) => (
            <Link key={story.slug} href={`/business/${story.slug}`} className="group block">
              <div className="aspect-[16/10] w-full overflow-hidden border border-rule">
                <img
                  src={story.image}
                  alt={story.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <span className="mt-3 block font-sans text-[11px] font-semibold uppercase tracking-wider text-masthead-red">
                Business
              </span>
              <h3 className="mt-1 font-serif text-base font-semibold leading-snug text-ink transition group-hover:text-masthead-red">
                {story.title}
              </h3>
              <p className="mt-1 font-sans text-xs text-ink-faint">
                By {story.author} · {estimateReadTime(story.body)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
