"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/Logo";

const links = [
  { href: "/", label: "Home" },
  { href: "/learn", label: "Learn" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/inflation", label: "Inflation" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Logo />
        </Link>

        <div className="flex items-center gap-4">
          {/* Navigation links */}
          <div className="flex gap-4 text-sm">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    "px-3 py-1 rounded-full transition " +
                    (active
                      ? "bg-emerald-500 text-slate-950 font-semibold"
                      : "text-slate-200 hover:bg-slate-800")
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* GitHub button */}
          <a
            href="https://github.com/zaskhakhalfani"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-slate-600 px-3 py-1 text-xs font-medium text-slate-200 hover:bg-slate-800 transition"
          >
            {/* Simple GitHub icon (no extra library needed) */}
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="h-4 w-4"
              fill="currentColor"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38
              0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52
              0-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95
              0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2
              .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87
              3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16
              8c0-4.42-3.58-8-8-8Z" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
