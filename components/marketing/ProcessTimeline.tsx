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
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {steps.map((step) => (
        <li
          key={step.number}
          className="rounded-2xl border border-navy-100 bg-muted/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-soft"
        >
          <p className="text-sm font-semibold text-accent">{step.number}</p>
          <h3 className="mt-2 font-semibold text-navy-900">{step.title}</h3>
          <p className="mt-1 text-sm text-navy-700">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
