interface LoadingSkeletonProps {
  lines?: number;
  className?: string;
}

export function LoadingSkeleton({ lines = 3, className }: LoadingSkeletonProps) {
  return (
    <div role="status" aria-live="polite" className={className}>
      <span className="sr-only">Loading...</span>
      <div className="space-y-3" aria-hidden="true">
        {Array.from({ length: lines }).map((_, index) => (
          <div key={index} className="h-4 w-full animate-pulse rounded bg-navy-100 motion-reduce:animate-none" />
        ))}
      </div>
    </div>
  );
}
