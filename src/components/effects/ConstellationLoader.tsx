"use client";

import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

const DOTS = [
  { x: 12, y: 34 },
  { x: 40, y: 12 },
  { x: 70, y: 30 },
  { x: 54, y: 60 },
  { x: 22, y: 62 },
];

const LINES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 0],
];

/**
 * TSUKI's signature loading motif: a few stars fade in and thin lines
 * gradually connect them. Used for full-page / section loading states.
 * Falls back to a static, non-animated version under reduced motion.
 */
export function ConstellationLoader({ label = "Loading", className }: { label?: string; className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn("flex flex-col items-center justify-center gap-4 py-16", className)}
      role="status"
      aria-live="polite"
    >
      <svg width="88" height="76" viewBox="0 0 88 76" aria-hidden="true">
        {LINES.map(([fromIdx, toIdx], i) => {
          const from = DOTS[fromIdx];
          const to = DOTS[toIdx];
          return (
            <motion.line
              key={i}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="rgba(124,131,255,0.5)"
              strokeWidth={1}
              initial={reduceMotion ? { opacity: 0.35 } : { pathLength: 0, opacity: 0 }}
              animate={
                reduceMotion
                  ? { opacity: 0.35 }
                  : { pathLength: 1, opacity: 0.5 }
              }
              transition={
                reduceMotion
                  ? undefined
                  : { duration: 0.6, delay: 0.15 * i + 0.3, ease: "easeOut", repeat: Infinity, repeatDelay: 1.2 }
              }
            />
          );
        })}
        {DOTS.map((dot, i) => (
          <motion.circle
            key={i}
            cx={dot.x}
            cy={dot.y}
            r={2.5}
            fill="var(--moonlight)"
            initial={{ opacity: reduceMotion ? 0.6 : 0.15 }}
            animate={reduceMotion ? { opacity: 0.6 } : { opacity: [0.15, 1, 0.15] }}
            transition={
              reduceMotion ? undefined : { duration: 1.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }
            }
          />
        ))}
      </svg>
      <span className="tsuki-eyebrow">{label}</span>
    </div>
  );
}
