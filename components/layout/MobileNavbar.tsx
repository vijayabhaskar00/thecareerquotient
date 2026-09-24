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
        className="focus-ring flex h-11 w-11 items-center justify-center rounded"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen(true)}
      >
        <Menu aria-hidden="true" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex h-full max-h-none w-full max-w-none flex-col gap-6 rounded-none p-6">
          <DialogTitle className="text-lg font-bold">Menu</DialogTitle>
          <nav className="flex flex-col gap-4" aria-label="Mobile">
            {MOBILE_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="focus-ring rounded py-2 text-lg text-navy-900"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Button asChild size="lg" className="mt-auto">
            <Link href="/hire-talent" onClick={() => setOpen(false)}>
              Hire Talent
            </Link>
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
