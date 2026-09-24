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
