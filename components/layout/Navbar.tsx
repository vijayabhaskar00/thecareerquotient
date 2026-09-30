import Link from "next/link";
import { services } from "@/content/services/data";
import { industries } from "@/content/industries/data";
import { MegaMenu } from "./MegaMenu";
import { MobileNavbar } from "./MobileNavbar";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/marketing/LogoMark";

const NAV_LINKS = [
  { href: "/find-jobs", label: "Candidates" },
  { href: "/about", label: "About" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-background/95 backdrop-blur-[8px]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="focus-ring flex items-center gap-2.5 rounded text-lg font-bold tracking-tight text-ink">
          <LogoMark />
          TheCareerQuotient
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          <MegaMenu
            label="Solutions"
            basePath="/services"
            overviewHref="/services"
            items={services.map((s) => ({ slug: s.slug, name: s.name, tagline: s.tagline }))}
          />
          <MegaMenu
            label="Industries"
            basePath="/industries"
            overviewHref="/industries"
            items={industries.map((i) => ({ slug: i.slug, name: i.name, tagline: i.intro }))}
          />
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring rounded-md px-3 py-2 text-sm font-medium text-ink-soft transition-colors duration-150 hover:bg-line-soft hover:text-ink"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button render={<Link href="/hire-talent">Hire Talent</Link>} />
        </div>

        <MobileNavbar
          services={services.map((s) => ({ slug: s.slug, name: s.name }))}
          industries={industries.map((i) => ({ slug: i.slug, name: i.name }))}
        />
      </div>
    </header>
  );
}
