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
import type { ComponentType, ReactNode } from "react";

export const puckDisplayDevices = ["mobile", "tablet", "desktop"] as const;

export type PuckDisplayDevice = (typeof puckDisplayDevices)[number];

const defaultDisplayDevices = [...puckDisplayDevices];

interface SelectFieldOption {
  value: unknown;
}

interface PuckFieldDefinition {
  arrayFields?: Record<string, PuckFieldDefinition>;
  defaultItemProps?: Record<string, unknown>;
  label?: string;
  objectFields?: Record<string, PuckFieldDefinition>;
  options?: ReadonlyArray<SelectFieldOption>;
  type?: string;
}

type PuckFieldDefinitions = Record<string, PuckFieldDefinition>;

type LegacyHideOnValue = "none" | PuckDisplayDevice;

const PUCK_MEDIA_FIELD_NAMES = new Set([
  "avatar",
  "backgroundImage",
  "imageUrl",
  "logoUrl",
  "mobileLogoUrl",
]);

const puckDisplayField = {
  type: "displayVisibility",
  label: "Hiển thị",
} satisfies PuckFieldDefinition;

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
  let didInsertDisplayField = false;

  for (const [fieldName, field] of Object.entries(fields)) {
    if (fieldName === "hideOn") {
      if (nextFields === fields) {
        nextFields = { ...fields };
      }

      delete nextFields[fieldName];
      continue;
    }

    if (
      !didInsertDisplayField &&
      (fieldName === "className" || fieldName === "children")
    ) {
      if (nextFields === fields) {
        nextFields = { ...fields };
      }

      nextFields.displayOn = puckDisplayField;
      didInsertDisplayField = true;
    }

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

  if (!didInsertDisplayField && !Object.hasOwn(nextFields, "displayOn")) {
    if (nextFields === fields) {
      nextFields = { ...fields };
    }

    nextFields.displayOn = puckDisplayField;
  }

  return nextFields;
}

function normalizeDisplayDevices(
  value: unknown,
  legacyHideOn?: LegacyHideOnValue,
): PuckDisplayDevice[] {
  if (Array.isArray(value)) {
    const devices = value.filter((item): item is PuckDisplayDevice =>
      puckDisplayDevices.includes(item as PuckDisplayDevice),
    );

    if (devices.length > 0) {
      return devices;
    }
  }

  switch (legacyHideOn) {
    case "mobile":
      return ["tablet", "desktop"];
    case "tablet":
      return ["mobile", "desktop"];
    case "desktop":
      return ["mobile", "tablet"];
    default:
      return [...defaultDisplayDevices];
  }
}

export function getDisplayOnClass(
  displayOn?: unknown,
  legacyHideOn?: LegacyHideOnValue,
): string {
  const devices = new Set(normalizeDisplayDevices(displayOn, legacyHideOn));

  if (devices.size === 0) {
    return "hidden";
  }

  if (devices.size === puckDisplayDevices.length) {
    return "";
  }

  const showOnMobile = devices.has("mobile");
  const showOnTablet = devices.has("tablet");
  const showOnDesktop = devices.has("desktop");

  if (showOnMobile && showOnTablet && !showOnDesktop) {
    return "contents lg:hidden";
  }

  if (showOnMobile && !showOnTablet && showOnDesktop) {
    return "contents sm:hidden lg:contents";
  }

  if (!showOnMobile && showOnTablet && showOnDesktop) {
    return "hidden sm:contents";
  }

  if (showOnMobile && !showOnTablet && !showOnDesktop) {
    return "contents sm:hidden";
  }

  if (!showOnMobile && showOnTablet && !showOnDesktop) {
    return "hidden sm:contents lg:hidden";
  }

  return "hidden lg:contents";
}

function wrapComponentRender(
  render: ((props: Record<string, unknown>) => ReactNode) | undefined,
): typeof render {
  if (render === undefined) {
    return render;
  }

  return (props) => (
    <div
      className={getDisplayOnClass(
        props.displayOn,
        props.hideOn as LegacyHideOnValue | undefined,
      )}
    >
      {render(props)}
    </div>
  );
}

export function withSelectFieldDefaults<TComponents>(
  components: TComponents,
): TComponents {
  const currentComponents = components as Record<
    string,
    {
      defaultProps?: unknown;
      fields?: unknown;
      render?: unknown;
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
      ? { ...componentConfig.defaultProps }
      : {};
    delete currentDefaultProps.hideOn;
    const nextDefaultProps = applySelectDefaultsToProps(
      currentDefaultProps,
      normalizedFields,
    );

    if (nextDefaultProps.displayOn === undefined) {
      nextDefaultProps.displayOn = [...defaultDisplayDevices];
    }

    if (nextComponents === currentComponents) {
      nextComponents = { ...currentComponents };
    }

    nextComponents[componentName] = {
      ...componentConfig,
      fields: normalizedFields,
      defaultProps: nextDefaultProps,
      render: wrapComponentRender(
        componentConfig.render as
          | ((props: Record<string, unknown>) => ReactNode)
          | undefined,
      ),
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
