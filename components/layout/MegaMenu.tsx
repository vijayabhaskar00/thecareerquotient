"use client";

import { useId, useState } from "react";
import Link from "next/link";

export interface MegaMenuItem {
  slug: string;
  name: string;
  tagline: string;
}

interface MegaMenuProps {
  label: string;
  basePath: string;
  overviewHref: string;
  items: MegaMenuItem[];
}

export function MegaMenu({ label, basePath, overviewHref, items }: MegaMenuProps) {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  return (
    <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        type="button"
        className="focus-ring flex items-center gap-1 rounded-full px-3 py-1.5 text-sm text-ink-soft transition-colors duration-200 hover:bg-line-soft hover:text-ink"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
      >
        {label}
      </button>
      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute left-0 top-full z-40 mt-3 grid w-80 grid-cols-1 gap-1 rounded-2xl border border-line bg-surface p-4 shadow-soft-lg before:absolute before:inset-x-0 before:-top-3 before:h-3 before:content-['']"
        >
          <Link
            href={overviewHref}
            role="menuitem"
            className="focus-ring rounded-lg px-3 py-2 font-semibold text-ink"
            onClick={() => setOpen(false)}
          >
            All {label}
          </Link>
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`${basePath}/${item.slug}`}
              role="menuitem"
              className="focus-ring rounded-lg px-3 py-2 text-sm text-ink-soft hover:bg-line-soft"
              onClick={() => setOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
