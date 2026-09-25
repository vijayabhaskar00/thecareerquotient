"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Clock } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

const ROTATION_MS = 2000;

const MATCHES = [
  { role: "Senior Engineer", score: 94, signals: ["Skills aligned", "Experience verified", "Culture fit assessed"] },
  { role: "Product Manager", score: 91, signals: ["Stakeholder experience", "Roadmap ownership", "Culture fit assessed"] },
  { role: "Data Analyst", score: 96, signals: ["SQL proficiency", "Experience verified", "Communication skills"] },
  { role: "Sales Director", score: 89, signals: ["Territory expertise", "Client relationships", "Culture fit assessed"] },
];

export function HeroVisual() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % MATCHES.length), ROTATION_MS);
    return () => clearInterval(id);
  }, [prefersReducedMotion]);

  const match = MATCHES[index];

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
    <div className="relative hidden h-[26rem] lg:block">
      <div
        className="absolute left-1/2 top-1/2 size-80 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background: "radial-gradient(circle, rgba(180,83,9,0.35), rgba(217,119,6,0.15) 60%, transparent 75%)",
        }}
        aria-hidden="true"
      />

      <div
        className="glass-panel absolute left-4 top-6 w-80 overflow-hidden rounded-3xl p-6 shadow-soft-lg backdrop-blur-[20px]"
        role="status"
        aria-live="polite"
      >
        <p className="text-xs font-semibold uppercase tracking-wide text-navy-700">Role Match</p>

        <AnimatePresence mode="wait">
          <motion.div
            key={match.role}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="mt-4 flex items-center gap-4">
              <div className="relative size-16 shrink-0">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(var(--color-accent) 0% ${match.score}%, var(--color-border) ${match.score}% 100%)`,
                  }}
                  aria-hidden="true"
                />
                <div className="absolute inset-[3px] flex items-center justify-center rounded-full bg-white">
                  <span className="text-base font-bold text-navy-900">{match.score}%</span>
                </div>
              </div>
              <div>
                <p className="font-semibold text-navy-900">{match.role}</p>
                <p className="text-sm text-navy-700">Match confidence</p>
              </div>
            </div>

            <ul className="mt-5 space-y-2 border-t border-navy-100 pt-4 text-sm text-navy-700">
              {match.signals.map((signal) => (
                <li key={signal} className="flex items-center gap-2">
                  <Check className="size-4 shrink-0 text-accent" strokeWidth={2.5} />
                  {signal}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>

        {!prefersReducedMotion && (
          <div className="mt-5 flex justify-center gap-1.5" aria-hidden="true">
            {MATCHES.map((m, i) => (
              <span
                key={m.role}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === index ? "w-4 bg-accent" : "w-1 bg-navy-100"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {prefersReducedMotion ? (
        <div className="glass-panel absolute bottom-8 right-2 flex items-center gap-3 rounded-2xl px-5 py-4 shadow-soft-lg backdrop-blur-[20px]">
          {statCard}
        </div>
      ) : (
        <motion.div
          className="glass-panel absolute bottom-8 right-2 flex items-center gap-3 rounded-2xl px-5 py-4 shadow-soft-lg backdrop-blur-[20px]"
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
