// app/labs/macro/page.js
import Link from "next/link";
import SectionCard from "@/components/SectionCard";

export default function MacroLab() {
  return (
    <main className="mx-auto max-w-6xl px-3 py-8 sm:px-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-slate-100">Macro & Real-World Lab</h1>
          <p className="mt-2 max-w-2xl text-slate-300">
            Connect history, policy, and real-world events to the concepts you use every day.
          </p>
        </div>
        <Link href="/learn" className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-100 hover:bg-slate-800">
          Open Macro Timeline →
        </Link>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <SectionCard
          title="UK Macro Snapshot"
          desc="Quick view of macro indicators and context."
          href="/api/uk-macro"
          cta="API route →"
        />
        <SectionCard
          title="Mini Dashboard"
          desc="Compact indicators used around the app."
          href="/api/mini-dashboard"
          cta="API route →"
        />
        <SectionCard
          title="Inflation Tool"
          desc="See inflation data and interpret the story behind it."
          href="/inflation"
          cta="Open →"
        />
      </div>

      <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-950/60 p-5">
        <h2 className="text-lg font-semibold text-slate-100">Use in writing</h2>
        <p className="mt-2 text-sm text-slate-300">
          When you click a timeline event in Learn, you’ll see an “Exam angle” box. Use that structure to connect context → mechanism → implication.
        </p>
      </div>
    </main>
  );
}
