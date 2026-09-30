import type { ReactNode } from "react";

interface EmptyStateProps {
  heading: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ heading, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-line p-10 text-center">
      <h3 className="text-lg font-semibold text-ink">{heading}</h3>
      <p className="mt-2 text-sm text-ink-soft">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
