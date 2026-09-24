import type { ReactNode } from "react";

interface EmptyStateProps {
  heading: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ heading, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-navy-100 p-10 text-center">
      <h3 className="text-lg font-semibold text-navy-900">{heading}</h3>
      <p className="mt-2 text-sm text-navy-700">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
