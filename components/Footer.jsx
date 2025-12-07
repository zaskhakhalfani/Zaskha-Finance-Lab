export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/90 mt-8">
      <div className="max-w-6xl mx-auto px-4 py-4 text-xs text-slate-400 flex flex-col sm:flex-row justify-between gap-2">
        <span>© {new Date().getFullYear()} Zaskha Finance Lab.</span>
        <span>Educational purposes only – not financial advice.</span>
      </div>
    </footer>
  );
}
