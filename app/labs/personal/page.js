// app/labs/personal/page.js
import Link from "next/link";
import SectionCard from "@/components/SectionCard";

export default function PersonalLab() {
  return (
    <main className="mx-auto max-w-6xl px-3 py-8 sm:px-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-slate-100">Personal Finance Lab</h1>
          <p className="mt-2 max-w-2xl text-slate-300">
            Use your tools with clearer context: inflation, compounding, and risk — explained simply.
          </p>
        </div>
        <Link href="/tools" className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 hover:bg-slate-800">
          Browse tools →
        </Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <SectionCard
          title="Portfolio Simulator"
          desc="Explore risk/return trade-offs and long-term compounding — with explanations."
          href="/portfolio"
          cta="Open →"
        />
        <SectionCard
          title="Inflation Dashboard"
          desc="See how inflation affects purchasing power and real income over time."
          href="/inflation"
          cta="Open →"
        />
      </div>

      <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-950/60 p-5">
        <h2 className="text-lg font-semibold text-slate-100">Investing (responsibly)</h2>
        <p className="mt-2 text-sm text-slate-300">
          The goal here is education: understanding concepts like diversification, time horizon, and real returns — not giving personalised financial advice.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href="/learn" className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-emerald-400">
            Learn the basics →
          </Link>
          <Link href="/tools/real-wage" className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 hover:bg-slate-800">
            Real wage tool →
          </Link>
        </div>
      </div>
    </main>
  );
}
