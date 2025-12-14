// app/newsletter/page.js
"use client";

import { useState } from "react";

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <main className="mx-auto max-w-6xl px-3 py-8 sm:px-4">
      <h1 className="text-3xl font-semibold text-slate-100">Newsletter</h1>
      <p className="mt-2 max-w-2xl text-slate-300">
        Weekly economic context: what happened, why it matters, and how to think about it.
      </p>

      <section className="mt-6 rounded-3xl border border-slate-800 bg-slate-950/60 p-5">
        <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Sign up</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100"
            placeholder="you@example.com"
          />
          <button
            onClick={() => setDone(true)}
            className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400"
          >
            Subscribe
          </button>
        </div>
        {done && (
          <p className="mt-2 text-sm text-slate-100">✅ Added (demo UI). Wire to Mailchimp/ConvertKit later.</p>
        )}
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Example issue</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-100">Inflation cooled — what it means</h2>
          <p className="mt-2 text-sm text-slate-300">
            A short breakdown of the drivers, what households feel, and how economists interpret the data.
          </p>
        </div>
        <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-5">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Example issue</p>
          <h2 className="mt-2 text-lg font-semibold text-slate-100">Rates pause — policy and trade-offs</h2>
          <p className="mt-2 text-sm text-slate-300">
            How central banks think, why lags matter, and what “real rates” actually means.
          </p>
        </div>
      </section>
    </main>
  );
}
