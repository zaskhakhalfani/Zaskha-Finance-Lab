// app/labs/page.js
import Link from "next/link";
import SectionCard from "@/components/SectionCard";

export default function LabsHub() {
  return (
    <main className="mx-auto max-w-6xl px-3 py-8 sm:px-4">
      <h1 className="text-3xl font-semibold text-slate-100">Labs</h1>
      <p className="mt-2 max-w-2xl text-slate-300">
        Focused spaces for personal finance, economic thinking, and practice. Your existing tools stay available — Labs simply organize the experience.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <SectionCard
          title="Personal Finance Lab"
          desc="Understand your situation, inflation, risk, and long-term trade-offs — explained clearly."
          href="/labs/personal"
          cta="Enter →"
        />
        <SectionCard
          title="Revision & Practice Lab"
          desc="Generate questions, turn your notes into quizzes, and get structured marking feedback."
          href="/labs/revision"
          cta="Enter →"
        />
        <SectionCard
          title="Macro & Real-World Lab"
          desc="Explore economic history and real-world context you can apply to decisions (and essays)."
          href="/labs/macro"
          cta="Enter →"
        />
      </div>

      <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
        <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wide">
          Shortcuts
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 hover:bg-slate-800" href="/tools">
            Tools index
          </Link>
          <Link className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 hover:bg-slate-800" href="/learn">
            Learn page
          </Link>
          <Link className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 hover:bg-slate-800" href="/portfolio">
            Portfolio simulator
          </Link>
          <Link className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-100 hover:bg-slate-800" href="/inflation">
            Inflation dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
