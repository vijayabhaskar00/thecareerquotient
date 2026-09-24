# TheCareerQuotient Marketing Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the TheCareerQuotient static marketing site (home, services, industries, about, insights, contact, hire-talent, find-jobs, legal) as a production-grade Next.js app — no job board, no accounts, no CMS/DB.

**Architecture:** Next.js 15 App Router + TypeScript, content-driven via typed TS data modules (services/industries) and MDX (insights articles), styled with Tailwind + shadcn/ui primitives, animated with Framer Motion gated behind `prefers-reduced-motion`. Forms use react-hook-form + zod validation with an isolated stub submit layer swappable for real delivery later.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, react-hook-form, zod, gray-matter + next-mdx-remote/rsc, Vitest + React Testing Library + jsdom.

**Spec:** `docs/superpowers/specs/2026-09-24-marketing-site-design.md`

## Global Constraints

- No fabricated statistics, testimonials, client logos, or awards anywhere (spec §11). Components render a neutral fallback when real data is absent.
- No job board / job search UI / JobPosting schema anywhere (spec §1, §5).
- No candidate/employer accounts, admin CMS, or database in this phase (spec §1).
- Forms: client-side validation + isolated stub submit handler per form; swapping real delivery later must not require editing form components (spec §6).
- WCAG 2.2 AA target: semantic HTML, keyboard nav, visible focus, alt text, 44px min touch target (spec §8).
- Animation must respect `prefers-reduced-motion: reduce` (spec §10).
- Content lives in typed TS data modules / MDX, not hardcoded inside page JSX (spec §3).
- No placeholder `#` links in production pages.
- Legal pages contain structural placeholders explicitly marked as pending counsel review — never invented legal claims (brief §32).

## Review Focus

1. **Failed form submission** — network/stub failure must render visible error UI, never fail silently. Test: mock submit rejection, assert error message shown.
2. **Invalid resume upload** — wrong file type or file over 5MB on the CandidateForm must be rejected client-side with a clear message before any submit attempt.
3. **Unknown dynamic route** — `/services/not-a-real-slug` and `/industries/not-a-real-slug` must render Next's `notFound()` (404), not throw or render empty.
4. **Reduced-motion preference** — `Counter` and `ScrollReveal` must show final state immediately with no animation when `prefers-reduced-motion: reduce` is set.
5. **Content data integrity** — duplicate slugs or missing required fields in services/industries data must fail a test before any page can render a broken route.

---

## File Structure

```
thecareerquotient/
  package.json, tsconfig.json, next.config.ts, tailwind.config.ts, postcss.config.js
  vitest.config.ts, vitest.setup.ts, .eslintrc.json
  app/
    layout.tsx, globals.css, page.tsx, not-found.tsx, sitemap.ts, robots.ts
    services/page.tsx, services/[slug]/page.tsx
    industries/page.tsx, industries/[slug]/page.tsx
    about/page.tsx
    insights/page.tsx, insights/[slug]/page.tsx
    hire-talent/page.tsx, find-jobs/page.tsx, contact/page.tsx
    privacy/page.tsx, terms/page.tsx, cookie-policy/page.tsx
    accessibility/page.tsx, candidate-privacy/page.tsx, employer-terms/page.tsx
  components/
    layout/Navbar.tsx, MegaMenu.tsx, MobileNavbar.tsx, Footer.tsx, CookieBanner.tsx
    ui/ (shadcn-generated primitives)
    motion/ScrollReveal.tsx, Counter.tsx
    marketing/Hero.tsx, CTASection.tsx, StatsSection.tsx, ServiceCard.tsx,
      IndustryCard.tsx, ProcessTimeline.tsx, Testimonial.tsx, ArticleCard.tsx,
      FAQAccordion.tsx, Breadcrumbs.tsx, LegalPageLayout.tsx
    states/LoadingSkeleton.tsx, EmptyState.tsx, ErrorState.tsx
    forms/ContactForm.tsx, EmployerForm.tsx, CandidateForm.tsx
    seo/JsonLd.tsx
  content/
    services/types.ts, services/data.ts
    industries/types.ts, industries/data.ts
    team.ts, values.ts
    insights/*.mdx (3 seed articles)
  lib/
    hooks/usePrefersReducedMotion.ts
    validation/formSchemas.ts
    forms/submitForm.ts
    seo/metadata.ts, seo/jsonld.ts
    content/insights.ts
```

---

### Task 1: Project Scaffold & Tooling

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.js`, `vitest.config.ts`, `vitest.setup.ts`, `.eslintrc.json`, `.gitignore`
- Create: `app/layout.tsx` (minimal placeholder), `app/page.tsx` (minimal placeholder), `app/globals.css` (empty, filled in Task 2)

**Interfaces:**
- Produces: a working `npm run dev`, `npm run build`, `npm test`, `npm run lint` pipeline every later task relies on.

- [ ] **Step 1: Scaffold Next.js app**

Run:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias "@/*" --no-turbopack
```
When prompted, accept defaults. This creates `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`, `postcss.config.js`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `.eslintrc.json`, `.gitignore`.

- [ ] **Step 2: Install additional dependencies**

Run:
```bash
npm install framer-motion react-hook-form @hookform/resolvers zod gray-matter next-mdx-remote reading-time lucide-react clsx tailwind-merge class-variance-authority
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event vite-tsconfig-paths
```

- [ ] **Step 3: Configure Vitest**

Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
  },
});
```

Create `vitest.setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";

