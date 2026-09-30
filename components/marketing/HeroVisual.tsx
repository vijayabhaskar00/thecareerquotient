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
      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
        <Clock className="size-5" strokeWidth={1.75} />
      </span>
      <div>
        <p className="text-lg font-bold leading-none text-ink">12 days</p>
        <p className="mt-1 text-xs text-ink-soft">Avg. time to fill</p>
      </div>
    </>
  );

  return (
    <div className="relative mx-auto w-full max-w-lg lg:h-[34rem] lg:max-w-none">
      {/* orbit rings */}
      <div className="pointer-events-none absolute inset-0 hidden items-center justify-center lg:flex" aria-hidden="true">
        <div className="absolute size-[30rem] rounded-full border border-line" />
        <div className="animate-orbit absolute size-[22rem] rounded-full border border-dashed border-accent/30">
          <span className="absolute -top-2 left-1/2 size-4 -translate-x-1/2 rounded-full bg-accent shadow-glow" />
          <span className="absolute -bottom-1.5 left-[18%] size-3 rounded-full bg-aurora-cyan" />
        </div>
        <div className="animate-orbit-rev absolute size-[15rem] rounded-full border border-line">
          <span className="absolute -right-1.5 top-1/2 size-3 -translate-y-1/2 rounded-full bg-aurora-violet" />
        </div>
        <div className="absolute size-72 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.45),rgba(34,211,238,0.12)_55%,transparent_72%)] blur-2xl" />
      </div>

      <div
        className="glass-panel relative w-full overflow-hidden rounded-3xl p-6 shadow-soft-lg backdrop-blur-[24px] lg:absolute lg:left-1/2 lg:top-1/2 lg:w-80 lg:-translate-x-1/2 lg:-translate-y-1/2"
        role="status"
        aria-live="polite"
      >
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-accent">Role Match</p>

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
                    background: `conic-gradient(var(--color-accent) 0% ${match.score}%, rgba(255,255,255,0.1) ${match.score}% 100%)`,
                  }}
                  aria-hidden="true"
                />
                <div className="absolute inset-[3px] flex items-center justify-center rounded-full bg-surface">
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
                  i === index ? "w-4 bg-accent" : "w-1 bg-line"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="glass-panel animate-float relative mt-4 flex w-fit items-center gap-3 rounded-2xl px-5 py-4 shadow-soft-lg backdrop-blur-[20px] lg:absolute lg:-right-2 lg:bottom-10 lg:mt-0">
        {statCard}
      </div>
    </div>
  );
}
