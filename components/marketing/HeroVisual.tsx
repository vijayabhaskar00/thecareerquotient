"use client";

import { motion } from "framer-motion";
import { Check, Clock } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

const SIGNALS = ["Skills aligned", "Experience verified", "Culture fit assessed"];

export function HeroVisual() {
  const prefersReducedMotion = usePrefersReducedMotion();

  const matchCard = (
    <>
      <p className="text-xs font-semibold uppercase tracking-wide text-navy-700">Role Match</p>

      <div className="mt-4 flex items-center gap-4">
        <div className="relative size-16 shrink-0">
          <div
            className="absolute inset-0 rounded-full"
            style={{ background: "conic-gradient(var(--color-accent) 0% 94%, var(--color-border) 94% 100%)" }}
          />
          <div className="absolute inset-[3px] flex items-center justify-center rounded-full bg-white">
            <span className="text-base font-bold text-navy-900">94%</span>
          </div>
        </div>
        <div>
          <p className="font-semibold text-navy-900">Senior Engineer</p>
          <p className="text-sm text-navy-700">Match confidence</p>
        </div>
      </div>

      <ul className="mt-5 space-y-2 border-t border-navy-100 pt-4 text-sm text-navy-700">
        {SIGNALS.map((signal) => (
          <li key={signal} className="flex items-center gap-2">
            <Check className="size-4 shrink-0 text-accent" strokeWidth={2.5} />
            {signal}
          </li>
        ))}
      </ul>
    </>
  );

  const statCard = (
    <>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
        <Clock className="size-5" strokeWidth={1.75} />
      </span>
      <div>
        <p className="text-lg font-bold leading-none text-navy-900">12 days</p>
        <p className="mt-1 text-xs text-navy-700">Avg. time to fill</p>
      </div>
    </>
  );

  return (
    <div className="relative hidden h-[26rem] lg:block" aria-hidden="true">
      <div
        className="absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(180,83,9,0.35), rgba(217,119,6,0.15) 60%, transparent 75%)",
        }}
      />

      {prefersReducedMotion ? (
        <div className="glass-panel absolute left-4 top-6 w-80 rounded-3xl p-6 shadow-soft-lg">{matchCard}</div>
      ) : (
        <motion.div
          className="glass-panel absolute left-4 top-6 w-80 rounded-3xl p-6 shadow-soft-lg"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={{ hidden: { opacity: 0, y: 16, scale: 0.97 }, show: { opacity: 1, y: 0, scale: 1 } }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {matchCard}
        </motion.div>
      )}

      {prefersReducedMotion ? (
        <div className="glass-panel absolute bottom-8 right-2 flex items-center gap-3 rounded-2xl px-5 py-4 shadow-soft-lg">
          {statCard}
        </div>
      ) : (
        <motion.div
          className="glass-panel absolute bottom-8 right-2 flex items-center gap-3 rounded-2xl px-5 py-4 shadow-soft-lg"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          variants={{ hidden: { opacity: 0, y: 16, scale: 0.97 }, show: { opacity: 1, y: 0, scale: 1 } }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
        >
          {statCard}
        </motion.div>
      )}
    </div>
  );
}
