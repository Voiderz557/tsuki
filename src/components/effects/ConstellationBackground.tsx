"use client";

import { useEffect, useRef } from "react";

interface Star {
  x: number;
  y: number;
  radius: number;
  baseOpacity: number;
  twinklePhase: number;
  twinkleSpeed: number;
  driftX: number;
  driftY: number;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

const STAR_DENSITY = 1 / 9000; // stars per square pixel
const MAX_LINK_DISTANCE = 140;
const SHOOTING_STAR_MIN_MS = 20000;
const SHOOTING_STAR_MAX_MS = 40000;

/**
 * Subtle, full-bleed night-sky backdrop: static-ish drifting stars, faint
 * constellation lines between nearby stars, and an occasional shooting
 * star. Respects `prefers-reduced-motion` by rendering a static field with
 * no animation loop at all.
 */
export function ConstellationBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let stars: Star[] = [];
    let shootingStar: ShootingStar | null = null;
    let nextShootingStarAt = 0;
    let animationFrame = 0;
    let lastTime = performance.now();

    function seedStars() {
      const count = Math.round(width * height * STAR_DENSITY);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.1 + 0.4,
        baseOpacity: Math.random() * 0.2 + 0.1, // 0.1 - 0.3
        twinklePhase: Math.random() * Math.PI * 2,
        twinkleSpeed: Math.random() * 0.4 + 0.15,
        driftX: (Math.random() - 0.5) * 0.006,
        driftY: (Math.random() - 0.5) * 0.006,
      }));
    }

    function resize() {
      const parent = canvas!.parentElement;
      width = parent ? parent.clientWidth : window.innerWidth;
      height = parent ? parent.clientHeight : window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedStars();
    }

    function scheduleNextShootingStar(now: number) {
      nextShootingStarAt =
        now + SHOOTING_STAR_MIN_MS + Math.random() * (SHOOTING_STAR_MAX_MS - SHOOTING_STAR_MIN_MS);
    }

    function maybeSpawnShootingStar(now: number) {
      if (shootingStar || now < nextShootingStarAt) return;
      const startX = Math.random() * width * 0.6 + width * 0.2;
      const startY = Math.random() * height * 0.3;
      const angle = (Math.PI / 5) * (Math.random() * 0.6 + 0.7);
      const speed = 6 + Math.random() * 3;
      shootingStar = {
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 40 + Math.random() * 20,
      };
    }

    function drawStatic() {
      ctx!.clearRect(0, 0, width, height);
      for (const star of stars) {
        ctx!.beginPath();
        ctx!.fillStyle = `rgba(244, 246, 255, ${star.baseOpacity})`;
        ctx!.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx!.fill();
      }
      drawLinks(stars.map((s) => ({ x: s.x, y: s.y })), 0.6);
    }

    function drawLinks(points: { x: number; y: number }[], opacityScale: number) {
      ctx!.strokeStyle = "rgba(124, 131, 255, 1)";
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_LINK_DISTANCE) {
            const opacity = (1 - dist / MAX_LINK_DISTANCE) * 0.12 * opacityScale;
            if (opacity < 0.01) continue;
            ctx!.globalAlpha = opacity;
            ctx!.beginPath();
            ctx!.moveTo(points[i].x, points[i].y);
            ctx!.lineTo(points[j].x, points[j].y);
            ctx!.stroke();
          }
        }
      }
      ctx!.globalAlpha = 1;
    }

    function tick(now: number) {
      const dt = Math.min(now - lastTime, 50);
      lastTime = now;

      ctx!.clearRect(0, 0, width, height);

      for (const star of stars) {
        star.x += star.driftX * dt;
        star.y += star.driftY * dt;
        if (star.x < 0) star.x += width;
        if (star.x > width) star.x -= width;
        if (star.y < 0) star.y += height;
        if (star.y > height) star.y -= height;

        star.twinklePhase += star.twinkleSpeed * (dt / 1000);
        const twinkle = (Math.sin(star.twinklePhase) + 1) / 2; // 0-1
        const opacity = star.baseOpacity * (0.75 + twinkle * 0.25);

        ctx!.beginPath();
        ctx!.fillStyle = `rgba(244, 246, 255, ${opacity})`;
        ctx!.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx!.fill();
      }

      drawLinks(stars, 1);

      maybeSpawnShootingStar(now);
      if (shootingStar) {
        shootingStar.x += shootingStar.vx * (dt / 16);
        shootingStar.y += shootingStar.vy * (dt / 16);
        shootingStar.life += dt / 16;

        const progress = shootingStar.life / shootingStar.maxLife;
        const fade = progress < 0.15 ? progress / 0.15 : 1 - (progress - 0.15) / 0.85;
        const tailX = shootingStar.x - shootingStar.vx * 6;
        const tailY = shootingStar.y - shootingStar.vy * 6;

        const gradient = ctx!.createLinearGradient(tailX, tailY, shootingStar.x, shootingStar.y);
        gradient.addColorStop(0, "rgba(221,231,255,0)");
        gradient.addColorStop(1, `rgba(221,231,255,${Math.max(fade * 0.85, 0)})`);
        ctx!.strokeStyle = gradient;
        ctx!.lineWidth = 1.5;
        ctx!.beginPath();
        ctx!.moveTo(tailX, tailY);
        ctx!.lineTo(shootingStar.x, shootingStar.y);
        ctx!.stroke();

        if (
          shootingStar.life >= shootingStar.maxLife ||
          shootingStar.x < -50 ||
          shootingStar.x > width + 50 ||
          shootingStar.y > height + 50
        ) {
          shootingStar = null;
          scheduleNextShootingStar(now);
        }
      }

      animationFrame = requestAnimationFrame(tick);
    }

    resize();
    window.addEventListener("resize", resize);

    if (reduceMotion) {
      drawStatic();
    } else {
      scheduleNextShootingStar(performance.now());
      animationFrame = requestAnimationFrame(tick);
    }

    return () => {
      window.removeEventListener("resize", resize);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ display: "block", pointerEvents: "none" }}
    />
  );
}
