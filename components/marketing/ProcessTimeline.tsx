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
    <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <span
        className="pointer-events-none absolute left-0 right-0 top-[2.6rem] hidden h-px bg-gradient-to-r from-accent/60 via-aurora-cyan/30 to-transparent lg:block"
        aria-hidden="true"
      />
      {steps.map((step) => (
        <li
          key={step.number}
          className="group relative rounded-3xl border border-line bg-surface p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent/40 hover:bg-surface-2"
        >
          <p className="font-display text-5xl font-bold text-ink/15 transition-colors duration-300 group-hover:text-accent">
            {step.number}
          </p>
          <h3 className="mt-5 text-lg font-semibold leading-snug text-ink">{step.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
