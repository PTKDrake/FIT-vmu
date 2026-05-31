import { Badge } from "./badge";
import { Heading } from "./heading";
import { Text } from "./text";
import { twMerge } from "tailwind-merge";

export interface AboutSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  badge?: string;
  header: string;
  description?: string;
  unitName?: string;
  address?: string;
  phone?: string;
  email?: string;
  imageUrl?: string;
  fallbackIcon?: React.ReactNode;
}

export function AboutSection({
  badge = "Về đơn vị",
  header,
  description,
  unitName,
  address,
  phone,
  email,
  imageUrl,
  fallbackIcon,
  className,
  ...props
}: AboutSectionProps) {
  return (
    <section
      data-slot="about-section"
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

      <div className="grid items-center gap-8 rounded-3xl border border-border bg-overlay p-6 sm:p-8 md:grid-cols-2 shadow-xs hover:shadow-md transition-all duration-300">
        <div className="space-y-6">
          {unitName && (
            <Heading
              level={3}
              className="text-xl font-bold tracking-tight text-fg sm:text-2xl leading-snug"
            >
              {unitName}
            </Heading>
          )}

          <div className="space-y-4 text-sm">
            {address && (
              <div className="flex items-start gap-3.5 group/item">
                <div className="mt-0.5 flex size-8 items-center justify-center rounded-lg bg-primary-subtle text-primary border border-primary/10 transition group-hover/item:bg-primary group-hover/item:text-primary-fg shrink-0">
                  <svg
                    className="size-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-muted-fg uppercase tracking-wider block">
                    Địa chỉ
                  </span>
                  <Text className="text-sm font-medium text-fg leading-normal">
                    {address}
                  </Text>
                </div>
              </div>
            )}

            {phone && (
              <div className="flex items-start gap-3.5 group/item">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary-subtle text-primary border border-primary/10 transition group-hover/item:bg-primary group-hover/item:text-primary-fg shrink-0">
                  <svg
                    className="size-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.502-5.183-3.861-6.686-6.686l1.293-.97c.362-.272.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    />
                  </svg>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-muted-fg uppercase tracking-wider block">
                    Điện thoại
                  </span>
                  <Text className="text-sm font-medium text-fg leading-normal">
                    {phone}
                  </Text>
                </div>
              </div>
            )}

            {email && (
              <div className="flex items-start gap-3.5 group/item">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary-subtle text-primary border border-primary/10 transition group-hover/item:bg-primary group-hover/item:text-primary-fg shrink-0">
                  <svg
                    className="size-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    />
                  </svg>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-muted-fg uppercase tracking-wider block">
                    Email
                  </span>
                  <Text className="text-sm font-medium text-fg leading-normal">
                    {email}
                  </Text>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex w-full justify-center">
          {imageUrl ? (
            <div className="overflow-hidden rounded-2xl border border-border shadow-xs w-full max-h-64 aspect-video md:aspect-square">
              <img
                src={imageUrl}
                alt={unitName || header}
                className="h-full w-full object-cover transition duration-300 hover:scale-105"
              />
            </div>
          ) : (
            <div className="flex h-56 w-full items-center justify-center rounded-2xl border border-primary/15 bg-linear-to-br from-primary/10 to-info/5 text-primary">
              {fallbackIcon || (
                <svg
                  className="size-16 opacity-50"
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
          )}
        </div>
      </div>
    </section>
  );
}
