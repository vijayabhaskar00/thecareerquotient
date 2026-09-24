# TheCareerQuotient — Marketing Site Design Spec

Date: 2026-09-24
Status: Approved for implementation planning

## 1. Scope

Build TheCareerQuotient as a **static marketing site** for a staffing/talent
platform brand. This spec covers Phase 1 of the full platform vision
described in the original brief (`CLAUDE.md` project instructions) — the
brief's later phases (job board, candidate/employer accounts, admin CMS,
analytics backend) are explicitly **out of scope** here.

In scope:
- Marketing pages: home, services (+ 7 service detail pages), industries
  (+ 8 industry detail pages), about, insights (articles), contact,
  hire-talent, find-jobs, legal pages (6).
- Design system (tokens, typography, components).
- Contact/lead forms with stubbed submission handling.
- SEO, accessibility, performance, and animation baseline.

Out of scope (deferred to later phases, not built now):
- Job search/listing/apply flow — no job board exists yet, so the
  homepage job-search UI from the original brief is **removed**, not
  built as a non-functional stub.
- Candidate and employer accounts/dashboards.
- Admin/CMS backend, database, authentication.
- Real form delivery (email/CRM integration) — forms are stubbed with
  client-side validation and a success/error UI; the submit handler is
  isolated so real delivery (a transactional email service or a form
  backend) can be wired in later without touching page/component code.
- Production deployment/domain configuration — build and run locally
  until the user is ready to deploy; deployment target (Vercel is the
  natural fit for Next.js) is not actioned in this phase.

## 2. Tech Stack

- Next.js (latest stable, App Router), TypeScript, React.
- Tailwind CSS for styling.
- shadcn/ui primitives (button, accordion, dialog, form inputs, etc.)
  for interactive/accessible components; custom-built components for
  marketing-specific pieces (hero, timeline, service/industry cards).
- Framer Motion for scroll-reveal, entrance animation, and counters,
  gated behind `prefers-reduced-motion`.
- MDX for long-form Insights articles; typed TS data modules for
  structured content (services, industries, team, FAQs).
- No database, no auth, no CMS backend in this phase. Content lives in
  versioned data files so a later phase can swap in a real CMS by
  replacing the data-fetch layer only.

## 3. Content Architecture

- `content/services/*.ts` — one module per service (7), typed via a
  shared `Service` interface (slug, name, summary, features, CTA copy).
- `content/industries/*.ts` — one module per industry (8), typed via
  `Industry` interface (slug, name, intro, challenges, roles, FAQ).
- `content/insights/*.mdx` — article files with frontmatter (title,
  description, author, date, category, featuredImage, readingTime).
- `content/team.ts`, `content/values.ts` — small structured data for
  About page.
- All content modules are the single source of truth consumed by page
  templates — no content hardcoded directly inside page JSX beyond
  static UI copy (headlines, microcopy) that isn't meant to be
  data-driven.

## 4. Design System

- **Color:** deep navy/near-black foundation (e.g. `#0B1220` range) +
  warm off-white surface, one electric accent color (cobalt or amber —
  final hex chosen during implementation via frontend-design skill),
  used sparingly (CTAs, underlines, small marks, focus rings). No
  gradient blobs, no glassmorphism.
- **Typography:** Plus Jakarta Sans or Manrope (variable font), loaded
  via `next/font` with subsetting. Fluid type scale via `clamp()`.
  Large display headlines, compact supporting text, strong CTA type.
- **Layout:** asymmetric editorial grid, not a centered-card SaaS
  layout — deliberately avoids the generic-template look. Final visual
  direction (imagery treatment, exact palette, spacing rhythm) is
  produced using the frontend-design and ui-ux-pro-max skills during
  implementation, not fixed numerically in this spec.
- **Design tokens** defined as CSS custom properties / Tailwind theme
  extension so colors and type scale are globally editable.
- Component list (from original brief, adapted — no Job* components):
  Navbar, MobileNavbar, MegaMenu, Hero, ServiceCard, IndustryCard,
  StatsSection (with verified-data-only placeholders, never fabricated
  numbers), Testimonial (real testimonials only, omitted if none
  available), ProcessTimeline, CTASection, ContactForm, EmployerForm,
  CandidateForm (resume upload UI, no backend processing yet),
  ArticleCard, FAQAccordion, Footer, Breadcrumbs, CookieBanner, Modal,
  Toast, Pagination (for Insights listing), LoadingSkeleton,
  EmptyState, ErrorState.

