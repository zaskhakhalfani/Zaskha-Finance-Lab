import Link from "next/link";

export default function SectionCard({
  title,
  description,
  desc,
  href,
  cta = "Open →",
  children,
}) {
  const text = description ?? desc;

  const inner = (
    <div className="flex h-full flex-col gap-3">
      <div>
        <h3 className="text-base font-semibold text-slate-50">{title}</h3>
        {text ? (
          <p className="mt-1 text-xs sm:text-sm text-slate-300">{text}</p>
        ) : null}
      </div>

      {children ? <div className="mt-1">{children}</div> : null}

      {href ? (
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="text-sm font-semibold text-slate-100">{cta}</span>
          <span className="text-slate-400 transition group-hover:text-slate-200">→</span>
        </div>
      ) : null}
    </div>
  );

  const className =
    "group block rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-700 hover:bg-slate-900/70 focus:outline-none focus:ring-2 focus:ring-emerald-500/30";

  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    );
  }

  return <div className={className}>{inner}</div>;
}
