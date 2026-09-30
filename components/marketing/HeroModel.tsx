"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

const SRC = "/models/career-match.glb";
const POSTER = "/models/career-match-poster.webp";
const ALT =
  "A 3D sculpture of an open ring with an orange sphere sliding into its opening, a symbol for a candidate matching a role.";

/** Playback speed of the dot's dock/release loop (the source clip is 4s). */
const TIME_SCALE = 2.4;
/** Sway of the camera either side of straight-on, in degrees. */
const SWAY_DEG = 22;
const SWAY_PERIOD_MS = 3200;
/** Fixed framing: ring plus the dot's travel path, centred between them. */
const ORBIT_RADIUS = "7.5m";
const TARGET = "0.3m 0m 0m";

/**
 * The brand mark as a 3D object built in Higgsfield's scene builder: the orange
 * dot slides into the ring's opening (the match), then releases. The static
 * poster shows until the viewer has loaded, and stays for reduced-motion users
 * or if WebGL is unavailable.
 */
export function HeroModel({ className }: { className?: string }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [ready, setReady] = useState(false);
  const viewerRef = useRef<HTMLElement | null>(null);

  // Load the web component only in the browser, only when motion is welcome.
  useEffect(() => {
    if (prefersReducedMotion) return;
    let cancelled = false;
    import("@google/model-viewer")
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch(() => {
        /* keep the poster */
      });
    return () => {
      cancelled = true;
    };
  }, [prefersReducedMotion]);

  // Camera sway, paused while the tab is hidden.
  useEffect(() => {
    if (!ready) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const el = viewerRef.current as (HTMLElement & { cameraOrbit?: string; timeScale?: number }) | null;
      // model-viewer resets timeScale when the model finishes loading, so keep asserting it.
      if (el && el.timeScale !== TIME_SCALE) el.timeScale = TIME_SCALE;
      if (el && !document.hidden) {
        const angle = Math.sin(((now - start) / SWAY_PERIOD_MS) * Math.PI * 2) * SWAY_DEG;
        el.cameraOrbit = `${angle.toFixed(2)}deg 90deg ${ORBIT_RADIUS}`;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [ready]);

  return (
    <div className={className}>
      {ready ? (
        <model-viewer
          ref={viewerRef}
          src={SRC}
          poster={POSTER}
          alt={ALT}
          autoplay
          animation-name="Match_Dot"
          camera-orbit={`0deg 90deg ${ORBIT_RADIUS}`}
          camera-target={TARGET}
          field-of-view="30deg"
          shadow-intensity="0"
          exposure="1.05"
          interaction-prompt="none"
          style={{ width: "100%", height: "100%", background: "transparent", pointerEvents: "none" }}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={POSTER} alt={ALT} className="size-full object-contain" width={816} height={816} />
      )}
    </div>
  );
}
