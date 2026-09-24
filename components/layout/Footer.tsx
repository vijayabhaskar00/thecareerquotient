import Link from "next/link";
import { services } from "@/content/services/data";

const CANDIDATE_LINKS = [
  { href: "/find-jobs", label: "Find Jobs" },
  { href: "/find-jobs", label: "Submit Resume" },
  { href: "/insights", label: "Career Resources" },
  { href: "/contact", label: "Candidate Support" },
];

const EMPLOYER_LINKS = [
  { href: "/hire-talent", label: "Hire Talent" },
  { href: "/services", label: "Workforce Solutions" },
  { href: "/industries", label: "Industries" },
];

const COMPANY_LINKS = [
  { href: "/about", label: "About" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/accessibility", label: "Accessibility" },
  { href: "/cookie-policy", label: "Cookie Policy" },
];

interface FooterColumnProps {
  title: string;
  links: { href: string; label: string }[];
}

function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <p className="text-sm font-semibold uppercase tracking-wide text-navy-100">{title}</p>
      <ul className="mt-3 flex flex-col gap-2">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link href={link.href} className="focus-ring rounded text-sm text-offwhite/90 hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-navy-100 bg-navy-900 text-offwhite">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-1">
          <p className="text-lg font-bold">TheCareerQuotient</p>
          <p className="mt-3 text-sm text-navy-100">
            Human-first staffing and workforce solutions, built for how hiring actually works.
          </p>
        </div>

        <FooterColumn title="Solutions" links={services.map((s) => ({ href: `/services/${s.slug}`, label: s.name }))} />
        <FooterColumn title="Candidates" links={CANDIDATE_LINKS} />
        <FooterColumn title="Employers" links={EMPLOYER_LINKS} />
        <FooterColumn title="Company" links={COMPANY_LINKS} />
      </div>

      <div className="border-t border-navy-700">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-sm text-navy-100 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>&copy; {year} TheCareerQuotient. All rights reserved.</p>
          <nav aria-label="Legal" className="flex flex-wrap gap-4">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="focus-ring rounded hover:text-white">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
