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
      <section className="border-y border-navy-100 bg-white py-10">
        <p className="mx-auto max-w-3xl px-4 text-center text-lg text-navy-700 sm:px-6 lg:px-8">
          Trusted by growing teams and ambitious professionals.
        </p>
      </section>
    );
  }

  return (
    <section className="border-y border-navy-100 bg-white py-10">
      <dl className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-4 text-center sm:px-6 md:grid-cols-4 lg:px-8">
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
