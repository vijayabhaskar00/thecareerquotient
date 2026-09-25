"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

interface MobileSubLink {
  slug: string;
  name: string;
}

interface MobileNavbarProps {
  services?: MobileSubLink[];
  industries?: MobileSubLink[];
}

const TRAILING_LINKS = [
  { href: "/find-jobs", label: "Candidates" },
  { href: "/about", label: "About" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export function MobileNavbar({ services = [], industries = [] }: MobileNavbarProps) {
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
        <DialogContent className="flex h-full max-h-none w-full max-w-none flex-col gap-6 overflow-y-auto rounded-none p-6">
          <DialogTitle className="text-lg font-bold">Menu</DialogTitle>
          <nav className="flex flex-col" aria-label="Mobile">
            <Accordion multiple>
              <AccordionItem value="solutions">
                <AccordionTrigger className="px-3 py-2.5 text-lg font-normal text-navy-900 hover:no-underline">
                  Solutions
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-1 pl-3">
                    <Link
                      href="/services"
                      className="focus-ring rounded-xl px-3 py-2 font-semibold text-navy-900 hover:bg-navy-50"
                      onClick={() => setOpen(false)}
                    >
                      All Solutions
                    </Link>
                    {services.map((service) => (
                      <Link
                        key={service.slug}
                        href={`/services/${service.slug}`}
                        className="focus-ring rounded-xl px-3 py-2 text-navy-700 hover:bg-navy-50"
                        onClick={() => setOpen(false)}
                      >
                        {service.name}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="industries">
                <AccordionTrigger className="px-3 py-2.5 text-lg font-normal text-navy-900 hover:no-underline">
                  Industries
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-1 pl-3">
                    <Link
                      href="/industries"
                      className="focus-ring rounded-xl px-3 py-2 font-semibold text-navy-900 hover:bg-navy-50"
                      onClick={() => setOpen(false)}
                    >
                      All Industries
                    </Link>
                    {industries.map((industry) => (
                      <Link
                        key={industry.slug}
                        href={`/industries/${industry.slug}`}
                        className="focus-ring rounded-xl px-3 py-2 text-navy-700 hover:bg-navy-50"
                        onClick={() => setOpen(false)}
                      >
                        {industry.name}
                      </Link>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {TRAILING_LINKS.map((link) => (
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
