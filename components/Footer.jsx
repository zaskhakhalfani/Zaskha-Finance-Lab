// components/Footer.js
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-8 border-t border-slate-800 bg-slate-950/90">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-4 text-[11px] text-slate-400 sm:flex-row">
        <span className="text-center sm:text-left">
          © {year} Zaskha Finance Lab.
        </span>
        <span className="text-center sm:text-right">
          For education only – not personalised financial advice.
        </span>
      </div>
    </footer>
  );
}
