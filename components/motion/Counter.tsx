"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

interface CounterProps {
  value: number;
  suffix?: string;
  durationSeconds?: number;
}

export function Counter({ value, suffix = "", durationSeconds = 1.5 }: CounterProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [displayValue, setDisplayValue] = useState(prefersReducedMotion ? value : 0);

  useEffect(() => {
    if (prefersReducedMotion) {
      // Snaps to the final value if the OS-level reduced-motion setting
      // changes while mounted; the initial render already gets this right
      // via the lazy useState above, so this only fires on a real toggle.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayValue(value);
      return;
    }
    const controls = animate(0, value, {
      duration: durationSeconds,
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [value, durationSeconds, prefersReducedMotion]);

  return (
    <span aria-label={`${value}${suffix}`}>
      {displayValue}
      {suffix}
    </span>
  );
}
