import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Zaskha Finance Lab",
  description: "Learn world economics and apply it to your personal finances.",
  icons: {
    icon: "/icon.svg",          // Main favicon (your neon emerald glow)
    shortcut: "/favicon.ico",   // Optional for legacy browsers
    apple: "/icon.svg",         // For Apple touch icon
  },
};

import "./globals.css";
import Navbar from "@/components/Navbar";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-50">
        <Navbar />
        <main className="mx-auto max-w-5xl px-3 sm:px-4 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}

