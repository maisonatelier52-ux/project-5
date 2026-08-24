"use client";

import { useState } from "react";
import Link from "next/link";
import { Newspaper, Mail, ArrowRight } from "lucide-react";

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

const SPOTLIGHT_COLORS = [
  "bg-emerald-500/15 text-emerald-300",
  "bg-amber-500/15 text-amber-300",
];

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
    <section className="bg-[#0A0A0F] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-3">
        {/* Featured Business article */}
        <div className="rounded-xl border border-white/10 p-5 sm:p-6 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <Newspaper size={18} className="text-violet-400" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Business</h2>
          </div>

          <Link href={`/business/${featured.slug}`} className="group relative block aspect-[16/9] overflow-hidden rounded-lg border border-white/5 sm:aspect-[2/1]">
            <img src={featured.image} alt={featured.title} className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"/>
          </Link>

          <Link href={`/business/${featured.slug}`} className="group mt-4 block">
            <h3 className="max-w-lg text-xl font-bold leading-snug text-white transition group-hover:text-violet-300 sm:text-2xl">
              {featured.title}
            </h3>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-white/60">
              {featured.dek}
            </p>
          </Link>

          <p className="mt-3 text-xs text-white/40">
            By {featured.author} • {estimateReadTime(featured.body)}
          </p>

          <Link href={`/business/${featured.slug}`} className="mt-3 flex w-fit items-center gap-1.5 text-sm font-semibold text-violet-300 transition hover:text-violet-200">
            Explore
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Daily Brief + latest Business spotlights */}
        <div className="flex flex-col gap-5">
          <div className="rounded-xl border border-white/10 p-5 sm:p-6">
            <div className="mb-3 flex items-center gap-2">
              <Mail size={18} className="text-violet-400" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-white">Daily Brief</h2>
            </div>
            <p className="text-sm text-white/50">The biggest stories, straight to your inbox every morning.</p>
            <form onSubmit={(e) => e.preventDefault()} className="mt-4 flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="rounded-md border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-violet-400/50 focus:outline-none"
              />
              <button type="submit" className="rounded-md bg-violet-500 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400">
                Subscribe
              </button>
            </form>
          </div>

          {spotlights.map((story, i) => (
            <Link key={story.slug} href={`/business/${story.slug}`} className="group relative overflow-hidden rounded-xl border border-white/10">
              <img src={story.image} alt={story.title} className="h-40 w-full object-cover transition duration-300 group-hover:scale-105"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4">
                <span className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${SPOTLIGHT_COLORS[i % SPOTLIGHT_COLORS.length]}`}>
                  Business
                </span>
                <h3 className="mt-2 text-sm font-semibold leading-snug text-white">
                  {story.title}
                </h3>
                <p className="mt-1 text-xs text-white/50">
                  By {story.author} • {estimateReadTime(story.body)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}