"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { Search, Moon, Menu, X } from "lucide-react";

// Adjust this path if this file moves relative to /public/data
import articleData from "../public/data/article.json";

const NAV_LINKS = [
  { label: "World", href: "/world" },
  { label: "Politics", href: "/politics" },
  { label: "Tech", href: "/tech" },
  { label: "Business", href: "/business" },
  { label: "Science", href: "/science" },
  { label: "Culture", href: "/culture" },
];

const TICKERS = [
  { label: "S&P 500", value: "0.83%", up: true },
  { label: "Nasdaq", value: "1.29%", up: true },
  { label: "DOW", value: "0.67%", up: true },
  { label: "BTC", value: "2.11%", up: true },
];

// Flattens article.json (grouped by category) into one searchable list
function getAllArticles() {
  const all = [];
  for (const category of Object.keys(articleData)) {
    for (const post of articleData[category]) {
      all.push({
        slug: post.slug,
        category: post.categorySlug || category,
        title: post.title,
        dek: post.dek,
        image: post.image,
      });
    }
  }
  return all;
}

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  const allArticles = useMemo(() => getAllArticles(), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return allArticles
      .filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          (a.dek || "").toLowerCase().includes(q)
      )
      .slice(0, 6);
  }, [query, allArticles]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (searchOpen) {
      inputRef.current?.focus();
    } else {
      setQuery("");
    }
  }, [searchOpen]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="border-b border-white/10 bg-[#0A0A0F]">
      {/* Live ticker strip */}
      <div className="hidden items-center justify-between border-b border-white/5 px-6 py-1.5 text-xs text-white/60 md:flex">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-violet-500/15 px-2 py-0.5 font-semibold text-violet-300">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" />
            LIVE
          </span>
          <span className="text-white/80">Global markets rally as inflation cools in key economies</span>
          <span className="text-white/30">12m ago</span>
        </div>
        <div className="flex items-center gap-4">
          {TICKERS.map((t) => (
            <span key={t.label} className="flex items-center gap-1">
              <span className="text-white/50">{t.label}</span>
              <span className={t.up ? "text-emerald-400" : "text-rose-400"}>
                {t.up ? "▲" : "▼"} {t.value}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* Main nav */}
      <div className="flex items-center justify-between px-6 py-5 lg:px-10 lg:py-6">
        <Link href="/" className="flex flex-col leading-none">
          <span className="text-3xl font-black tracking-tight text-white lg:text-4xl">
            NEX<span className="text-violet-400">O</span>RA
          </span>
          <span className="mt-1 text-xs font-medium uppercase tracking-[0.25em] text-white/40">News. Context. Impact.</span>
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          <Link href="/" className="border-b-2 border-violet-400 pb-1 text-base font-medium text-white">Home</Link>
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-base font-medium text-white/70 transition hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
            className={`hidden items-center gap-2 rounded-full border px-4 py-2 text-sm transition sm:flex ${
              searchOpen
                ? "border-violet-400/50 text-white"
                : "border-white/10 text-white/60 hover:border-white/25 hover:text-white"
            }`}
          >
            <Search size={17} />
            Search
          </button>
          <button
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
            className="rounded-full p-2.5 text-white/60 transition hover:bg-white/5 hover:text-white sm:hidden"
          >
            <Search size={20} />
          </button>
          <button aria-label="Toggle theme" className="rounded-full p-2.5 text-white/60 transition hover:bg-white/5 hover:text-white">
            <Moon size={20} />
          </button>
          <button
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="rounded-full p-2.5 text-white/60 transition hover:bg-white/5 hover:text-white lg:hidden"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Search panel */}
      {searchOpen && (
        <div className="border-t border-white/10 px-6 py-5 lg:px-10">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
              <Search size={18} className="shrink-0 text-white/40" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
              />
              <button
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
                className="shrink-0 text-white/40 transition hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {query.trim() !== "" && (
              <div className="mt-3 flex flex-col divide-y divide-white/10 rounded-lg border border-white/10">
                {results.length === 0 ? (
                  <p className="px-4 py-4 text-sm text-white/40">No articles found for "{query}".</p>
                ) : (
                  results.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/${item.category}/${item.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="group flex items-center gap-3 p-3 transition hover:bg-white/5"
                    >
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md">
                        <img src={item.image} alt={item.title} className="h-full w-full object-cover"/>
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-300 capitalize">
                          {item.category}
                        </span>
                        <p className="truncate text-sm font-medium text-white transition group-hover:text-violet-300">
                          {item.title}
                        </p>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile drawer backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        className={`fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Mobile sliding drawer */}
      <nav
        className={`fixed right-0 top-0 z-[70] h-full w-72 max-w-[80%] transform border-l border-white/10 bg-[#0A0A0F] shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <span className="text-xl font-black tracking-tight text-white">
            NEX<span className="text-violet-400">O</span>RA
          </span>
          <button
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="rounded-full p-2 text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            <X size={22} />
          </button>
        </div>
        <div className="flex flex-col gap-1 px-3 py-4">
          {[{ label: "Home", href: "/" }, ...NAV_LINKS].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-4 py-3.5 text-base font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}