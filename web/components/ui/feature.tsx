import { Card, CardContent } from "./card";
import { Heading } from "./heading";
import { Text } from "./text";
import { Badge } from "./badge";
import { twMerge } from "tailwind-merge";

export interface FeatureCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export function FeatureCard({
  title,
  description,
  icon,
  className,
  ...props
}: FeatureCardProps) {
  return (
    <Card
      data-slot="feature-card"
      className={twMerge(
        "rounded-3xl border-border bg-overlay py-0 shadow-none transition-all duration-300 hover:border-primary/20 hover:shadow-md",
        className,
      )}
      {...props}
    >
      <CardContent className="p-6 flex flex-col gap-4 items-start text-left">
        {icon && (
          <div className="inline-flex size-12 items-center justify-center rounded-2xl border border-primary/5 bg-primary-subtle text-primary shrink-0 transition-colors duration-300 group-hover/card:bg-primary group-hover/card:text-primary-fg shadow-xs">
            {icon}
          </div>
        )}
        <div className="space-y-2">
          <Heading
            level={3}
            className="text-lg font-bold tracking-tight text-fg"
          >
            {title}
          </Heading>
          <Text className="text-sm/relaxed text-muted-fg">{description}</Text>
        </div>
      </CardContent>
    </Card>
  );
}

export interface FeatureSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  badge?: string;
  header: string;
  description?: string;
  features: Array<{
    title: string;
    description: string;
    icon?: React.ReactNode;
  }>;
  columns?: 1 | 2 | 3 | 4;
}

export function FeatureSection({
  badge = "Thế mạnh",
  header,
  description,
  features,
  columns = 3,
  className,
  ...props
}: FeatureSectionProps) {
  return (
    <section
      data-slot="feature-section"
      className={twMerge("space-y-8 py-8 relative", className)}
      {...props}
    >
      <div className="space-y-3 text-center">
        {badge && (
          <Badge
            intent="outline"
            isCircle={false}
            className="px-3 py-1 font-semibold uppercase tracking-wider text-[10px] border-primary/20 bg-primary-subtle/20 text-primary"
          >
            {badge}
          </Badge>
        )}
        <Heading
          level={2}
          className="text-3xl font-extrabold tracking-tight text-fg"
        >
          {header}
        </Heading>
        {description && (
          <Text className="mx-auto max-w-2xl text-base text-muted-fg leading-relaxed">
            {description}
          </Text>
        )}
      </div>

      <div
        className={twMerge(
          "grid gap-6 w-full",
          columns === 1 && "grid-cols-1",
          columns === 2 && "grid-cols-1 md:grid-cols-2",
          columns === 3 && "grid-cols-1 md:grid-cols-3",
          columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        )}
      >
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            title={feature.title}
            description={feature.description}
            icon={feature.icon}
          />
        ))}
      </div>
    </section>
  );
}
