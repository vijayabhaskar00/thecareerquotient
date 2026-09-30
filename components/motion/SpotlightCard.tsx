"use client";

import type { MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  as?: "article" | "div" | "li";
}

/** Card whose border glow follows the cursor. Falls back to a plain card without JS. */
export function SpotlightCard({ children, className, as: Tag = "article" }: SpotlightCardProps) {
  function onMove(e: MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }

  return (
    <Tag onMouseMove={onMove} className={cn("spotlight", className)}>
      {children}
    </Tag>
  );
}
