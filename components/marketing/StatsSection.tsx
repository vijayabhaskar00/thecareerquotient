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
        <p className="mx-auto w-fit text-center text-sm font-medium text-ink-soft">
          Trusted by growing teams and ambitious professionals.
        </p>
      </section>
    );
  }

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <dl className="mx-auto grid max-w-5xl grid-cols-2 gap-4 rounded-xl border border-line bg-surface-2 p-8 text-center md:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dd className="font-display text-4xl font-bold text-ink">
              <Counter value={stat.value} suffix={stat.suffix} />
            </dd>
            <dt className="mt-1 text-sm text-ink-soft">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
