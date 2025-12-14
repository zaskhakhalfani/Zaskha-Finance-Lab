// app/tools/page.js
import Link from "next/link";
import SectionCard from "@/components/SectionCard";

export default function ToolsIndex() {
  return (
    <main className="mx-auto max-w-6xl px-3 py-8 sm:px-4">
      <h1 className="text-3xl font-semibold text-slate-100">Tools</h1>
      <p className="mt-2 max-w-2xl text-slate-300">
        Practical calculators and demos — paired with explanations so you understand the “why”, not just the output.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <SectionCard title="Inflation Dashboard" desc="Explore inflation and purchasing power." href="/inflation" cta="Open →" />
        <SectionCard title="Portfolio Simulator" desc="Test compounding and risk/return trade-offs." href="/portfolio" cta="Open →" />
        <SectionCard title="Cost of Delay" desc="See how delaying investing changes outcomes." href="/tools/cost-of-delay" cta="Open →" />
        <SectionCard title="Real Wage" desc="Understand wage growth vs inflation." href="/tools/real-wage" cta="Open →" />
        <SectionCard title="Shopping Basket" desc="Inflation through everyday prices." href="/tools/shopping-basket" cta="Open →" />
        <SectionCard title="AI Tutor" desc="Ask follow-up questions in plain English." href="/learn" cta="Open →" />
      </div>

      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">Looking for structure?</p>
        <p className="mt-1 text-sm text-slate-300">
          Use <Link className="text-emerald-400 hover:underline" href="/labs">Labs</Link> to follow guided paths.
        </p>
      </div>
    </main>
  );
}
