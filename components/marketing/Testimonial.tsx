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
