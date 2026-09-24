import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  heading?: string;
  description: string;
  onRetry?: () => void;
}

export function ErrorState({ heading = "Something went wrong", description, onRetry }: ErrorStateProps) {
  return (
    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
      <h3 className="text-lg font-semibold text-red-900">{heading}</h3>
      <p className="mt-2 text-sm text-red-800">{description}</p>
      {onRetry ? (
        <Button variant="outline" className="mt-4" onClick={onRetry}>
          Try Again
        </Button>
      ) : null}
    </div>
  );
}
