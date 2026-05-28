import type { Config } from "@puckeditor/core";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import type { VmuFitPageBuilderComponents } from "./page-builder-data";

type PageBuilderConfig = Config<
  VmuFitPageBuilderComponents,
  Record<string, never>,
  "hero" | "content"
>;

export const vmuFitPageBuilderConfig: PageBuilderConfig = {
  categories: {
    hero: {
      title: "Khối mở đầu",
      components: ["HeroBanner"],
    },
    content: {
      title: "Khối nội dung",
      components: ["RichTextSection", "HighlightsGrid"],
    },
  },
  root: {
    render: ({ children }) => (
      <article className="space-y-6 rounded-3xl bg-bg p-4 sm:p-6">
        {children}
      </article>
    ),
  },
  components: {
    HeroBanner: {
      label: "Hero có CTA",
      defaultProps: {
        eyebrow: "Trang VMUFit",
        title: "Tiêu đề trang",
        description: "Mô tả ngắn cho phần mở đầu của trang.",
        primaryActionHref: "/",
        primaryActionLabel: "Hành động chính",
        secondaryActionHref: "/dashboard",
        secondaryActionLabel: "Hành động phụ",
      },
      fields: {
        eyebrow: { type: "text" },
        title: { type: "text" },
        description: { type: "textarea" },
        primaryActionLabel: { type: "text" },
        primaryActionHref: { type: "text" },
        secondaryActionLabel: { type: "text" },
        secondaryActionHref: { type: "text" },
      },
      render: ({
        eyebrow,
        title,
        description,
        primaryActionHref,
        primaryActionLabel,
        secondaryActionHref,
        secondaryActionLabel,
      }) => (
        <section className="overflow-hidden rounded-3xl border border-border bg-linear-to-br from-primary-subtle via-bg to-info-subtle p-6 sm:p-8">
          <div className="space-y-4">
            <Badge intent="outline" isCircle={false}>
              {eyebrow}
            </Badge>
            <div className="max-w-3xl space-y-3">
              <Heading level={1} className="text-3xl/9 sm:text-4xl/11">
                {title}
              </Heading>
              <Text className="text-base/7 text-muted-fg sm:text-base/7">
                {description}
              </Text>
            </div>
            <div className="flex flex-wrap gap-3">
              <ActionLink
                className="bg-primary text-primary-fg hover:bg-primary/90"
                href={primaryActionHref}
                label={primaryActionLabel}
              />
              <ActionLink
                className="border border-border bg-bg text-fg hover:bg-secondary"
                href={secondaryActionHref}
                label={secondaryActionLabel}
              />
            </div>
          </div>
        </section>
      ),
    },
    RichTextSection: {
      label: "Section văn bản",
      defaultProps: {
        title: "Tiêu đề section",
        body: "Đoạn văn thứ nhất.\n\nĐoạn văn thứ hai.",
      },
      fields: {
        title: { type: "text" },
        body: { type: "textarea" },
      },
      render: ({ title, body }) => (
        <section className="space-y-4 rounded-3xl border border-border bg-overlay p-6">
          <Heading level={2}>{title}</Heading>
          <div className="space-y-3">
            {splitParagraphs(body).map((paragraph) => (
              <Text key={paragraph}>{paragraph}</Text>
            ))}
          </div>
        </section>
      ),
    },
    HighlightsGrid: {
      label: "Lưới highlight",
      defaultProps: {
        sectionTitle: "Điểm nhấn nội dung",
        firstTitle: "Điểm nhấn 1",
        firstBody: "Mô tả ngắn cho điểm nhấn thứ nhất.",
        secondTitle: "Điểm nhấn 2",
        secondBody: "Mô tả ngắn cho điểm nhấn thứ hai.",
        thirdTitle: "Điểm nhấn 3",
        thirdBody: "Mô tả ngắn cho điểm nhấn thứ ba.",
      },
      fields: {
        sectionTitle: { type: "text" },
        firstTitle: { type: "text" },
        firstBody: { type: "textarea" },
        secondTitle: { type: "text" },
        secondBody: { type: "textarea" },
        thirdTitle: { type: "text" },
        thirdBody: { type: "textarea" },
      },
      render: ({
        sectionTitle,
        firstTitle,
        firstBody,
        secondTitle,
        secondBody,
        thirdTitle,
        thirdBody,
      }) => (
        <section className="space-y-4">
          <Heading level={2}>{sectionTitle}</Heading>
          <div className="grid gap-4 md:grid-cols-3">
            <HighlightCard body={firstBody} title={firstTitle} />
            <HighlightCard body={secondBody} title={secondTitle} />
            <HighlightCard body={thirdBody} title={thirdTitle} />
          </div>
        </section>
      ),
    },
  },
};

function ActionLink({
  className,
  href,
  label,
}: {
  className: string;
  href: string;
  label: string;
}) {
  if (!label.trim()) {
    return null;
  }

  return (
    <Link
      className={`inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-medium transition-colors ${className}`}
      href={href || "#"}
    >
      {label}
    </Link>
  );
}

function HighlightCard({ body, title }: { body: string; title: string }) {
  return (
    <Card className="rounded-3xl border-border bg-overlay py-0 shadow-none">
      <CardContent className="space-y-3 p-5">
        <Badge intent="outline" isCircle={false}>
          Highlight
        </Badge>
        <Heading level={3}>{title}</Heading>
        <Text>{body}</Text>
      </CardContent>
    </Card>
  );
}

function splitParagraphs(value: string): string[] {
  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