if (typeof window !== "undefined") {
  if (!window.matchMedia) {
    window.matchMedia = (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
  }

  class MockIntersectionObserver implements IntersectionObserver {
    readonly root: Element | null = null;
    readonly rootMargin: string = "";
    readonly thresholds: ReadonlyArray<number> = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  // @ts-expect-error jsdom has no IntersectionObserver
  window.IntersectionObserver = MockIntersectionObserver;
}
```

Add to `package.json` `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 4: Write a scaffold smoke test to verify the pipeline**

Create `lib/__smoke__.test.ts`:
```ts
import { describe, it, expect } from "vitest";

describe("scaffold smoke test", () => {
  it("runs under vitest with jsdom", () => {
    expect(typeof window).toBe("object");
    expect(window.matchMedia("(prefers-reduced-motion: reduce)").matches).toBe(false);
  });
});
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test`
Expected: PASS (1 test).

- [ ] **Step 6: Initialize shadcn/ui**

Run:
```bash
npx shadcn@latest init -d
```
Accept the generated `components.json` (base color: neutral, CSS variables: yes).

- [ ] **Step 7: Verify build**

Run: `npm run build`
Expected: build succeeds with the default Next.js starter page.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with Tailwind, Vitest, shadcn/ui"
```

---

### Task 2: Design Tokens & Global Styles

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`
- Create: `lib/fonts.ts`
- Test: `lib/fonts.test.ts`

**Interfaces:**
- Produces: Tailwind theme tokens `colors.navy`, `colors.offwhite`, `colors.accent` (cobalt), and `fontFamily.sans` wired to the loaded variable font; `lib/fonts.ts` exports `fontSans: { variable: string }`.

- [ ] **Step 1: Write a failing test asserting the font module exports a CSS variable name**

Create `lib/fonts.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { fontSans } from "./fonts";

describe("fontSans", () => {
  it("exposes a CSS variable class for next/font", () => {
    expect(fontSans.variable).toMatch(/^__variable_/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/fonts.test.ts`
Expected: FAIL — `lib/fonts.ts` does not exist.

- [ ] **Step 3: Implement font loader**

Create `lib/fonts.ts`:
```ts
import { Plus_Jakarta_Sans } from "next/font/google";

export const fontSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/fonts.test.ts`
Expected: PASS.

- [ ] **Step 5: Extend Tailwind theme with design tokens**

Modify `tailwind.config.ts` — replace the `theme` key:
```ts
theme: {
  extend: {
    colors: {
      navy: {
        DEFAULT: "#0B1220",
        50: "#F4F6FA",
        100: "#E4E9F2",
        700: "#1B2740",
        900: "#0B1220",
      },
      offwhite: "#FAF9F6",
      accent: {
        DEFAULT: "#2557E8",
        light: "#5C82F0",
      },
    },
    fontFamily: {
      sans: ["var(--font-sans)", "system-ui", "sans-serif"],
    },
    fontSize: {
      "display-lg": ["clamp(2.5rem, 5vw + 1rem, 5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
      "display-md": ["clamp(2rem, 3vw + 1rem, 3.25rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
    },
  },
},
```

- [ ] **Step 6: Write global styles**

Replace `app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: light;
  }
}

body {
  @apply bg-offwhite text-navy-900 antialiased;
}

a {
  @apply underline-offset-4;
}

.focus-ring {
  @apply outline-none ring-2 ring-accent ring-offset-2 ring-offset-offwhite;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Note: this site is light-mode only by design (spec §4 defines one palette); the dark-mode media block above intentionally pins `color-scheme: light` rather than introducing a second palette, so form controls don't mismatch the fixed brand colors.

- [ ] **Step 7: Run full test suite and build**

Run: `npm test && npm run build`
Expected: all tests PASS, build succeeds.

- [ ] **Step 8: Commit**

```bash
git add tailwind.config.ts app/globals.css lib/fonts.ts lib/fonts.test.ts
git commit -m "feat: add design tokens, fonts, and global styles"
```

---

### Task 3: Content Layer — Services

**Files:**
- Create: `content/services/types.ts`
- Create: `content/services/data.ts`
- Test: `content/services/data.test.ts`

**Interfaces:**
- Produces: `Service` interface `{ slug: string; name: string; tagline: string; summary: string; features: string[]; ctaLabel: string }` and `services: Service[]` (exactly 7 entries) — consumed by Tasks 11, 20.

- [ ] **Step 1: Write failing data-integrity test**

Create `content/services/data.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { services } from "./data";

describe("services data", () => {
  it("has exactly 7 services", () => {
    expect(services).toHaveLength(7);
  });

  it("has unique slugs", () => {
    const slugs = services.map((s) => s.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has complete, real content for every service", () => {
    for (const service of services) {
      expect(service.name.length).toBeGreaterThan(0);
      expect(service.tagline.length).toBeGreaterThan(0);
      expect(service.summary.length).toBeGreaterThan(40);
      expect(service.features.length).toBeGreaterThanOrEqual(3);
      expect(service.ctaLabel.length).toBeGreaterThan(0);
      expect(service.summary.toLowerCase()).not.toContain("lorem");
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- content/services/data.test.ts`
Expected: FAIL — `./data` does not exist.

- [ ] **Step 3: Define the Service type**

Create `content/services/types.ts`:
```ts
export interface Service {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  features: string[];
  ctaLabel: string;
}
```

- [ ] **Step 4: Author the 7 services**

Create `content/services/data.ts`:
```ts
import type { Service } from "./types";

export const services: Service[] = [
  {
    slug: "contingent-staffing",
    name: "Contingent Staffing",
    tagline: "Flexible talent for changing workforce demands.",
    summary:
      "When workload shifts faster than your headcount can, contingent staffing gives you vetted professionals ready to start on your timeline — for a project, a season, or as long as the work requires.",
    features: [
      "Contract and temporary staffing",
      "Project-based professionals",
      "Rapid workforce scaling up or down",
      "Short-term and long-term assignments",
      "Pre-screened, ready-to-start talent",
    ],
    ctaLabel: "Explore Contingent Staffing",
  },
  {
    slug: "contract-to-hire",
    name: "Contract-to-Hire",
    tagline: "Evaluate talent before making a permanent commitment.",
    summary:
      "Bring someone onto your team on a contract basis first, see how they perform against real work and real deadlines, then convert to permanent employment once you're both certain it's the right fit.",
    features: [
      "Flexible initial engagement",
      "Structured candidate evaluation",
      "Reduced hiring risk",
      "Seamless conversion to permanent employment",
      "No re-onboarding when you convert",
    ],
    ctaLabel: "Explore Contract-to-Hire",
  },
  {
    slug: "direct-hire",
    name: "Direct Hire",
    tagline: "Find permanent professionals aligned with your business.",
    summary:
      "For roles you need to fill once and fill right, our direct hire process combines sourcing, technical evaluation, and cultural alignment so the person who joins your team is built to stay.",
    features: [
      "Targeted candidate sourcing",
      "Structured screening",
      "Technical evaluation",
      "Cultural alignment assessment",
      "Interview coordination",
      "Offer and onboarding support",
    ],
    ctaLabel: "Explore Direct Hire",
  },
  {
    slug: "executive-search",
    name: "Executive Search",
    tagline: "Identify leaders who can shape the future of your organization.",
    summary:
      "Leadership hires carry outsized consequences. Our executive search process maps the market, assesses candidates against your specific mandate, and validates references before a name ever reaches you.",
    features: [
      "C-suite, VP, and director-level search",
      "Confidential market mapping",
      "Structured executive assessment",
      "Reference and background validation",
      "Offer negotiation and transition support",
    ],
    ctaLabel: "Find Leadership Talent",
  },
  {
    slug: "employer-of-record",
    name: "Employer of Record",
    tagline: "Simplify employment administration.",
    summary:
      "Hire talent in new markets or structures without standing up the legal and administrative infrastructure yourself — we handle payroll, benefits, and compliance so you can focus on the work.",
    features: [
      "Payroll administration",
      "Benefits administration",
      "Employment documentation and compliance",
      "Onboarding and offboarding",
      "Ongoing workforce administration",
    ],
    ctaLabel: "Explore EOR",
  },
  {
    slug: "statement-of-work",
    name: "Statement of Work",
    tagline: "Outcome-based workforce delivery.",
    summary:
      "When you need a defined outcome delivered on a defined timeline, an SOW engagement puts scope, deliverables, and accountability in writing from day one — and keeps you informed as the work progresses.",
    features: [
      "Clearly defined scope and deliverables",
      "Fixed timeline and milestones",
      "Documented responsibilities",
      "Ongoing project governance",
      "Performance tracking and cost control",
    ],
    ctaLabel: "Explore SOW Solutions",
  },
  {
    slug: "high-volume-hiring",
    name: "High-Volume Hiring",
    tagline: "Build scalable hiring programs for rapidly growing organizations.",
    summary:
      "Opening a new site, launching a new shift, or scaling a team fast? High-volume hiring programs are built for throughput without losing the screening rigor that keeps quality high.",
    features: [
      "Mass recruitment campaigns",
      "Talent pipeline development",
      "Structured screening at scale",
      "Interview scheduling and coordination",
      "Recruitment operations support",
      "Hiring analytics and workforce planning",
    ],
    ctaLabel: "Scale Your Hiring",
  },
];
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- content/services/data.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add content/services
git commit -m "feat: add services content data"
```

---

### Task 4: Content Layer — Industries

**Files:**
- Create: `content/industries/types.ts`
- Create: `content/industries/data.ts`
- Test: `content/industries/data.test.ts`

**Interfaces:**
- Consumes: `services` from `content/services/data.ts` (Task 3) — each industry's `services` field must reference valid service slugs.
- Produces: `Industry` interface `{ slug, name, intro, challenges: string[], roles: string[], services: string[], faqs: { question: string; answer: string }[] }` and `industries: Industry[]` (exactly 8 entries) — consumed by Tasks 11, 21.

- [ ] **Step 1: Write failing data-integrity test**

Create `content/industries/data.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { industries } from "./data";
import { services } from "../services/data";

describe("industries data", () => {
  const serviceSlugs = new Set(services.map((s) => s.slug));

  it("has exactly 8 industries", () => {
    expect(industries).toHaveLength(8);
  });

  it("has unique slugs", () => {
    const slugs = industries.map((i) => i.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("has complete, real content and valid service references", () => {
    for (const industry of industries) {
      expect(industry.name.length).toBeGreaterThan(0);
      expect(industry.intro.length).toBeGreaterThan(40);
      expect(industry.challenges.length).toBeGreaterThanOrEqual(2);
      expect(industry.roles.length).toBeGreaterThanOrEqual(3);
      expect(industry.faqs.length).toBeGreaterThanOrEqual(2);
      for (const svc of industry.services) {
        expect(serviceSlugs.has(svc)).toBe(true);
      }
      expect(industry.intro.toLowerCase()).not.toContain("lorem");
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- content/industries/data.test.ts`
Expected: FAIL — `./data` does not exist.

- [ ] **Step 3: Define the Industry type**

Create `content/industries/types.ts`:
```ts
export interface IndustryFaq {
  question: string;
  answer: string;
}

export interface Industry {
  slug: string;
  name: string;
  intro: string;
  challenges: string[];
  roles: string[];
  services: string[];
  faqs: IndustryFaq[];
}
```

- [ ] **Step 4: Author the 8 industries**

Create `content/industries/data.ts`:
```ts
import type { Industry } from "./types";

export const industries: Industry[] = [
  {
    slug: "technology",
    name: "Technology",
    intro:
      "Technology teams compete for talent in a market where the best engineers have their pick of offers. We help you move fast without cutting corners on evaluation.",
    challenges: [
      "Competing against well-funded tech employers for scarce specialists",
      "Evaluating technical depth quickly and accurately",
      "Balancing urgent hiring needs with long-term team fit",
    ],
    roles: ["Software Engineering", "Cloud", "DevOps", "Cybersecurity", "Data", "AI/ML", "Product", "QA", "IT Infrastructure", "Enterprise Applications"],
    services: ["contingent-staffing", "contract-to-hire", "direct-hire", "high-volume-hiring"],
    faqs: [
      {
        question: "How quickly can you fill a specialized engineering role?",
        answer:
          "Timelines vary by specialty and seniority, but most direct hire searches produce a qualified shortlist within two to three weeks of a clear role brief.",
      },
      {
        question: "Do you support remote and distributed technology teams?",
        answer:
          "Yes. We recruit for remote, hybrid, and on-site technology roles and can source across multiple time zones depending on your team's structure.",
      },
    ],
  },
  {
    slug: "engineering",
    name: "Engineering",
    intro:
      "From mechanical design to industrial automation, engineering hiring demands people who can translate technical requirements into working systems.",
    challenges: [
      "Finding engineers with both technical rigor and hands-on production experience",
      "Regional talent shortages in specialized disciplines",
      "Long lead times for niche certifications and clearances",
    ],
    roles: ["Mechanical", "Electrical", "Civil", "Manufacturing", "Industrial", "Automotive", "Robotics"],
    services: ["contingent-staffing", "direct-hire", "statement-of-work"],
    faqs: [
      {
        question: "Can you source engineers with specific certifications?",
        answer: "Yes, we screen for licensure, certifications, and hands-on experience relevant to your discipline before any candidate reaches your desk.",
      },
      {
        question: "Do you support project-based engineering teams?",
        answer: "Yes, our statement of work engagements are built for defined engineering projects with clear deliverables and timelines.",
      },
    ],
  },
  {
    slug: "finance-accounting",
    name: "Finance & Accounting",
    intro:
      "Finance teams need people who can be trusted with the numbers on day one. We screen for both technical accuracy and sound judgment.",
    challenges: [
      "Verifying technical accounting and analytical skill before hire",
      "Filling seasonal peaks around close, audit, and tax cycles",
      "Finding candidates comfortable with your specific systems and controls",
    ],
    roles: ["Accounting", "FP&A", "Financial Analysis", "Audit", "Tax", "Banking", "Financial Operations"],
    services: ["contingent-staffing", "contract-to-hire", "direct-hire"],
    faqs: [
      {
        question: "Can you help with seasonal finance hiring, like close or audit season?",
        answer: "Yes, contingent staffing is built for exactly this kind of predictable, seasonal workload increase.",
      },
      {
        question: "Do you verify accounting credentials?",
        answer: "Yes, we confirm relevant certifications and licensure as part of every finance and accounting screening process.",
      },
    ],
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    intro:
      "Healthcare organizations can't afford hiring delays or mismatches. We combine credential verification with operational fit assessment.",
    challenges: [
      "Verifying licensure and credentials quickly and accurately",
      "Filling administrative and IT roles that support clinical teams",
      "Managing compliance requirements across roles",
    ],
    roles: ["Healthcare Administration", "Clinical Operations", "Healthcare IT", "Medical Operations", "Healthcare Support"],
    services: ["contingent-staffing", "direct-hire", "employer-of-record"],
    faqs: [
      {
        question: "Do you place clinical staff directly?",
        answer: "We focus on healthcare administration, operations, IT, and support roles rather than direct clinical placements.",
      },
      {
        question: "How do you handle credential verification?",
        answer: "Credential and licensure verification is a required step in our healthcare screening process before any candidate is presented.",
      },
    ],
  },
  {
    slug: "manufacturing",
    name: "Manufacturing",
    intro:
      "Manufacturing hiring spans the shop floor to the front office. We build pipelines that keep production running without sacrificing quality standards.",
    challenges: [
      "Filling production roles fast enough to meet output targets",
      "Maintaining quality and safety standards under hiring pressure",
      "Coordinating hiring across shifts and multiple sites",
    ],
    roles: ["Production", "Quality", "Operations", "Engineering", "Supply Chain", "Logistics"],
    services: ["high-volume-hiring", "contingent-staffing", "statement-of-work"],
    faqs: [
      {
        question: "Can you support multi-site or multi-shift hiring?",
        answer: "Yes, high-volume hiring programs are designed to coordinate recruitment across multiple shifts and locations at once.",
      },
      {
        question: "Do you screen for safety and quality compliance?",
        answer: "Yes, safety and quality requirements are built into our screening criteria for every manufacturing role.",
      },
    ],
  },
  {
    slug: "automotive",
    name: "Automotive",
    intro:
      "The shift toward electric and autonomous vehicles has changed what automotive hiring looks like. We recruit for both traditional and next-generation roles.",
    challenges: [
      "Finding talent that bridges traditional automotive and emerging EV and autonomous disciplines",
      "Meeting aggressive production ramp timelines",
      "Sourcing specialized software talent for vehicle systems",
    ],
    roles: ["Vehicle Engineering", "Manufacturing", "Software", "EV", "Autonomous Systems", "Quality", "Supply Chain"],
    services: ["direct-hire", "contingent-staffing", "high-volume-hiring"],
    faqs: [
      {
        question: "Do you recruit for EV and autonomous systems roles?",
        answer: "Yes, we recruit across both traditional automotive disciplines and emerging EV and autonomous systems roles.",
      },
      {
        question: "Can you support a production ramp-up?",
        answer: "Yes, high-volume hiring is built for exactly this kind of fast, large-scale ramp-up.",
      },
    ],
  },
  {
    slug: "sales-marketing",
    name: "Sales & Marketing",
    intro: "Revenue teams live or die on the people running them. We evaluate for track record, not just talk.",
    challenges: [
      "Separating strong interviewers from strong performers",
      "Filling quota-carrying roles without a gap in pipeline coverage",
      "Finding marketers who can prove impact with data",
    ],
    roles: ["Sales", "Business Development", "Marketing", "Digital Marketing", "Product Marketing", "Customer Success"],
    services: ["direct-hire", "contract-to-hire", "executive-search"],
    faqs: [
      {
        question: "How do you evaluate sales candidates beyond the interview?",
        answer: "We assess track record, quota attainment history, and references alongside the interview to validate real performance.",
      },
      {
        question: "Do you handle senior marketing and sales leadership searches?",
        answer: "Yes, senior and leadership-level searches in sales and marketing run through our executive search process.",
      },
    ],
  },
  {
    slug: "professional-services",
    name: "Professional Services",
    intro:
      "Operations, HR, and consulting roles keep every other function running. We help you staff the people who make the business work.",
    challenges: [
      "Finding generalists who can operate across ambiguous, cross-functional work",
      "Filling specialized procurement and compliance roles",
      "Scaling operations teams alongside company growth",
    ],
    roles: ["HR", "Operations", "Consulting", "Project Management", "Procurement", "Administration"],
    services: ["contingent-staffing", "contract-to-hire", "direct-hire"],
    faqs: [
      {
        question: "Do you recruit for HR and People Operations roles?",
        answer: "Yes, HR and People Operations are a core part of our professional services recruiting practice.",
      },
      {
        question: "Can you support a growing operations team?",
        answer: "Yes, we scale operations hiring alongside your growth, from a single hire to a full team build-out.",
      },
    ],
  },
];
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- content/industries/data.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 6: Commit**

```bash
git add content/industries
git commit -m "feat: add industries content data"
```

---

### Task 5: Content Layer — Team & Values

**Files:**
- Create: `content/values.ts`
- Create: `content/team.ts`
- Test: `content/values.test.ts`, `content/team.test.ts`

**Interfaces:**
- Produces: `Value { title: string; description: string }`, `values: Value[]` (6 entries); `TeamMember { name: string; role: string; bio: string; photoUrl: string }`, `team: TeamMember[]` (intentionally empty — see Step 4) — consumed by Task 23 (About page).

**Note on `team`:** the brief asks for a leadership section, but no real leadership names/bios/photos have been supplied. Per the non-fabrication rule (Global Constraints), we do not invent people. `team` ships as a typed empty array; the About page (Task 23) renders a neutral "leadership profiles coming soon" state instead of a team grid until real data is supplied.

- [ ] **Step 1: Write failing test for values**

Create `content/values.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { values } from "./values";

describe("values data", () => {
  it("has exactly 6 values", () => {
    expect(values).toHaveLength(6);
  });

  it("has non-empty, real descriptions", () => {
    for (const value of values) {
      expect(value.title.length).toBeGreaterThan(0);
      expect(value.description.length).toBeGreaterThan(20);
      expect(value.description.toLowerCase()).not.toContain("lorem");
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- content/values.test.ts`
Expected: FAIL — `./values` does not exist.

- [ ] **Step 3: Author values**

Create `content/values.ts`:
```ts
export interface Value {
  title: string;
  description: string;
}

export const values: Value[] = [
  {
    title: "People First",
    description:
      "Every hiring decision affects a real person's career and a real team's future. We weigh both before we weigh a fee.",
  },
  {
    title: "Integrity",
    description:
      "We tell clients when a candidate isn't right and tell candidates when a role isn't either, even when it costs us the placement.",
  },
  {
    title: "Curiosity",
    description:
      "We ask why a role exists, not just what it requires, so the match we make solves the actual problem behind the opening.",
  },
  {
    title: "Accountability",
    description:
      "If a placement isn't working, we stay engaged until it's resolved. Sending a resume isn't where our job ends.",
  },
  {
    title: "Excellence",
    description:
      "A shortlist of three strong candidates beats a stack of twenty mediocre ones. We optimize for fit, not volume.",
  },
  {
    title: "Long-Term Relationships",
    description:
      "We measure success by whether clients and candidates come back to us for the next hire and the next chapter, not just this one.",
  },
];
```

- [ ] **Step 4: Write failing test for team**

Create `content/team.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { team } from "./team";

describe("team data", () => {
  it("is a typed array, currently empty pending real leadership data", () => {
    expect(Array.isArray(team)).toBe(true);
    expect(team).toHaveLength(0);
  });
});
```

- [ ] **Step 5: Run test to verify it fails**

Run: `npm test -- content/team.test.ts`
Expected: FAIL — `./team` does not exist.

- [ ] **Step 6: Create the team module**

Create `content/team.ts`:
```ts
export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
}

// Intentionally empty: no real leadership names, bios, or photos have been
// supplied yet. Per the non-fabrication rule, we do not invent team members.
// Populate this array when real leadership data is available.
export const team: TeamMember[] = [];
```

- [ ] **Step 7: Run both tests to verify they pass**

Run: `npm test -- content/values.test.ts content/team.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 8: Commit**

```bash
git add content/values.ts content/team.ts content/values.test.ts content/team.test.ts
git commit -m "feat: add values content and typed empty team data"
```

---

### Task 6: Motion Utilities — Reduced Motion Hook, ScrollReveal, Counter

**Files:**
- Create: `lib/hooks/usePrefersReducedMotion.ts`
- Create: `components/motion/ScrollReveal.tsx`
- Create: `components/motion/Counter.tsx`
- Test: `lib/hooks/usePrefersReducedMotion.test.tsx`, `components/motion/ScrollReveal.test.tsx`, `components/motion/Counter.test.tsx`

**Interfaces:**
- Produces: `usePrefersReducedMotion(): boolean`; `<ScrollReveal className? delay?>children</ScrollReveal>`; `<Counter value: number suffix?: string durationSeconds?: number />` — consumed by Tasks 10, 11, 20.
- Addresses Review Focus #4 (reduced-motion users see final state immediately, no animation).

- [ ] **Step 1: Write failing test for the hook**

Create `lib/hooks/usePrefersReducedMotion.test.tsx`:
```tsx
import { describe, it, expect, vi, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("usePrefersReducedMotion", () => {
  it("returns true when the user prefers reduced motion", () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);
  });

  it("returns false when the user has no motion preference set", () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/hooks/usePrefersReducedMotion.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement the hook**

Create `lib/hooks/usePrefersReducedMotion.ts`:
```ts
"use client";

import { useEffect, useState } from "react";

export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/hooks/usePrefersReducedMotion.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Write failing test for Counter**

Create `components/motion/Counter.test.tsx`:
```tsx
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { Counter } from "./Counter";

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Counter", () => {
  it("shows the final value immediately when reduced motion is preferred", () => {
    mockMatchMedia(true);
    render(<Counter value={250} suffix="+" />);
    expect(screen.getByText("250+")).toBeInTheDocument();
  });

  it("always exposes the final value via aria-label regardless of animation state", () => {
    mockMatchMedia(false);
    render(<Counter value={250} suffix="+" />);
    expect(screen.getByLabelText("250+")).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npm test -- components/motion/Counter.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 7: Implement Counter**

Create `components/motion/Counter.tsx`:
```tsx
"use client";

import { useEffect, useState } from "react";
import { animate } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

interface CounterProps {
  value: number;
  suffix?: string;
  durationSeconds?: number;
}

export function Counter({ value, suffix = "", durationSeconds = 1.5 }: CounterProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [displayValue, setDisplayValue] = useState(prefersReducedMotion ? value : 0);

  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayValue(value);
      return;
    }
    const controls = animate(0, value, {
      duration: durationSeconds,
      onUpdate: (latest) => setDisplayValue(Math.round(latest)),
    });
    return () => controls.stop();
  }, [value, durationSeconds, prefersReducedMotion]);

  return (
    <span aria-label={`${value}${suffix}`}>
      {displayValue}
      {suffix}
    </span>
  );
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npm test -- components/motion/Counter.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 9: Write failing test for ScrollReveal**

Create `components/motion/ScrollReveal.test.tsx`:
```tsx
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ScrollReveal } from "./ScrollReveal";

function mockMatchMedia(matches: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("ScrollReveal", () => {
  it("renders children in a plain div with no animation when reduced motion is preferred", () => {
    mockMatchMedia(true);
    render(
      <ScrollReveal className="test-class">
        <p>Reveal me</p>
      </ScrollReveal>
    );
    const content = screen.getByText("Reveal me");
    expect(content).toBeInTheDocument();
    expect(content.parentElement).toHaveClass("test-class");
    expect(content.parentElement?.tagName).toBe("DIV");
  });

  it("renders children when motion is allowed", () => {
    mockMatchMedia(false);
    render(
      <ScrollReveal>
        <p>Reveal me too</p>
      </ScrollReveal>
    );
    expect(screen.getByText("Reveal me too")).toBeInTheDocument();
  });
});
```

- [ ] **Step 10: Run test to verify it fails**

Run: `npm test -- components/motion/ScrollReveal.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 11: Implement ScrollReveal**

Create `components/motion/ScrollReveal.tsx`:
```tsx
"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 12: Run all three test files to verify they pass**

Run: `npm test -- lib/hooks/usePrefersReducedMotion.test.tsx components/motion/Counter.test.tsx components/motion/ScrollReveal.test.tsx`
Expected: PASS (6 tests).

- [ ] **Step 13: Commit**

```bash
git add lib/hooks components/motion
git commit -m "feat: add reduced-motion hook, ScrollReveal, and Counter"
```

---

### Task 7: UI Primitives via shadcn/ui

**Files:**
- Create (generated): `components/ui/button.tsx`, `components/ui/accordion.tsx`, `components/ui/dialog.tsx`, `components/ui/sonner.tsx`, `components/ui/input.tsx`, `components/ui/label.tsx`, `components/ui/select.tsx`, `components/ui/textarea.tsx`
- Test: `components/ui/button.test.tsx`

**Interfaces:**
- Produces: `Button`, `Accordion`/`AccordionItem`/`AccordionTrigger`/`AccordionContent`, `Dialog`, `Toaster` + `toast()` (from sonner), `Input`, `Label`, `Select`, `Textarea` — consumed by Tasks 8, 9, 11, 15-17, 19.

- [ ] **Step 1: Install shadcn primitives**

Run:
```bash
npx shadcn@latest add button accordion dialog sonner input label select textarea
```
This generates the files under `components/ui/` listed above.

- [ ] **Step 2: Write a smoke test confirming Button renders accessibly**

Create `components/ui/button.test.tsx`:
```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./button";

describe("Button", () => {
  it("renders as a real button element and responds to click", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    const button = screen.getByRole("button", { name: "Click me" });
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

- [ ] **Step 3: Run test to verify it passes**

Run: `npm test -- components/ui/button.test.tsx`
Expected: PASS.

- [ ] **Step 4: Run full build to catch any generation issues**

Run: `npm run build`
Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add components.json components/ui lib/utils.ts
git commit -m "chore: add shadcn/ui primitives"
```

---

### Task 8: Layout — Navbar, MegaMenu, MobileNavbar

**Files:**
- Create: `components/layout/MegaMenu.tsx`, `components/layout/Navbar.tsx`, `components/layout/MobileNavbar.tsx`
- Test: `components/layout/MegaMenu.test.tsx`, `components/layout/Navbar.test.tsx`, `components/layout/MobileNavbar.test.tsx`

**Interfaces:**
- Consumes: `services` (Task 3), `industries` (Task 4), `Button`/`Dialog`/`DialogContent`/`DialogTitle` (Task 7).
- Produces: `<Navbar />`, `<MobileNavbar />`, `<MegaMenu label basePath overviewHref items: {slug,name,tagline}[] />` — consumed by Task 19 (root layout).

- [ ] **Step 1: Write failing tests for MegaMenu**

Create `components/layout/MegaMenu.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MegaMenu } from "./MegaMenu";

const items = [
  { slug: "a", name: "Service A", tagline: "Tagline A" },
  { slug: "b", name: "Service B", tagline: "Tagline B" },
];

describe("MegaMenu", () => {
  it("is closed by default and opens on trigger click", async () => {
    render(<MegaMenu label="Solutions" basePath="/services" overviewHref="/services" items={items} />);
    expect(screen.queryByRole("menuitem", { name: "Service A" })).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Solutions" }));
    expect(screen.getByRole("menuitem", { name: "Service A" })).toHaveAttribute("href", "/services/a");
    expect(screen.getByRole("menuitem", { name: "Service B" })).toHaveAttribute("href", "/services/b");
  });

  it("closes when Escape is pressed", async () => {
    render(<MegaMenu label="Solutions" basePath="/services" overviewHref="/services" items={items} />);
    await userEvent.click(screen.getByRole("button", { name: "Solutions" }));
    expect(screen.getByRole("menuitem", { name: "Service A" })).toBeInTheDocument();

    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("menuitem", { name: "Service A" })).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/layout/MegaMenu.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement MegaMenu**

Create `components/layout/MegaMenu.tsx`:
```tsx
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
        className="focus-ring flex items-center gap-1 rounded px-1 py-2 text-navy-700 hover:text-navy-900"
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
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
          className="absolute left-0 top-full z-40 grid w-80 grid-cols-1 gap-1 rounded-lg border border-navy-100 bg-white p-4 shadow-xl"
        >
          <Link
            href={overviewHref}
            role="menuitem"
            className="focus-ring rounded px-2 py-1 font-semibold text-navy-900"
            onClick={() => setOpen(false)}
          >
            All {label}
          </Link>
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`${basePath}/${item.slug}`}
              role="menuitem"
              className="focus-ring rounded px-2 py-1 text-sm text-navy-700 hover:bg-navy-50"
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- components/layout/MegaMenu.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 5: Write failing test for MobileNavbar**

Create `components/layout/MobileNavbar.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MobileNavbar } from "./MobileNavbar";

describe("MobileNavbar", () => {
  it("opens the menu panel when the hamburger button is clicked", async () => {
    render(<MobileNavbar />);
    const toggle = screen.getByRole("button", { name: "Open menu" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(toggle);
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: "Hire Talent" })).toHaveAttribute("href", "/hire-talent");
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npm test -- components/layout/MobileNavbar.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 7: Implement MobileNavbar**

Create `components/layout/MobileNavbar.tsx`:
```tsx
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
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npm test -- components/layout/MobileNavbar.test.tsx`
Expected: PASS.

- [ ] **Step 9: Write failing test for Navbar**

Create `components/layout/Navbar.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Navbar } from "./Navbar";

describe("Navbar", () => {
  it("renders the logo, primary nav links, and the Hire Talent CTA", () => {
    render(<Navbar />);
    expect(screen.getByRole("link", { name: "TheCareerQuotient" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute("href", "/contact");
    expect(screen.getAllByRole("link", { name: "Hire Talent" }).length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 10: Run test to verify it fails**

Run: `npm test -- components/layout/Navbar.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 11: Implement Navbar**

Create `components/layout/Navbar.tsx`:
```tsx
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
    <header className="sticky top-0 z-50 border-b border-navy-100 bg-offwhite/95 backdrop-blur">
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
              className="focus-ring rounded px-1 py-2 text-navy-700 hover:text-navy-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button asChild>
            <Link href="/hire-talent">Hire Talent</Link>
          </Button>
        </div>

        <MobileNavbar />
      </div>
    </header>
  );
}
```

- [ ] **Step 12: Run test to verify it passes**

Run: `npm test -- components/layout/Navbar.test.tsx`
Expected: PASS.

- [ ] **Step 13: Run full suite and commit**

Run: `npm test`
Expected: all tests PASS.

```bash
git add components/layout
git commit -m "feat: add Navbar, MegaMenu, and MobileNavbar"
```

---

### Task 9: Layout — Footer, CookieBanner

**Files:**
- Create: `components/layout/Footer.tsx`, `components/layout/CookieBanner.tsx`
- Test: `components/layout/Footer.test.tsx`, `components/layout/CookieBanner.test.tsx`

**Interfaces:**
- Consumes: `services` (Task 3).
- Produces: `<Footer />`, `<CookieBanner />` — consumed by Task 19 (root layout).
- Note: no social links are included — no real social profile URLs have been supplied, and linking to placeholder `#` hrefs is forbidden (Global Constraints). Add social links when real URLs exist.

- [ ] **Step 1: Write failing tests for Footer**

Create `components/layout/Footer.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("renders solutions, candidates, employers, company, and legal links pointing to real routes", () => {
    render(<Footer />);
    expect(screen.getByRole("link", { name: "Direct Hire" })).toHaveAttribute("href", "/services/direct-hire");
    expect(screen.getByRole("link", { name: "Find Jobs" })).toHaveAttribute("href", "/find-jobs");
    expect(screen.getByRole("link", { name: "Hire Talent" })).toHaveAttribute("href", "/hire-talent");
    expect(screen.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
    expect(screen.getByText(new RegExp(`${new Date().getFullYear()}`))).toBeInTheDocument();
  });

  it("contains no placeholder # links", () => {
    render(<Footer />);
    for (const link of screen.getAllByRole("link")) {
      expect(link.getAttribute("href")).not.toBe("#");
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/layout/Footer.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement Footer**

Create `components/layout/Footer.tsx`:
```tsx
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
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- components/layout/Footer.test.tsx`
Expected: PASS.

- [ ] **Step 5: Write failing tests for CookieBanner**

Create `components/layout/CookieBanner.test.tsx`:
```tsx
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CookieBanner } from "./CookieBanner";

describe("CookieBanner", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows the banner when no consent decision has been made", () => {
    render(<CookieBanner />);
    expect(screen.getByRole("region", { name: "Cookie notice" })).toBeInTheDocument();
  });

  it("hides the banner and stores the decision when Accept is clicked", async () => {
    render(<CookieBanner />);
    await userEvent.click(screen.getByRole("button", { name: "Accept" }));
    expect(screen.queryByRole("region", { name: "Cookie notice" })).not.toBeInTheDocument();
    expect(window.localStorage.getItem("tcq_cookie_consent")).toBe("accepted");
  });

  it("does not show the banner again after a decision was already stored", () => {
    window.localStorage.setItem("tcq_cookie_consent", "declined");
    render(<CookieBanner />);
    expect(screen.queryByRole("region", { name: "Cookie notice" })).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npm test -- components/layout/CookieBanner.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 7: Implement CookieBanner**

Create `components/layout/CookieBanner.tsx`:
```tsx
"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const CONSENT_KEY = "tcq_cookie_consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(window.localStorage.getItem(CONSENT_KEY) === null);
    } catch {
      setVisible(false);
    }
  }, []);

  function respond(value: "accepted" | "declined") {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // localStorage unavailable; hide the banner anyway rather than block the page
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-50 flex flex-col gap-3 border-t border-navy-100 bg-white p-4 shadow-lg sm:flex-row sm:items-center sm:justify-between"
      style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
    >
      <p className="text-sm text-navy-700">
        We use cookies to improve your experience on this site. Read our{" "}
        <a href="/cookie-policy" className="underline">
          Cookie Policy
        </a>{" "}
        to learn more.
      </p>
      <div className="flex gap-2">
        <Button variant="outline" onClick={() => respond("declined")}>
          Decline
        </Button>
        <Button onClick={() => respond("accepted")}>Accept</Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npm test -- components/layout/CookieBanner.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 9: Run full suite and commit**

Run: `npm test`
Expected: all tests PASS.

```bash
git add components/layout/Footer.tsx components/layout/CookieBanner.tsx components/layout/Footer.test.tsx components/layout/CookieBanner.test.tsx
git commit -m "feat: add Footer and CookieBanner"
```

---

### Task 10: Marketing Components — Hero, CTASection, StatsSection

**Files:**
- Create: `components/marketing/Hero.tsx`, `components/marketing/CTASection.tsx`, `components/marketing/StatsSection.tsx`
- Test: `components/marketing/Hero.test.tsx`, `components/marketing/CTASection.test.tsx`, `components/marketing/StatsSection.test.tsx`

**Interfaces:**
- Consumes: `ScrollReveal`, `Counter` (Task 6), `Button` (Task 7).
- Produces: `<Hero />` (no job-search UI — Global Constraints); `<CTASection heading description ctaLabel ctaHref />`; `Stat { value: number; suffix?: string; label: string }`, `<StatsSection stats: Stat[] />` (renders a neutral fallback when `stats` is empty — no fabricated numbers) — consumed by Task 20.

- [ ] **Step 1: Write failing test for Hero**

Create `components/marketing/Hero.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("renders the headline and both employer/candidate CTAs, with no job search input", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1, name: /Smarter Talent/ })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Hire Talent" })).toHaveAttribute("href", "/hire-talent");
    expect(screen.getByRole("link", { name: "Find Jobs" })).toHaveAttribute("href", "/find-jobs");
    expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/marketing/Hero.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement Hero**

Create `components/marketing/Hero.tsx`:
```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/motion/ScrollReveal";

export function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <ScrollReveal>
        <h1 className="text-display-lg font-bold text-navy-900">Smarter Talent. Stronger Teams. Better Careers.</h1>
        <p className="mt-6 max-w-2xl text-lg text-navy-700">
          TheCareerQuotient connects ambitious organizations with exceptional professionals through flexible
          staffing, permanent hiring, executive search, and workforce solutions.
        </p>
      </ScrollReveal>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-navy-100 bg-white p-6">
          <h2 className="text-xl font-semibold text-navy-900">Build Your Team</h2>
          <p className="mt-2 text-sm text-navy-700">
            Tell us what you need. We&apos;ll help you find the people who can move your business forward.
          </p>
          <Button asChild className="mt-4">
            <Link href="/hire-talent">Hire Talent</Link>
          </Button>
        </div>

        <div className="rounded-xl border border-navy-100 bg-white p-6">
          <h2 className="text-xl font-semibold text-navy-900">Find Your Next Opportunity</h2>
          <p className="mt-2 text-sm text-navy-700">
            Discover roles that match your skills, ambitions, and career goals.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/find-jobs">Find Jobs</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- components/marketing/Hero.test.tsx`
Expected: PASS.

- [ ] **Step 5: Write failing test for CTASection**

Create `components/marketing/CTASection.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CTASection } from "./CTASection";

describe("CTASection", () => {
  it("renders the heading, description, and CTA link", () => {
    render(
      <CTASection
        heading="Ready to build your team?"
        description="Talk to a talent expert today."
        ctaLabel="Talk to Sales"
        ctaHref="/contact"
      />
    );
    expect(screen.getByRole("heading", { name: "Ready to build your team?" })).toBeInTheDocument();
    expect(screen.getByText("Talk to a talent expert today.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Talk to Sales" })).toHaveAttribute("href", "/contact");
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npm test -- components/marketing/CTASection.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 7: Implement CTASection**

Create `components/marketing/CTASection.tsx`:
```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CTASectionProps {
  heading: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
}

export function CTASection({ heading, description, ctaLabel, ctaHref }: CTASectionProps) {
  return (
    <section className="bg-navy-900 py-16 text-offwhite">
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-4 px-4 sm:px-6 lg:px-8">
        <h2 className="text-display-md font-bold">{heading}</h2>
        <p className="text-navy-100">{description}</p>
        <Button asChild size="lg" className="mt-2">
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      </div>
    </section>
  );
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npm test -- components/marketing/CTASection.test.tsx`
Expected: PASS.

- [ ] **Step 9: Write failing test for StatsSection**

Create `components/marketing/StatsSection.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatsSection } from "./StatsSection";

describe("StatsSection", () => {
  it("renders a neutral trust statement when no verified stats are supplied", () => {
    render(<StatsSection stats={[]} />);
    expect(screen.getByText("Trusted by growing teams and ambitious professionals.")).toBeInTheDocument();
  });

  it("renders each verified stat's value and label when stats are supplied", () => {
    render(<StatsSection stats={[{ value: 12, suffix: " industries", label: "Industries served" }]} />);
    expect(screen.getByLabelText("12 industries")).toBeInTheDocument();
    expect(screen.getByText("Industries served")).toBeInTheDocument();
  });
});
```

- [ ] **Step 10: Run test to verify it fails**

Run: `npm test -- components/marketing/StatsSection.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 11: Implement StatsSection**

Create `components/marketing/StatsSection.tsx`:
```tsx
import { Counter } from "@/components/motion/Counter";

export interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

interface StatsSectionProps {
  stats: Stat[];
}

export function StatsSection({ stats }: StatsSectionProps) {
  if (stats.length === 0) {
    return (
      <section className="border-y border-navy-100 bg-white py-10">
        <p className="mx-auto max-w-3xl px-4 text-center text-lg text-navy-700 sm:px-6 lg:px-8">
          Trusted by growing teams and ambitious professionals.
        </p>
      </section>
    );
  }

  return (
    <section className="border-y border-navy-100 bg-white py-10">
      <dl className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 text-center sm:px-6 md:grid-cols-4 lg:px-8">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dt className="sr-only">{stat.label}</dt>
            <dd className="text-3xl font-bold text-navy-900">
              <Counter value={stat.value} suffix={stat.suffix} />
            </dd>
            <p className="mt-1 text-sm text-navy-700">{stat.label}</p>
          </div>
        ))}
      </dl>
    </section>
  );
}
```

- [ ] **Step 12: Run all three test files, then commit**

Run: `npm test -- components/marketing/Hero.test.tsx components/marketing/CTASection.test.tsx components/marketing/StatsSection.test.tsx`
Expected: PASS (4 tests).

```bash
git add components/marketing/Hero.tsx components/marketing/CTASection.tsx components/marketing/StatsSection.tsx components/marketing/Hero.test.tsx components/marketing/CTASection.test.tsx components/marketing/StatsSection.test.tsx
git commit -m "feat: add Hero, CTASection, and StatsSection"
```

---

### Task 11: Marketing Components — ServiceCard, IndustryCard, ProcessTimeline, Testimonial, ArticleCard, FAQAccordion, Breadcrumbs

**Files:**
- Create: `components/marketing/ServiceCard.tsx`, `IndustryCard.tsx`, `ProcessTimeline.tsx`, `Testimonial.tsx`, `ArticleCard.tsx`, `FAQAccordion.tsx`, `Breadcrumbs.tsx` (all under `components/marketing/`)
- Test: matching `.test.tsx` for each

**Interfaces:**
- Consumes: `Service` (Task 3), `Industry` (Task 4), `Accordion*` (Task 7).
- Produces: `<ServiceCard service />`, `<IndustryCard industry />`, `TimelineStep`, `<ProcessTimeline steps />`, `TestimonialData`, `<Testimonial testimonial: TestimonialData | null />` (renders nothing when null — no fabricated testimonials), `ArticleSummary`, `<ArticleCard article />`, `FAQItem`, `<FAQAccordion items />`, `Crumb`, `<Breadcrumbs items />` — consumed by Tasks 20-24.

- [ ] **Step 1: Write failing tests for all seven components**

Create `components/marketing/ServiceCard.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ServiceCard } from "./ServiceCard";
import { services } from "@/content/services/data";

describe("ServiceCard", () => {
  it("renders the service name, tagline, and a link to its detail page", () => {
    const service = services[0];
    render(<ServiceCard service={service} />);
    expect(screen.getByRole("heading", { name: service.name })).toBeInTheDocument();
    expect(screen.getByText(service.tagline)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: new RegExp(service.ctaLabel) })).toHaveAttribute(
      "href",
      `/services/${service.slug}`
    );
  });
});
```

Create `components/marketing/IndustryCard.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { IndustryCard } from "./IndustryCard";
import { industries } from "@/content/industries/data";

describe("IndustryCard", () => {
  it("renders the industry name, intro, and a link to its detail page", () => {
    const industry = industries[0];
    render(<IndustryCard industry={industry} />);
    expect(screen.getByRole("heading", { name: industry.name })).toBeInTheDocument();
    expect(screen.getByText(industry.intro)).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", `/industries/${industry.slug}`);
  });
});
```

Create `components/marketing/ProcessTimeline.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProcessTimeline } from "./ProcessTimeline";

describe("ProcessTimeline", () => {
  it("renders each step's number, title, and description in order", () => {
    render(
      <ProcessTimeline
        steps={[
          { number: "01", title: "Tell Us What You Need", description: "Share your requirements." },
          { number: "02", title: "We Find & Screen", description: "Candidates are shortlisted." },
        ]}
      />
    );
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("01");
    expect(items[0]).toHaveTextContent("Tell Us What You Need");
    expect(items[1]).toHaveTextContent("We Find & Screen");
  });
});
```

Create `components/marketing/Testimonial.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Testimonial } from "./Testimonial";

describe("Testimonial", () => {
  it("renders nothing when no verified testimonial is supplied", () => {
    const { container } = render(<Testimonial testimonial={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the quote, author, and role when a testimonial is supplied", () => {
    render(<Testimonial testimonial={{ quote: "They found us the right person fast.", author: "J. Rivera", role: "VP Engineering" }} />);
    expect(screen.getByText(/They found us the right person fast\./)).toBeInTheDocument();
    expect(screen.getByText(/J\. Rivera, VP Engineering/)).toBeInTheDocument();
  });
});
```

Create `components/marketing/ArticleCard.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ArticleCard } from "./ArticleCard";

describe("ArticleCard", () => {
  it("renders the article title as a link, category, and reading time", () => {
    render(
      <ArticleCard
        article={{
          slug: "resume-tips-that-work",
          title: "Resume Tips That Work",
          description: "Practical advice for a stronger resume.",
          category: "Resume Tips",
          date: "2026-01-10",
          readingTime: "5 min read",
        }}
      />
    );
    expect(screen.getByRole("link", { name: "Resume Tips That Work" })).toHaveAttribute(
      "href",
      "/insights/resume-tips-that-work"
    );
    expect(screen.getByText("Resume Tips")).toBeInTheDocument();
    expect(screen.getByText(/5 min read/)).toBeInTheDocument();
  });
});
```

Create `components/marketing/FAQAccordion.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FAQAccordion } from "./FAQAccordion";

describe("FAQAccordion", () => {
  it("reveals an answer when its question is clicked", async () => {
    render(<FAQAccordion items={[{ question: "Do you support remote roles?", answer: "Yes, we do." }]} />);
    expect(screen.queryByText("Yes, we do.")).not.toBeVisible();
    await userEvent.click(screen.getByRole("button", { name: "Do you support remote roles?" }));
    expect(screen.getByText("Yes, we do.")).toBeVisible();
  });
});
```

Create `components/marketing/Breadcrumbs.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Breadcrumbs } from "./Breadcrumbs";

describe("Breadcrumbs", () => {
  it("renders prior crumbs as links and marks the last as the current page", () => {
    render(
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/services", label: "Services" },
          { href: "/services/direct-hire", label: "Direct Hire" },
        ]}
      />
    );
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "Services" })).toHaveAttribute("href", "/services");
    expect(screen.getByText("Direct Hire")).toHaveAttribute("aria-current", "page");
  });
});
```

- [ ] **Step 2: Run all seven test files to verify they fail**

Run: `npm test -- components/marketing/ServiceCard.test.tsx components/marketing/IndustryCard.test.tsx components/marketing/ProcessTimeline.test.tsx components/marketing/Testimonial.test.tsx components/marketing/ArticleCard.test.tsx components/marketing/FAQAccordion.test.tsx components/marketing/Breadcrumbs.test.tsx`
Expected: FAIL — none of the seven modules exist yet.

- [ ] **Step 3: Implement ServiceCard and IndustryCard**

Create `components/marketing/ServiceCard.tsx`:
```tsx
import Link from "next/link";
import type { Service } from "@/content/services/types";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <article className="flex flex-col rounded-xl border border-navy-100 bg-white p-6">
      <h3 className="text-lg font-semibold text-navy-900">{service.name}</h3>
      <p className="mt-2 text-sm text-navy-700">{service.tagline}</p>
      <ul className="mt-4 flex-1 space-y-1 text-sm text-navy-700">
        {service.features.slice(0, 3).map((feature) => (
          <li key={feature}>• {feature}</li>
        ))}
      </ul>
      <Link href={`/services/${service.slug}`} className="focus-ring mt-4 inline-block rounded font-semibold text-accent">
        {service.ctaLabel} →
      </Link>
    </article>
  );
}
```

Create `components/marketing/IndustryCard.tsx`:
```tsx
import Link from "next/link";
import type { Industry } from "@/content/industries/types";

interface IndustryCardProps {
  industry: Industry;
}

export function IndustryCard({ industry }: IndustryCardProps) {
  return (
    <article className="flex flex-col rounded-xl border border-navy-100 bg-white p-6">
      <h3 className="text-lg font-semibold text-navy-900">{industry.name}</h3>
      <p className="mt-2 text-sm text-navy-700">{industry.intro}</p>
      <Link
        href={`/industries/${industry.slug}`}
        className="focus-ring mt-4 inline-block rounded font-semibold text-accent"
      >
        Explore {industry.name} →
      </Link>
    </article>
  );
}
```

- [ ] **Step 4: Implement ProcessTimeline and Testimonial**

Create `components/marketing/ProcessTimeline.tsx`:
```tsx
export interface TimelineStep {
  number: string;
  title: string;
  description: string;
}

interface ProcessTimelineProps {
  steps: TimelineStep[];
}

export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  return (
    <ol className="grid gap-8 md:grid-cols-5">
      {steps.map((step) => (
        <li key={step.number} className="border-t-2 border-accent pt-4">
          <p className="text-sm font-semibold text-accent">{step.number}</p>
          <h3 className="mt-2 font-semibold text-navy-900">{step.title}</h3>
          <p className="mt-1 text-sm text-navy-700">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
```

Create `components/marketing/Testimonial.tsx`:
```tsx
export interface TestimonialData {
  quote: string;
  author: string;
  role: string;
}

interface TestimonialProps {
  testimonial: TestimonialData | null;
}

export function Testimonial({ testimonial }: TestimonialProps) {
  if (!testimonial) return null;

  return (
    <figure className="rounded-xl border border-navy-100 bg-white p-8">
      <blockquote className="text-lg text-navy-900">&ldquo;{testimonial.quote}&rdquo;</blockquote>
      <figcaption className="mt-4 text-sm text-navy-700">
        {testimonial.author}, {testimonial.role}
      </figcaption>
    </figure>
  );
}
```

- [ ] **Step 5: Implement ArticleCard, FAQAccordion, and Breadcrumbs**

Create `components/marketing/ArticleCard.tsx`:
```tsx
import Link from "next/link";

export interface ArticleSummary {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  readingTime: string;
}

interface ArticleCardProps {
  article: ArticleSummary;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <article className="rounded-xl border border-navy-100 bg-white p-6">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent">{article.category}</p>
      <h3 className="mt-2 text-lg font-semibold text-navy-900">
        <Link href={`/insights/${article.slug}`} className="focus-ring rounded">
          {article.title}
        </Link>
      </h3>
      <p className="mt-2 text-sm text-navy-700">{article.description}</p>
      <p className="mt-4 text-xs text-navy-700">
        {article.date} · {article.readingTime}
      </p>
    </article>
  );
}
```

Create `components/marketing/FAQAccordion.tsx`:
```tsx
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export function FAQAccordion({ items }: FAQAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item, index) => (
        <AccordionItem key={item.question} value={`item-${index}`}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
```

Create `components/marketing/Breadcrumbs.tsx`:
```tsx
import Link from "next/link";

export interface Crumb {
  href: string;
  label: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-navy-700">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            {index === items.length - 1 ? (
              <span aria-current="page" className="font-semibold text-navy-900">
                {item.label}
              </span>
            ) : (
              <>
                <Link href={item.href} className="focus-ring rounded hover:underline">
                  {item.label}
                </Link>
                <span aria-hidden="true">/</span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

- [ ] **Step 6: Run all seven test files to verify they pass**

Run: `npm test -- components/marketing/ServiceCard.test.tsx components/marketing/IndustryCard.test.tsx components/marketing/ProcessTimeline.test.tsx components/marketing/Testimonial.test.tsx components/marketing/ArticleCard.test.tsx components/marketing/FAQAccordion.test.tsx components/marketing/Breadcrumbs.test.tsx`
Expected: PASS (9 tests).

- [ ] **Step 7: Commit**

```bash
git add components/marketing
git commit -m "feat: add ServiceCard, IndustryCard, ProcessTimeline, Testimonial, ArticleCard, FAQAccordion, Breadcrumbs"
```

---

### Task 12: State Components — LoadingSkeleton, EmptyState, ErrorState

**Files:**
- Create: `components/states/LoadingSkeleton.tsx`, `EmptyState.tsx`, `ErrorState.tsx` (under `components/states/`)
- Test: matching `.test.tsx` for each

**Interfaces:**
- Produces: `<LoadingSkeleton lines? className? />`, `<EmptyState heading description action? />`, `<ErrorState heading? description onRetry? />` — consumed by Task 24 (Insights listing empty/loading states) and Tasks 15-17 (form error UI, addressing Review Focus #1).

- [ ] **Step 1: Write failing tests**

Create `components/states/LoadingSkeleton.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LoadingSkeleton } from "./LoadingSkeleton";

describe("LoadingSkeleton", () => {
  it("announces loading state to assistive tech and renders the requested number of lines", () => {
    const { container } = render(<LoadingSkeleton lines={4} />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading");
    expect(container.querySelectorAll("[aria-hidden='true'] > div")).toHaveLength(4);
  });
});
```

Create `components/states/EmptyState.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyState } from "./EmptyState";

describe("EmptyState", () => {
  it("renders heading, description, and an optional action", () => {
    render(
      <EmptyState
        heading="No articles matched your filter."
        description="Try a different category."
        action={<a href="/insights">View all insights</a>}
      />
    );
    expect(screen.getByRole("heading", { name: "No articles matched your filter." })).toBeInTheDocument();
    expect(screen.getByText("Try a different category.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View all insights" })).toBeInTheDocument();
  });
});
```

Create `components/states/ErrorState.test.tsx`:
```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorState } from "./ErrorState";

describe("ErrorState", () => {
  it("renders as an alert with the description and calls onRetry when the retry button is clicked", async () => {
    const onRetry = vi.fn();
    render(<ErrorState description="We couldn't submit your request." onRetry={onRetry} />);
    expect(screen.getByRole("alert")).toHaveTextContent("We couldn't submit your request.");
    await userEvent.click(screen.getByRole("button", { name: "Try Again" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders without a retry button when onRetry is not supplied", () => {
    render(<ErrorState description="We couldn't submit your request." />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run all three test files to verify they fail**

Run: `npm test -- components/states/LoadingSkeleton.test.tsx components/states/EmptyState.test.tsx components/states/ErrorState.test.tsx`
Expected: FAIL — none of the three modules exist yet.

- [ ] **Step 3: Implement LoadingSkeleton**

Create `components/states/LoadingSkeleton.tsx`:
```tsx
interface LoadingSkeletonProps {
  lines?: number;
  className?: string;
}

export function LoadingSkeleton({ lines = 3, className }: LoadingSkeletonProps) {
  return (
    <div role="status" aria-live="polite" className={className}>
      <span className="sr-only">Loading…</span>
      <div className="space-y-3" aria-hidden="true">
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="h-4 w-full animate-pulse rounded bg-navy-100 motion-reduce:animate-none" />
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Implement EmptyState**

Create `components/states/EmptyState.tsx`:
```tsx
import type { ReactNode } from "react";

interface EmptyStateProps {
  heading: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ heading, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-navy-100 p-10 text-center">
      <h3 className="text-lg font-semibold text-navy-900">{heading}</h3>
      <p className="mt-2 text-sm text-navy-700">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
```

- [ ] **Step 5: Implement ErrorState**

Create `components/states/ErrorState.tsx`:
```tsx
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  heading?: string;
  description: string;
  onRetry?: () => void;
}

export function ErrorState({ heading = "Something went wrong", description, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <h3 className="text-lg font-semibold text-red-900">{heading}</h3>
      <p className="mt-2 text-sm text-red-800">{description}</p>
      {onRetry ? (
        <Button variant="outline" className="mt-4" onClick={onRetry}>
          Try Again
        </Button>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 6: Run all three test files to verify they pass**

Run: `npm test -- components/states/LoadingSkeleton.test.tsx components/states/EmptyState.test.tsx components/states/ErrorState.test.tsx`
Expected: PASS (4 tests).

- [ ] **Step 7: Commit**

```bash
git add components/states
git commit -m "feat: add LoadingSkeleton, EmptyState, and ErrorState"
```

---

### Task 13: Form Validation Library

**Files:**
- Create: `lib/validation/formSchemas.ts`
- Test: `lib/validation/formSchemas.test.ts`

**Interfaces:**
- Produces: `contactFormSchema`, `ContactFormValues`; `employerFormSchema`, `EmployerFormValues`; `candidateFormSchema`, `CandidateFormValues`; `MAX_RESUME_SIZE_BYTES`, `ACCEPTED_RESUME_TYPES`, `validateResumeFile(file: File): string | null` — consumed by Tasks 14-17.
- Addresses Review Focus #2 (invalid resume upload rejected client-side).

- [ ] **Step 1: Write failing tests**

Create `lib/validation/formSchemas.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import {
  contactFormSchema,
  employerFormSchema,
  candidateFormSchema,
  validateResumeFile,
  MAX_RESUME_SIZE_BYTES,
} from "./formSchemas";

describe("contactFormSchema", () => {
  it("accepts a valid contact submission", () => {
    const result = contactFormSchema.safeParse({
      name: "Jordan Lee",
      email: "jordan@example.com",
      audience: "employer",
      message: "We need to hire three engineers this quarter.",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const result = contactFormSchema.safeParse({
      name: "Jordan Lee",
      email: "not-an-email",
      audience: "employer",
      message: "We need to hire three engineers this quarter.",
    });
    expect(result.success).toBe(false);
  });

  it("rejects a message that is too short", () => {
    const result = contactFormSchema.safeParse({
      name: "Jordan Lee",
      email: "jordan@example.com",
      audience: "candidate",
      message: "Hi",
    });
    expect(result.success).toBe(false);
  });
});

describe("employerFormSchema", () => {
  it("accepts a valid employer lead submission", () => {
    const result = employerFormSchema.safeParse({
      name: "Priya Nair",
      company: "Acme Robotics",
      workEmail: "priya@acmerobotics.com",
      phone: "5551234567",
      jobTitle: "VP Engineering",
      hiringNeed: "direct-hire",
      numberOfPositions: 3,
      location: "Austin, TX",
      employmentType: "full-time",
    });
    expect(result.success).toBe(true);
  });

  it("rejects fewer than 1 position", () => {
    const result = employerFormSchema.safeParse({
      name: "Priya Nair",
      company: "Acme Robotics",
      workEmail: "priya@acmerobotics.com",
      phone: "5551234567",
      jobTitle: "VP Engineering",
      hiringNeed: "direct-hire",
      numberOfPositions: 0,
      location: "Austin, TX",
      employmentType: "full-time",
    });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown hiring need", () => {
    const result = employerFormSchema.safeParse({
      name: "Priya Nair",
      company: "Acme Robotics",
      workEmail: "priya@acmerobotics.com",
      phone: "5551234567",
      jobTitle: "VP Engineering",
      hiringNeed: "not-a-real-service",
      numberOfPositions: 3,
      location: "Austin, TX",
      employmentType: "full-time",
    });
    expect(result.success).toBe(false);
  });
});

describe("candidateFormSchema", () => {
  it("accepts a valid candidate submission", () => {
    const result = candidateFormSchema.safeParse({
      name: "Sam Okafor",
      email: "sam@example.com",
      phone: "5559876543",
      preferredLocation: "Remote",
      employmentType: "contract",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a missing preferred location", () => {
    const result = candidateFormSchema.safeParse({
      name: "Sam Okafor",
      email: "sam@example.com",
      phone: "5559876543",
      preferredLocation: "",
      employmentType: "contract",
    });
    expect(result.success).toBe(false);
  });
});

describe("validateResumeFile", () => {
  it("accepts a PDF under the size limit", () => {
    const file = new File(["content"], "resume.pdf", { type: "application/pdf" });
    expect(validateResumeFile(file)).toBeNull();
  });

  it("rejects an unsupported file type", () => {
    const file = new File(["content"], "resume.png", { type: "image/png" });
    expect(validateResumeFile(file)).toBe("Upload a PDF or Word document.");
  });

  it("rejects a file over the size limit", () => {
    const oversized = new File([new Uint8Array(MAX_RESUME_SIZE_BYTES + 1)], "resume.pdf", {
      type: "application/pdf",
    });
    expect(validateResumeFile(oversized)).toBe("File must be smaller than 5MB.");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/validation/formSchemas.test.ts`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement the validation library**

Create `lib/validation/formSchemas.ts`:
```ts
import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name."),
  email: z.string().trim().email("Enter a valid email address."),
  audience: z.enum(["employer", "candidate"]),
  message: z.string().trim().min(10, "Message must be at least 10 characters."),
});
export type ContactFormValues = z.infer<typeof contactFormSchema>;

export const HIRING_NEEDS = [
  "contingent-staffing",
  "contract-to-hire",
  "direct-hire",
  "executive-search",
  "employer-of-record",
  "statement-of-work",
  "high-volume-hiring",
] as const;

export const EMPLOYMENT_TYPES = ["full-time", "contract", "contract-to-hire", "part-time", "temporary"] as const;

export const employerFormSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name."),
  company: z.string().trim().min(2, "Enter your company name."),
  workEmail: z.string().trim().email("Enter a valid work email address."),
  phone: z.string().trim().min(7, "Enter a valid phone number."),
  jobTitle: z.string().trim().min(2, "Enter your job title."),
  hiringNeed: z.enum(HIRING_NEEDS),
  numberOfPositions: z.coerce.number().int().min(1, "Enter at least 1 position."),
  location: z.string().trim().min(2, "Enter a location."),
  employmentType: z.enum(EMPLOYMENT_TYPES),
  message: z.string().trim().optional(),
});
export type EmployerFormValues = z.infer<typeof employerFormSchema>;

export const candidateFormSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name."),
  email: z.string().trim().email("Enter a valid email address."),
  phone: z.string().trim().min(7, "Enter a valid phone number."),
  preferredLocation: z.string().trim().min(2, "Enter a preferred location."),
  employmentType: z.enum(EMPLOYMENT_TYPES),
});
export type CandidateFormValues = z.infer<typeof candidateFormSchema>;

export const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024;
export const ACCEPTED_RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export function validateResumeFile(file: File): string | null {
  if (!ACCEPTED_RESUME_TYPES.includes(file.type)) {
    return "Upload a PDF or Word document.";
  }
  if (file.size > MAX_RESUME_SIZE_BYTES) {
    return "File must be smaller than 5MB.";
  }
  return null;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/validation/formSchemas.test.ts`
Expected: PASS (11 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/validation
git commit -m "feat: add form validation schemas and resume file validation"
```

---

### Task 14: Form Submit Stub Handlers

**Files:**
- Create: `lib/forms/submitForm.ts`
- Test: `lib/forms/submitForm.test.ts`

**Interfaces:**
- Consumes: `ContactFormValues`, `EmployerFormValues`, `CandidateFormValues` (Task 13).
- Produces: `SubmitResult { success: boolean; error?: string }`; `submitContactForm(values): Promise<SubmitResult>`; `submitEmployerLead(values): Promise<SubmitResult>`; `submitCandidateResume(values, resume: File): Promise<SubmitResult>` — consumed by Tasks 15-17. This is the single isolated point where real delivery (email service or form backend) gets wired in later, per spec §6.

- [ ] **Step 1: Write failing tests**

Create `lib/forms/submitForm.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { submitContactForm, submitEmployerLead, submitCandidateResume } from "./submitForm";

describe("submitForm stub handlers", () => {
  it("submitContactForm resolves with success", async () => {
    const result = await submitContactForm({
      name: "Jordan Lee",
      email: "jordan@example.com",
      audience: "employer",
      message: "We need to hire three engineers this quarter.",
    });
    expect(result).toEqual({ success: true });
  });

  it("submitEmployerLead resolves with success", async () => {
    const result = await submitEmployerLead({
      name: "Priya Nair",
      company: "Acme Robotics",
      workEmail: "priya@acmerobotics.com",
      phone: "5551234567",
      jobTitle: "VP Engineering",
      hiringNeed: "direct-hire",
      numberOfPositions: 3,
      location: "Austin, TX",
      employmentType: "full-time",
    });
    expect(result).toEqual({ success: true });
  });

  it("submitCandidateResume resolves with success", async () => {
    const file = new File(["content"], "resume.pdf", { type: "application/pdf" });
    const result = await submitCandidateResume(
      {
        name: "Sam Okafor",
        email: "sam@example.com",
        phone: "5559876543",
        preferredLocation: "Remote",
        employmentType: "contract",
      },
      file
    );
    expect(result).toEqual({ success: true });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/forms/submitForm.test.ts`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement the stub submit layer**

Create `lib/forms/submitForm.ts`:
```ts
import type { ContactFormValues, EmployerFormValues, CandidateFormValues } from "@/lib/validation/formSchemas";

export interface SubmitResult {
  success: boolean;
  error?: string;
}

// Stub delivery layer: simulates network latency and always succeeds today.
// Swap the body of `deliver` for a real transactional email call or form
// backend request later — no caller in components/forms needs to change.
async function deliver<T>(_payload: T): Promise<SubmitResult> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { success: true };
}

export async function submitContactForm(values: ContactFormValues): Promise<SubmitResult> {
  return deliver(values);
}

export async function submitEmployerLead(values: EmployerFormValues): Promise<SubmitResult> {
  return deliver(values);
}

export async function submitCandidateResume(
  values: CandidateFormValues,
  resume: File
): Promise<SubmitResult> {
  return deliver({ ...values, resumeName: resume.name, resumeSize: resume.size });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/forms/submitForm.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add lib/forms/submitForm.ts lib/forms/submitForm.test.ts
git commit -m "feat: add isolated stub form submit handlers"
```

---

### Task 15: ContactForm Component

**Files:**
- Create: `components/forms/ContactForm.tsx`
- Test: `components/forms/ContactForm.test.tsx`

**Interfaces:**
- Consumes: `contactFormSchema` (Task 13), `submitContactForm` (Task 14), `ErrorState` (Task 12), `Input`/`Label`/`Textarea`/`Button` (Task 7).
- Produces: `<ContactForm />` — consumed by Task 25 (`/contact` page).
- Addresses Review Focus #1 (failed submission shows visible error UI).

- [ ] **Step 1: Write failing tests**

Create `components/forms/ContactForm.test.tsx`:
```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "./ContactForm";
import * as submitFormModule from "@/lib/forms/submitForm";

vi.mock("@/lib/forms/submitForm", () => ({
  submitContactForm: vi.fn(),
}));

describe("ContactForm", () => {
  beforeEach(() => {
    vi.mocked(submitFormModule.submitContactForm).mockReset();
  });

  it("shows validation errors when required fields are missing and does not submit", async () => {
    render(<ContactForm />);
    await userEvent.click(screen.getByRole("button", { name: "Send Message" }));
    expect(await screen.findAllByRole("alert")).not.toHaveLength(0);
    expect(submitFormModule.submitContactForm).not.toHaveBeenCalled();
  });

  it("shows a success message after a valid submission succeeds", async () => {
    vi.mocked(submitFormModule.submitContactForm).mockResolvedValue({ success: true });
    render(<ContactForm />);
    await userEvent.type(screen.getByLabelText("Full name"), "Jordan Lee");
    await userEvent.type(screen.getByLabelText("Email"), "jordan@example.com");
    await userEvent.click(screen.getByLabelText("Employer"));
    await userEvent.type(screen.getByLabelText("Message"), "We need to hire three engineers this quarter.");
    await userEvent.click(screen.getByRole("button", { name: "Send Message" }));
    expect(await screen.findByRole("status")).toHaveTextContent(/received your message/);
  });

  it("shows an error state when submission fails (Review Focus #1)", async () => {
    vi.mocked(submitFormModule.submitContactForm).mockResolvedValue({ success: false, error: "network error" });
    render(<ContactForm />);
    await userEvent.type(screen.getByLabelText("Full name"), "Jordan Lee");
    await userEvent.type(screen.getByLabelText("Email"), "jordan@example.com");
    await userEvent.click(screen.getByLabelText("Employer"));
    await userEvent.type(screen.getByLabelText("Message"), "We need to hire three engineers this quarter.");
    await userEvent.click(screen.getByRole("button", { name: "Send Message" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/couldn't send/i);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/forms/ContactForm.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement ContactForm**

Create `components/forms/ContactForm.tsx`:
```tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema, type ContactFormValues } from "@/lib/validation/formSchemas";
import { submitContactForm } from "@/lib/forms/submitForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ErrorState } from "@/components/states/ErrorState";

export function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactFormSchema) });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function onSubmit(values: ContactFormValues) {
    const result = await submitContactForm(values);
    if (result.success) {
      setStatus("success");
      reset();
    } else {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-xl border border-green-200 bg-green-50 p-6 text-green-900">
        Thanks — we received your message and will be in touch soon.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      {status === "error" && (
        <ErrorState description="We couldn't send your message. Please try again." onRetry={() => setStatus("idle")} />
      )}

      <div>
        <Label htmlFor="contact-name">Full name</Label>
        <Input id="contact-name" {...register("name")} aria-invalid={!!errors.name} />
        {errors.name && (
          <p role="alert" className="mt-1 text-sm text-red-700">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="contact-email">Email</Label>
        <Input id="contact-email" type="email" {...register("email")} aria-invalid={!!errors.email} />
        {errors.email && (
          <p role="alert" className="mt-1 text-sm text-red-700">
            {errors.email.message}
          </p>
        )}
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-navy-900">I am a...</legend>
        <div className="mt-2 flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" value="employer" {...register("audience")} /> Employer
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" value="candidate" {...register("audience")} /> Candidate
          </label>
        </div>
        {errors.audience && (
          <p role="alert" className="mt-1 text-sm text-red-700">
            Select one.
          </p>
        )}
      </fieldset>

      <div>
        <Label htmlFor="contact-message">Message</Label>
        <Textarea id="contact-message" rows={5} {...register("message")} aria-invalid={!!errors.message} />
        {errors.message && (
          <p role="alert" className="mt-1 text-sm text-red-700">
            {errors.message.message}
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="min-h-11">
        {isSubmitting ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- components/forms/ContactForm.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add components/forms/ContactForm.tsx components/forms/ContactForm.test.tsx
git commit -m "feat: add ContactForm with validation and error handling"
```

---

### Task 16: EmployerForm Component (hire-talent)

**Files:**
- Modify: `vitest.setup.ts` (add Radix UI jsdom polyfills)
- Create: `components/forms/EmployerForm.tsx`
- Test: `components/forms/EmployerForm.test.tsx`

**Interfaces:**
- Consumes: `employerFormSchema`, `HIRING_NEEDS`, `EMPLOYMENT_TYPES` (Task 13), `submitEmployerLead` (Task 14), `services` (Task 3), shadcn `Select*` (Task 7).
- Produces: `<EmployerForm />` — consumed by Task 25 (`/hire-talent` page).

- [ ] **Step 1: Add Radix UI jsdom polyfills needed for Select interaction in tests**

Modify `vitest.setup.ts` — append before the closing brace of the `if (typeof window !== "undefined")` block:
```ts
  window.HTMLElement.prototype.hasPointerCapture = () => false;
  window.HTMLElement.prototype.releasePointerCapture = () => {};
  window.HTMLElement.prototype.scrollIntoView = () => {};
  if (!window.ResizeObserver) {
    window.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as unknown as typeof ResizeObserver;
  }
```

- [ ] **Step 2: Write failing tests**

Create `components/forms/EmployerForm.test.tsx`:
```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EmployerForm } from "./EmployerForm";
import * as submitFormModule from "@/lib/forms/submitForm";

vi.mock("@/lib/forms/submitForm", () => ({
  submitEmployerLead: vi.fn(),
}));

async function fillRequiredFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Full name"), "Priya Nair");
  await user.type(screen.getByLabelText("Company"), "Acme Robotics");
  await user.type(screen.getByLabelText("Work email"), "priya@acmerobotics.com");
  await user.type(screen.getByLabelText("Phone"), "5551234567");
  await user.type(screen.getByLabelText("Job title"), "VP Engineering");
  await user.click(screen.getByRole("combobox", { name: "Hiring need" }));
  await user.click(await screen.findByRole("option", { name: "Direct Hire" }));
  await user.clear(screen.getByLabelText("Number of positions"));
  await user.type(screen.getByLabelText("Number of positions"), "3");
  await user.type(screen.getByLabelText("Location"), "Austin, TX");
  await user.click(screen.getByRole("combobox", { name: "Employment type" }));
  await user.click(await screen.findByRole("option", { name: "full time" }));
}

describe("EmployerForm", () => {
  beforeEach(() => {
    vi.mocked(submitFormModule.submitEmployerLead).mockReset();
  });

  it("shows validation errors when required fields are missing and does not submit", async () => {
    const user = userEvent.setup();
    render(<EmployerForm />);
    await user.click(screen.getByRole("button", { name: "Talk to a Talent Expert" }));
    expect(await screen.findAllByRole("alert")).not.toHaveLength(0);
    expect(submitFormModule.submitEmployerLead).not.toHaveBeenCalled();
  });

  it("submits and shows a success message when all fields are valid", async () => {
    vi.mocked(submitFormModule.submitEmployerLead).mockResolvedValue({ success: true });
    const user = userEvent.setup();
    render(<EmployerForm />);
    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: "Talk to a Talent Expert" }));
    expect(await screen.findByRole("status")).toHaveTextContent(/talent expert will reach out/);
  });

  it("shows an error state when submission fails (Review Focus #1)", async () => {
    vi.mocked(submitFormModule.submitEmployerLead).mockResolvedValue({ success: false });
    const user = userEvent.setup();
    render(<EmployerForm />);
    await fillRequiredFields(user);
    await user.click(screen.getByRole("button", { name: "Talk to a Talent Expert" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/couldn't submit/i);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test -- components/forms/EmployerForm.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 4: Implement EmployerForm**

Create `components/forms/EmployerForm.tsx`:
```tsx
"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  employerFormSchema,
  type EmployerFormValues,
  HIRING_NEEDS,
  EMPLOYMENT_TYPES,
} from "@/lib/validation/formSchemas";
import { submitEmployerLead } from "@/lib/forms/submitForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ErrorState } from "@/components/states/ErrorState";
import { services } from "@/content/services/data";

const HIRING_NEED_LABELS: Record<string, string> = Object.fromEntries(
  services.filter((s) => (HIRING_NEEDS as readonly string[]).includes(s.slug)).map((s) => [s.slug, s.name])
);

interface FieldProps {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="mt-1">{children}</div>
      {error && (
        <p role="alert" className="mt-1 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export function EmployerForm() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmployerFormValues>({ resolver: zodResolver(employerFormSchema) });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function onSubmit(values: EmployerFormValues) {
    const result = await submitEmployerLead(values);
    if (result.success) {
      setStatus("success");
      reset();
    } else {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-xl border border-green-200 bg-green-50 p-6 text-green-900">
        Thanks — a talent expert will reach out shortly.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4 sm:grid-cols-2">
      {status === "error" && (
        <div className="sm:col-span-2">
          <ErrorState
            description="We couldn't submit your request. Please try again."
            onRetry={() => setStatus("idle")}
          />
        </div>
      )}

      <Field id="employer-name" label="Full name" error={errors.name?.message}>
        <Input id="employer-name" {...register("name")} />
      </Field>
      <Field id="employer-company" label="Company" error={errors.company?.message}>
        <Input id="employer-company" {...register("company")} />
      </Field>
      <Field id="employer-work-email" label="Work email" error={errors.workEmail?.message}>
        <Input id="employer-work-email" type="email" {...register("workEmail")} />
      </Field>
      <Field id="employer-phone" label="Phone" error={errors.phone?.message}>
        <Input id="employer-phone" type="tel" {...register("phone")} />
      </Field>
      <Field id="employer-job-title" label="Job title" error={errors.jobTitle?.message}>
        <Input id="employer-job-title" {...register("jobTitle")} />
      </Field>

      <Field id="employer-hiring-need" label="Hiring need" error={errors.hiringNeed?.message}>
        <Controller
          control={control}
          name="hiringNeed"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="employer-hiring-need">
                <SelectValue placeholder="Select a service" />
              </SelectTrigger>
              <SelectContent>
                {HIRING_NEEDS.map((need) => (
                  <SelectItem key={need} value={need}>
                    {HIRING_NEED_LABELS[need]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </Field>

      <Field id="employer-positions" label="Number of positions" error={errors.numberOfPositions?.message}>
        <Input id="employer-positions" type="number" min={1} {...register("numberOfPositions")} />
      </Field>
      <Field id="employer-location" label="Location" error={errors.location?.message}>
        <Input id="employer-location" {...register("location")} />
      </Field>

      <Field id="employer-employment-type" label="Employment type" error={errors.employmentType?.message}>
        <Controller
          control={control}
          name="employmentType"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="employer-employment-type">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                {EMPLOYMENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace(/-/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </Field>

      <div className="sm:col-span-2">
        <Field id="employer-message" label="Message (optional)">
          <Textarea id="employer-message" rows={4} {...register("message")} />
        </Field>
      </div>

      <div className="sm:col-span-2">
        <Button type="submit" disabled={isSubmitting} className="min-h-11">
          {isSubmitting ? "Sending…" : "Talk to a Talent Expert"}
        </Button>
      </div>
    </form>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- components/forms/EmployerForm.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 6: Run full suite to confirm the setup polyfills didn't break earlier tests, then commit**

Run: `npm test`
Expected: all tests PASS.

```bash
git add vitest.setup.ts components/forms/EmployerForm.tsx components/forms/EmployerForm.test.tsx
git commit -m "feat: add EmployerForm for hire-talent lead capture"
```

---

### Task 17: CandidateForm Component (find-jobs resume submission)

**Files:**
- Create: `components/forms/CandidateForm.tsx`
- Test: `components/forms/CandidateForm.test.tsx`

**Interfaces:**
- Consumes: `candidateFormSchema`, `EMPLOYMENT_TYPES`, `validateResumeFile`, `MAX_RESUME_SIZE_BYTES` (Task 13), `submitCandidateResume` (Task 14).
- Produces: `<CandidateForm />` — consumed by Task 25 (`/find-jobs` page).
- Addresses Review Focus #2 (invalid/oversized resume rejected client-side before submit) and Review Focus #1 (failed submission shows visible error UI).

- [ ] **Step 1: Write failing tests**

Create `components/forms/CandidateForm.test.tsx`:
```tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CandidateForm } from "./CandidateForm";
import * as submitFormModule from "@/lib/forms/submitForm";
import { MAX_RESUME_SIZE_BYTES } from "@/lib/validation/formSchemas";

vi.mock("@/lib/forms/submitForm", () => ({
  submitCandidateResume: vi.fn(),
}));

async function fillCandidateFields(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText("Full name"), "Sam Okafor");
  await user.type(screen.getByLabelText("Email"), "sam@example.com");
  await user.type(screen.getByLabelText("Phone"), "5559876543");
  await user.type(screen.getByLabelText("Preferred location"), "Remote");
  await user.click(screen.getByRole("combobox", { name: "Employment type" }));
  await user.click(await screen.findByRole("option", { name: "contract" }));
}

describe("CandidateForm", () => {
  beforeEach(() => {
    vi.mocked(submitFormModule.submitCandidateResume).mockReset();
  });

  it("rejects an unsupported resume file type (Review Focus #2)", async () => {
    const user = userEvent.setup();
    render(<CandidateForm />);
    const file = new File(["content"], "resume.png", { type: "image/png" });
    await user.upload(screen.getByLabelText(/Resume/), file);
    expect(await screen.findByRole("alert")).toHaveTextContent("Upload a PDF or Word document.");
  });

  it("rejects a resume file over the size limit (Review Focus #2)", async () => {
    const user = userEvent.setup();
    render(<CandidateForm />);
    const oversized = new File([new Uint8Array(MAX_RESUME_SIZE_BYTES + 1)], "resume.pdf", {
      type: "application/pdf",
    });
    await user.upload(screen.getByLabelText(/Resume/), oversized);
    expect(await screen.findByRole("alert")).toHaveTextContent("File must be smaller than 5MB.");
  });

  it("blocks submission when no resume has been attached, even with valid fields", async () => {
    const user = userEvent.setup();
    render(<CandidateForm />);
    await fillCandidateFields(user);
    await user.click(screen.getByRole("button", { name: "Submit Your Resume" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Upload your resume to continue.");
    expect(submitFormModule.submitCandidateResume).not.toHaveBeenCalled();
  });

  it("submits and shows a success message with a valid resume and fields", async () => {
    vi.mocked(submitFormModule.submitCandidateResume).mockResolvedValue({ success: true });
    const user = userEvent.setup();
    render(<CandidateForm />);
    await fillCandidateFields(user);
    const file = new File(["content"], "resume.pdf", { type: "application/pdf" });
    await user.upload(screen.getByLabelText(/Resume/), file);
    await user.click(screen.getByRole("button", { name: "Submit Your Resume" }));
    expect(await screen.findByRole("status")).toHaveTextContent(/resume was received/);
  });

  it("shows an error state when submission fails (Review Focus #1)", async () => {
    vi.mocked(submitFormModule.submitCandidateResume).mockResolvedValue({ success: false });
    const user = userEvent.setup();
    render(<CandidateForm />);
    await fillCandidateFields(user);
    const file = new File(["content"], "resume.pdf", { type: "application/pdf" });
    await user.upload(screen.getByLabelText(/Resume/), file);
    await user.click(screen.getByRole("button", { name: "Submit Your Resume" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/couldn't submit your resume/i);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/forms/CandidateForm.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement CandidateForm**

Create `components/forms/CandidateForm.tsx`:
```tsx
"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  candidateFormSchema,
  type CandidateFormValues,
  EMPLOYMENT_TYPES,
  validateResumeFile,
} from "@/lib/validation/formSchemas";
import { submitCandidateResume } from "@/lib/forms/submitForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ErrorState } from "@/components/states/ErrorState";

export function CandidateForm() {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CandidateFormValues>({ resolver: zodResolver(candidateFormSchema) });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);

  function handleResumeChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    if (!file) {
      setResumeFile(null);
      setResumeError(null);
      return;
    }
    const error = validateResumeFile(file);
    if (error) {
      setResumeError(error);
      setResumeFile(null);
      event.target.value = "";
      return;
    }
    setResumeError(null);
    setResumeFile(file);
  }

  async function onSubmit(values: CandidateFormValues) {
    if (!resumeFile) {
      setResumeError("Upload your resume to continue.");
      return;
    }
    const result = await submitCandidateResume(values, resumeFile);
    if (result.success) {
      setStatus("success");
      reset();
      setResumeFile(null);
    } else {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="rounded-xl border border-green-200 bg-green-50 p-6 text-green-900">
        Thanks — your resume was received. A recruiter will follow up if there&apos;s a fit.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      {status === "error" && (
        <ErrorState
          description="We couldn't submit your resume. Please try again."
          onRetry={() => setStatus("idle")}
        />
      )}

      <div>
        <Label htmlFor="candidate-name">Full name</Label>
        <Input id="candidate-name" {...register("name")} />
        {errors.name && (
          <p role="alert" className="mt-1 text-sm text-red-700">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="candidate-email">Email</Label>
        <Input id="candidate-email" type="email" {...register("email")} />
        {errors.email && (
          <p role="alert" className="mt-1 text-sm text-red-700">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="candidate-phone">Phone</Label>
        <Input id="candidate-phone" type="tel" {...register("phone")} />
        {errors.phone && (
          <p role="alert" className="mt-1 text-sm text-red-700">
            {errors.phone.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="candidate-location">Preferred location</Label>
        <Input id="candidate-location" {...register("preferredLocation")} />
        {errors.preferredLocation && (
          <p role="alert" className="mt-1 text-sm text-red-700">
            {errors.preferredLocation.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="candidate-employment-type">Employment type</Label>
        <Controller
          control={control}
          name="employmentType"
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="candidate-employment-type">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                {EMPLOYMENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type.replace(/-/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.employmentType && (
          <p role="alert" className="mt-1 text-sm text-red-700">
            Select an employment type.
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="candidate-resume">Resume (PDF or Word, up to 5MB)</Label>
        <input
          id="candidate-resume"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleResumeChange}
          className="mt-1 block w-full text-sm"
        />
        {resumeError && (
          <p role="alert" className="mt-1 text-sm text-red-700">
            {resumeError}
          </p>
        )}
        {resumeFile && !resumeError && <p className="mt-1 text-sm text-navy-700">Selected: {resumeFile.name}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="min-h-11">
        {isSubmitting ? "Submitting…" : "Submit Your Resume"}
      </Button>
    </form>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- components/forms/CandidateForm.test.tsx`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add components/forms/CandidateForm.tsx components/forms/CandidateForm.test.tsx
git commit -m "feat: add CandidateForm with resume upload validation"
```

---

### Task 18: SEO Helpers — Metadata Builder and JSON-LD

**Files:**
- Create: `lib/seo/metadata.ts`, `lib/seo/jsonld.ts`, `components/seo/JsonLd.tsx`
- Test: `lib/seo/metadata.test.ts`, `lib/seo/jsonld.test.ts`, `components/seo/JsonLd.test.tsx`

**Interfaces:**
- Produces: `SITE_NAME`, `SITE_URL`; `buildMetadata({ title, description, path }): Metadata`; `organizationJsonLd()`, `websiteJsonLd()`, `breadcrumbJsonLd(items: BreadcrumbEntry[])`, `articleJsonLd(input: ArticleJsonLdInput)`, `faqPageJsonLd(items: FAQJsonLdInput[])`; `<JsonLd data />` — consumed by Tasks 19-26 (every page).
- No `JobPosting` schema anywhere (Global Constraints — no job board exists).

- [ ] **Step 1: Write failing test for metadata builder**

Create `lib/seo/metadata.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { buildMetadata, SITE_URL } from "./metadata";

describe("buildMetadata", () => {
  it("builds a title suffixed with the site name and a canonical URL", () => {
    const metadata = buildMetadata({ title: "Direct Hire", description: "Find permanent talent.", path: "/services/direct-hire" });
    expect(metadata.title).toBe("Direct Hire | TheCareerQuotient");
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/services/direct-hire`);
    expect(metadata.openGraph?.title).toBe("Direct Hire");
    expect(metadata.twitter?.card).toBe("summary_large_image");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/seo/metadata.test.ts`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement metadata builder**

Create `lib/seo/metadata.ts`:
```ts
import type { Metadata } from "next";

export const SITE_NAME = "TheCareerQuotient";
export const SITE_URL = "https://thecareerquotient.com";

interface BuildMetadataOptions {
  title: string;
  description: string;
  path: string;
}

export function buildMetadata({ title, description, path }: BuildMetadataOptions): Metadata {
  const url = `${SITE_URL}${path}`;
  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- lib/seo/metadata.test.ts`
Expected: PASS.

- [ ] **Step 5: Write failing test for JSON-LD builders**

Create `lib/seo/jsonld.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { organizationJsonLd, websiteJsonLd, breadcrumbJsonLd, articleJsonLd, faqPageJsonLd } from "./jsonld";

describe("jsonld builders", () => {
  it("builds Organization and WebSite schema", () => {
    expect(organizationJsonLd()["@type"]).toBe("Organization");
    expect(websiteJsonLd()["@type"]).toBe("WebSite");
  });

  it("builds a BreadcrumbList with 1-indexed positions", () => {
    const result = breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
    ]);
    expect(result.itemListElement).toHaveLength(2);
    expect(result.itemListElement[0].position).toBe(1);
    expect(result.itemListElement[1].item).toBe("https://thecareerquotient.com/services");
  });

  it("builds Article schema", () => {
    const result = articleJsonLd({
      title: "Resume Tips That Work",
      description: "Practical advice.",
      path: "/insights/resume-tips-that-work",
      datePublished: "2026-01-10",
      author: "TheCareerQuotient Editorial Team",
    });
    expect(result["@type"]).toBe("Article");
    expect(result.headline).toBe("Resume Tips That Work");
  });

  it("builds FAQPage schema with nested Question/Answer entities", () => {
    const result = faqPageJsonLd([{ question: "Do you support remote roles?", answer: "Yes." }]);
    expect(result.mainEntity[0]["@type"]).toBe("Question");
    expect(result.mainEntity[0].acceptedAnswer.text).toBe("Yes.");
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npm test -- lib/seo/jsonld.test.ts`
Expected: FAIL — module does not exist.

- [ ] **Step 7: Implement JSON-LD builders**

Create `lib/seo/jsonld.ts`:
```ts
import { SITE_NAME, SITE_URL } from "./metadata";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  };
}

export interface BreadcrumbEntry {
  name: string;
  path: string;
}

export function breadcrumbJsonLd(items: BreadcrumbEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export interface ArticleJsonLdInput {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  author: string;
}

export function articleJsonLd(input: ArticleJsonLdInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    datePublished: input.datePublished,
    author: { "@type": "Person", name: input.author },
    mainEntityOfPage: `${SITE_URL}${input.path}`,
  };
}

export interface FAQJsonLdInput {
  question: string;
  answer: string;
}

export function faqPageJsonLd(items: FAQJsonLdInput[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npm test -- lib/seo/jsonld.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 9: Write failing test for the JsonLd component**

Create `components/seo/JsonLd.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { JsonLd } from "./JsonLd";

describe("JsonLd", () => {
  it("renders a script tag containing the serialized data", () => {
    const { container } = render(<JsonLd data={{ "@type": "Organization", name: "TheCareerQuotient" }} />);
    const script = container.querySelector('script[type="application/ld+json"]');
    expect(script).not.toBeNull();
    expect(JSON.parse(script?.textContent ?? "{}")).toEqual({ "@type": "Organization", name: "TheCareerQuotient" });
  });
});
```

- [ ] **Step 10: Run test to verify it fails**

Run: `npm test -- components/seo/JsonLd.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 11: Implement JsonLd**

Create `components/seo/JsonLd.tsx`:
```tsx
interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
```

- [ ] **Step 12: Run all SEO test files, then commit**

Run: `npm test -- lib/seo/metadata.test.ts lib/seo/jsonld.test.ts components/seo/JsonLd.test.tsx`
Expected: PASS (6 tests).

```bash
git add lib/seo components/seo
git commit -m "feat: add SEO metadata builder and JSON-LD structured data"
```

---

### Task 19: Root Layout & App Shell

**Files:**
- Create: `components/layout/AppShell.tsx`
- Test: `components/layout/AppShell.test.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `Navbar` (Task 8), `Footer`/`CookieBanner` (Task 9), `Toaster` (Task 7), `JsonLd` (Task 18), `organizationJsonLd`/`websiteJsonLd` (Task 18), `fontSans` (Task 2).
- Produces: `<AppShell>{children}</AppShell>` (skip link + Navbar + `<main id="main-content">` + Footer + CookieBanner + Toaster); root `RootLayout` wraps it with `<html>`/`<body>` and site-wide metadata — consumed by every route in Tasks 20-26.
- Note: layout is split into `AppShell` (testable, no `<html>`/`<body>`) and the thin `app/layout.tsx` wrapper, because rendering nested `<html>`/`<body>` tags inside React Testing Library's jsdom document is invalid and untestable directly.

- [ ] **Step 1: Write failing test for AppShell**

Create `components/layout/AppShell.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AppShell } from "./AppShell";

describe("AppShell", () => {
  it("renders the skip link, Navbar landmark, a labeled main region, and Footer landmark", () => {
    render(
      <AppShell>
        <p>Page content</p>
      </AppShell>
    );
    expect(screen.getByRole("link", { name: "Skip to main content" })).toHaveAttribute("href", "#main-content");
    expect(screen.getByRole("banner")).toBeInTheDocument();
    const main = screen.getByRole("main");
    expect(main).toHaveAttribute("id", "main-content");
    expect(main).toHaveTextContent("Page content");
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/layout/AppShell.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement AppShell**

Create `components/layout/AppShell.tsx`:
```tsx
import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CookieBanner } from "./CookieBanner";
import { Toaster } from "@/components/ui/sonner";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col font-sans">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2"
      >
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <CookieBanner />
      <Toaster />
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- components/layout/AppShell.test.tsx`
Expected: PASS.

- [ ] **Step 5: Wire up the root layout with site-wide metadata and Organization/WebSite JSON-LD**

Replace `app/layout.tsx`:
```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { fontSans } from "@/lib/fonts";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/jsonld";
import { SITE_NAME, SITE_URL } from "@/lib/seo/metadata";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description:
    "TheCareerQuotient connects ambitious organizations with exceptional professionals through flexible staffing, permanent hiring, executive search, and workforce solutions.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={fontSans.variable}>
      <body>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
```

- [ ] **Step 6: Run full build to confirm the root layout compiles and renders**

Run: `npm run build`
Expected: build succeeds (the default `app/page.tsx` placeholder from Task 1 still renders inside the shell).

- [ ] **Step 7: Commit**

```bash
git add components/layout/AppShell.tsx components/layout/AppShell.test.tsx app/layout.tsx
git commit -m "feat: add AppShell and wire up root layout with site metadata"
```

---

### Task 20: Insights — MDX Content Infra, Listing, and Article Detail

**Files:**
- Create: `content/insights/how-to-write-a-resume-that-gets-interviews.mdx`
- Create: `content/insights/what-hiring-managers-actually-look-for-in-2026.mdx`
- Create: `content/insights/how-to-negotiate-a-job-offer-with-confidence.mdx`
- Create: `lib/content/insights.ts`
- Create: `app/insights/page.tsx`, `app/insights/[slug]/page.tsx`
- Test: `lib/content/insights.test.ts`

**Interfaces:**
- Consumes: `ArticleCard` (Task 11), `EmptyState` (Task 12), `buildMetadata` (Task 18), `articleJsonLd`/`breadcrumbJsonLd`/`JsonLd` (Task 18), `Breadcrumbs` (Task 11).
- Produces: `Article { slug, title, description, category, date, author, readingTime, content }`; `getAllArticles(): Article[]` (sorted newest first); `getArticleBySlug(slug): Article | null`; `getAllCategories(): string[]` — consumed by Task 21 (homepage Career Insights preview).
- No `Pagination` component: with 3 seed articles, pagination adds no value yet (YAGNI) — add it when article volume warrants it.

- [ ] **Step 1: Write failing test for the content loader**

Create `lib/content/insights.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { getAllArticles, getArticleBySlug, getAllCategories } from "./insights";

describe("insights content loader", () => {
  it("loads all 3 seed articles sorted newest first", () => {
    const articles = getAllArticles();
    expect(articles).toHaveLength(3);
    for (let i = 1; i < articles.length; i++) {
      expect(articles[i - 1].date >= articles[i].date).toBe(true);
    }
  });

  it("computes a human-readable reading time for every article", () => {
    for (const article of getAllArticles()) {
      expect(article.readingTime).toMatch(/read/);
    }
  });

  it("returns a matching article by slug and null for an unknown slug", () => {
    const [first] = getAllArticles();
    expect(getArticleBySlug(first.slug)?.title).toBe(first.title);
    expect(getArticleBySlug("not-a-real-article")).toBeNull();
  });

  it("derives the distinct category list", () => {
    const categories = getAllCategories();
    expect(categories.length).toBeGreaterThan(0);
    expect(new Set(categories).size).toBe(categories.length);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- lib/content/insights.test.ts`
Expected: FAIL — module and content directory do not exist.

- [ ] **Step 3: Author the 3 seed articles**

Create `content/insights/how-to-write-a-resume-that-gets-interviews.mdx`:
```mdx
---
title: "How to Write a Resume That Gets Interviews"
description: "A resume's job is to earn you fifteen more minutes with a hiring manager. Here's how to write one that does."
category: "Resume Tips"
date: "2026-01-10"
author: "TheCareerQuotient Editorial Team"
---

A resume's job is not to tell your whole story — it's to earn you fifteen more minutes with a hiring manager. Every line should serve that goal.

Start with results, not duties. Instead of "Responsible for managing a sales team," write "Grew regional sales 18% by restructuring a six-person team's territory coverage." The second version tells a hiring manager what actually happened.

Match your language to the role, not the other way around. If a job posting says "cross-functional collaboration," and that's genuinely part of what you did, use those words — many resumes are scanned for relevant terms before a human ever reads them.

Keep it to one page for anything under ten years of experience. A shorter resume forces you to cut what doesn't matter, which usually makes the whole document stronger.
```

Create `content/insights/what-hiring-managers-actually-look-for-in-2026.mdx`:
```mdx
---
title: "What Hiring Managers Actually Look For in 2026"
description: "Job descriptions list requirements. Interviews reveal priorities. Here are the patterns that show up again and again."
category: "Hiring Trends"
date: "2026-02-14"
author: "TheCareerQuotient Editorial Team"
---

Job descriptions list requirements. Interviews reveal priorities. After years of conversations with hiring managers across industries, a few patterns show up again and again.

First, they want evidence you can operate with ambiguity. Fewer roles today come with a fully scoped playbook — most hiring managers are looking for someone who can make progress without waiting for perfect instructions.

Second, they're screening for how you handle disagreement. A candidate who can describe a time they pushed back on a decision, respectfully and with a reason, stands out more than one who only describes smooth collaboration.

Third, they care about ramp time. The question behind most interview questions is some version of: how long until this person is contributing without heavy oversight? Concrete examples of learning something unfamiliar quickly answer that question better than a list of skills.
```

Create `content/insights/how-to-negotiate-a-job-offer-with-confidence.mdx`:
```mdx
---
title: "How to Negotiate a Job Offer With Confidence"
description: "Declining to negotiate has a cost too. Here's how to ask for more without feeling like you're overreaching."
category: "Career Advice"
date: "2026-03-05"
author: "TheCareerQuotient Editorial Team"
---

Negotiating a job offer feels risky, but declining to negotiate has a cost too — most employers build some room into their initial offer, and not asking means leaving that room unused.

Start by getting the full offer in writing before you respond. Base salary is only one part of the picture; bonus structure, equity, start date, and remote flexibility are all negotiable in most cases.

When you respond, lead with enthusiasm, then ask, not demand. "I'm excited about this role — based on my research and experience, I was expecting a base closer to X. Is there flexibility there?" gives the employer room to say yes without feeling cornered.

If the number can't move, ask about the things that can: a signing bonus, an earlier performance review, or additional vacation days. A good offer is rarely just one number — it's a package, and packages have more flexible edges than headlines suggest.
```

- [ ] **Step 4: Implement the content loader**

Create `lib/content/insights.ts`:
```ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import readingTime from "reading-time";

const INSIGHTS_DIR = path.join(process.cwd(), "content", "insights");

export interface ArticleFrontmatter {
  title: string;
  description: string;
  category: string;
  date: string;
  author: string;
}

export interface Article extends ArticleFrontmatter {
  slug: string;
  readingTime: string;
  content: string;
}

function readArticleFile(filename: string): Article {
  const slug = filename.replace(/\.mdx$/, "");
  const raw = fs.readFileSync(path.join(INSIGHTS_DIR, filename), "utf8");
  const { data, content } = matter(raw);
  const frontmatter = data as ArticleFrontmatter;
  return {
    ...frontmatter,
    slug,
    readingTime: readingTime(content).text,
    content,
  };
}

export function getAllArticles(): Article[] {
  const filenames = fs.readdirSync(INSIGHTS_DIR).filter((name) => name.endsWith(".mdx"));
  return filenames.map(readArticleFile).sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(INSIGHTS_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  return readArticleFile(`${slug}.mdx`);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(getAllArticles().map((article) => article.category))).sort();
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test -- lib/content/insights.test.ts`
Expected: PASS (4 tests).

- [ ] **Step 6: Build the Insights listing page**

Create `app/insights/page.tsx`:
```tsx
import Link from "next/link";
import type { Metadata } from "next";
import { getAllArticles, getAllCategories } from "@/lib/content/insights";
import { ArticleCard } from "@/components/marketing/ArticleCard";
import { EmptyState } from "@/components/states/EmptyState";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Career Insights",
  description: "Career advice, hiring trends, and workforce strategy from TheCareerQuotient.",
  path: "/insights",
});

interface InsightsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function InsightsPage({ searchParams }: InsightsPageProps) {
  const { category } = await searchParams;
  const articles = getAllArticles();
  const categories = getAllCategories();
  const filtered = category ? articles.filter((a) => a.category === category) : articles;

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-display-md font-bold text-navy-900">Career Insights</h1>

      <nav aria-label="Filter by category" className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/insights"
          className={`rounded-full border px-4 py-2 text-sm ${
            !category ? "border-navy-900 bg-navy-900 text-white" : "border-navy-100 text-navy-700"
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/insights?category=${encodeURIComponent(cat)}`}
            className={`rounded-full border px-4 py-2 text-sm ${
              category === cat ? "border-navy-900 bg-navy-900 text-white" : "border-navy-100 text-navy-700"
            }`}
          >
            {cat}
          </Link>
        ))}
      </nav>

      {filtered.length === 0 ? (
        <div className="mt-10">
          <EmptyState
            heading="No articles matched this category."
            description="Try a different category or view all insights."
            action={
              <Link href="/insights" className="font-semibold text-accent">
                View all insights
              </Link>
            }
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 7: Build the article detail page**

Create `app/insights/[slug]/page.tsx`:
```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllArticles, getArticleBySlug } from "@/lib/content/insights";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { articleJsonLd, breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  return buildMetadata({ title: article.title, description: article.description, path: `/insights/${slug}` });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <JsonLd
        data={articleJsonLd({
          title: article.title,
          description: article.description,
          path: `/insights/${slug}`,
          datePublished: article.date,
          author: article.author,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Insights", path: "/insights" },
          { name: article.title, path: `/insights/${slug}` },
        ])}
      />
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/insights", label: "Insights" },
          { href: `/insights/${slug}`, label: article.title },
        ]}
      />
      <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-accent">{article.category}</p>
      <h1 className="mt-2 text-display-md font-bold text-navy-900">{article.title}</h1>
      <p className="mt-2 text-sm text-navy-700">
        {article.author} · {article.date} · {article.readingTime}
      </p>
      <div className="mt-8 space-y-4 text-navy-800">
        <MDXRemote source={article.content} />
      </div>
    </article>
  );
}
```

- [ ] **Step 8: Run full build to confirm both routes and dynamic params generate correctly**

Run: `npm run build`
Expected: build succeeds; `/insights` and 3 static `/insights/[slug]` routes are generated.

- [ ] **Step 9: Commit**

```bash
git add content/insights lib/content app/insights
git commit -m "feat: add Insights MDX content, listing, and article detail pages"
```

---

### Task 21: Homepage Assembly

**Files:**
- Modify: `app/page.tsx` (replace the create-next-app placeholder)
- Test: `app/page.test.tsx`

**Interfaces:**
- Consumes: `Hero`, `CTASection`, `StatsSection`, `ServiceCard`, `IndustryCard`, `ProcessTimeline`, `ArticleCard` (Tasks 10-11), `ScrollReveal` (Task 6), `services` (Task 3), `industries` (Task 4), `getAllArticles` (Task 20), `buildMetadata` (Task 18).
- Implements the homepage section order from spec §5 minus Navigation/Footer (owned by `AppShell`, Task 19) and the job-search hero block (removed per Global Constraints).

- [ ] **Step 1: Write failing test for the homepage**

Create `app/page.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HomePage from "./page";
import { services } from "@/content/services/data";
import { getAllArticles } from "@/lib/content/insights";

describe("HomePage", () => {
  it("renders the hero, all 7 services, both process timelines, and every primary CTA", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { level: 1, name: /Smarter Talent/ })).toBeInTheDocument();

    for (const service of services) {
      expect(screen.getByRole("heading", { name: service.name })).toBeInTheDocument();
    }

    expect(screen.getByRole("heading", { name: "How It Works for Employers" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "How It Works for Candidates" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View all industries →" })).toHaveAttribute("href", "/industries");

    const latest = getAllArticles().slice(0, 3);
    for (const article of latest) {
      expect(screen.getByRole("heading", { name: article.title })).toBeInTheDocument();
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- app/page.test.tsx`
Expected: FAIL — placeholder homepage does not contain this content.

- [ ] **Step 3: Implement the homepage**

Replace `app/page.tsx`:
```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/marketing/Hero";
import { StatsSection } from "@/components/marketing/StatsSection";
import { ServiceCard } from "@/components/marketing/ServiceCard";
import { IndustryCard } from "@/components/marketing/IndustryCard";
import { ProcessTimeline } from "@/components/marketing/ProcessTimeline";
import { ArticleCard } from "@/components/marketing/ArticleCard";
import { CTASection } from "@/components/marketing/CTASection";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { services } from "@/content/services/data";
import { industries } from "@/content/industries/data";
import { getAllArticles } from "@/lib/content/insights";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Smarter Talent. Stronger Teams. Better Careers.",
  description:
    "TheCareerQuotient connects ambitious organizations with exceptional professionals through flexible staffing, permanent hiring, executive search, and workforce solutions.",
  path: "/",
});

const WHY_POINTS = [
  { title: "Human Expertise", description: "Experienced recruiters who understand people beyond resumes." },
  { title: "Intelligent Matching", description: "Technology and structured assessment identify stronger matches." },
  { title: "Speed", description: "We reduce unnecessary delays in the hiring process." },
  {
    title: "Precision",
    description: "Matching skills, experience, culture, career goals, and business requirements.",
  },
  { title: "Transparency", description: "Clients and candidates stay informed throughout the process." },
  { title: "Long-Term Relationships", description: "We don't disappear after placement." },
];

const EMPLOYER_STEPS = [
  {
    number: "01",
    title: "Tell Us What You Need",
    description: "Share your role, workforce challenge, timeline, and requirements.",
  },
  { number: "02", title: "We Build the Talent Strategy", description: "We identify the right sourcing and engagement model." },
  { number: "03", title: "We Find & Screen", description: "Candidates are sourced, evaluated, and shortlisted." },
  { number: "04", title: "You Meet the Talent", description: "Review qualified candidates and conduct interviews." },
  {
    number: "05",
    title: "Hire & Scale",
    description: "We support offer management, onboarding, and ongoing workforce needs.",
  },
];

const CANDIDATE_STEPS = [
  { number: "01", title: "Create Your Profile", description: "Tell us about your experience and career goals." },
  { number: "02", title: "Discover Opportunities", description: "Explore roles matching your skills and goals." },
  { number: "03", title: "Connect With Recruiters", description: "Our recruiters guide you through relevant opportunities." },
  { number: "04", title: "Interview", description: "Prepare, interview, and receive feedback." },
  { number: "05", title: "Start Your Next Chapter", description: "Join your new organization with continued support." },
];

export default function HomePage() {
  const featuredIndustries = industries.slice(0, 4);
  const latestArticles = getAllArticles().slice(0, 3);

  return (
    <>
      <div className="border-b border-navy-100 bg-navy-900 py-2 text-center text-sm text-offwhite">
        Human-first hiring, built for how work actually happens.
      </div>

      <Hero />

      <StatsSection stats={[]} />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-display-md font-bold text-navy-900">Workforce Solutions Built Around Your Needs</h2>
        </ScrollReveal>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="text-display-md font-bold text-navy-900">Recruitment Should Feel Human.</h2>
          </ScrollReveal>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_POINTS.map((point) => (
              <div key={point.title} className="rounded-xl border border-navy-100 p-6">
                <h3 className="font-semibold text-navy-900">{point.title}</h3>
                <p className="mt-2 text-sm text-navy-700">{point.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-display-md font-bold text-navy-900">How It Works for Employers</h2>
        <div className="mt-8">
          <ProcessTimeline steps={EMPLOYER_STEPS} />
        </div>

        <h2 className="mt-16 text-display-md font-bold text-navy-900">How It Works for Candidates</h2>
        <div className="mt-8">
          <ProcessTimeline steps={CANDIDATE_STEPS} />
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-display-md font-bold text-navy-900">Industries We Serve</h2>
            <Link href="/industries" className="font-semibold text-accent">
              View all industries →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredIndustries.map((industry) => (
              <IndustryCard key={industry.slug} industry={industry} />
            ))}
          </div>
        </div>
      </section>

      <CTASection
        heading="Your next opportunity starts here."
        description="Discover roles that match your skills, ambitions, and career goals."
        ctaLabel="Find Jobs"
        ctaHref="/find-jobs"
      />

      <CTASection
        heading="Your next great hire is closer than you think."
        description="Tell us what you need. We'll help you find the people who can move your business forward."
        ctaLabel="Hire Talent"
        ctaHref="/hire-talent"
      />

      {latestArticles.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-display-md font-bold text-navy-900">Career Insights</h2>
            <Link href="/insights" className="font-semibold text-accent">
              View all insights →
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </section>
      )}

      <CTASection
        heading="Great hiring starts with understanding."
        description="Talk to a talent expert about your next hire or your next career move."
        ctaLabel="Talk to Us"
        ctaHref="/contact"
      />
    </>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- app/page.test.tsx`
Expected: PASS.

- [ ] **Step 5: Run full build, then commit**

Run: `npm run build`
Expected: build succeeds.

```bash
git add app/page.tsx app/page.test.tsx
git commit -m "feat: assemble homepage from spec section order"
```

---

### Task 22: Services Pages — Overview and Dynamic Detail

**Files:**
- Create: `app/services/page.tsx`, `app/services/[slug]/page.tsx`
- Test: `app/services/page.test.tsx`, `app/services/[slug]/page.test.tsx`

**Interfaces:**
- Consumes: `services` (Task 3), `industries` (Task 4), `ServiceCard`/`IndustryCard`/`CTASection`/`Breadcrumbs` (Tasks 10-11), `buildMetadata`/`breadcrumbJsonLd`/`JsonLd` (Task 18).
- Addresses Review Focus #3 (`/services/not-a-real-slug` renders `notFound()`).

- [ ] **Step 1: Write failing test for the services overview page**

Create `app/services/page.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ServicesPage from "./page";
import { services } from "@/content/services/data";

describe("ServicesPage", () => {
  it("renders every service as a card with a link to its detail page", () => {
    render(<ServicesPage />);
    for (const service of services) {
      expect(screen.getByRole("heading", { name: service.name })).toBeInTheDocument();
    }
    expect(screen.getByRole("heading", { name: "Not sure which service fits?" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- app/services/page.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement the services overview page**

Create `app/services/page.tsx`:
```tsx
import type { Metadata } from "next";
import { services } from "@/content/services/data";
import { ServiceCard } from "@/components/marketing/ServiceCard";
import { CTASection } from "@/components/marketing/CTASection";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Workforce Solutions",
  description: "Contingent staffing, direct hire, executive search, and more workforce solutions from TheCareerQuotient.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-display-md font-bold text-navy-900">Workforce Solutions Built Around Your Needs</h1>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </div>
      <CTASection
        heading="Not sure which service fits?"
        description="Talk to a talent expert and we'll help you find the right engagement model."
        ctaLabel="Talk to a Talent Expert"
        ctaHref="/contact"
      />
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- app/services/page.test.tsx`
Expected: PASS.

- [ ] **Step 5: Write failing test for the service detail page**

Create `app/services/[slug]/page.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ServiceDetailPage, { generateStaticParams } from "./page";
import { services } from "@/content/services/data";

describe("ServiceDetailPage", () => {
  it("generates static params for all services", () => {
    expect(generateStaticParams()).toHaveLength(services.length);
  });

  it("renders the service name, summary, and features for a valid slug", async () => {
    const jsx = await ServiceDetailPage({ params: Promise.resolve({ slug: "direct-hire" }) });
    render(jsx);
    const directHire = services.find((s) => s.slug === "direct-hire")!;
    expect(screen.getByRole("heading", { level: 1, name: "Direct Hire" })).toBeInTheDocument();
    expect(screen.getByText(directHire.summary)).toBeInTheDocument();
  });

  it("throws notFound for an unknown slug (Review Focus #3)", async () => {
    await expect(ServiceDetailPage({ params: Promise.resolve({ slug: "not-a-real-slug" }) })).rejects.toThrow();
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npm test -- app/services/[slug]/page.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 7: Implement the service detail page**

Create `app/services/[slug]/page.tsx`:
```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services } from "@/content/services/data";
import { industries } from "@/content/industries/data";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo/jsonld";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { CTASection } from "@/components/marketing/CTASection";
import { IndustryCard } from "@/components/marketing/IndustryCard";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return buildMetadata({ title: service.name, description: service.summary, path: `/services/${slug}` });
}

export default async function ServiceDetailPage({ params }: ServiceDetailPageProps) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const relatedIndustries = industries.filter((industry) => industry.services.includes(service.slug)).slice(0, 3);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.name, path: `/services/${slug}` },
        ])}
      />
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/services", label: "Services" },
          { href: `/services/${slug}`, label: service.name },
        ]}
      />
      <h1 className="mt-6 text-display-md font-bold text-navy-900">{service.name}</h1>
      <p className="mt-2 text-lg text-navy-700">{service.tagline}</p>
      <p className="mt-6 max-w-3xl text-navy-800">{service.summary}</p>

      <h2 className="mt-10 text-xl font-semibold text-navy-900">What&apos;s included</h2>
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {service.features.map((feature) => (
          <li key={feature} className="rounded-lg border border-navy-100 p-4 text-sm text-navy-700">
            {feature}
          </li>
        ))}
      </ul>

      {relatedIndustries.length > 0 && (
        <>
          <h2 className="mt-10 text-xl font-semibold text-navy-900">Industries we apply this to</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-3">
            {relatedIndustries.map((industry) => (
              <IndustryCard key={industry.slug} industry={industry} />
            ))}
          </div>
        </>
      )}

      <div className="mt-12">
        <CTASection
          heading={`Ready to get started with ${service.name}?`}
          description="Talk to a talent expert today."
          ctaLabel={service.ctaLabel}
          ctaHref="/hire-talent"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npm test -- app/services/[slug]/page.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 9: Run full build, then commit**

Run: `npm run build`
Expected: build succeeds; 7 static `/services/[slug]` routes generated.

```bash
git add app/services
git commit -m "feat: add services overview and dynamic detail pages"
```

---

### Task 23: Industries Pages — Overview and Dynamic Detail

**Files:**
- Create: `app/industries/page.tsx`, `app/industries/[slug]/page.tsx`
- Test: `app/industries/page.test.tsx`, `app/industries/[slug]/page.test.tsx`

**Interfaces:**
- Consumes: `industries` (Task 4), `services` (Task 3), `IndustryCard`/`ServiceCard`/`FAQAccordion`/`CTASection`/`Breadcrumbs` (Tasks 10-11), `buildMetadata`/`breadcrumbJsonLd`/`faqPageJsonLd`/`JsonLd` (Task 18).
- Addresses Review Focus #3 (`/industries/not-a-real-slug` renders `notFound()`).

- [ ] **Step 1: Write failing test for the industries overview page**

Create `app/industries/page.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import IndustriesPage from "./page";
import { industries } from "@/content/industries/data";

describe("IndustriesPage", () => {
  it("renders every industry as a card", () => {
    render(<IndustriesPage />);
    for (const industry of industries) {
      expect(screen.getByRole("heading", { name: industry.name })).toBeInTheDocument();
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails, then implement**

Run: `npm test -- app/industries/page.test.tsx`
Expected: FAIL — module does not exist.

Create `app/industries/page.tsx`:
```tsx
import type { Metadata } from "next";
import { industries } from "@/content/industries/data";
import { IndustryCard } from "@/components/marketing/IndustryCard";
import { CTASection } from "@/components/marketing/CTASection";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Industries We Serve",
  description: "Specialized staffing and workforce solutions across technology, engineering, finance, healthcare, and more.",
  path: "/industries",
});

export default function IndustriesPage() {
  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-display-md font-bold text-navy-900">Industries We Serve</h1>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((industry) => (
            <IndustryCard key={industry.slug} industry={industry} />
          ))}
        </div>
      </div>
      <CTASection
        heading="Don't see your industry?"
        description="We recruit across a wide range of specialties. Tell us what you need."
        ctaLabel="Talk to a Talent Expert"
        ctaHref="/contact"
      />
    </div>
  );
}
```

Run: `npm test -- app/industries/page.test.tsx`
Expected: PASS.

- [ ] **Step 3: Write failing test for the industry detail page**

Create `app/industries/[slug]/page.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import IndustryDetailPage, { generateStaticParams } from "./page";
import { industries } from "@/content/industries/data";

describe("IndustryDetailPage", () => {
  it("generates static params for all industries", () => {
    expect(generateStaticParams()).toHaveLength(industries.length);
  });

  it("renders the industry name, intro, roles, and FAQ for a valid slug", async () => {
    const jsx = await IndustryDetailPage({ params: Promise.resolve({ slug: "technology" }) });
    render(jsx);
    const technology = industries.find((i) => i.slug === "technology")!;
    expect(screen.getByRole("heading", { level: 1, name: "Technology" })).toBeInTheDocument();
    expect(screen.getByText(technology.intro)).toBeInTheDocument();
    expect(screen.getByText(technology.roles[0])).toBeInTheDocument();
    expect(screen.getByRole("button", { name: technology.faqs[0].question })).toBeInTheDocument();
  });

  it("throws notFound for an unknown slug (Review Focus #3)", async () => {
    await expect(IndustryDetailPage({ params: Promise.resolve({ slug: "not-a-real-slug" }) })).rejects.toThrow();
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `npm test -- app/industries/[slug]/page.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 5: Implement the industry detail page**

Create `app/industries/[slug]/page.tsx`:
```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { industries } from "@/content/industries/data";
import { services } from "@/content/services/data";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/seo/jsonld";
import { Breadcrumbs } from "@/components/marketing/Breadcrumbs";
import { ServiceCard } from "@/components/marketing/ServiceCard";
import { FAQAccordion } from "@/components/marketing/FAQAccordion";
import { CTASection } from "@/components/marketing/CTASection";

interface IndustryDetailPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: industry.slug }));
}

export async function generateMetadata({ params }: IndustryDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const industry = industries.find((i) => i.slug === slug);
  if (!industry) return {};
  return buildMetadata({ title: industry.name, description: industry.intro, path: `/industries/${slug}` });
}

export default async function IndustryDetailPage({ params }: IndustryDetailPageProps) {
  const { slug } = await params;
  const industry = industries.find((i) => i.slug === slug);
  if (!industry) notFound();

  const relatedServices = services.filter((s) => industry.services.includes(s.slug));

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Industries", path: "/industries" },
          { name: industry.name, path: `/industries/${slug}` },
        ])}
      />
      <JsonLd data={faqPageJsonLd(industry.faqs)} />
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/industries", label: "Industries" },
          { href: `/industries/${slug}`, label: industry.name },
        ]}
      />
      <h1 className="mt-6 text-display-md font-bold text-navy-900">{industry.name}</h1>
      <p className="mt-6 max-w-3xl text-navy-800">{industry.intro}</p>

      <h2 className="mt-10 text-xl font-semibold text-navy-900">Workforce challenges we solve</h2>
      <ul className="mt-4 space-y-2">
        {industry.challenges.map((challenge) => (
          <li key={challenge} className="rounded-lg border border-navy-100 p-4 text-sm text-navy-700">
            {challenge}
          </li>
        ))}
      </ul>

      <h2 className="mt-10 text-xl font-semibold text-navy-900">Roles we recruit</h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {industry.roles.map((role) => (
          <li key={role} className="rounded-full border border-navy-100 px-4 py-2 text-sm text-navy-700">
            {role}
          </li>
        ))}
      </ul>

      {relatedServices.length > 0 && (
        <>
          <h2 className="mt-10 text-xl font-semibold text-navy-900">Services available</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedServices.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
        </>
      )}

      <h2 className="mt-10 text-xl font-semibold text-navy-900">Frequently asked questions</h2>
      <div className="mt-4">
        <FAQAccordion items={industry.faqs} />
      </div>

      <div className="mt-12">
        <CTASection
          heading={`Ready to hire in ${industry.name}?`}
          description="Talk to a talent expert about your workforce needs."
          ctaLabel="Hire Talent"
          ctaHref="/hire-talent"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test -- app/industries/[slug]/page.test.tsx`
Expected: PASS (3 tests).

- [ ] **Step 7: Run full build, then commit**

Run: `npm run build`
Expected: build succeeds; 8 static `/industries/[slug]` routes generated.

```bash
git add app/industries
git commit -m "feat: add industries overview and dynamic detail pages"
```

---

### Task 24: About Page

**Files:**
- Create: `app/about/page.tsx`
- Test: `app/about/page.test.tsx`

**Interfaces:**
- Consumes: `values`, `team` (Task 5), `CTASection` (Task 10), `EmptyState` (Task 12), `buildMetadata` (Task 18).
- Renders a neutral "coming soon" state for leadership instead of fabricated bios, since `team` ships empty (Task 5 decision).

- [ ] **Step 1: Write failing test**

Create `app/about/page.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import AboutPage from "./page";
import { values } from "@/content/values";

describe("AboutPage", () => {
  it("renders the headline, mission copy, all 6 values, and a non-fabricated leadership placeholder", () => {
    render(<AboutPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Talent Is Personal." })).toBeInTheDocument();
    for (const value of values) {
      expect(screen.getByRole("heading", { name: value.title })).toBeInTheDocument();
    }
    expect(screen.getByRole("heading", { name: "Leadership profiles coming soon." })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- app/about/page.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement the About page**

Create `app/about/page.tsx`:
```tsx
import type { Metadata } from "next";
import { values } from "@/content/values";
import { team } from "@/content/team";
import { CTASection } from "@/components/marketing/CTASection";
import { EmptyState } from "@/components/states/EmptyState";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "About Us",
  description:
    "TheCareerQuotient exists to make hiring and career development more human, more intelligent, and more effective.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div>
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-display-md font-bold text-navy-900">Talent Is Personal.</h1>
        <p className="mt-6 text-lg text-navy-700">
          TheCareerQuotient exists to make hiring and career development more human, more intelligent, and more
          effective. We built this company because too much of staffing treats people like line items — a resume
          matched to a keyword, a requisition closed and forgotten. We think hiring works better when it starts from
          the assumption that both sides of the table are making one of the more consequential decisions of their
          year.
        </p>
        <p className="mt-4 text-lg text-navy-700">
          That means recruiters who ask why a role exists before they ask what it requires. It means candidates who
          get real feedback, not silence. And it means we stay in the relationship after the placement is made,
          because that&apos;s when you actually find out if it worked.
        </p>
      </div>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-display-md font-bold text-navy-900">What We Stand For</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => (
              <div key={value.title} className="rounded-xl border border-navy-100 p-6">
                <h3 className="font-semibold text-navy-900">{value.title}</h3>
                <p className="mt-2 text-sm text-navy-700">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-display-md font-bold text-navy-900">Leadership</h2>
        {team.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              heading="Leadership profiles coming soon."
              description="We're introducing our leadership team here shortly."
            />
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {team.map((member) => (
              <div key={member.name} className="rounded-xl border border-navy-100 p-6">
                <h3 className="font-semibold text-navy-900">{member.name}</h3>
                <p className="text-sm text-navy-700">{member.role}</p>
                <p className="mt-2 text-sm text-navy-700">{member.bio}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      <CTASection
        heading="Want to work with us?"
        description="Whether you're hiring or looking for your next role, we'd like to hear from you."
        ctaLabel="Contact Us"
        ctaHref="/contact"
      />
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- app/about/page.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/about
git commit -m "feat: add About page"
```

---

### Task 25: Contact, Hire-Talent, and Find-Jobs Pages

**Files:**
- Create: `app/contact/page.tsx`, `app/hire-talent/page.tsx`, `app/find-jobs/page.tsx`
- Test: matching `.test.tsx` for each

**Interfaces:**
- Consumes: `ContactForm` (Task 15), `EmployerForm` (Task 16), `CandidateForm` (Task 17), `buildMetadata` (Task 18).

- [ ] **Step 1: Write failing tests**

Create `app/contact/page.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ContactPage from "./page";

describe("ContactPage", () => {
  it("renders the headline and the contact form", () => {
    render(<ContactPage />);
    expect(screen.getByRole("heading", { level: 1, name: "Let's Talk." })).toBeInTheDocument();
    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send Message" })).toBeInTheDocument();
  });
});
```

Create `app/hire-talent/page.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import HireTalentPage from "./page";

describe("HireTalentPage", () => {
  it("renders the headline and the employer lead form", () => {
    render(<HireTalentPage />);
    expect(screen.getByRole("heading", { level: 1, name: /next great hire/i })).toBeInTheDocument();
    expect(screen.getByLabelText("Company")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Talk to a Talent Expert" })).toBeInTheDocument();
  });
});
```

Create `app/find-jobs/page.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import FindJobsPage from "./page";

describe("FindJobsPage", () => {
  it("renders the headline, career resources link, and the candidate resume form", () => {
    render(<FindJobsPage />);
    expect(screen.getByRole("heading", { level: 1, name: /next opportunity starts here/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "career resources" })).toHaveAttribute("href", "/insights");
    expect(screen.getByLabelText(/Resume/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit Your Resume" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run all three test files to verify they fail**

Run: `npm test -- app/contact/page.test.tsx app/hire-talent/page.test.tsx app/find-jobs/page.test.tsx`
Expected: FAIL — none of the three pages exist yet.

- [ ] **Step 3: Implement the three pages**

Create `app/contact/page.tsx`:
```tsx
import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  description: "Talk to a talent expert about hiring or your next career move.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-display-md font-bold text-navy-900">Let&apos;s Talk.</h1>
      <p className="mt-4 text-lg text-navy-700">
        Whether you&apos;re building a team or looking for your next role, tell us a bit about what you need.
      </p>
      <div className="mt-10">
        <ContactForm />
      </div>
    </div>
  );
}
```

Create `app/hire-talent/page.tsx`:
```tsx
import type { Metadata } from "next";
import { EmployerForm } from "@/components/forms/EmployerForm";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Hire Talent",
  description: "Tell us what you need. We'll help you find the people who can move your business forward.",
  path: "/hire-talent",
});

export default function HireTalentPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-display-md font-bold text-navy-900">Your next great hire is closer than you think.</h1>
      <p className="mt-4 text-lg text-navy-700">Tell us about your hiring need and a talent expert will follow up.</p>
      <div className="mt-10">
        <EmployerForm />
      </div>
    </div>
  );
}
```

Create `app/find-jobs/page.tsx`:
```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { CandidateForm } from "@/components/forms/CandidateForm";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Find Jobs",
  description: "Submit your resume and explore career resources from TheCareerQuotient.",
  path: "/find-jobs",
});

export default function FindJobsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-display-md font-bold text-navy-900">Your next opportunity starts here.</h1>
      <p className="mt-4 text-lg text-navy-700">
        Submit your resume and a recruiter will reach out if there&apos;s a fit. In the meantime, explore our{" "}
        <Link href="/insights" className="font-semibold text-accent">
          career resources
        </Link>
        .
      </p>
      <div className="mt-10">
        <CandidateForm />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run all three test files to verify they pass**

Run: `npm test -- app/contact/page.test.tsx app/hire-talent/page.test.tsx app/find-jobs/page.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add app/contact app/hire-talent app/find-jobs
git commit -m "feat: add Contact, Hire-Talent, and Find-Jobs pages"
```

---

### Task 26: Legal Pages (6)

**Files:**
- Create: `components/marketing/LegalPageLayout.tsx`
- Test: `components/marketing/LegalPageLayout.test.tsx`
- Create: `app/privacy/page.tsx`, `app/terms/page.tsx`, `app/cookie-policy/page.tsx`, `app/accessibility/page.tsx`, `app/candidate-privacy/page.tsx`, `app/employer-terms/page.tsx`
- Test: `app/legal-pages.test.tsx` (covers all 6)

**Interfaces:**
- Produces: `<LegalPageLayout title lastUpdated>{children}</LegalPageLayout>` — renders a visible "pending counsel review" notice on every legal page, per Global Constraints (no invented legal claims). Consumed by the 6 legal route pages.

- [ ] **Step 1: Write failing test for LegalPageLayout**

Create `components/marketing/LegalPageLayout.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { LegalPageLayout } from "./LegalPageLayout";

describe("LegalPageLayout", () => {
  it("renders the title, last-updated date, counsel-review notice, and children", () => {
    render(
      <LegalPageLayout title="Privacy Policy" lastUpdated="Pending counsel review">
        <p>Body content</p>
      </LegalPageLayout>
    );
    expect(screen.getByRole("heading", { level: 1, name: "Privacy Policy" })).toBeInTheDocument();
    expect(screen.getByText(/Pending counsel review/)).toBeInTheDocument();
    expect(screen.getByRole("note")).toHaveTextContent(/not yet been reviewed by qualified legal counsel/);
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- components/marketing/LegalPageLayout.test.tsx`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement LegalPageLayout**

Create `components/marketing/LegalPageLayout.tsx`:
```tsx
import type { ReactNode } from "react";

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

export function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-display-md font-bold text-navy-900">{title}</h1>
      <p className="mt-2 text-sm text-navy-700">Last updated: {lastUpdated}</p>
      <div role="note" className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        This page is a structural placeholder and has not yet been reviewed by qualified legal counsel. Do not rely
        on it as legal advice.
      </div>
      <div className="mt-8 space-y-6 text-navy-800">{children}</div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- components/marketing/LegalPageLayout.test.tsx`
Expected: PASS.

- [ ] **Step 5: Write failing combined test for the 6 legal pages**

Create `app/legal-pages.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PrivacyPage from "./privacy/page";
import TermsPage from "./terms/page";
import CookiePolicyPage from "./cookie-policy/page";
import AccessibilityPage from "./accessibility/page";
import CandidatePrivacyPage from "./candidate-privacy/page";
import EmployerTermsPage from "./employer-terms/page";

const pages: [string, () => JSX.Element][] = [
  ["Privacy Policy", PrivacyPage],
  ["Terms of Service", TermsPage],
  ["Cookie Policy", CookiePolicyPage],
  ["Accessibility Statement", AccessibilityPage],
  ["Candidate Privacy Notice", CandidatePrivacyPage],
  ["Employer Terms", EmployerTermsPage],
];

describe("legal pages", () => {
  it.each(pages)("%s renders its title and the counsel-review notice", (title, Page) => {
    render(<Page />);
    expect(screen.getByRole("heading", { level: 1, name: title })).toBeInTheDocument();
    expect(screen.getByRole("note")).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npm test -- app/legal-pages.test.tsx`
Expected: FAIL — none of the 6 pages exist yet.

- [ ] **Step 7: Implement the 6 legal pages**

Create `app/privacy/page.tsx`:
```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageLayout } from "@/components/marketing/LegalPageLayout";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How TheCareerQuotient collects, uses, and protects personal information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="Pending counsel review">
      <section>
        <h2 className="text-lg font-semibold text-navy-900">Information We Collect</h2>
        <p className="mt-2 text-sm">
          This section will describe the categories of personal information collected through this site, including
          information submitted through forms and any information collected automatically.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-navy-900">How We Use Information</h2>
        <p className="mt-2 text-sm">This section will describe the purposes for which collected information is used.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-navy-900">Your Rights</h2>
        <p className="mt-2 text-sm">
          This section will describe the rights available to individuals regarding their personal information,
          consistent with applicable law.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-navy-900">Contact Us</h2>
        <p className="mt-2 text-sm">
          Questions about this policy can be directed to us through our{" "}
          <Link href="/contact" className="underline">
            contact page
          </Link>
          .
        </p>
      </section>
    </LegalPageLayout>
  );
}
```

Create `app/terms/page.tsx`:
```tsx
import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/marketing/LegalPageLayout";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description: "The terms governing use of the TheCareerQuotient website.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <LegalPageLayout title="Terms of Service" lastUpdated="Pending counsel review">
      <section>
        <h2 className="text-lg font-semibold text-navy-900">Acceptance of Terms</h2>
        <p className="mt-2 text-sm">This section will describe what using this site means you agree to.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-navy-900">Use of the Site</h2>
        <p className="mt-2 text-sm">This section will describe permitted and prohibited uses of this site.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-navy-900">Limitation of Liability</h2>
        <p className="mt-2 text-sm">This section will describe the limits of TheCareerQuotient's liability.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-navy-900">Changes to These Terms</h2>
        <p className="mt-2 text-sm">This section will describe how and when these terms may be updated.</p>
      </section>
    </LegalPageLayout>
  );
}
```

Create `app/cookie-policy/page.tsx`:
```tsx
import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/marketing/LegalPageLayout";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Cookie Policy",
  description: "How TheCareerQuotient uses cookies on this site.",
  path: "/cookie-policy",
});

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout title="Cookie Policy" lastUpdated="Pending counsel review">
      <section>
        <h2 className="text-lg font-semibold text-navy-900">What Cookies Are</h2>
        <p className="mt-2 text-sm">This section will explain what cookies are in plain language.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-navy-900">How We Use Cookies</h2>
        <p className="mt-2 text-sm">This section will describe the categories of cookies used on this site.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-navy-900">Managing Your Preferences</h2>
        <p className="mt-2 text-sm">This section will describe how to manage or withdraw cookie consent.</p>
      </section>
    </LegalPageLayout>
  );
}
```

Create `app/accessibility/page.tsx`:
```tsx
import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/marketing/LegalPageLayout";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Accessibility Statement",
  description: "TheCareerQuotient's commitment to a WCAG 2.2 AA accessible website.",
  path: "/accessibility",
});

export default function AccessibilityPage() {
  return (
    <LegalPageLayout title="Accessibility Statement" lastUpdated="Pending counsel review">
      <section>
        <h2 className="text-lg font-semibold text-navy-900">Our Commitment</h2>
        <p className="mt-2 text-sm">
          TheCareerQuotient aims to make this site usable for people of all abilities, targeting WCAG 2.2 Level AA.
        </p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-navy-900">Standards We Reference</h2>
        <p className="mt-2 text-sm">This section will describe the accessibility standards this site is built against.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-navy-900">Feedback</h2>
        <p className="mt-2 text-sm">
          If you encounter an accessibility barrier on this site, please let us know through our contact page.
        </p>
      </section>
    </LegalPageLayout>
  );
}
```

Create `app/candidate-privacy/page.tsx`:
```tsx
import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/marketing/LegalPageLayout";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Candidate Privacy Notice",
  description: "How TheCareerQuotient handles resumes and candidate information.",
  path: "/candidate-privacy",
});

export default function CandidatePrivacyPage() {
  return (
    <LegalPageLayout title="Candidate Privacy Notice" lastUpdated="Pending counsel review">
      <section>
        <h2 className="text-lg font-semibold text-navy-900">Information Collected From Candidates</h2>
        <p className="mt-2 text-sm">This section will describe the resume and profile information collected from candidates.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-navy-900">How Resume Data Is Used</h2>
        <p className="mt-2 text-sm">This section will describe how submitted resumes are used and who can access them.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-navy-900">Retention and Deletion</h2>
        <p className="mt-2 text-sm">This section will describe how long candidate data is retained and how to request deletion.</p>
      </section>
    </LegalPageLayout>
  );
}
```

Create `app/employer-terms/page.tsx`:
```tsx
import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/marketing/LegalPageLayout";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Employer Terms",
  description: "The terms governing TheCareerQuotient's engagements with employer clients.",
  path: "/employer-terms",
});

export default function EmployerTermsPage() {
  return (
    <LegalPageLayout title="Employer Terms" lastUpdated="Pending counsel review">
      <section>
        <h2 className="text-lg font-semibold text-navy-900">Scope of Services</h2>
        <p className="mt-2 text-sm">This section will describe the staffing services covered by these terms.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-navy-900">Payment Terms</h2>
        <p className="mt-2 text-sm">This section will describe fees, invoicing, and payment timelines.</p>
      </section>
      <section>
        <h2 className="text-lg font-semibold text-navy-900">Confidentiality</h2>
        <p className="mt-2 text-sm">This section will describe how confidential client and candidate information is handled.</p>
      </section>
    </LegalPageLayout>
  );
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npm test -- app/legal-pages.test.tsx`
Expected: PASS (6 tests).

- [ ] **Step 9: Run full build, then commit**

Run: `npm run build`
Expected: build succeeds.

```bash
git add components/marketing/LegalPageLayout.tsx components/marketing/LegalPageLayout.test.tsx app/privacy app/terms app/cookie-policy app/accessibility app/candidate-privacy app/employer-terms app/legal-pages.test.tsx
git commit -m "feat: add 6 legal pages with shared layout and counsel-review notice"
```

---

### Task 27: SEO Infra and Fallback Routes — sitemap, robots, 404

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`, `app/not-found.tsx`
- Test: `app/sitemap.test.ts`, `app/robots.test.ts`, `app/not-found.test.tsx`

**Interfaces:**
- Consumes: `services` (Task 3), `industries` (Task 4), `getAllArticles` (Task 20), `SITE_URL` (Task 18), `Button` (Task 7).

- [ ] **Step 1: Write failing test for the sitemap**

Create `app/sitemap.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import sitemap from "./sitemap";
import { services } from "@/content/services/data";
import { industries } from "@/content/industries/data";
import { getAllArticles } from "@/lib/content/insights";
import { SITE_URL } from "@/lib/seo/metadata";

describe("sitemap", () => {
  it("includes the homepage and every service, industry, and article URL", () => {
    const entries = sitemap();
    const urls = entries.map((entry) => entry.url);

    expect(urls).toContain(`${SITE_URL}/`);
    for (const service of services) {
      expect(urls).toContain(`${SITE_URL}/services/${service.slug}`);
    }
    for (const industry of industries) {
      expect(urls).toContain(`${SITE_URL}/industries/${industry.slug}`);
    }
    for (const article of getAllArticles()) {
      expect(urls).toContain(`${SITE_URL}/insights/${article.slug}`);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails, then implement**

Run: `npm test -- app/sitemap.test.ts`
Expected: FAIL — module does not exist.

Create `app/sitemap.ts`:
```ts
import type { MetadataRoute } from "next";
import { services } from "@/content/services/data";
import { industries } from "@/content/industries/data";
import { getAllArticles } from "@/lib/content/insights";
import { SITE_URL } from "@/lib/seo/metadata";

const STATIC_PATHS = [
  "/",
  "/services",
  "/industries",
  "/about",
  "/insights",
  "/hire-talent",
  "/find-jobs",
  "/contact",
  "/privacy",
  "/terms",
  "/cookie-policy",
  "/accessibility",
  "/candidate-privacy",
  "/employer-terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = STATIC_PATHS.map((path) => ({ url: `${SITE_URL}${path}`, lastModified: new Date() }));
  const serviceEntries = services.map((s) => ({ url: `${SITE_URL}/services/${s.slug}`, lastModified: new Date() }));
  const industryEntries = industries.map((i) => ({
    url: `${SITE_URL}/industries/${i.slug}`,
    lastModified: new Date(),
  }));
  const articleEntries = getAllArticles().map((a) => ({
    url: `${SITE_URL}/insights/${a.slug}`,
    lastModified: new Date(a.date),
  }));

  return [...staticEntries, ...serviceEntries, ...industryEntries, ...articleEntries];
}
```

Run: `npm test -- app/sitemap.test.ts`
Expected: PASS.

- [ ] **Step 3: Write failing test for robots, then implement**

Create `app/robots.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import robots from "./robots";
import { SITE_URL } from "@/lib/seo/metadata";

describe("robots", () => {
  it("allows all crawlers and points to the sitemap", () => {
    const result = robots();
    expect(result.rules).toEqual({ userAgent: "*", allow: "/" });
    expect(result.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });
});
```

Run: `npm test -- app/robots.test.ts`
Expected: FAIL — module does not exist.

Create `app/robots.ts`:
```ts
import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/metadata";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

Run: `npm test -- app/robots.test.ts`
Expected: PASS.

- [ ] **Step 4: Write failing test for the 404 page, then implement**

Create `app/not-found.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NotFound from "./not-found";

describe("NotFound", () => {
  it("renders a 404 heading and a link back home", () => {
    render(<NotFound />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/couldn't find that page/i);
    expect(screen.getByRole("link", { name: "Go Home" })).toHaveAttribute("href", "/");
  });
});
```

Run: `npm test -- app/not-found.test.tsx`
Expected: FAIL — module does not exist.

Create `app/not-found.tsx`:
```tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wide text-accent">404</p>
      <h1 className="mt-2 text-display-md font-bold text-navy-900">We couldn&apos;t find that page.</h1>
      <p className="mt-4 text-navy-700">
        The page you&apos;re looking for may have moved or no longer exists. Try one of the links below.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Button asChild>
          <Link href="/">Go Home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/services">Browse Services</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Run all three test files to verify they pass**

Run: `npm test -- app/sitemap.test.ts app/robots.test.ts app/not-found.test.tsx`
Expected: PASS.

- [ ] **Step 6: Run full build, then commit**

Run: `npm run build`
Expected: build succeeds; `/sitemap.xml` and `/robots.txt` are generated.

```bash
git add app/sitemap.ts app/robots.ts app/not-found.tsx app/sitemap.test.ts app/robots.test.ts app/not-found.test.tsx
git commit -m "feat: add sitemap, robots, and 404 page"
```

---

### Task 28: Final Integration & QA

**Files:**
- Test: `app/accessibility-smoke.test.tsx`
- Modify: any file flagged by lint or the `#`-link grep below

**Interfaces:**
- No new interfaces — this task verifies the whole branch integrates and closes out the Review Focus list.

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: every test file from Tasks 1-27 passes.

- [ ] **Step 2: Run lint and fix any reported issues**

Run: `npm run lint`
Expected: no errors. Fix anything reported (unused imports, missing key props, etc.) with minimal, targeted edits — do not refactor unrelated code.

- [ ] **Step 3: Grep for placeholder `#` links across the app**

Run: `grep -rn 'href="#"' app components || true`
Expected: no matches. If any are found, replace them with the real route they should point to (Global Constraints forbid placeholder links in production).

- [ ] **Step 4: Add an automated accessibility smoke test on two representative pages**

Run:
```bash
npm install -D jest-axe
```

Create `app/accessibility-smoke.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import HomePage from "./page";
import ServiceDetailPage from "./services/[slug]/page";

expect.extend(toHaveNoViolations);

describe("accessibility smoke test", () => {
  it("the homepage has no automatically detectable accessibility violations", async () => {
    const { container } = render(<HomePage />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("a service detail page has no automatically detectable accessibility violations", async () => {
    const jsx = await ServiceDetailPage({ params: Promise.resolve({ slug: "direct-hire" }) });
    const { container } = render(jsx);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

- [ ] **Step 5: Run the new test to verify it passes**

Run: `npm test -- app/accessibility-smoke.test.tsx`
Expected: PASS (2 tests). If violations are reported, fix the underlying markup (e.g. missing label, insufficient contrast) in the flagged component — do not suppress the rule.

- [ ] **Step 6: Run the full production build one more time**

Run: `npm run build`
Expected: build succeeds with all static routes listed: `/`, `/services` (+7 detail), `/industries` (+8 detail), `/about`, `/insights` (+3 detail), `/hire-talent`, `/find-jobs`, `/contact`, 6 legal pages, `/sitemap.xml`, `/robots.txt`, `/404`.

- [ ] **Step 7: Confirm Review Focus coverage**

Verify each item has a passing test (all should already be green from earlier tasks — this is a final confirmation, not new code):
1. Failed form submission → `ContactForm.test.tsx`, `EmployerForm.test.tsx`, `CandidateForm.test.tsx` (Tasks 15-17).
2. Invalid/oversized resume upload → `CandidateForm.test.tsx` (Task 17).
3. Unknown dynamic route → `[slug]/page.test.tsx` for services and industries (Tasks 22-23).
4. Reduced-motion preference → `Counter.test.tsx`, `ScrollReveal.test.tsx` (Task 6).
5. Content data integrity → `content/services/data.test.ts`, `content/industries/data.test.ts` (Tasks 3-4).

- [ ] **Step 8: Final commit**

```bash
git add -A
git commit -m "test: add accessibility smoke test and close out final QA pass"
```

---

## Self-Review Notes

- **Spec coverage:** every numbered section of the design spec (§1-§12) maps to at least one task — content architecture (Tasks 3-5), design system (Task 2), forms (Tasks 13-17), SEO (Tasks 18, 20, 27), accessibility (Tasks 6, 8-9, 28), performance (Task 1 code-splitting via App Router, Task 2 font loading, no additional task needed since Next.js App Router defaults satisfy §9 without extra code), animation (Task 6), non-fabrication rules (Tasks 5, 10-11, 24).
- **Placeholder scan:** no "TBD"/"TODO" left as unresolved plan steps; the only intentional placeholders are the legal pages' counsel-review notice and the empty `team` array, both explicitly justified against the non-fabrication constraint, not left vague.
- **Type consistency:** `Service`, `Industry`, `Article`, `Stat`, `TimelineStep`, `TestimonialData`, `ArticleSummary`, `FAQItem`, `Crumb` are each defined once (Tasks 3, 4, 20, 10, 11) and reused by name in every consuming task without renaming.
- **Review Focus:** all 5 items are covered by tests owned by specific tasks (see Task 28, Step 7).

