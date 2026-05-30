import { Heading } from "./heading";
import { Text } from "./text";
import { Link } from "./link";
import { twMerge } from "tailwind-merge";
import { StatsGrid, StatItem } from "./stats";

export interface HeroSplitProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  imageUrl?: string;
  imageAlt?: string;
  fallbackIcon?: React.ReactNode;
  stats?: Array<{
    value: string | number;
    label: string;
    description?: string;
  }>;
}

export function HeroSplit({
  title,
  description,
  primaryAction,
  secondaryAction,
  imageUrl,
  imageAlt = "Hero Image",
  fallbackIcon,
  stats,
  className,
  ...props
}: HeroSplitProps) {
  return (
    <section
      data-slot="hero-split"
      className={twMerge("py-12 md:py-20 relative overflow-hidden", className)}
      {...props}
    >
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="space-y-6 relative z-10">
          <Heading
            level={1}
            className="text-4xl font-extrabold tracking-tight text-fg sm:text-5xl lg:text-5xl/snug"
          >
            {title}
          </Heading>

          {description && (
            <Text className="max-w-lg text-base text-muted-fg sm:text-lg leading-relaxed">
              {description}
            </Text>
          )}

          {(primaryAction?.label || secondaryAction?.label) && (
            <div className="flex flex-wrap gap-3 pt-2">
              {primaryAction?.label && (
                <Link
                  href={primaryAction.href || "#"}
                  className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-fg hover:bg-primary/95 hover:scale-[1.02] active:scale-[0.98] transition duration-200"
                >
                  {primaryAction.label}
                </Link>
              )}

              {secondaryAction?.label && (
                <Link
                  href={secondaryAction.href || "#"}
                  className="inline-flex min-h-11 items-center justify-center rounded-full border border-border bg-bg px-6 py-2.5 text-sm font-semibold text-fg hover:bg-secondary hover:scale-[1.02] active:scale-[0.98] transition duration-200"
                >
                  {secondaryAction.label}
                </Link>
              )}
            </div>
          )}

          {stats && stats.length > 0 && (
            <div className="border-t border-border/80 pt-8 mt-8">
              <StatsGrid columns={stats.length === 2 ? 2 : 3} gap={4}>
                {stats.map((stat, index) => (
                  <div key={index} className="space-y-1">
                    <div className="text-2xl font-extrabold text-primary sm:text-3xl">
                      {stat.value}
                    </div>
                    <div className="text-xs font-semibold text-muted-fg uppercase tracking-wider">
                      {stat.label}
                    </div>
                    {stat.description && (
                      <div className="text-[10px] text-muted-fg/80">
                        {stat.description}
                      </div>
                    )}
                  </div>
                ))}
              </StatsGrid>
            </div>
          )}
        </div>

        <div className="relative flex w-full justify-center">
          <div className="absolute -top-12 -right-12 size-72 bg-primary/10 blur-3xl rounded-full pointer-events-none" />
          {imageUrl ? (
            <div className="group overflow-hidden rounded-3xl border border-border shadow-md">
              <img
                src={imageUrl}
                alt={imageAlt}
                className="aspect-video w-full object-cover transition duration-500 group-hover:scale-105 md:aspect-[4/3]"
              />
            </div>
          ) : (
            <div className="relative flex h-80 w-full items-center justify-center overflow-hidden rounded-3xl border border-primary/15 bg-linear-to-br from-primary/10 to-info/5 shadow-xs sm:h-96">
              <div className="space-y-4 text-center p-6">
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary-subtle text-primary border border-primary/10 shadow-xs">
                  {fallbackIcon || (
                    <svg
                      className="size-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.33l-7.5-5-7.5 5V21m16.5 0H3.75"
                      />
                    </svg>
                  )}
                </div>
                <Text className="text-sm font-medium text-muted-fg max-w-xs mx-auto">
                  Hình ảnh minh họa
                </Text>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
