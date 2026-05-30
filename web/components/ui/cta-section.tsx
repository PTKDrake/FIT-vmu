import { Heading } from "./heading";
import { Text } from "./text";
import { Link } from "./link";
import { twMerge } from "tailwind-merge";

export interface CTASectionProps extends React.HTMLAttributes<HTMLDivElement> {
  header: string;
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

export function CTASection({
  header,
  description,
  primaryAction,
  secondaryAction,
  className,
  ...props
}: CTASectionProps) {
  return (
    <section
      data-slot="cta-section"
      className={twMerge(
        "space-y-8 rounded-3xl bg-primary p-8 text-center text-primary-fg shadow-xs sm:p-12 relative overflow-hidden",
        className,
      )}
      {...props}
    >
      {/* Visual background accents */}
      <div className="absolute top-0 left-0 size-80 bg-white/5 blur-3xl rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 size-80 bg-white/5 blur-3xl rounded-full pointer-events-none translate-x-1/2 translate-y-1/2" />

      <div className="mx-auto max-w-3xl space-y-4 relative z-10">
        <Heading
          level={2}
          className="text-3xl font-extrabold tracking-tight text-primary-fg sm:text-4xl"
        >
          {header}
        </Heading>
        {description && (
          <Text className="text-base text-primary-fg/90 max-w-2xl mx-auto leading-relaxed">
            {description}
          </Text>
        )}
      </div>

      {(primaryAction?.label || secondaryAction?.label) && (
        <div className="flex flex-wrap justify-center gap-4 pt-2 relative z-10">
          {primaryAction?.label && (
            <Link
              href={primaryAction.href || "#"}
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-overlay text-fg hover:bg-secondary hover:scale-[1.02] active:scale-[0.98] px-6 py-2.5 text-sm font-semibold transition duration-200 shadow-sm"
            >
              {primaryAction.label}
            </Link>
          )}

          {secondaryAction?.label && (
            <Link
              href={secondaryAction.href || "#"}
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-primary-fg/30 text-primary-fg hover:bg-primary-fg/10 hover:scale-[1.02] active:scale-[0.98] px-6 py-2.5 text-sm font-semibold transition duration-200"
            >
              {secondaryAction.label}
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
