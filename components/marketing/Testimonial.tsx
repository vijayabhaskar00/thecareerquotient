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
    <figure className="rounded-xl border border-line bg-surface p-8">
      <blockquote className="text-lg text-ink">&ldquo;{testimonial.quote}&rdquo;</blockquote>
      <figcaption className="mt-4 text-sm text-ink-soft">
        {testimonial.author}, {testimonial.role}
      </figcaption>
    </figure>
  );
}
