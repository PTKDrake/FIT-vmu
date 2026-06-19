import { usePage } from "@inertiajs/react";
import layoutBuilderRoutes from "@/routes/cms/layout-builder";
import type { SharedData } from "@/types/shared";
import { isPuckEditorPreview } from "../shared";

export interface PuckDynamicPost {
  author: string | null;
  categoryIds: number[];
  categoryNames: string[];
  date: string | null;
  excerpt: string | null;
  id: number;
  slug: string;
  thumbnailUrl: string | null;
  title: string;
  url: string | null;
}

export interface PuckDynamicCategory {
  description: string | null;
  id: number;
  name: string;
  parentId: number | null;
  slug: string;
  postCount?: number;
}

export interface PuckDynamicStaff {
  academicTitle: string | null;
  avatarUrl: string | null;
  email: string | null;
  expertise: string | null;
  fullName: string;
  id: number;
  name: string;
  phone: string | null;
  position: string | null;
  slug: string;
  unitIds: number[];
}

export interface PuckDynamicUnit {
  description: string | null;
  head: string | null;
  id: number;
  name: string;
  slug: string;
}

export interface PuckDynamicPage {
  id: number;
  slug: string;
  title: string;
  url: string;
}

export interface PuckDynamicNavigationItem {
  children: PuckDynamicNavigationItem[];
  id: number;
  target: string;
  title: string;
  url: string;
}

export interface PuckDynamicNavigationMenu {
  id: number;
  items: PuckDynamicNavigationItem[];
  location: string | null;
  name: string;
  slug: string;
}

interface PuckDynamicMediaItem {
  displayName: string;
  id: number;
  mimeType: string;
  previewUrl: string;
}

export interface PuckDynamicData {
  categories: PuckDynamicCategory[];
  media?: Record<number, PuckDynamicMediaItem>;
  navigationMenus: PuckDynamicNavigationMenu[];
  pages: PuckDynamicPage[];
  posts: PuckDynamicPost[];
  staff: PuckDynamicStaff[];
  units: PuckDynamicUnit[];
}

const emptyPuckDynamicData: PuckDynamicData = {
  categories: [],
  navigationMenus: [],
  pages: [],
  posts: [],
  staff: [],
  units: [],
};

export function usePuckDynamicData(): PuckDynamicData {
  const pageDynamicData = usePage<
    SharedData & { dynamicData?: PuckDynamicData }
  >().props.dynamicData;

  return (
    pageDynamicData ?? readPuckDynamicDataFromWindow() ?? emptyPuckDynamicData
  );
}

function readPuckDynamicDataFromWindow(): PuckDynamicData | null {
  if (typeof window === "undefined") {
    return null;
  }

  const currentWindow = window as Window & {
    __VMU_PUCK_DYNAMIC_DATA__?: PuckDynamicData;
  };

  if (currentWindow.__VMU_PUCK_DYNAMIC_DATA__) {
    return currentWindow.__VMU_PUCK_DYNAMIC_DATA__;
  }

  try {
    const topWindow = window.top as
      | (Window & {
          __VMU_PUCK_DYNAMIC_DATA__?: PuckDynamicData;
        })
      | null;

    return topWindow?.__VMU_PUCK_DYNAMIC_DATA__ ?? null;
  } catch {
    return null;
  }
}

export function parseOptionalId(value: string | undefined): number | null {
  if (!value || value === "all") {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

export function getBlockLayoutPresetClass(preset: string | undefined): string {
  switch (preset) {
    case "headerPrimary":
      return "w-full min-w-0 md:grow md:basis-[44rem] md:max-w-none";
    case "footerContact":
      return "mx-auto max-w-sm text-center lg:mx-0 lg:text-left";
    case "footerMenu":
      return "mx-auto max-w-sm text-center lg:mr-0 lg:ml-auto lg:text-left";
    case "containedWide":
      return "mx-auto w-full max-w-4xl";
    default:
      return "";
  }
}

export function getResponsiveTextAlignClass(
  align: string | undefined,
  breakpoint?: "lg",
): string {
  const prefix = breakpoint ? `${breakpoint}:` : "";

  switch (align) {
    case "left":
      return `${prefix}text-left`;
    case "center":
      return `${prefix}text-center`;
    case "right":
      return `${prefix}text-right`;
    default:
      return "";
  }
}

export function getResponsivePositionClass(
  position: string | undefined,
  breakpoint: "lg",
): string {
  switch (position) {
    case "start":
      return `${breakpoint}:mr-auto ${breakpoint}:ml-0`;
    case "center":
      return `${breakpoint}:mx-auto`;
    case "end":
      return `${breakpoint}:ml-auto ${breakpoint}:mr-0`;
    default:
      return "";
  }
}

export function getResponsiveMaxWidthClass(
  maxWidth: string | undefined,
): string {
  switch (maxWidth) {
    case "sm":
      return "max-w-sm";
    case "none":
      return "max-w-none";
    default:
      return "";
  }
}

export function EmptyDynamicState({ label }: { label: string }) {
  if (!isPuckEditorPreview()) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-dashed border-border/80 p-8 text-center text-sm text-muted-fg">
      {label}
    </div>
  );
}

export function staffDisplayName(staff: PuckDynamicStaff): string {
  if (staff.name.trim() !== "") {
    return staff.name;
  }

  if (staff.academicTitle) {
    return `${staff.academicTitle} ${staff.fullName}`;
  }

  return staff.fullName;
}

interface SourceOption {
  id: number;
  label: string;
  meta?: Record<string, string | null | undefined>;
}

async function fetchSourceOptions(
  source: string,
): Promise<SourceOption[] | null> {
  const response = await fetch(layoutBuilderRoutes.sources.url(source), {
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as {
    data?: SourceOption[];
  };

  return payload.data ?? [];
}

export async function buildNavigationMenuFieldOptions(
  emptyLabel: string,
): Promise<Array<{ label: string; value: string }> | null> {
  const items = await fetchSourceOptions("navigation-menus");

  if (items === null) {
    return null;
  }

  return [
    { label: emptyLabel, value: "" },
    ...items.map((item) => ({
      label: item.meta?.location
        ? `${item.label} (${item.meta.location})`
        : item.label,
      value: item.id.toString(),
    })),
  ];
}

export async function buildStaffFieldOptions(
  emptyLabel: string,
): Promise<Array<{ label: string; value: string }> | null> {
  const items = await fetchSourceOptions("staff");

  if (items === null) {
    return null;
  }

  return [
    { label: emptyLabel, value: "" },
    ...items.map((item) => ({
      label: item.meta?.position
        ? `${item.label} (${item.meta.position})`
        : item.label,
      value: item.id.toString(),
    })),
  ];
}

export async function buildCategoryFieldOptions(
  emptyLabel: string,
): Promise<Array<{ label: string; value: string }> | null> {
  const items = await fetchSourceOptions("categories");

  if (items === null) {
    return null;
  }

  return [
    { label: emptyLabel, value: "" },
    ...items.map((item) => ({
      label: item.meta?.parentId ? `${item.label} (danh mục con)` : item.label,
      value: item.id.toString(),
    })),
  ];
}
