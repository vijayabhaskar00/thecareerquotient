export interface TimelineStep {
  number: string;
  title: string;
  description: string;
}

interface ProcessTimelineProps {
  steps: TimelineStep[];
}

/** A real sequence, so the numbers carry meaning here. */
export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  return (
    <ol className="grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
      {steps.map((step) => (
        <li key={step.number} className="border-t-2 border-ink pt-4">
          <p className="font-display text-4xl font-extrabold text-accent-ink [font-stretch:75%]">{step.number}</p>
          <h3 className="mt-3 text-lg leading-snug text-ink">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
