import Link from "next/link";

export interface Crumb {
  href: string;
  label: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-navy-700">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center gap-2">
            {index === items.length - 1 ? (
              <span aria-current="page" className="font-semibold text-navy-900">
                {item.label}
              </span>
            ) : (
              <>
                <Link href={item.href} className="focus-ring rounded hover:underline">
                  {item.label}
                </Link>
                <span aria-hidden="true">/</span>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
