"use client";

import { useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

import { useGlobalSearch } from "@/components/search/GlobalSearch";

export function Hero() {
  const router = useRouter();
  const { setOpen: setSearchOpen } = useGlobalSearch();
  const sectionRef = useRef<HTMLDivElement>(null);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const springX = useSpring(pointerX, { stiffness: 60, damping: 20 });
  const springY = useSpring(pointerY, { stiffness: 60, damping: 20 });

  // Foreground moves the most, stars a little, distant background almost none.
  const foregroundX = useTransform(springX, [-1, 1], [-3, 3]);
  const foregroundY = useTransform(springY, [-1, 1], [-3, 3]);
  const starsX = useTransform(springX, [-1, 1], [-1, 1]);
  const starsY = useTransform(springY, [-1, 1], [-1, 1]);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const bounds = sectionRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const relX = (event.clientX - bounds.left) / bounds.width;
    const relY = (event.clientY - bounds.top) / bounds.height;
    pointerX.set(relX * 2 - 1);
    pointerY.set(relY * 2 - 1);
  }

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      className="relative flex h-[480px] w-full items-center overflow-hidden md:h-[550px]"
    >
      {/* Night sky base */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(180deg, #050710 0%, #0a0e20 35%, #121533 65%, #1c1830 100%)",
        }}
        aria-hidden="true"
      />

      {/* Moon glow */}
      <motion.div
        aria-hidden="true"
        className="absolute right-[12%] top-[14%] size-40 rounded-full md:size-56"
        style={{
          x: starsX,
          y: starsY,
          background: "radial-gradient(circle, rgba(221,231,255,0.9) 0%, rgba(221,231,255,0.25) 40%, transparent 75%)",
          filter: "blur(2px)",
        }}
      />

      {/* Distant stars layer */}
      <motion.div aria-hidden="true" className="absolute inset-0" style={{ x: starsX, y: starsY }}>
        {STAR_DOTS.map((dot, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-moonlight"
            style={{
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              width: dot.size,
              height: dot.size,
              opacity: dot.opacity,
            }}
          />
        ))}
      </motion.div>

      {/* Mountain silhouettes (background -> foreground depth) */}
      <svg
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[55%] w-full"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
      >
        <polygon points="0,400 0,220 220,140 460,240 700,120 980,230 1220,160 1440,240 1440,400" fill="#141a33" opacity="0.75" />
        <polygon points="0,400 0,300 260,210 560,300 860,190 1150,290 1440,220 1440,400" fill="#0d1124" opacity="0.9" />
      </svg>

      {/* Torii silhouette + lanterns, foreground layer */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-0 left-[6%] hidden h-[42%] w-24 sm:block md:h-[46%]"
        style={{ x: foregroundX, y: foregroundY }}
      >
        <svg viewBox="0 0 100 160" className="h-full w-full" preserveAspectRatio="xMidYMax meet">
          <rect x="8" y="34" width="6" height="126" fill="#080a14" />
          <rect x="86" y="34" width="6" height="126" fill="#080a14" />
          <rect x="0" y="18" width="100" height="10" fill="#080a14" />
          <rect x="6" y="34" width="88" height="7" fill="#080a14" />
        </svg>
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="absolute bottom-[18%] left-[20%] size-3 rounded-full bg-gold/80 blur-[2px] md:left-[24%]"
        style={{ x: foregroundX, y: foregroundY }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute bottom-[26%] left-[30%] size-2 rounded-full bg-gold/60 blur-[1.5px] md:left-[32%]"
        style={{ x: foregroundX, y: foregroundY }}
      />

      {/* Mist band near horizon for readability */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{ backgroundImage: "linear-gradient(180deg, transparent 0%, rgba(8,12,24,0.85) 100%)" }}
      />

      {/* Content */}
      <div className="tsuki-container relative z-10">
        <div className="max-w-xl">
          <p className="tsuki-eyebrow mb-4">Some stories stay with us</p>
          <h1 className="font-display text-4xl leading-tight text-foreground md:text-6xl">
            Find Your
            <br />
            Next Story
          </h1>
          <p className="mt-4 max-w-md text-base text-foreground-secondary">
            Track, discover and share the anime and manga that stay with you.
          </p>

          <form
            className="tsuki-focus-ring mt-8 flex items-center gap-3 rounded-xl border border-border bg-[rgba(13,19,36,0.85)] px-4 py-3 backdrop-blur-sm transition-colors focus-within:border-border-accent"
            onSubmit={(event: FormEvent<HTMLFormElement>) => {
              event.preventDefault();
              const value = new FormData(event.currentTarget).get("q");
              const query = typeof value === "string" ? value.trim() : "";
              if (query) {
                router.push(`/search?q=${encodeURIComponent(query)}`);
              } else {
                setSearchOpen(true);
              }
            }}
          >
            <Search className="size-5 text-muted-foreground" aria-hidden="true" />
            <input
              type="search"
              name="q"
              placeholder="Search anime, manga, characters…"
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              aria-label="Search anime, manga, characters"
              onFocus={() => setSearchOpen(true)}
            />
          </form>
        </div>
      </div>
    </section>
  );
}

const STAR_DOTS = Array.from({ length: 40 }, (_, i) => ({
  x: (i * 37) % 100,
  y: (i * 53) % 55,
  size: (i % 3) + 1,
  opacity: 0.15 + ((i * 7) % 20) / 100,
}));