## 5. Pages / Routes

```
/                       Homepage
/services               Services overview
/services/[slug]        7 service detail pages (contingent-staffing,
                        contract-to-hire, direct-hire, executive-search,
                        employer-of-record, statement-of-work,
                        high-volume-hiring)
/industries             Industries overview
/industries/[slug]      8 industry detail pages (technology, engineering,
                        finance-accounting, healthcare, manufacturing,
                        automotive, sales-marketing, professional-services)
/about                  Brand story, mission, values, leadership
/insights               Articles listing (category filter)
/insights/[slug]        Article detail (MDX)
/hire-talent            Employer lead-gen landing page + form
/find-jobs              Candidate landing page: resume submission +
                        career resources (no job listings)
/contact                Contact page (employer/candidate split CTAs)
/privacy, /terms, /cookie-policy, /accessibility,
/candidate-privacy, /employer-terms   Legal pages (placeholder,
                        counsel-reviewed language marked TBD)
/404                    Not found page
```

### Homepage section order (adapted from brief section 43, job-search removed)

1. Announcement bar
2. Navigation
3. Hero (Employer/Candidate split CTA — no job search bar)
4. Trust section (verified stats only, or a neutral trust statement if
   no verified numbers exist yet)
5. Workforce solutions (7 service cards)
6. Why TheCareerQuotient
7. How it works (employer + candidate timelines)
8. Industries
9. Candidate experience (find-jobs / resume CTA)
10. Employer CTA (hire-talent)
11. Career insights (latest articles)
12. Final CTA
13. Footer

## 6. Forms

Three forms: Contact, Hire Talent (employer lead), Find Jobs (resume
submission). All:
- Client-side validation (required fields, email format, file type/size
  for resume upload).
- Touch-friendly inputs (44px min target), accessible labels/errors.
- Submit handler is an isolated function (e.g.
  `lib/forms/submitContactForm.ts`) that currently returns a stubbed
  success/error result after a short delay — swapping in real delivery
  (transactional email service or third-party form backend) later means
  editing that one function, not the form components.
- Success and error UI states both implemented (no silent failure).

## 7. SEO

- Per-page metadata (title, description, canonical) via Next.js
  Metadata API.
- Open Graph + Twitter card metadata per page.
- JSON-LD structured data: Organization, WebSite, BreadcrumbList,
  Article (Insights pages), FAQPage (where FAQ accordions exist). No
  JobPosting schema (no jobs).
- `sitemap.xml` and `robots.txt` generated via Next.js conventions.
- Semantic heading hierarchy enforced per page.

## 8. Accessibility

Target WCAG 2.2 AA: semantic HTML, full keyboard navigation, visible
focus states, accessible form labels/errors, alt text on all images,
color contrast checked against tokens, `prefers-reduced-motion`
respected, ARIA only where semantic HTML is insufficient.

## 9. Performance

Targets: Lighthouse Performance 90+, Accessibility 95+, Best Practices
95+, SEO 95+; LCP < 2.5s, INP < 200ms, CLS < 0.1. Achieved via
`next/image`, font subsetting/`next/font`, code splitting (default in
App Router), lazy-loading below-the-fold sections, no unnecessary
client-side JS on static content.

## 10. Animation

Framer Motion: scroll reveal, entrance transitions, number counters
(trust section, only shown with verified data), hover/elevation on
cards, magnetic CTA on primary buttons. All gated behind
`prefers-reduced-motion: reduce`. No auto-playing parallax that could
cause motion discomfort; kept subtle per brief section 21.

## 11. Explicit Non-Fabrication Rules

Per brief sections 4 and 45: no fabricated statistics, testimonials,
client logos, or awards. Trust section and testimonials render only
when real, verified content is supplied; otherwise a neutral trust
statement is shown instead of empty/fake placeholders. This is a hard
content rule, not a visual placeholder to fill in later with fiction.

## 12. Out-of-Scope Reminder for Future Phases

The original brief's Phase 2+ (candidate/employer accounts, job board,
admin CMS, analytics, AI matching) remain the long-term roadmap but are
not designed or scaffolded in this spec. When that work begins, it gets
its own brainstorming → spec → plan cycle, informed by whatever content
architecture and component patterns this phase establishes.
