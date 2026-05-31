import { Badge } from "./badge";
import { Heading } from "./heading";
import { Text } from "./text";
import { Link } from "./link";
import { twMerge } from "tailwind-merge";

export interface HeroBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
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
}

export function HeroBanner({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  className,
  ...props
}: HeroBannerProps) {
  return (
    <section
      data-slot="hero-banner"
      className={twMerge(
        "overflow-hidden rounded-3xl border border-border bg-linear-to-br from-primary-subtle/40 via-bg to-info-subtle/30 p-6 sm:p-10 md:p-12 relative shadow-xs hover:shadow-md transition-shadow duration-300",
        className,
      )}
      {...props}
    >
      <div className="absolute top-0 right-0 size-72 bg-primary/5 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 size-72 bg-info/5 blur-3xl rounded-full pointer-events-none" />

      <div className="relative space-y-5 max-w-4xl">
        {eyebrow && (
          <Badge
            intent="outline"
            isCircle={false}
            className="px-3 py-1 font-semibold uppercase tracking-wider text-[10px] border-primary/20 bg-primary-subtle/20 text-primary"
          >
            {eyebrow}
          </Badge>
        )}

        <div className="space-y-4">
          <Heading
            level={1}
            className="text-3xl font-extrabold tracking-tight text-fg sm:text-4xl lg:text-5xl leading-tight sm:leading-none"
          >
            {title}
          </Heading>

          {description && (
            <Text className="text-base text-muted-fg sm:text-lg max-w-2xl leading-relaxed">
              {description}
            </Text>
          )}
        </div>

        {(primaryAction?.label || secondaryAction?.label) && (
          <div className="flex flex-wrap gap-3 pt-2">
            {primaryAction?.label && (
              <Link
                href={primaryAction.href || "#"}
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-fg hover:bg-primary/95 hover:scale-[1.02] shadow-sm active:scale-[0.98] transition duration-200"
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
      </div>
    </section>
  );
}
