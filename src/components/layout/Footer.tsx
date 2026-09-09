import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-border pb-20 md:pb-0">
      <div className="tsuki-container flex flex-col items-center justify-between gap-4 py-10 text-sm text-muted-foreground sm:flex-row">
        <div className="tsuki-wordmark flex items-center gap-2 text-foreground-secondary">
          <span aria-hidden="true">☾</span>
          <span>TSUKI</span>
        </div>
        <p>Stories are stars — your journey becomes your sky.</p>
        <nav className="flex gap-4">
          <Link href="/browse" className="hover:text-foreground-secondary">
            Browse
          </Link>
          <Link href="/community" className="hover:text-foreground-secondary">
            Community
          </Link>
        </nav>
      </div>
    </footer>
  );
}
