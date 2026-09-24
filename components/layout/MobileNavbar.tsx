"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const MOBILE_LINKS = [
  { href: "/services", label: "Solutions" },
  { href: "/industries", label: "Industries" },
  { href: "/find-jobs", label: "Candidates" },
  { href: "/about", label: "About" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export function MobileNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="focus-ring flex size-10 items-center justify-center rounded-full text-navy-900 transition-colors duration-200 hover:bg-white"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen(true)}
      >
        <Menu aria-hidden="true" className="size-5" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex h-full max-h-none w-full max-w-none flex-col gap-6 rounded-none p-6">
          <DialogTitle className="text-lg font-bold">Menu</DialogTitle>
          <nav className="flex flex-col gap-4" aria-label="Mobile">
            {MOBILE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="focus-ring rounded-xl px-3 py-2.5 text-lg text-navy-900 transition-colors duration-200 hover:bg-navy-50 active:bg-navy-100"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Button
            size="lg"
            className="mt-auto"
            render={
              <Link href="/hire-talent" onClick={() => setOpen(false)}>
                Hire Talent
              </Link>
            }
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
