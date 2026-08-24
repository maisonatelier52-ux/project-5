const CATEGORIES = [
  { label: "World", href: "/world" },
  { label: "Politics", href: "/politics" },
  { label: "Tech", href: "/tech" },
  { label: "Business", href: "/business" },
  { label: "Science", href: "/science" },
  { label: "Culture", href: "/culture" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
];

const SOCIALS = [
  {
    label: "Twitter",
    href: "https://twitter.com",
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7.1l-5.5-7.2L4.4 22H1.3l8.1-9.3L1 2h7.3l5 6.6L18.9 2Zm-1.2 18h1.9L7.4 4h-2l12.3 16Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M12 2c2.7 0 3.05.01 4.12.06 1.06.05 1.79.22 2.43.47.66.26 1.22.6 1.77 1.15.55.55.9 1.11 1.15 1.77.25.64.42 1.37.47 2.43.05 1.07.06 1.42.06 4.12s-.01 3.05-.06 4.12c-.05 1.06-.22 1.79-.47 2.43a4.9 4.9 0 0 1-1.15 1.77 4.9 4.9 0 0 1-1.77 1.15c-.64.25-1.37.42-2.43.47-1.07.05-1.42.06-4.12.06s-3.05-.01-4.12-.06c-1.06-.05-1.79-.22-2.43-.47a4.9 4.9 0 0 1-1.77-1.15 4.9 4.9 0 0 1-1.15-1.77c-.25-.64-.42-1.37-.47-2.43C2.01 15.05 2 14.7 2 12s.01-3.05.06-4.12c.05-1.06.22-1.79.47-2.43.26-.66.6-1.22 1.15-1.77A4.9 4.9 0 0 1 5.45.53C6.09.28 6.82.11 7.88.06 8.95.01 9.3 0 12 0Zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10Zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4Zm5.2-8.4a1.17 1.17 0 1 1 0-2.34 1.17 1.17 0 0 1 0 2.34Z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://youtube.com",
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.8.6 9.4.6 9.4.6s7.6 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.5V8.5L15.8 12l-6.2 3.5Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: (props) => (
      <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
      </svg>
    ),
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#0A0A0F]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-5 lg:px-10">
        {/* Brand column */}
        <div className="col-span-2 lg:col-span-2">
          <a href="/" className="flex flex-col leading-none">
            <span className="text-3xl font-black tracking-tight text-white">
              NEX<span className="text-violet-400">O</span>RA
            </span>
          </a>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/50">Independent reporting and sharp 
          analysis on the stories shaping the world — delivered daily.</p>
          <div className="mt-6 flex items-center gap-3">
            {SOCIALS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 p-2.5 text-white/50 transition hover:border-violet-400/40 hover:text-violet-300"
              >
                <Icon className="h-[17px] w-[17px]" />
              </a>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Categories</h3>
          <ul className="mt-4 flex flex-col gap-3">
            {CATEGORIES.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-sm text-white/60 transition hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Company</h3>
          <ul className="mt-4 flex flex-col gap-3">
            {COMPANY_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-sm text-white/60 transition hover:text-white">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div className="col-span-2 lg:col-span-1">
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">Daily Brief</h3>
          <p className="mt-4 text-sm text-white/50">The biggest stories, straight to your inbox every morning.</p>
          <form className="mt-4 flex flex-col gap-2">
            <input type="email" placeholder="Your email address" className="rounded-md border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:border-violet-400/50 focus:outline-none"/>
            <button type="submit" className="rounded-md bg-violet-500 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-400">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 px-6 py-6 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col-reverse items-center justify-between gap-4 sm:flex-row">
          <span className="text-xs text-white/40">© {year} Nexora News. All rights reserved.</span>
          <div className="flex items-center gap-6">
            {LEGAL_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="text-xs text-white/40 transition hover:text-white/70">
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}