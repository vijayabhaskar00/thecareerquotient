import { Counter } from "@/components/motion/Counter";

export interface Stat {
  value: number;
  suffix?: string;
  label: string;
}

interface StatsSectionProps {
  stats: Stat[];
}

export function StatsSection({ stats }: StatsSectionProps) {
  if (stats.length === 0) {
    return (
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <p className="mx-auto w-fit rounded-full border border-navy-100 bg-muted/60 px-6 py-3 text-center text-navy-700">
          Trusted by growing teams and ambitious professionals.
        </p>
      </section>
    );
  }

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <dl className="mx-auto grid max-w-5xl grid-cols-2 gap-4 rounded-3xl border border-navy-100 bg-muted/40 p-8 text-center md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dd className="text-3xl font-bold text-navy-900">
              <Counter value={stat.value} suffix={stat.suffix} />
            </dd>
            <dt className="mt-1 text-sm text-navy-700">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
