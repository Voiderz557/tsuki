"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Search, ListChecks, User } from "lucide-react";

import { useGlobalSearch } from "@/components/search/GlobalSearch";
import { cn } from "@/lib/utils";

const ITEMS: {
  label: string;
  href?: string;
  icon: ComponentType<{ className?: string }>;
  action?: "search";
}[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Browse", href: "/browse", icon: Compass },
  { label: "Search", icon: Search, action: "search" },
  { label: "List", href: "/user/me/anime", icon: ListChecks },
  { label: "Profile", href: "/user/me", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();
  const { setOpen: setSearchOpen } = useGlobalSearch();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-[rgba(8,12,24,0.96)] backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Primary mobile navigation"
    >
      <ul className="flex items-stretch justify-between">
        {ITEMS.map(({ label, href, icon: Icon, action }) => {
          const active = href ? pathname === href : pathname === "/search";
          const className = cn(
            "flex min-h-14 w-full flex-col items-center justify-center gap-1 text-[11px] transition-colors",
            active ? "text-primary" : "text-muted-foreground"
          );

          return (
            <li key={label} className="flex-1">
              {action === "search" ? (
                <button type="button" className={className} onClick={() => setSearchOpen(true)} aria-label="Search">
                  <Icon className="size-5" />
                  {label}
                </button>
              ) : (
                <Link href={href ?? "/"} className={className} aria-current={active ? "page" : undefined}>
                  <Icon className="size-5" />
                  {label}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
