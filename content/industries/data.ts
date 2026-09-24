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
