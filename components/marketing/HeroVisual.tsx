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

  return (
    <div className="grid gap-4 sm:grid-cols-[1fr_auto] lg:grid-cols-1">
      <div className="rounded-xl border border-line bg-surface-2 p-6 shadow-soft" role="status" aria-live="polite">
        <p className="text-sm font-bold text-ink">Role Match</p>

        <AnimatePresence mode="wait">
          <motion.div
            key={match.role}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="mt-4 flex items-center gap-4">
              <div className="relative size-16 shrink-0">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(var(--accent) 0% ${match.score}%, rgba(13,43,36,0.12) ${match.score}% 100%)`,
                  }}
                  aria-hidden="true"
                />
                <div className="absolute inset-[5px] flex items-center justify-center rounded-full bg-surface-2">
                  <span className="text-base font-bold text-ink">{match.score}%</span>
                </div>
              </div>
              <div>
                <p className="font-semibold text-ink">{match.role}</p>
                <p className="text-sm text-ink-soft">Match confidence</p>
              </div>
            </div>

            <ul className="mt-5 space-y-2 border-t border-line pt-4 text-sm text-ink-soft">
              {match.signals.map((signal) => (
                <li key={signal} className="flex items-center gap-2">
                  <Check className="size-4 shrink-0 text-accent-ink" strokeWidth={2.5} />
                  {signal}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-forest px-6 py-5 text-sage sm:self-end lg:self-auto">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-ink">
          <Clock className="size-5" strokeWidth={2} />
        </span>
        <div>
          <p className="text-xl font-bold leading-none text-white">12 days</p>
          <p className="mt-1 text-xs text-sage/80">Avg. time to fill</p>
        </div>
      </div>
    </div>
  );
}
