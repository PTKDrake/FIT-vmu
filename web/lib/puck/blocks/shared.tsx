import * as LucideIcons from "lucide-react";
import type { ComponentType } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
interface SelectFieldOption {
  value: unknown;
}

interface PuckFieldDefinition {
  arrayFields?: Record<string, PuckFieldDefinition>;
  defaultItemProps?: Record<string, unknown>;
  objectFields?: Record<string, PuckFieldDefinition>;
  options?: ReadonlyArray<SelectFieldOption>;
  type?: string;
}

type PuckFieldDefinitions = Record<string, PuckFieldDefinition>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function applySelectDefaultsToProps(
  props: Record<string, unknown>,
  fields: PuckFieldDefinitions,
): Record<string, unknown> {
  let nextProps = props;

  for (const [fieldName, field] of Object.entries(fields)) {
    if (
      field.type !== "select" ||
      props[fieldName] !== undefined ||
      !field.options?.length
    ) {
      continue;
    }

    if (nextProps === props) {
      nextProps = { ...props };
    }

    nextProps[fieldName] = field.options[0]?.value;
  }

  return nextProps;
}

function normalizeFieldDefinitions(
  fields: PuckFieldDefinitions,
): PuckFieldDefinitions {
  let nextFields = fields;

  for (const [fieldName, field] of Object.entries(fields)) {
    let nextField = field;

    if (field.type === "array" && field.arrayFields) {
      const normalizedArrayFields = normalizeFieldDefinitions(field.arrayFields);
      const currentDefaultItemProps = isRecord(field.defaultItemProps)
        ? field.defaultItemProps
        : {};
      const nextDefaultItemProps = applySelectDefaultsToProps(
        currentDefaultItemProps,
        normalizedArrayFields,
      );

      if (
        normalizedArrayFields !== field.arrayFields ||
        nextDefaultItemProps !== currentDefaultItemProps ||
        !isRecord(field.defaultItemProps)
      ) {
        nextField = {
          ...field,
          arrayFields: normalizedArrayFields,
          defaultItemProps: nextDefaultItemProps,
        };
      }
    }

    if (field.type === "object" && field.objectFields) {
      const normalizedObjectFields = normalizeFieldDefinitions(field.objectFields);

      if (normalizedObjectFields !== field.objectFields) {
        nextField = {
          ...nextField,
          objectFields: normalizedObjectFields,
        };
      }
    }

    if (nextField !== field) {
      if (nextFields === fields) {
        nextFields = { ...fields };
      }

      nextFields[fieldName] = nextField;
    }
  }

  return nextFields;
}

export function withSelectFieldDefaults<TComponents>(
  components: TComponents,
): TComponents {
  const currentComponents = components as Record<
    string,
    {
      defaultProps?: unknown;
      fields?: unknown;
    }
  >;
  let nextComponents = currentComponents;

  for (const componentName of Object.keys(currentComponents)) {
    const componentConfig = currentComponents[componentName];

    if (!componentConfig?.fields) {
      continue;
    }

    const normalizedFields = normalizeFieldDefinitions(
      componentConfig.fields as PuckFieldDefinitions,
    );
    const currentDefaultProps = isRecord(componentConfig.defaultProps)
      ? componentConfig.defaultProps
      : {};
    const nextDefaultProps = applySelectDefaultsToProps(
      currentDefaultProps,
      normalizedFields,
    );

    if (
      normalizedFields === componentConfig.fields &&
      nextDefaultProps === currentDefaultProps &&
      isRecord(componentConfig.defaultProps)
    ) {
      continue;
    }

    if (nextComponents === currentComponents) {
      nextComponents = { ...currentComponents };
    }

    nextComponents[componentName] = {
      ...componentConfig,
      fields: normalizedFields,
      defaultProps: nextDefaultProps,
    };
  }

  return nextComponents as TComponents;
}

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
