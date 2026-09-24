"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Zap, Heart } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

const BADGES = [
  { icon: Users, label: "Human Expertise", className: "left-2 top-4 rotate-[-4deg]", delay: 0 },
  { icon: Zap, label: "Fast Turnaround", className: "right-0 top-32 rotate-[3deg]", delay: 0.6 },
  { icon: Heart, label: "Long-Term Partnerships", className: "left-10 top-64 rotate-[-2deg]", delay: 1.2 },
];

export function HeroVisual() {
  // Both the server and the client's first paint always render with
  // animate=false, so hydration can never diff a computed motion style.
  // Only after mount (a genuine post-hydration effect) do the badges
  // start floating.
  const [mounted, setMounted] = useState(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  const animate = mounted && !prefersReducedMotion;

  return (
    <div className="relative hidden h-96 lg:block" aria-hidden="true">
      <div
        className="absolute left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(180,83,9,0.35), rgba(217,119,6,0.15) 60%, transparent 75%)",
        }}
      />

      {BADGES.map(({ icon: Icon, label, className, delay }) => (
        <motion.div
          key={label}
          className={`glass-panel absolute flex items-center gap-3 rounded-2xl px-4 py-3 shadow-soft-lg ${className}`}
          animate={animate ? { y: [0, -12, 0] } : { y: 0 }}
          transition={
            animate ? { duration: 5, repeat: Infinity, ease: "easeInOut", delay } : { duration: 0 }
          }
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Icon className="size-4" strokeWidth={1.75} />
          </span>
          <span className="text-sm font-semibold text-navy-900">{label}</span>
        </motion.div>
      ))}
    </div>
  );
}
