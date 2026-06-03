import * as LucideIcons from "lucide-react";
import type { ComponentType } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";

export function LucideIconRenderer({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const IconComponent = (
    LucideIcons as unknown as Record<
      string,
      ComponentType<{ className?: string }>
    >
  )[name];

  if (!IconComponent) {
    const Fallback = LucideIcons.School || LucideIcons.BookOpen;

    return <Fallback className={className} />;
  }

  return <IconComponent className={className} />;
}

export function ActionLink({
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
      className={`inline-flex min-h-11 items-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${className}`}
      href={href || "#"}
    >
      {label}
    </Link>
  );
}

export function getPuckBlockDomId(
  id?: string,
  anchorId?: string,
): string | undefined {
  return id?.trim() || anchorId?.trim() || undefined;
}

export function isPuckEditorPreview(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export function HighlightCard({
  body,
  title,
}: {
  body: string;
  title: string;
}) {
  return (
    <Card className="rounded-3xl border-border bg-overlay py-0 shadow-none transition hover:shadow-xs">
      <CardContent className="space-y-3 p-6">
        <Badge intent="outline" isCircle={false}>
          Highlight
        </Badge>
        <Heading level={3} className="text-lg font-semibold">
          {title}
        </Heading>
        <Text className="text-muted-fg text-sm/6">{body}</Text>
      </CardContent>
    </Card>
  );
}

export function splitParagraphs(value: string): string[] {
  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
