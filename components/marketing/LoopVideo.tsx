"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

interface LoopVideoProps {
  /** Path without extension: expects `<src>.webm` and `<src>.mp4` in /public. */
  src: string;
  poster: string;
  className?: string;
  /** 1 = as rendered. Higher plays the loop faster. */
  playbackRate?: number;
  /** Skip the video (and its download) below this viewport width, in px. */
  minWidth?: number;
}

/**
 * Decorative looping background video. Shows only the poster until it is near
 * the viewport, pauses when scrolled away, and stays a still image for users who
 * prefer reduced motion or are on a narrow screen.
 */
export function LoopVideo({ src, poster, className, playbackRate = 1, minWidth = 768 }: LoopVideoProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [wide, setWide] = useState(false);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${minWidth}px)`);
    const update = () => setWide(mq.matches);
    mq.addEventListener("change", update);
    update();
    return () => mq.removeEventListener("change", update);
  }, [minWidth]);

  // Start fetching shortly before the section scrolls into view; pause when it leaves.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setNear(true);
        const v = videoRef.current;
        if (!v) return;
        if (entry.isIntersecting) void v.play().catch(() => {});
        else v.pause();
      },
      { rootMargin: "200px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const showVideo = wide && near && !prefersReducedMotion;

  return (
    <div ref={wrapRef} className={className} aria-hidden="true">
      {showVideo ? (
        <video
          ref={videoRef}
          className="size-full object-cover"
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          tabIndex={-1}
          // Some browsers reset the rate on play or loop, so re-apply it.
          onLoadedMetadata={(e) => (e.currentTarget.playbackRate = playbackRate)}
          onPlay={(e) => {
            if (e.currentTarget.playbackRate !== playbackRate) e.currentTarget.playbackRate = playbackRate;
          }}
        >
          <source src={`${src}.webm`} type="video/webm" />
          <source src={`${src}.mp4`} type="video/mp4" />
        </video>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt="" className="size-full object-cover" width={1280} height={716} />
      )}
    </div>
  );
}
