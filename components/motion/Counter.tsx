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
