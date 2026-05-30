import { Card, CardContent } from "./card";
import { Heading } from "./heading";
import { Text } from "./text";
import { Badge } from "./badge";
import { twMerge } from "tailwind-merge";

export interface HighlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  badge?: string;
  title: string;
  description: string;
}

export function HighlightCard({
  badge = "Highlight",
  title,
  description,
  className,
  ...props
}: HighlightCardProps) {
  return (
    <Card
      data-slot="highlight-card"
      className={twMerge(
        "rounded-3xl border-border bg-overlay py-0 shadow-none transition-all duration-300 hover:shadow-md hover:border-primary/20",
        className,
      )}
      {...props}
    >
      <CardContent className="space-y-4 p-6 flex flex-col items-start text-left">
        {badge && (
          <Badge
            intent="outline"
            isCircle={false}
            className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-semibold border-primary/20 bg-primary-subtle/10 text-primary"
          >
            {badge}
          </Badge>
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

export interface HighlightSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  header: string;
  highlights: Array<{
    title: string;
    description: string;
    badge?: string;
  }>;
  columns?: 1 | 2 | 3;
}

export function HighlightSection({
  header,
  highlights,
  columns = 3,
  className,
  ...props
}: HighlightSectionProps) {
  return (
    <section
      data-slot="highlight-section"
      className={twMerge("space-y-6 py-6", className)}
      {...props}
    >
      <Heading
        level={2}
        className="text-center text-2xl font-extrabold tracking-tight text-fg md:text-left sm:text-3xl"
      >
        {header}
      </Heading>
      <div
        className={twMerge(
          "grid gap-6 w-full",
          columns === 1 && "grid-cols-1",
          columns === 2 && "grid-cols-1 md:grid-cols-2",
          columns === 3 && "grid-cols-1 md:grid-cols-3",
        )}
      >
        {highlights.map((highlight, index) => (
          <HighlightCard
            key={index}
            badge={highlight.badge}
            title={highlight.title}
            description={highlight.description}
          />
        ))}
      </div>
    </section>
  );
}
