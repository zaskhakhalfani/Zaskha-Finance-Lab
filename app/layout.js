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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
