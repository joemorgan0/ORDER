import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { StatsModal } from "@/components/StatsModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ORDER - The Daily Trivia Game",
  description: "Can you put it in the right order?",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 min-h-screen flex flex-col`}>
        <header className="w-full border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="font-black text-2xl tracking-tighter hover:opacity-80 transition-opacity">
              ORDER
            </Link>
            <nav className="flex gap-4 font-semibold text-sm items-center">
              <StatsModal />
            </nav>
          </div>
        </header>
        
        <main className="flex-1 flex flex-col p-4 md:p-8 max-w-4xl w-full mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
