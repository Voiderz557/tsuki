import type { Metadata } from "next";
import { Inter, Playfair_Display, Geist_Mono } from "next/font/google";

import { Navbar } from "@/components/layout/Navbar";
import { MobileNav } from "@/components/layout/MobileNav";
import { Footer } from "@/components/layout/Footer";
import { ConstellationBackground } from "@/components/effects/ConstellationBackground";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TSUKI — Your Anime & Manga Journey",
  description:
    "Track, discover and share the anime and manga that stay with you. Every story you watch or read becomes part of your personal night sky.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${playfairDisplay.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col bg-background text-foreground">
        <ConstellationBackground className="pointer-events-none fixed inset-0 z-0 h-full w-full" />
        <Navbar />
        <main className="relative z-10 flex-1 pt-16 pb-20 md:pt-[72px] md:pb-0">{children}</main>
        <div className="relative z-10">
          <Footer />
        </div>
        <MobileNav />
      </body>
    </html>
  );
}
