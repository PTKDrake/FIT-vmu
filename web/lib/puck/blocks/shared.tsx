import {
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle,
  Cpu,
  Globe,
  GraduationCap,
  School,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import type { ComponentType } from "react";

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

const PUCK_MEDIA_FIELD_NAMES = new Set([
  "avatar",
  "backgroundImage",
  "imageUrl",
  "logoUrl",
  "mobileLogoUrl",
]);

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
      const normalizedArrayFields = normalizeFieldDefinitions(
        field.arrayFields,
      );
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
      const normalizedObjectFields = normalizeFieldDefinitions(
        field.objectFields,
      );

      if (normalizedObjectFields !== field.objectFields) {
        nextField = {
          ...nextField,
          objectFields: normalizedObjectFields,
        };
      }
    }

    if (field.type === "text" && PUCK_MEDIA_FIELD_NAMES.has(fieldName)) {
      nextField = {
        ...nextField,
        type: "cmsMedia",
      };
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
  const IconComponent = lucideIconMap[name] ?? School;

  return <IconComponent className={className} />;
}

const lucideIconMap: Record<string, ComponentType<{ className?: string }>> = {
  Award,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle,
  Cpu,
  Globe,
  GraduationCap,
  School,
  Shield,
  Sparkles,
  Users,
};

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
