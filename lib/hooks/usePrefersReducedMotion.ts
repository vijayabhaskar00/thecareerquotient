"use client";

import { useEffect, useState } from "react";

export function usePrefersReducedMotion(): boolean {
  // Starts false to match the server-rendered markup; the real value is
  // applied post-mount so the client's first render doesn't diverge from
  // the server's and trigger a hydration mismatch.
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}
