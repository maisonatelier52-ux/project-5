"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";

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

  const today = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
    []
  );

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
    <header className="bg-paper">
      {/* Utility strip — date, edition, markets */}
      <div className="hidden items-center justify-between border-b border-rule px-6 py-1.5 font-sans text-[11px] text-ink-soft md:flex lg:px-10">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center gap-1.5 font-semibold text-masthead-red">
            <span className="h-1.5 w-1.5 rounded-full bg-masthead-red" />
            LIVE
          </span>
          <span>Global markets rally as inflation cools in key economies</span>
        </div>
        <div className="flex items-center gap-5">
          <span>{today}</span>
          <span className="h-3 w-px bg-rule" />
          <div className="flex items-center gap-4">
            {TICKERS.map((t) => (
              <span key={t.label} className="flex items-center gap-1">
                <span className="text-ink-faint">{t.label}</span>
                <span className={t.up ? "text-[#5cae66]" : "text-masthead-red"}>
                  {t.up ? "▲" : "▼"} {t.value}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Masthead — centered wordmark, flanked by search / menu */}
      <div className="relative flex items-center justify-between px-5 py-6 sm:px-6 lg:px-10 lg:py-8">
        <span className="hidden font-sans text-xs uppercase tracking-[0.2em] text-ink-faint sm:block md:hidden lg:block">
          {today}
        </span>

        <Link
          href="/"
          className="mx-auto flex flex-col items-center leading-none sm:absolute sm:left-1/2 sm:-translate-x-1/2"
        >
          <span className="font-serif text-4xl font-black tracking-tight text-ink sm:text-5xl">
            NEXORA
          </span>
          <span className="mt-2 font-sans text-[10px] font-semibold uppercase tracking-[0.35em] text-ink-soft">
            News · Context · Clarity
          </span>
        </Link>

        <div className="ml-auto flex items-center gap-1 sm:ml-0">
          <button
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
            className={`hidden items-center gap-2 border px-4 py-2 font-sans text-sm transition sm:flex ${
              searchOpen
                ? "border-ink text-ink"
                : "border-rule text-ink-soft hover:border-ink hover:text-ink"
            }`}
          >
            <Search size={16} />
            Search
          </button>
          <button
            aria-label="Search"
            onClick={() => setSearchOpen((v) => !v)}
            className="p-2.5 text-ink-soft transition hover:text-ink sm:hidden"
          >
            <Search size={20} />
          </button>
          <button
            aria-label="Toggle menu"
            onClick={() => setMobileOpen((v) => !v)}
            className="p-2.5 text-ink-soft transition hover:text-ink lg:hidden"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Section nav */}
      <nav className="hidden border-y border-rule-strong lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-10 px-10 py-3">
          <Link href="/" className="font-sans text-sm font-semibold text-ink">
            Home
          </Link>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-sm text-ink-soft transition hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
      <div className="border-b border-rule lg:hidden" />

      {/* Search panel */}
      {searchOpen && (
        <div className="border-b border-rule bg-paper px-6 py-5 lg:px-10">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center gap-3 border border-rule-strong bg-paper px-4 py-3">
              <Search size={18} className="shrink-0 text-ink-faint" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search articles…"
                className="w-full bg-transparent font-sans text-sm text-ink placeholder:text-ink-faint focus:outline-none"
              />
              <button
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
                className="shrink-0 text-ink-faint transition hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            {query.trim() !== "" && (
              <div className="mt-3 flex flex-col divide-y divide-rule border border-rule">
                {results.length === 0 ? (
                  <p className="px-4 py-4 font-sans text-sm text-ink-faint">
                    No articles found for &ldquo;{query}&rdquo;.
                  </p>
                ) : (
                  results.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/${item.category}/${item.slug}`}
                      onClick={() => setSearchOpen(false)}
                      className="group flex items-center gap-3 p-3 transition hover:bg-paper-shade"
                    >
                      <div className="h-12 w-12 shrink-0 overflow-hidden">
                        <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-sans text-[10px] font-semibold uppercase tracking-wider text-masthead-red">
                          {item.category}
                        </span>
                        <p className="truncate font-serif text-base font-semibold text-ink transition group-hover:text-masthead-red">
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
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Mobile sliding drawer */}
      <nav
        className={`fixed right-0 top-0 z-[70] h-full w-72 max-w-[80%] transform border-l border-rule-strong bg-paper shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-rule px-5 py-5">
          <span className="font-serif text-xl font-black tracking-tight text-ink">NEXORA</span>
          <button
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="p-2 text-ink-soft transition hover:text-ink"
          >
            <X size={22} />
          </button>
        </div>
        <div className="flex flex-col px-3 py-4">
          {[{ label: "Home", href: "/" }, ...NAV_LINKS].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="border-b border-rule px-3 py-4 font-sans text-base font-medium text-ink-soft transition hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
