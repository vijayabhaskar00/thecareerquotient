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
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";
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
  {
    title: "Intelligent Matching",
    description: "Technology and structured assessment identify stronger matches.",
  },
  { title: "Speed", description: "We reduce unnecessary delays in the hiring process." },
  {
    title: "Precision",
    description: "Matching skills, experience, culture, career goals, and business requirements.",
  },
  {
    title: "Transparency",
    description: "Clients and candidates stay informed throughout the process.",
  },
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
      <Hero />

      <StatsSection stats={[]} />

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <ScrollReveal>
          <h2 className="text-display-md font-bold text-navy-900">Workforce Solutions Built Around Your Needs</h2>
        </ScrollReveal>
        <StaggerGrid className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <StaggerItem
              key={service.slug}
              className={index === 0 ? "h-full sm:col-span-2 sm:row-span-2" : "h-full"}
            >
              <ServiceCard service={service} featured={index === 0} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <h2 className="max-w-2xl text-display-md font-bold text-navy-900">Recruitment Should Feel Human.</h2>
          </ScrollReveal>
          <StaggerGrid className="mt-10 grid gap-x-12 gap-y-8 sm:grid-cols-2">
            {WHY_POINTS.map((point, index) => (
              <StaggerItem key={point.title}>
                <div className="flex gap-5 border-t border-navy-100 pt-5">
                  <span className="font-mono text-sm text-accent">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="font-semibold text-navy-900">{point.title}</h3>
                    <p className="mt-1.5 text-sm text-navy-700">{point.description}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
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
              View all industries -&gt;
            </Link>
          </div>
          <StaggerGrid className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredIndustries.map((industry) => (
              <StaggerItem key={industry.slug} className="h-full">
                <IndustryCard industry={industry} />
              </StaggerItem>
            ))}
          </StaggerGrid>
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
              View all insights -&gt;
            </Link>
          </div>
          <StaggerGrid className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestArticles.map((article) => (
              <StaggerItem key={article.slug} className="h-full">
                <ArticleCard article={article} />
              </StaggerItem>
            ))}
          </StaggerGrid>
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
