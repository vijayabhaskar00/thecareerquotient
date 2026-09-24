import Link from "next/link";
import { services } from "@/content/services/data";
import { industries } from "@/content/industries/data";
import { MegaMenu } from "./MegaMenu";
import { MobileNavbar } from "./MobileNavbar";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/find-jobs", label: "Candidates" },
  { href: "/about", label: "About" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  return (
    <header className="glass-panel sticky top-0 z-50 shadow-soft">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="focus-ring rounded text-lg font-bold text-navy-900">
          TheCareerQuotient
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Primary">
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
              className="focus-ring rounded-full px-3 py-1.5 text-navy-700 transition-colors duration-200 hover:bg-white hover:text-navy-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button render={<Link href="/hire-talent">Hire Talent</Link>} />
        </div>

        <MobileNavbar />
      </div>
    </header>
  );
}
