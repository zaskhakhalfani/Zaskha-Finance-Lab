// components/Navbar.js
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/learn", label: "Learn" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/inflation", label: "Inflation" },
];

const githubUrl = "https://github.com/zaskhakhalfani";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-2 sm:px-4">
        {/* Left: logo */}
        <Link href="/" className="flex items-baseline gap-1">
          <span className="text-sm font-semibold text-emerald-400">
            Zaskha
          </span>
          <span className="text-xs font-medium text-slate-100">
            Finance Lab
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-4 md:flex">
          {/* Links pill */}
          <div className="flex items-center gap-2 rounded-full bg-slate-900 px-1 py-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  "rounded-full px-3 py-1.5 text-xs transition " +
                  (isActive(link.href)
                    ? "bg-emerald-500 text-slate-950 font-semibold"
                    : "text-slate-100 hover:bg-slate-800")
                }
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* GitHub button */}
          <Link
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-[11px] text-slate-100 hover:bg-slate-800"
          >
            <GitHubIcon className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </Link>
        </div>

        {/* Mobile right side: GitHub icon + burger */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900 p-1.5 text-slate-100"
            aria-label="View on GitHub"
          >
            <GitHubIcon className="h-4 w-4" />
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900 p-1.5 text-slate-100"
            aria-label="Toggle navigation menu"
          >
            {open ? <CloseIcon className="h-4 w-4" /> : <MenuIcon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="border-t border-slate-800 bg-slate-950 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-3 py-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={
                  "rounded-xl px-3 py-2 text-sm " +
                  (isActive(link.href)
                    ? "bg-emerald-500 text-slate-950 font-semibold"
                    : "bg-slate-900 text-slate-100 hover:bg-slate-800")
                }
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

/* ----------------- Icons ----------------- */

function GitHubIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.39 7.87 10.91.57.1.78-.25.78-.56
      0-.27-.01-1-.02-1.96-3.2.7-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7
      1.16.08 1.76 1.19 1.76 1.19 1.02 1.76 2.69 1.25 3.35.96.1-.75.4-1.26.73-1.55-2.56-.29-5.25-1.28-5.25-5.69
      0-1.26.44-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a10.9 10.9 0 0 1 5.8 0c2.21-1.49 3.18-1.18 3.18-1.18
      .63 1.59.23 2.76.11 3.05.74.8 1.18 1.82 1.18 3.08 0 4.42-2.69 5.4-5.26 5.69.41.36.79 1.07.79 2.15
      0 1.55-.01 2.8-.01 3.18 0 .31.21.67.79.56C20.21 21.39 23.5 17.09 23.5 12 23.5 5.65 18.35.5 12 .5z" />
    </svg>
  );
}

function MenuIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}
