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
    <ol className="grid gap-8 md:grid-cols-5">
      {steps.map((step) => (
        <li key={step.number} className="border-t-2 border-accent pt-4">
          <p className="text-sm font-semibold text-accent">{step.number}</p>
          <h3 className="mt-2 font-semibold text-navy-900">{step.title}</h3>
          <p className="mt-1 text-sm text-navy-700">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
