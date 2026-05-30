import { StarIcon } from "@heroicons/react/20/solid";
import { twMerge } from "tailwind-merge";
import { Avatar } from "./avatar";

export interface TestimonialItemProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  role?: string;
  content: string;
  avatarUrl?: string | null;
  rating?: number;
}

export function TestimonialCard({
  name,
  role,
  content,
  avatarUrl,
  rating,
  className,
  ...props
}: TestimonialItemProps) {
  const initials = name?.split(" ").pop()?.substring(0, 2);

  return (
    <div
      data-slot="testimonial-card"
      className={twMerge(
        "flex flex-col justify-between rounded-2xl border border-border bg-overlay p-6 shadow-xs relative transition hover:shadow-md duration-300",
        className,
      )}
      {...props}
    >
      <div className="space-y-4">
        {/* Rating stars if provided */}
        {rating !== undefined && (
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <StarIcon
                key={index}
                className={twMerge(
                  "size-4",
                  index < rating ? "text-amber-500" : "text-border",
                )}
              />
            ))}
          </div>
        )}

        {/* Testimonial Quote */}
        <p className="text-sm/6 italic text-muted-fg leading-relaxed">
          &ldquo;{content}&rdquo;
        </p>
      </div>

      {/* Author Profile */}
      <div className="flex items-center gap-3 pt-5 border-t border-border/50 mt-5">
        <Avatar src={avatarUrl} alt={name} initials={initials} size="lg" />
        <div className="space-y-0.5">
          <h4 className="text-sm font-bold tracking-tight text-fg">{name}</h4>
          {role && <p className="text-xs text-muted-fg font-medium">{role}</p>}
        </div>
      </div>
    </div>
  );
}

export interface TestimonialsGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3;
  gap?: 3 | 4 | 6 | 8;
}

export function TestimonialsGrid({
  columns = 2,
  gap = 6,
  className,
  ...props
}: TestimonialsGridProps) {
  return (
    <div
      data-slot="testimonials-grid"
      className={twMerge(
        "grid w-full",
        columns === 1 && "grid-cols-1",
        columns === 2 && "grid-cols-1 md:grid-cols-2",
        columns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
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
