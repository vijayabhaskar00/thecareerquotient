import type { ReactNode } from "react";

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

export function LegalPageLayout({ title, lastUpdated, children }: LegalPageLayoutProps) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-display-md font-bold text-navy-900">{title}</h1>
      <p className="mt-2 text-sm text-navy-700">Last updated: {lastUpdated}</p>
      <div role="note" className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        This page is a structural placeholder and has not yet been reviewed by qualified legal counsel. Do not rely
        on it as legal advice.
      </div>
      <div className="mt-8 space-y-6 text-navy-800">{children}</div>
    </div>
  );
}
