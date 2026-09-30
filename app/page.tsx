import type { Metadata } from "next";
import { Hero } from "@/components/marketing/Hero";
import { StatsSection } from "@/components/marketing/StatsSection";
import { ServiceCard } from "@/components/marketing/ServiceCard";
import { IndustryCard } from "@/components/marketing/IndustryCard";
import { ProcessTimeline } from "@/components/marketing/ProcessTimeline";
import { ArticleCard } from "@/components/marketing/ArticleCard";
import { CTASection } from "@/components/marketing/CTASection";
import { LoopVideo } from "@/components/marketing/LoopVideo";
import { SectionHeader } from "@/components/marketing/SectionHeader";
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

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <ScrollReveal>
          <SectionHeader eyebrow="Our Solutions" title="Workforce Solutions Built Around Your Needs" />
        </ScrollReveal>
        <StaggerGrid className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <StaggerItem
              key={service.slug}
              className={index === 0 ? "h-full sm:col-span-2" : index === services.length - 1 ? "h-full lg:col-span-2" : "h-full"}
            >
              <ServiceCard service={service} featured={index === 0} />
            </StaggerItem>
          ))}
        </StaggerGrid>
      </section>

      <section className="relative overflow-hidden bg-forest py-24 text-sage">
        {/* Motion loop generated in Higgsfield. The blend drops the clip's slightly darker green, so only rings and dots show. */}
        <LoopVideo
          src="/videos/match-loop"
          poster="/videos/match-loop-poster.webp"
          playbackRate={1.6}
          className="pointer-events-none absolute right-0 top-0 hidden h-[30rem] w-[66%] mix-blend-lighten md:block [-webkit-mask-composite:source-in] [mask-composite:intersect] [mask-image:linear-gradient(to_bottom,#000_28%,transparent_60%),linear-gradient(to_right,transparent,#000_32%)]"
        />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <SectionHeader eyebrow="Why Us" title="Recruitment Should Feel Human." tone="dark" />
          </ScrollReveal>
          <StaggerGrid className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_POINTS.map((point) => (
              <StaggerItem key={point.title} className="h-full">
                <div className="h-full border-t-2 border-accent pt-5">
                  <h3 className="text-2xl text-white">{point.title}</h3>
                  <p className="mt-2 text-sage/80">{point.description}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="For Employers" title="How It Works for Employers" />
        <div className="mt-12">
          <ProcessTimeline steps={EMPLOYER_STEPS} />
        </div>

        <SectionHeader eyebrow="For Candidates" title="How It Works for Candidates" className="mt-28" />
        <div className="mt-12">
          <ProcessTimeline steps={CANDIDATE_STEPS} />
        </div>
      </section>

      <section className="border-y border-line bg-surface py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Industries"
            title="Industries We Serve"
            action={{ label: "View all industries", href: "/industries" }}
          />
          <StaggerGrid className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
        tone="orange"
      />

      <CTASection
        heading="Your next great hire is closer than you think."
        description="Tell us what you need. We'll help you find the people who can move your business forward."
        ctaLabel="Hire Talent"
        ctaHref="/hire-talent"
      />

      {latestArticles.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Resources"
            title="Career Insights"
            action={{ label: "View all insights", href: "/insights" }}
          />
          <StaggerGrid className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
        tone="paper"
      />
    </>
  );
}
