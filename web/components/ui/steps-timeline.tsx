import { Badge } from "./badge";
import { Heading } from "./heading";
import { Text } from "./text";
import { twMerge } from "tailwind-merge";

export interface StepItemProps extends React.HTMLAttributes<HTMLDivElement> {
  stepNumber: string | number;
  title: string;
  description: string;
}

export function StepItem({
  stepNumber,
  title,
  description,
  className,
  ...props
}: StepItemProps) {
  const displayNum =
    typeof stepNumber === "number"
      ? String(stepNumber).padStart(2, "0")
      : stepNumber;

  return (
    <div
      data-slot="step-item"
      className={twMerge(
        "group space-y-3 text-center flex flex-col items-center relative z-10",
        className,
      )}
      {...props}
    >
      <div className="inline-flex size-14 items-center justify-center rounded-full border border-primary/5 bg-primary-subtle text-lg font-extrabold text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-fg shadow-xs group-hover:scale-105 active:scale-95 cursor-pointer">
        {displayNum}
      </div>
      <div className="space-y-1 max-w-xs">
        <Heading
          level={3}
          className="text-base font-bold text-fg group-hover:text-primary transition-colors duration-200"
        >
          {title}
        </Heading>
        <Text className="text-xs/relaxed text-muted-fg">{description}</Text>
      </div>
    </div>
  );
}

export interface StepsSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  badge?: string;
  header: string;
  description?: string;
  steps: Array<{
    title: string;
    description: string;
  }>;
}

export function StepsTimeline({
  badge = "Lộ trình",
  header,
  description,
  steps,
  className,
  ...props
}: StepsSectionProps) {
  return (
    <section
      data-slot="steps-timeline"
      className={twMerge("space-y-8 py-8 relative overflow-hidden", className)}
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

      <div className="mx-auto grid max-w-6xl gap-8 pt-4 sm:grid-cols-2 md:grid-cols-4 relative">
        {/* Connection line between steps (tablet & desktop only) */}
        <div className="absolute top-11 left-0 right-0 h-0.5 bg-border/40 hidden md:block z-0 max-w-[80%] mx-auto" />

        {steps.map((step, index) => (
          <StepItem
            key={index}
            stepNumber={index + 1}
            title={step.title}
            description={step.description}
          />
        ))}
      </div>
    </section>
  );
}
