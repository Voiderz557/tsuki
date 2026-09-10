"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useGlobalSearch } from "@/components/search/GlobalSearch";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Browse", href: "/browse" },
  { label: "Seasonal", href: "/seasonal" },
  { label: "Anime", href: "/browse?type=anime" },
  { label: "Manga", href: "/browse?type=manga" },
  { label: "Community", href: "/community" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { setOpen: setSearchOpen } = useGlobalSearch();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 h-16 backdrop-blur-md transition-colors duration-200 md:h-[72px]",
        scrolled ? "border-b border-border-strong bg-[rgba(8,12,24,0.98)]" : "border-b border-border bg-[rgba(8,12,24,0.90)]"
      )}
    >
      <div className="tsuki-container flex h-full items-center justify-between gap-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="tsuki-wordmark flex items-center gap-2 text-lg text-foreground">
            <span aria-hidden="true">☾</span>
            <span>TSUKI</span>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-foreground-secondary transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="tsuki-focus-ring hidden items-center gap-2 rounded-lg border border-border bg-background/40 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground-secondary sm:flex"
            aria-label="Search anime and manga"
          >
            <Search className="size-4" />
            <span>Search…</span>
            <kbd className="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">⌘K</kbd>
          </button>

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="tsuki-focus-ring flex size-9 items-center justify-center rounded-lg text-foreground-secondary hover:text-foreground sm:hidden"
            aria-label="Search anime and manga"
          >
            <Search className="size-5" />
          </button>

          <div className="hidden items-center gap-2 sm:flex">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button size="sm" className="tsuki-btn-gradient border-0 text-white">
              Join TSUKI
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
