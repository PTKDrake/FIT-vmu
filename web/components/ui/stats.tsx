import { twMerge } from "tailwind-merge";

export interface StatItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
  };
}

export function StatItem({
  value,
  label,
  description,
  icon,
  trend,
  className,
  ...props
}: StatItemProps) {
  return (
    <div
      data-slot="stat-item"
      className={twMerge(
        "flex flex-col gap-2 rounded-2xl border border-border bg-overlay p-6 shadow-xs relative overflow-hidden transition hover:shadow-md duration-300",
        className,
      )}
      {...props}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-fg">{label}</span>
        {icon && <span className="text-primary size-5 shrink-0">{icon}</span>}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-extrabold tracking-tight text-fg">
          {value}
        </span>
        {trend && (
          <span
            className={twMerge(
              "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-semibold",
              trend.isPositive
                ? "bg-emerald-500/10 text-emerald-600"
                : "bg-danger-subtle/10 text-danger-subtle-fg",
            )}
          >
            {trend.value}
          </span>
        )}
      </div>

      {description && (
        <p className="text-xs text-muted-fg leading-relaxed">{description}</p>
      )}
    </div>
  );
}

export interface StatsGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3 | 4 | 5;
  gap?: 2 | 3 | 4 | 6 | 8;
}

export function StatsGrid({
  columns = 3,
  gap = 4,
  className,
  ...props
}: StatsGridProps) {
  return (
    <div
      data-slot="stats-grid"
      className={twMerge(
        "grid w-full",
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
        columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        columns === 5 &&
          "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
        gap === 2 && "gap-2",
        gap === 3 && "gap-3",
        gap === 4 && "gap-4",
        gap === 6 && "gap-6",
        gap === 8 && "gap-8",
        className,
      )}
      {...props}
    />
  );
}
