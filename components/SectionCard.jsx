export default function SectionCard({ title, description, children }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 flex flex-col gap-3">
      <div>
        <h3 className="text-base font-semibold text-slate-50">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          {description}
        </p>
      </div>
      {children && <div className="mt-1">{children}</div>}
    </div>
  );
}
