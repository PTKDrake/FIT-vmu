import { usePage } from "@inertiajs/react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { NavbarItem, NavbarMenu, NavbarSubmenu } from "@/components/ui/navbar";
import { Text } from "@/components/ui/text";
import { useIsMobile } from "@/hooks/use-mobile";
import { getPuckImageUrl, type PuckImageValue } from "@/lib/puck/media";
import layoutBuilderRoutes from "@/routes/cms/layout-builder";
import type { SharedData } from "@/types/shared";
import { getPuckBlockDomId, isPuckEditorPreview } from "./shared";
import { getSurfaceClassName, puckSurfaceFields } from "./surface";
import type { PageBuilderComponentConfig } from "./types";

interface PuckDynamicPost {
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

interface PuckDynamicCategory {
  description: string | null;
  id: number;
  name: string;
  parentId: number | null;
  slug: string;
}

interface PuckDynamicStaff {
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

interface PuckDynamicUnit {
  description: string | null;
  head: string | null;
  id: number;
  name: string;
  slug: string;
}

interface PuckDynamicPage {
  id: number;
  slug: string;
  title: string;
  url: string;
}

interface PuckDynamicNavigationItem {
  children: PuckDynamicNavigationItem[];
  id: number;
  target: string;
  title: string;
  url: string;
}

interface PuckDynamicNavigationMenu {
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

interface PuckDynamicData {
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

function usePuckDynamicData(): PuckDynamicData {
  const pageDynamicData =
    usePage<SharedData & { dynamicData?: PuckDynamicData }>().props.dynamicData;

  return pageDynamicData ?? readPuckDynamicDataFromWindow() ?? emptyPuckDynamicData;
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
    const topWindow = window.top as Window & {
      __VMU_PUCK_DYNAMIC_DATA__?: PuckDynamicData;
    } | null;

    return topWindow?.__VMU_PUCK_DYNAMIC_DATA__ ?? null;
  } catch {
    return null;
  }
}

function parseOptionalId(value: string | undefined): number | null {
  if (!value || value === "all") {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

function getBlockLayoutPresetClass(
  preset: string | undefined,
): string {
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

function getResponsiveTextAlignClass(
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

function getResponsivePositionClass(
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

function getResponsiveMaxWidthClass(maxWidth: string | undefined): string {
  switch (maxWidth) {
    case "sm":
      return "max-w-sm";
    case "none":
      return "max-w-none";
    default:
      return "";
  }
}

function EmptyDynamicState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/80 p-8 text-center text-sm text-muted-fg">
      {label}
    </div>
  );
}

function staffDisplayName(staff: PuckDynamicStaff): string {
  if (staff.name.trim() !== "") {
    return staff.name;
  }

  if (staff.academicTitle) {
    return `${staff.academicTitle} ${staff.fullName}`;
  }

  return staff.fullName;
}

interface LatestPostsBlockProps {
  categoryId?: string;
  className?: string;
  layout?: string;
  limit: number;
  showCTA?: boolean;
  title: string;
  surfaceBorder?: "none" | "subtle" | "default" | "strong" | "dashed";
  surfacePadding?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  surfaceRadius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  surfaceShadow?: "none" | "sm" | "md";
  surfaceTone?: "transparent" | "bg" | "overlay" | "muted" | "subtle";
}

function LatestPostsBlock(props: LatestPostsBlockProps) {
  const {
    title,
    limit,
    categoryId,
    layout,
    showCTA,
    surfaceTone,
    surfaceBorder,
    surfaceRadius,
    surfacePadding,
    surfaceShadow,
    className,
  } = props;
  const id = getPuckBlockDomId((props as { id?: string }).id);
  const dynamicData = usePuckDynamicData();
  const selectedCategoryId = parseOptionalId(categoryId);
  const posts = dynamicData.posts
    .filter((post) =>
      selectedCategoryId ? post.categoryIds.includes(selectedCategoryId) : true,
    )
    .slice(0, limit);

  if (posts.length === 0) {
    return <EmptyDynamicState label="Không có tin tức nào để hiển thị." />;
  }

  return (
    <section
      id={id}
      className={twMerge(
        "space-y-6 py-6 w-full relative",
        getSurfaceClassName(
          {
            surfaceTone,
            surfaceBorder,
            surfaceRadius,
            surfacePadding,
            surfaceShadow,
          },
          "",
        ),
        className,
      )}
    >
      <div className="flex items-end justify-between pb-3">
        <Heading
          level={2}
          className="text-2xl font-extrabold tracking-tight text-fg"
        >
          {title}
        </Heading>
        <Badge
          intent="info"
          isCircle={false}
          className="text-[9px] font-bold border-info/20"
        >
          Dữ liệu động
        </Badge>
      </div>

      <div
        className={twMerge(
          "grid gap-6 w-full",
          layout === "grid" ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1",
        )}
      >
        {posts.map((post) => (
          <Link
            key={post.id}
            href={post.url ?? "#"}
            className="block"
          >
            <Card
              className={twMerge(
                "overflow-hidden py-0 transition duration-300 hover:shadow-md hover:border-primary/15 group flex flex-col justify-between cursor-pointer",
                getSurfaceClassName(
                  {
                    surfaceTone,
                    surfaceBorder,
                    surfaceRadius,
                    surfacePadding,
                    surfaceShadow,
                  },
                  "",
                ),
              )}
            >
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <Badge
                    intent="primary"
                    isCircle={false}
                    className="text-[9px] font-semibold tracking-wider uppercase border-primary/20 bg-primary-subtle/10 text-primary"
                  >
                    {post.categoryNames[0] ?? "Tin tức"}
                  </Badge>
                  <span className="text-[10px] text-muted-fg font-medium">
                    {post.date}
                  </span>
                </div>
                <div className="space-y-2">
                  <Heading
                    level={3}
                    className="text-base font-bold text-fg group-hover:text-primary transition-colors leading-snug"
                  >
                    {post.title}
                  </Heading>
                  <Text className="text-xs/relaxed text-muted-fg leading-relaxed">
                    {post.excerpt}
                  </Text>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {showCTA && (
        <div className="flex justify-center pt-2">
          <Link
            href="/posts"
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-border bg-bg px-5 py-2 text-xs font-semibold text-fg hover:bg-secondary transition"
          >
            Xem tất cả tin tức
          </Link>
        </div>
      )}
    </section>
  );
}

interface LatestAnnouncementsBlockProps {
  className?: string;
  layout?: string;
  limit: number;
  showCTA?: boolean;
  title: string;
  surfaceBorder?: "none" | "subtle" | "default" | "strong" | "dashed";
  surfacePadding?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  surfaceRadius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  surfaceShadow?: "none" | "sm" | "md";
  surfaceTone?: "transparent" | "bg" | "overlay" | "muted" | "subtle";
}

function LatestAnnouncementsBlock(props: LatestAnnouncementsBlockProps) {
  const {
    title,
    limit,
    layout,
    showCTA,
    surfaceTone,
    surfaceBorder,
    surfaceRadius,
    surfacePadding,
    surfaceShadow,
    className,
  } = props;
  const id = getPuckBlockDomId((props as { id?: string }).id);
  const announcements = usePuckDynamicData()
    .posts.filter((post) =>
      post.categoryNames.some((category) =>
        category.toLowerCase().includes("thông báo"),
      ),
    )
    .slice(0, limit);

  if (announcements.length === 0) {
    return <EmptyDynamicState label="Không có thông báo nào để hiển thị." />;
  }

  return (
    <section
      id={id}
      className={twMerge(
        "space-y-6 py-6 w-full relative",
        getSurfaceClassName(
          {
            surfaceTone,
            surfaceBorder,
            surfaceRadius,
            surfacePadding,
            surfaceShadow,
          },
          "",
        ),
        className,
      )}
    >
      <div className="flex items-end justify-between border-b border-border/60 pb-3">
        <Heading
          level={2}
          className="text-2xl font-extrabold tracking-tight text-fg"
        >
          {title}
        </Heading>
        <Badge
          intent="success"
          isCircle={false}
          className="text-[9px] font-bold border-success/20"
        >
          Thông báo mới
        </Badge>
      </div>

      <div
        className={twMerge(
          "grid gap-4 w-full",
          layout === "grid" ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1",
        )}
      >
        {announcements.map((ann) => (
          <Link
            key={ann.id}
            href={ann.url ?? "#"}
            className={twMerge(
              "group relative flex items-start gap-4 transition hover:bg-overlay hover:border-primary/20 hover:shadow-xs cursor-pointer",
              getSurfaceClassName(
                {
                  surfaceTone,
                  surfaceBorder,
                  surfaceRadius,
                  surfacePadding,
                  surfaceShadow,
                },
                "",
              ),
            )}
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-warning-subtle text-warning-subtle-fg border border-warning/10 font-bold text-xs uppercase">
              {(ann.categoryNames[0] ?? "TB").substring(0, 2)}
            </div>
            <div className="space-y-1 flex-1">
              <Heading
                level={3}
                className="text-sm font-bold text-fg group-hover:text-primary transition-colors leading-snug"
              >
                {ann.title}
              </Heading>
              <div className="flex items-center gap-3 text-[10px] text-muted-fg font-medium">
                <span>{ann.date ?? "Chưa có ngày"}</span>
                <span>•</span>
                <span>{ann.categoryNames[0] ?? "Thông báo"}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {showCTA && (
        <div className="flex justify-center pt-2">
          <Link
            href="/announcements"
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-border bg-bg px-5 py-2 text-xs font-semibold text-fg hover:bg-secondary transition"
          >
            Xem tất cả thông báo
          </Link>
        </div>
      )}
    </section>
  );
}

interface StaffGridBlockProps {
  className?: string;
  departmentId?: string;
  limit: number;
  title: string;
  surfaceBorder?: "none" | "subtle" | "default" | "strong" | "dashed";
  surfacePadding?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  surfaceRadius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  surfaceShadow?: "none" | "sm" | "md";
  surfaceTone?: "transparent" | "bg" | "overlay" | "muted" | "subtle";
}

function StaffGridBlock({
  title,
  limit,
  departmentId,
  surfaceTone,
  surfaceBorder,
  surfaceRadius,
  surfacePadding,
  surfaceShadow,
  className,
}: StaffGridBlockProps) {
  const selectedUnitId = parseOptionalId(departmentId);
  const staff = usePuckDynamicData()
    .staff.filter((staffProfile) =>
      selectedUnitId ? staffProfile.unitIds.includes(selectedUnitId) : true,
    )
    .slice(0, limit);

  if (staff.length === 0) {
    return <EmptyDynamicState label="Không có hồ sơ cán bộ để hiển thị." />;
  }

  return (
    <section
      className={twMerge(
        "space-y-6 py-6 w-full relative",
        getSurfaceClassName(
          {
            surfaceTone,
            surfaceBorder,
            surfaceRadius,
            surfacePadding,
            surfaceShadow,
          },
          "",
        ),
        className,
      )}
    >
      <div className="flex items-end justify-between border-b border-border/60 pb-3">
        <Heading
          level={2}
          className="text-2xl font-extrabold tracking-tight text-fg"
        >
          {title}
        </Heading>
        <Badge
          intent="primary"
          isCircle={false}
          className="text-[9px] font-bold border-primary/20"
        >
          Giảng viên
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3 w-full">
        {staff.map((st) => (
          <Card
            key={st.id}
            className={twMerge(
              "py-0 shadow-none hover:shadow-md transition-shadow duration-300 group",
              getSurfaceClassName(
                {
                  surfaceTone,
                  surfaceBorder,
                  surfaceRadius,
                  surfacePadding,
                  surfaceShadow,
                },
                "",
              ),
            )}
          >
            <CardContent className="p-6 flex flex-col gap-4 items-center text-center">
              <Avatar
                src={st.avatarUrl ?? ""}
                alt={staffDisplayName(st)}
                initials={st.fullName.split(" ").pop()?.substring(0, 2)}
                size="xl"
                className="shadow-xs group-hover:scale-105 transition duration-300"
              />
              <div className="space-y-1">
                <Heading
                  level={3}
                  className="text-base font-bold text-fg group-hover:text-primary transition-colors"
                >
                  {staffDisplayName(st)}
                </Heading>
                <Text className="text-xs font-bold text-primary uppercase tracking-wider text-[10px]">
                  {st.position ?? "Cán bộ"}
                </Text>
                <Text className="text-xs text-muted-fg leading-relaxed">
                  {st.expertise ? `Đơn vị: ${st.expertise}` : st.phone}
                </Text>
              </div>
              <div className="pt-2 w-full border-t border-border/50 flex items-center justify-center gap-1.5 text-xs text-muted-fg">
                <svg
                  className="size-3.5 text-primary"
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
                <span>{st.email ?? "Chưa có email"}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

interface StaffProfileCardBlockProps {
  className?: string;
  fallbackRole?: string;
  showEmail?: boolean;
  showPosition?: boolean;
  staffId?: string;
  title?: string;
  surfaceBorder?: "none" | "subtle" | "default" | "strong" | "dashed";
  surfacePadding?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  surfaceRadius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  surfaceShadow?: "none" | "sm" | "md";
  surfaceTone?: "transparent" | "bg" | "overlay" | "muted" | "subtle";
}

function StaffProfileCardBlock({
  title,
  staffId,
  fallbackRole,
  showEmail = true,
  showPosition = true,
  surfaceTone,
  surfaceBorder,
  surfaceRadius,
  surfacePadding,
  surfaceShadow,
  className,
}: StaffProfileCardBlockProps) {
  const selectedStaffId = parseOptionalId(staffId);
  const staffRecords = usePuckDynamicData().staff;
  const staff =
    staffRecords.find((record) => record.id === selectedStaffId) ??
    staffRecords[0] ??
    null;

  if (!staff) {
    return <EmptyDynamicState label="Không có hồ sơ cán bộ để hiển thị." />;
  }

  const roleLabel = showPosition
    ? (staff.position ?? fallbackRole ?? "Cán bộ")
    : (fallbackRole ?? "");

  return (
    <section
      className={twMerge(
        "mx-auto flex w-full max-w-sm flex-col items-center gap-4 text-center",
        getSurfaceClassName(
          {
            surfaceTone,
            surfaceBorder,
            surfaceRadius,
            surfacePadding,
            surfaceShadow,
          },
          "",
        ),
        className,
      )}
    >
      {title ? (
        <Heading level={3} className="text-base font-bold text-fg">
          {title}
        </Heading>
      ) : null}
      <Avatar
        src={staff.avatarUrl ?? ""}
        alt={staffDisplayName(staff)}
        initials={staff.fullName.split(" ").pop()?.substring(0, 2)}
        className="size-52 rounded-sm border border-border/70 object-cover shadow-xs"
      />
      <div className="space-y-2">
        <Heading level={3} className="text-2xl font-semibold text-fg">
          {staffDisplayName(staff)}
        </Heading>
        {showEmail && staff.email ? (
          <p className="text-lg text-primary">
            <span className="font-semibold text-fg">Email:</span>{" "}
            <Link href={`mailto:${staff.email}`}>{staff.email}</Link>
          </p>
        ) : null}
        {roleLabel ? (
          <Text className="text-2xl font-medium text-fg">{roleLabel}</Text>
        ) : null}
      </div>
    </section>
  );
}

interface UnitListBlockProps {
  className?: string;
  limit: number;
  title: string;
  surfaceBorder?: "none" | "subtle" | "default" | "strong" | "dashed";
  surfacePadding?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  surfaceRadius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  surfaceShadow?: "none" | "sm" | "md";
  surfaceTone?: "transparent" | "bg" | "overlay" | "muted" | "subtle";
}

function UnitListBlock({
  title,
  limit,
  surfaceTone,
  surfaceBorder,
  surfaceRadius,
  surfacePadding,
  surfaceShadow,
  className,
}: UnitListBlockProps) {
  const units = usePuckDynamicData().units.slice(0, limit);

  if (units.length === 0) {
    return <EmptyDynamicState label="Không có đơn vị nào để hiển thị." />;
  }

  return (
    <section
      className={twMerge(
        "space-y-6 py-6 w-full relative",
        getSurfaceClassName(
          {
            surfaceTone,
            surfaceBorder,
            surfaceRadius,
            surfacePadding,
            surfaceShadow,
          },
          "",
        ),
        className,
      )}
    >
      <div className="flex items-end justify-between border-b border-border/60 pb-3">
        <Heading
          level={2}
          className="text-2xl font-extrabold tracking-tight text-fg"
        >
          {title}
        </Heading>
        <Badge
          intent="warning"
          isCircle={false}
          className="text-[9px] font-bold border-warning/20"
        >
          Các đơn vị
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3 w-full">
        {units.map((un) => (
          <Card
            key={un.id}
            className={twMerge(
              "overflow-hidden py-0 transition duration-300 hover:shadow-md hover:border-primary/15 group flex flex-col justify-between",
              getSurfaceClassName(
                {
                  surfaceTone,
                  surfaceBorder,
                  surfaceRadius,
                  surfacePadding,
                  surfaceShadow,
                },
                "",
              ),
            )}
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="inline-flex size-10 items-center justify-center rounded-xl border border-primary/5 bg-primary-subtle text-primary shrink-0 transition-colors group-hover:bg-primary group-hover:text-primary-fg shadow-xs">
                  <svg
                    className="size-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.33l-7.5-5-7.5 5V21m16.5 0H3.75"
                    />
                  </svg>
                </div>
                <div>
                  <Heading
                    level={3}
                    className="text-base font-bold text-fg group-hover:text-primary transition-colors leading-tight"
                  >
                    {un.name}
                  </Heading>
                  {un.head ? (
                    <span className="text-[10px] text-muted-fg font-medium">
                      Phụ trách: {un.head}
                    </span>
                  ) : null}
                </div>
              </div>
              <Text className="text-xs/relaxed text-muted-fg leading-relaxed">
                {un.description ?? "Chưa có mô tả công khai."}
              </Text>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

interface RelatedPostsBlockProps {
  className?: string;
  limit: number;
  title: string;
  surfaceBorder?: "none" | "subtle" | "default" | "strong" | "dashed";
  surfacePadding?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  surfaceRadius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  surfaceShadow?: "none" | "sm" | "md";
  surfaceTone?: "transparent" | "bg" | "overlay" | "muted" | "subtle";
}

function RelatedPostsBlock({
  title,
  limit,
  surfaceTone,
  surfaceBorder,
  surfaceRadius,
  surfacePadding,
  surfaceShadow,
  className,
}: RelatedPostsBlockProps) {
  const related = usePuckDynamicData().posts.slice(0, limit);

  if (related.length === 0) {
    return <EmptyDynamicState label="Không có tin liên quan để hiển thị." />;
  }

  return (
    <section
      className={twMerge(
        "space-y-6 py-6 w-full relative",
        getSurfaceClassName(
          {
            surfaceTone,
            surfaceBorder,
            surfaceRadius,
            surfacePadding,
            surfaceShadow,
          },
          "",
        ),
        className,
      )}
    >
      <div className="flex items-end justify-between border-b border-border/60 pb-3">
        <Heading level={2} className="text-xl font-bold text-fg">
          {title}
        </Heading>
        <Badge
          intent="info"
          isCircle={false}
          className="text-[9px] font-bold border-info/20"
        >
          Tin liên quan
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 w-full">
        {related.map((post) => (
          <Link
            key={post.id}
            href={post.url ?? "#"}
            className="block"
          >
            <Card
              className={twMerge(
                "py-0 shadow-none hover:shadow-md transition-shadow group flex flex-col justify-between cursor-pointer",
                getSurfaceClassName(
                  {
                    surfaceTone,
                    surfaceBorder,
                    surfaceRadius,
                    surfacePadding,
                    surfaceShadow,
                  },
                  "",
                ),
              )}
            >
              <CardContent className="p-5 space-y-3">
                <span className="text-[10px] text-primary font-bold uppercase tracking-wider block">
                  {post.categoryNames[0] ?? "Tin tức"}
                </span>
                <Heading
                  level={3}
                  className="text-sm font-bold text-fg group-hover:text-primary transition-colors leading-snug"
                >
                  {post.title}
                </Heading>
                <Text className="text-xs text-muted-fg leading-relaxed line-clamp-2">
                  {post.excerpt}
                </Text>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

interface NavigationMenuBlockProps {
  className?: string;
  layoutPreset?: string;
  fullWidthOnMobile?: boolean;
  autoWidthFromMd?: boolean;
  noShrinkFromMd?: boolean;
  growFromMd?: boolean;
  basisFromMd?: "none" | "44rem";
  maxWidth?: "default" | "none" | "sm";
  textAlign?: "left" | "center" | "right";
  textAlignFromLg?: "inherit" | "left" | "center" | "right";
  positionFromLg?: "inherit" | "start" | "center" | "end";
  menuId?: string;
  mobileButtonLabel?: string;
  mobileLogoAlt?: string;
  mobileLogoUrl?: PuckImageValue;
  mobilePanelTitle?: string;
  orientation?: string;
  title?: string;
  surfaceBorder?: "none" | "subtle" | "default" | "strong" | "dashed";
  surfacePadding?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  surfaceRadius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  surfaceShadow?: "none" | "sm" | "md";
  surfaceTone?: "transparent" | "bg" | "overlay" | "muted" | "subtle";
}

function NavigationMenuBlock(props: NavigationMenuBlockProps) {
  const {
    title,
    menuId,
    layoutPreset,
    fullWidthOnMobile,
    autoWidthFromMd,
    noShrinkFromMd,
    growFromMd,
    basisFromMd,
    maxWidth,
    textAlign,
    textAlignFromLg,
    positionFromLg,
    orientation,
    surfaceTone,
    surfaceBorder,
    surfaceRadius,
    surfacePadding,
    surfaceShadow,
    className,
  } = props;
  const id = getPuckBlockDomId((props as { id?: string }).id);
  const navigationMenus = usePuckDynamicData().navigationMenus;
  const pageUrl = usePage().url;
  const isMobile = useIsMobile();
  const isEditorPreview = isPuckEditorPreview();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const selectedMenuId = parseOptionalId(menuId);
  const previewMenu =
    selectedMenuId === null ? navigationMenus[0] ?? null : null;

  const menu =
    navigationMenus.find((navigationMenu) =>
      selectedMenuId ? navigationMenu.id === selectedMenuId : true,
    ) ??
    (isPuckEditorPreview() ? previewMenu : null);

  if (!menuId && !menu) {
    return (
      <EmptyDynamicState label="Chưa chọn menu điều hướng để hiển thị." />
    );
  }

  if (!menu || menu.items.length === 0) {
    return <EmptyDynamicState label="Không có menu điều hướng để hiển thị." />;
  }

  const layoutClassName = twMerge(
    getBlockLayoutPresetClass(layoutPreset),
    fullWidthOnMobile ? "w-full" : "",
    autoWidthFromMd ? "md:w-auto" : "",
    noShrinkFromMd ? "md:shrink-0" : "",
    growFromMd ? "md:grow" : "",
    basisFromMd === "44rem" ? "md:basis-[44rem]" : "",
    maxWidth === "none" ? "md:max-w-none" : "",
    getResponsiveMaxWidthClass(maxWidth),
    getResponsiveTextAlignClass(textAlign),
    textAlignFromLg === "inherit"
      ? ""
      : getResponsiveTextAlignClass(textAlignFromLg, "lg"),
    positionFromLg === "inherit"
      ? ""
      : getResponsivePositionClass(positionFromLg, "lg"),
  );
  const editorPreviewLayoutClassName =
    isEditorPreview && orientation !== "vertical"
      ? "w-full max-w-none min-w-fit md:basis-[44rem] md:grow"
      : "";
  const editorPreviewNavClassName =
    isEditorPreview && orientation !== "vertical"
      ? "w-full min-w-0"
      : "w-full min-w-0";
  const editorPreviewItemsClassName =
    isEditorPreview && orientation !== "vertical"
      ? "flex min-w-fit gap-1"
      : "flex min-w-0 gap-1";

  if (orientation !== "vertical" && isMobile && !isEditorPreview) {
    return (
      <MobileNavigationMenu
        buttonLabel={props.mobileButtonLabel}
        className={className}
        currentPath={pageUrl}
        isOpen={isDrawerOpen}
        layoutPreset={layoutPreset}
        layoutClassName={layoutClassName}
        logoAlt={props.mobileLogoAlt}
        logoUrl={getPuckImageUrl(props.mobileLogoUrl)}
        menu={menu}
        panelTitle={props.mobilePanelTitle}
        title={title}
        onOpenChange={setIsDrawerOpen}
        surfaceBorder={surfaceBorder}
        surfacePadding={surfacePadding}
        surfaceRadius={surfaceRadius}
        surfaceShadow={surfaceShadow}
        surfaceTone={surfaceTone}
      />
    );
  }

  return (
    <section
      id={id}
      data-vmu-puck-block="navigation-menu"
      data-vmu-navigation-orientation={
        orientation === "vertical" ? "vertical" : "horizontal"
      }
      className={twMerge(
        "@container/nav min-w-0 space-y-3",
        getSurfaceClassName(
          {
            surfaceTone,
            surfaceBorder,
            surfaceRadius,
            surfacePadding,
            surfaceShadow,
          },
          "",
        ),
        layoutClassName,
        editorPreviewLayoutClassName,
        className,
      )}
    >
      {title ? (
        <Heading level={3} className="text-sm font-bold text-fg">
          {title}
        </Heading>
      ) : null}
      <nav
        aria-label={menu.name}
        className={editorPreviewNavClassName}
      >
        <div
          className={twMerge(
            editorPreviewItemsClassName,
            orientation === "vertical"
              ? "flex-col items-stretch"
              : "flex-row flex-wrap items-center justify-center xl:justify-between",
          )}
        >
          {menu.items.map((item) => (
            <NavigationMenuEntry
              currentPath={pageUrl}
              item={item}
              key={item.id}
              orientation={orientation}
            />
          ))}
        </div>
      </nav>
    </section>
  );
}

interface MobileNavigationMenuProps {
  buttonLabel?: string;
  className?: string;
  currentPath: string;
  isOpen: boolean;
  layoutClassName?: string;
  logoAlt?: string;
  logoUrl?: string;
  menu: PuckDynamicNavigationMenu;
  panelTitle?: string;
  layoutPreset?: string;
  title?: string;
  onOpenChange: (nextOpen: boolean) => void;
  surfaceBorder?: NavigationMenuBlockProps["surfaceBorder"];
  surfacePadding?: NavigationMenuBlockProps["surfacePadding"];
  surfaceRadius?: NavigationMenuBlockProps["surfaceRadius"];
  surfaceShadow?: NavigationMenuBlockProps["surfaceShadow"];
  surfaceTone?: NavigationMenuBlockProps["surfaceTone"];
}

function MobileNavigationMenu({
  buttonLabel,
  className,
  currentPath,
  isOpen,
  layoutClassName,
  logoAlt,
  logoUrl,
  menu,
  layoutPreset,
  panelTitle,
  title,
  onOpenChange,
  surfaceBorder,
  surfacePadding,
  surfaceRadius,
  surfaceShadow,
  surfaceTone,
}: MobileNavigationMenuProps) {
  return (
    <section
      className={twMerge(
        "@container/nav min-w-0 w-full max-w-none space-y-3 md:w-auto",
        getSurfaceClassName(
          {
            surfaceTone,
            surfaceBorder,
            surfaceRadius,
            surfacePadding,
            surfaceShadow,
          },
          "",
        ),
        layoutClassName || getBlockLayoutPresetClass(layoutPreset),
        className,
      )}
    >
      {title ? (
        <Heading level={3} className="text-sm font-bold text-fg">
          {title}
        </Heading>
      ) : null}

      <div className="md:hidden">
        <button
          aria-controls={`mobile-navigation-${menu.id}`}
          aria-expanded={isOpen}
          aria-label={buttonLabel || "Mở menu điều hướng"}
          className="flex min-h-12 w-full items-center gap-3 rounded-lg border border-border bg-overlay px-4 py-2 text-fg shadow-sm transition hover:bg-muted"
          type="button"
          onClick={() => onOpenChange(!isOpen)}
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={logoAlt || menu.name}
              className="size-9 shrink-0 rounded-full border border-border bg-bg object-contain p-1 shadow-sm"
            />
          ) : null}
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          <div className="min-w-0 flex-1 text-left">
            <div className="truncate text-sm font-semibold">
              {panelTitle || menu.name}
            </div>
            <div className="truncate text-[11px] text-muted-fg">
              {buttonLabel || "Mở menu điều hướng"}
            </div>
          </div>
        </button>
      </div>

      {isOpen
        ? createPortal(
        <div className="fixed inset-0 z-[120] md:hidden">
          <button
            aria-label="Đóng menu điều hướng"
            className="absolute inset-0 bg-fg/70"
            type="button"
            onClick={() => onOpenChange(false)}
          />

          <div
            id={`mobile-navigation-${menu.id}`}
            className="relative isolate h-dvh w-full overflow-y-auto bg-bg pb-8 text-fg shadow-2xl"
          >
            <div className="sticky top-0 z-10 border-b border-border bg-bg/95 px-4 pt-3 pb-4 backdrop-blur">
              <button
                aria-label="Đóng menu điều hướng"
                className="flex h-11 w-full items-center justify-start rounded-lg border border-border bg-overlay px-4 text-fg transition hover:bg-muted"
                type="button"
                onClick={() => onOpenChange(false)}
              >
                <X className="size-5" />
              </button>
              {logoUrl ? (
                <div className="flex justify-center pt-5">
                  <img
                    src={logoUrl}
                    alt={logoAlt || menu.name}
                    className="size-16 rounded-full border border-border bg-bg object-contain p-1 shadow-lg"
                  />
                </div>
              ) : null}
              {panelTitle ? (
                <p className="pt-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-fg">
                  {panelTitle}
                </p>
              ) : null}
            </div>

            <nav aria-label={menu.name} className="px-4 pt-4">
              <div className="space-y-0.5">
                {menu.items.map((item) => (
                  <MobileNavigationMenuEntry
                    currentPath={currentPath}
                    item={item}
                    key={item.id}
                    onNavigate={() => onOpenChange(false)}
                  />
                ))}
              </div>
            </nav>
          </div>
        </div>,
        document.body,
      )
        : null}
    </section>
  );
}

function MobileNavigationMenuEntry({
  currentPath,
  item,
  onNavigate,
}: {
  currentPath: string;
  item: PuckDynamicNavigationItem;
  onNavigate: () => void;
}) {
  const hasChildren = item.children.length > 0;
  const isCurrent = isNavigationItemCurrent(item.url, currentPath);
  const hasCurrentChild = item.children.some((child) =>
    isNavigationItemCurrent(child.url, currentPath),
  );
  const [isExpanded, setIsExpanded] = useState(
    normalizeNavigationPath(currentPath) !== "/" && hasCurrentChild,
  );

  if (!hasChildren) {
    return (
      <Link
        className={twMerge(
          "flex min-h-12 items-center border-b border-border/80 py-1 text-base font-semibold text-fg transition hover:text-primary",
          isCurrent ? "text-primary" : "",
        )}
        href={item.url}
        target={item.target === "_blank" ? "_blank" : undefined}
        onClick={onNavigate}
      >
        {item.title}
      </Link>
    );
  }

  return (
    <div className="border-b border-border/80 py-1">
      <div className="flex items-center gap-2">
        <Link
          className={twMerge(
            "flex min-h-12 flex-1 items-center text-base font-semibold text-fg transition hover:text-primary",
            isCurrent ? "text-primary" : "",
          )}
          href={item.url}
          target={item.target === "_blank" ? "_blank" : undefined}
          onClick={onNavigate}
        >
          {item.title}
        </Link>
        <button
          aria-expanded={isExpanded}
          aria-label={`Mở nhóm ${item.title}`}
          className="grid size-10 shrink-0 place-items-center rounded-full text-muted-fg transition hover:bg-muted hover:text-fg"
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ChevronDown
            className={twMerge(
              "size-4 transition-transform",
              isExpanded ? "rotate-180" : "",
            )}
          />
        </button>
      </div>

      {isExpanded ? (
        <div className="space-y-1 pb-2 ps-3 pt-1">
          {item.children.map((child) => (
            <Link
              className={twMerge(
                "flex min-h-10 items-center rounded-lg bg-overlay px-3 text-sm font-medium text-muted-fg transition hover:bg-muted hover:text-fg",
                isNavigationItemCurrent(child.url, currentPath)
                  ? "bg-muted text-fg"
                  : "",
              )}
              href={child.url}
              key={child.id}
              target={child.target === "_blank" ? "_blank" : undefined}
              onClick={onNavigate}
            >
              {child.title}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

interface CategoriesBlockProps {
  className?: string;
  limit: number;
  parentId?: string;
  title: string;
  surfaceBorder?: "none" | "subtle" | "default" | "strong" | "dashed";
  surfacePadding?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  surfaceRadius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  surfaceShadow?: "none" | "sm" | "md";
  surfaceTone?: "transparent" | "bg" | "overlay" | "muted" | "subtle";
}

function CategoriesBlock(props: CategoriesBlockProps) {
  const {
    title,
    parentId,
    limit,
    surfaceTone,
    surfaceBorder,
    surfaceRadius,
    surfacePadding,
    surfaceShadow,
    className,
  } = props;
  const id = getPuckBlockDomId((props as { id?: string }).id);
  const selectedParentId = parseOptionalId(parentId);
  const categories = usePuckDynamicData()
    .categories.filter((category) =>
      selectedParentId ? category.parentId === selectedParentId : true,
    )
    .slice(0, limit);

  if (categories.length === 0) {
    return <EmptyDynamicState label="Không có danh mục để hiển thị." />;
  }

  return (
    <section
      id={id}
      className={twMerge(
        "space-y-4",
        getSurfaceClassName(
          {
            surfaceTone,
            surfaceBorder,
            surfaceRadius,
            surfacePadding,
            surfaceShadow,
          },
          "",
        ),
        className,
      )}
    >
      <Heading level={3} className="text-base font-bold text-fg">
        {title}
      </Heading>
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Link
            className={twMerge(
              "inline-flex min-h-9 items-center text-xs font-semibold text-fg hover:bg-muted/60",
              getSurfaceClassName(
                {
                  surfaceTone,
                  surfaceBorder,
                  surfaceRadius,
                  surfacePadding,
                  surfaceShadow,
                },
                "",
              ),
            )}
            href={`/${category.slug}`}
            key={category.id}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </section>
  );
}

interface PageLinksBlockProps {
  className?: string;
  limit: number;
  title: string;
  surfaceBorder?: "none" | "subtle" | "default" | "strong" | "dashed";
  surfacePadding?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  surfaceRadius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  surfaceShadow?: "none" | "sm" | "md";
  surfaceTone?: "transparent" | "bg" | "overlay" | "muted" | "subtle";
}

function PageLinksBlock(props: PageLinksBlockProps) {
  const {
    title,
    limit,
    surfaceTone,
    surfaceBorder,
    surfaceRadius,
    surfacePadding,
    surfaceShadow,
    className,
  } = props;
  const id = getPuckBlockDomId((props as { id?: string }).id);
  const pages = usePuckDynamicData().pages.slice(0, limit);

  if (pages.length === 0) {
    return <EmptyDynamicState label="Không có trang để hiển thị." />;
  }

  return (
    <section
      id={id}
      className={twMerge(
        "space-y-3",
        getSurfaceClassName(
          {
            surfaceTone,
            surfaceBorder,
            surfaceRadius,
            surfacePadding,
            surfaceShadow,
          },
          "",
        ),
        className,
      )}
    >
      <Heading level={3} className="text-base font-bold text-fg">
        {title}
      </Heading>
      <div className="grid gap-2">
        {pages.map((page) => (
          <Link
            className={twMerge(
              "px-3 py-2 text-sm font-semibold text-fg hover:bg-muted/60",
              getSurfaceClassName(
                {
                  surfaceTone,
                  surfaceBorder,
                  surfaceRadius,
                  surfacePadding,
                  surfaceShadow,
                },
                "",
              ),
            )}
            href={page.url}
            key={page.id}
          >
            {page.title}
          </Link>
        ))}
      </div>
    </section>
  );
}

// 1. LATEST POSTS BLOCK
export const LatestPostsComponentConfig: PageBuilderComponentConfig<"LatestPosts"> =
{
  label: "Tin tức mới nhất",
  defaultProps: {
    title: "Tin Tức & Hoạt Động Mới",
    limit: 3,
    categoryId: "all",
    layout: "grid",
    showCTA: true,
    surfaceTone: "transparent",
    surfaceBorder: "none",
    surfaceRadius: "none",
    surfacePadding: "none",
    surfaceShadow: "none",
    className: "",
  },
  fields: {
    ...puckSurfaceFields,
    title: { type: "text", label: "Tiêu đề khối" },
    limit: { type: "number", label: "Số lượng tin tức" },
    categoryId: {
      type: "text",
      label: "ID Danh mục (để trống nếu lấy tất cả)",
    },
    layout: {
      type: "select",
      label: "Kiểu bố cục",
      options: [
        { label: "Dạng lưới", value: "grid" },
        { label: "Dạng danh sách", value: "list" },
      ],
    },
    showCTA: {
      type: "radio",
      label: "Hiển thị nút 'Xem tất cả'",
      options: [
        { label: "Có", value: true },
        { label: "Không", value: false },
      ],
    },
    className: { type: "text", label: "Lớp CSS bổ sung" },
  },
  render: (props) => <LatestPostsBlock {...props} />,
};

// 2. LATEST ANNOUNCEMENTS BLOCK
export const LatestAnnouncementsComponentConfig: PageBuilderComponentConfig<"LatestAnnouncements"> =
{
  label: "Thông báo mới",
  defaultProps: {
    title: "Thông Báo Quan Trọng",
    limit: 3,
    layout: "list",
    showCTA: true,
    surfaceTone: "transparent",
    surfaceBorder: "none",
    surfaceRadius: "none",
    surfacePadding: "none",
    surfaceShadow: "none",
    className: "",
  },
  fields: {
    ...puckSurfaceFields,
    title: { type: "text", label: "Tiêu đề khối" },
    limit: { type: "number", label: "Số lượng thông báo" },
    layout: {
      type: "select",
      label: "Kiểu bố cục",
      options: [
        { label: "Dạng danh sách", value: "list" },
        { label: "Dạng lưới", value: "grid" },
      ],
    },
    showCTA: {
      type: "radio",
      label: "Hiển thị nút 'Xem tất cả'",
      options: [
        { label: "Có", value: true },
        { label: "Không", value: false },
      ],
    },
    className: { type: "text", label: "Lớp CSS bổ sung" },
  },
  render: (props) => <LatestAnnouncementsBlock {...props} />,
};

// 3. STAFF GRID BLOCK
export const StaffGridComponentConfig: PageBuilderComponentConfig<"StaffGrid"> =
{
  label: "Đội ngũ giảng viên",
  defaultProps: {
    title: "Đội Ngũ Cán Bộ Giảng Viên",
    limit: 3,
    departmentId: "all",
    surfaceTone: "transparent",
    surfaceBorder: "none",
    surfaceRadius: "none",
    surfacePadding: "none",
    surfaceShadow: "none",
    className: "",
  },
  fields: {
    ...puckSurfaceFields,
    title: { type: "text", label: "Tiêu đề khối" },
    limit: { type: "number", label: "Số lượng giảng viên tối đa" },
    departmentId: {
      type: "text",
      label: "ID Bộ môn (để trống nếu lấy tất cả)",
    },
    className: { type: "text", label: "Lớp CSS bổ sung" },
  },
  render: (props) => <StaffGridBlock {...props} />,
};

export const StaffProfileCardComponentConfig: PageBuilderComponentConfig<"StaffProfileCard"> =
{
  label: "Hồ sơ một cán bộ",
  defaultProps: {
    title: "",
    staffId: "",
    fallbackRole: "Cán bộ",
    showEmail: true,
    showPosition: true,
    surfaceTone: "transparent",
    surfaceBorder: "none",
    surfaceRadius: "none",
    surfacePadding: "none",
    surfaceShadow: "none",
    className: "",
  },
  fields: {
    ...puckSurfaceFields,
    title: { type: "text", label: "Tiêu đề phụ" },
    staffId: {
      type: "select",
      label: "Cán bộ",
      options: [{ label: "Chưa chọn cán bộ", value: "" }],
    },
    fallbackRole: { type: "text", label: "Chức danh dự phòng" },
    showEmail: {
      type: "radio",
      label: "Hiển thị email",
      options: [
        { label: "Có", value: true },
        { label: "Không", value: false },
      ],
    },
    showPosition: {
      type: "radio",
      label: "Hiển thị chức vụ",
      options: [
        { label: "Có", value: true },
        { label: "Không", value: false },
      ],
    },
    className: { type: "text", label: "Lớp CSS bổ sung" },
  },
  resolveFields: async (_data, { fields, lastFields }) => {
    const lastStaffField = lastFields.staffId;

    if (
      lastStaffField &&
      "options" in lastStaffField &&
      Array.isArray(lastStaffField.options) &&
      lastStaffField.options.length > 1
    ) {
      return lastFields;
    }

    const response = await fetch(layoutBuilderRoutes.sources.url("staff"), {
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return fields;
    }

    const payload = (await response.json()) as {
      data?: Array<{
        id: number;
        label: string;
        meta?: {
          position?: string | null;
        };
      }>;
    };

    return {
      ...fields,
      staffId: {
        type: "select",
        label: "Cán bộ",
        options: [
          { label: "Chưa chọn cán bộ", value: "" },
          ...(payload.data ?? []).map((item) => ({
            label: item.meta?.position
              ? `${item.label} (${item.meta.position})`
              : item.label,
            value: item.id.toString(),
          })),
        ],
      },
    };
  },
  render: (props) => <StaffProfileCardBlock {...props} />,
};

// 4. UNIT LIST BLOCK
export const UnitListComponentConfig: PageBuilderComponentConfig<"UnitList"> = {
  label: "Danh sách đơn vị",
  defaultProps: {
    title: "Các Bộ Môn Trực Thuộc Khoa",
    limit: 3,
    type: "academic",
    surfaceTone: "transparent",
    surfaceBorder: "none",
    surfaceRadius: "none",
    surfacePadding: "none",
    surfaceShadow: "none",
    className: "",
  },
  fields: {
    ...puckSurfaceFields,
    title: { type: "text", label: "Tiêu đề khối" },
    limit: { type: "number", label: "Số bộ môn tối đa" },
    type: { type: "text", label: "Loại đơn vị (để trống nếu lấy tất cả)" },
    className: { type: "text", label: "Lớp CSS bổ sung" },
  },
  render: (props) => <UnitListBlock {...props} />,
};

// 5. RELATED POSTS BLOCK
export const RelatedPostsComponentConfig: PageBuilderComponentConfig<"RelatedPosts"> =
{
  label: "Tin tức liên quan",
  defaultProps: {
    title: "Bài Viết Liên Quan",
    limit: 2,
    surfaceTone: "transparent",
    surfaceBorder: "none",
    surfaceRadius: "none",
    surfacePadding: "none",
    surfaceShadow: "none",
    className: "",
  },
  fields: {
    ...puckSurfaceFields,
    title: { type: "text", label: "Tiêu đề khối" },
    limit: { type: "number", label: "Số bài viết liên quan" },
    className: { type: "text", label: "Lớp CSS bổ sung" },
  },
  render: (props) => <RelatedPostsBlock {...props} />,
};

export const NavigationMenuComponentConfig: PageBuilderComponentConfig<"NavigationMenu"> =
{
  label: "Menu điều hướng",
  defaultProps: {
    title: "",
    menuId: "",
    mobileButtonLabel: "Mở menu",
    mobileLogoAlt: "FIT VMU",
    mobileLogoUrl: "/logo.png",
    mobilePanelTitle: "",
    layoutPreset: "default",
    fullWidthOnMobile: false,
    autoWidthFromMd: false,
    noShrinkFromMd: false,
    growFromMd: false,
    basisFromMd: "none",
    maxWidth: "default",
    textAlign: "left",
    textAlignFromLg: "inherit",
    positionFromLg: "inherit",
    orientation: "horizontal",
    surfaceTone: "transparent",
    surfaceBorder: "none",
    surfaceRadius: "none",
    surfacePadding: "none",
    surfaceShadow: "none",
    className: "",
  },
  fields: {
    ...puckSurfaceFields,
    title: { type: "text", label: "Tiêu đề phụ" },
    menuId: {
      type: "select",
      label: "Menu điều hướng",
      options: [{ label: "Chưa chọn menu điều hướng", value: "" }],
    },
    orientation: {
      type: "select",
      label: "Hướng hiển thị",
      options: [
        { label: "Ngang", value: "horizontal" },
        { label: "Dọc", value: "vertical" },
      ],
    },
    layoutPreset: {
      type: "select",
      label: "Bố cục sẵn",
      options: [
        { label: "Mặc định", value: "default" },
        { label: "Menu chính ở header", value: "headerPrimary" },
        { label: "Menu footer canh phải", value: "footerMenu" },
      ],
    },
    fullWidthOnMobile: {
      type: "radio",
      label: "Đầy chiều rộng trên mobile",
      options: [
        { label: "Có", value: true },
        { label: "Không", value: false },
      ],
    },
    autoWidthFromMd: {
      type: "radio",
      label: "Tự co chiều rộng từ tablet",
      options: [
        { label: "Có", value: true },
        { label: "Không", value: false },
      ],
    },
    noShrinkFromMd: {
      type: "radio",
      label: "Giữ kích thước từ tablet",
      options: [
        { label: "Có", value: true },
        { label: "Không", value: false },
      ],
    },
    growFromMd: {
      type: "radio",
      label: "Giãn ra từ tablet",
      options: [
        { label: "Có", value: true },
        { label: "Không", value: false },
      ],
    },
    basisFromMd: {
      type: "select",
      label: "Chiều rộng nền từ tablet",
      options: [
        { label: "Không đặt", value: "none" },
        { label: "Rộng (44rem)", value: "44rem" },
      ],
    },
    maxWidth: {
      type: "select",
      label: "Chiều rộng tối đa",
      options: [
        { label: "Mặc định", value: "default" },
        { label: "Không giới hạn", value: "none" },
        { label: "Nhỏ (sm)", value: "sm" },
      ],
    },
    textAlign: {
      type: "select",
      label: "Canh chữ trên mobile",
      options: [
        { label: "Trái", value: "left" },
        { label: "Giữa", value: "center" },
        { label: "Phải", value: "right" },
      ],
    },
    textAlignFromLg: {
      type: "select",
      label: "Canh chữ từ desktop",
      options: [
        { label: "Giữ như mobile", value: "inherit" },
        { label: "Trái", value: "left" },
        { label: "Giữa", value: "center" },
        { label: "Phải", value: "right" },
      ],
    },
    positionFromLg: {
      type: "select",
      label: "Vị trí khối từ desktop",
      options: [
        { label: "Giữ mặc định", value: "inherit" },
        { label: "Bám trái", value: "start" },
        { label: "Giữa", value: "center" },
        { label: "Bám phải", value: "end" },
      ],
    },
    mobileButtonLabel: { type: "text", label: "Nhãn trợ năng nút mobile" },
    mobileLogoUrl: { type: "text", label: "Logo trong menu mobile" },
    mobileLogoAlt: { type: "text", label: "Mô tả logo mobile" },
    mobilePanelTitle: { type: "text", label: "Tiêu đề nhỏ trong menu mobile" },
    className: { type: "text", label: "Lớp CSS bổ sung" },
  },
  resolveFields: async (_data, { fields, lastFields }) => {
    const lastMenuField = lastFields.menuId;

    if (
      lastMenuField &&
      "options" in lastMenuField &&
      Array.isArray(lastMenuField.options) &&
      lastMenuField.options.length > 1
    ) {
      return lastFields;
    }

    const response = await fetch(
      layoutBuilderRoutes.sources.url("navigation-menus"),
      {
        credentials: "same-origin",
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      return fields;
    }

    const payload = (await response.json()) as {
      data?: Array<{
        id: number;
        label: string;
        meta?: {
          location?: string | null;
        };
      }>;
    };

    return {
      ...fields,
      menuId: {
        type: "select",
        label: "Menu điều hướng",
        options: [
          { label: "Chưa chọn menu điều hướng", value: "" },
          ...(payload.data ?? []).map((item) => ({
            label: item.meta?.location
              ? `${item.label} (${item.meta.location})`
              : item.label,
            value: item.id.toString(),
          })),
        ],
      },
    };
  },
  render: (props) => <NavigationMenuBlock {...props} />,
};

function NavigationMenuEntry({
  currentPath,
  item,
  orientation,
}: {
  currentPath: string;
  item: PuckDynamicNavigationItem;
  orientation?: string;
}) {
  const isEditorPreview = isPuckEditorPreview();
  const isVertical = orientation === "vertical";
  const isCurrent = isNavigationBranchCurrent(item, currentPath);
  const hasChildren = item.children.length > 0;

  if (isEditorPreview) {
    return (
      <div
        className={twMerge(
          "flex flex-col gap-2",
          isVertical ? "w-full" : "w-auto min-w-0",
        )}
      >
        <div
          className={twMerge(
            "inline-flex min-h-10 items-center rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap",
            isCurrent ? "bg-secondary/50 text-fg" : "text-fg",
            isVertical ? "w-full justify-start" : "w-auto justify-center",
          )}
        >
          {item.title}
        </div>
        {hasChildren ? (
          <div className="flex flex-col gap-1 ps-3">
            {item.children.map((child) => (
              <Link
                className={twMerge(
                  "rounded-lg px-3 py-2 text-xs font-medium",
                  isNavigationItemCurrent(child.url, currentPath)
                    ? "bg-muted text-fg"
                    : "text-muted-fg",
                )}
                href={child.url}
                key={child.id}
                target={child.target === "_blank" ? "_blank" : undefined}
              >
                {child.title}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <NavbarMenu
      className={twMerge(
        "group/menu-item",
        isVertical ? "w-full" : "flex w-auto max-w-full flex-col",
      )}
      delayCloseMs={isVertical ? 0 : 150}
    >
      <NavbarItem
        className={twMerge(
          "min-h-10 whitespace-nowrap",
          isVertical ? "w-full justify-start" : "w-auto justify-center",
        )}
        href={item.url}
        isCurrent={isCurrent}
        target={item.target === "_blank" ? "_blank" : undefined}
      >
        {item.title}
      </NavbarItem>
      {hasChildren ? (
        <NavbarSubmenu
          className={twMerge(
            isVertical
              ? "md:static md:min-w-0 md:border-0 md:bg-transparent md:p-0 md:shadow-none md:ring-0"
              : "",
          )}
        >
          {item.children.map((child) => (
            <Link
              className={twMerge(
                "rounded-lg px-3 py-2 text-xs font-medium transition",
                isNavigationItemCurrent(child.url, currentPath)
                  ? "bg-muted text-fg"
                  : "text-muted-fg hover:bg-muted/60 hover:text-fg",
              )}
              href={child.url}
              key={child.id}
              target={child.target === "_blank" ? "_blank" : undefined}
            >
              {child.title}
            </Link>
          ))}
        </NavbarSubmenu>
      ) : null}
    </NavbarMenu>
  );
}

function isNavigationBranchCurrent(
  item: PuckDynamicNavigationItem,
  currentPath: string,
): boolean {
  return (
    isNavigationItemCurrent(item.url, currentPath) ||
    item.children.some((child) =>
      isNavigationItemCurrent(child.url, currentPath),
    )
  );
}

function isNavigationItemCurrent(
  itemUrl: string,
  currentPath: string,
): boolean {
  const normalizedCurrentPath = normalizeNavigationPath(currentPath);
  const normalizedItemPath = normalizeNavigationPath(itemUrl);

  if (!normalizedCurrentPath || !normalizedItemPath) {
    return false;
  }

  if (normalizedItemPath === "/") {
    return normalizedCurrentPath === "/";
  }

  return (
    normalizedCurrentPath === normalizedItemPath ||
    normalizedCurrentPath.startsWith(`${normalizedItemPath}/`)
  );
}

function normalizeNavigationPath(value: string): string {
  try {
    const url = value.startsWith("http")
      ? new URL(value)
      : new URL(value, "https://fit-vmu.local");
    const pathname = url.pathname.replace(/\/+$/, "");

    return pathname === "" ? "/" : pathname;
  } catch {
    return value.replace(/\/+$/, "") || "/";
  }
}

export const CategoriesComponentConfig: PageBuilderComponentConfig<"Categories"> =
{
  label: "Danh mục bài viết",
  defaultProps: {
    title: "Danh mục",
    parentId: "",
    limit: 8,
    surfaceTone: "transparent",
    surfaceBorder: "none",
    surfaceRadius: "none",
    surfacePadding: "none",
    surfaceShadow: "none",
    className: "",
  },
  fields: {
    ...puckSurfaceFields,
    title: { type: "text", label: "Tiêu đề khối" },
    parentId: { type: "text", label: "ID danh mục cha (tùy chọn)" },
    limit: { type: "number", label: "Số danh mục tối đa" },
    className: { type: "text", label: "Lớp CSS bổ sung" },
  },
  render: (props) => <CategoriesBlock {...props} />,
};

export const PageLinksComponentConfig: PageBuilderComponentConfig<"PageLinks"> =
{
  label: "Liên kết trang",
  defaultProps: {
    title: "Trang liên quan",
    limit: 8,
    surfaceTone: "transparent",
    surfaceBorder: "none",
    surfaceRadius: "none",
    surfacePadding: "none",
    surfaceShadow: "none",
    className: "",
  },
  fields: {
    ...puckSurfaceFields,
    title: { type: "text", label: "Tiêu đề khối" },
    limit: { type: "number", label: "Số trang tối đa" },
    className: { type: "text", label: "Lớp CSS bổ sung" },
  },
  render: (props) => <PageLinksBlock {...props} />,
};

export const LinkListComponentConfig: PageBuilderComponentConfig<"LinkList"> = {
  label: "Danh sách link tùy chỉnh",
  defaultProps: {
    title: "Liên kết nhanh",
    links: [
      {
        label: "Website VMU",
        url: "https://vimaru.edu.vn",
        openInNewTab: true,
      },
    ],
    surfaceTone: "transparent",
    surfaceBorder: "none",
    surfaceRadius: "none",
    surfacePadding: "none",
    surfaceShadow: "none",
    className: "",
  },
  fields: {
    ...puckSurfaceFields,
    title: { type: "text", label: "Tiêu đề khối" },
    links: {
      type: "array",
      label: "Danh sách link",
      arrayFields: {
        label: { type: "text", label: "Nhãn" },
        url: { type: "text", label: "URL" },
        openInNewTab: {
          type: "radio",
          label: "Mở tab mới",
          options: [
            { label: "Có", value: true },
            { label: "Không", value: false },
          ],
        },
      },
    },
    className: { type: "text", label: "Lớp CSS bổ sung" },
  },
  render: (props) => {
    const {
      title,
      links,
      surfaceTone,
      surfaceBorder,
      surfaceRadius,
      surfacePadding,
      surfaceShadow,
      className,
    } = props;
    const id = getPuckBlockDomId((props as { id?: string }).id);

    return (
      <section
        id={id}
        className={twMerge(
          "space-y-3",
          getSurfaceClassName(
            {
              surfaceTone,
              surfaceBorder,
              surfaceRadius,
              surfacePadding,
              surfaceShadow,
            },
            "",
          ),
          className,
        )}
      >
        <Heading level={3} className="text-base font-bold text-fg">
          {title}
        </Heading>
        <div className="grid gap-2">
          {(links ?? []).map((link, index) => (
            <Link
              className="text-sm font-semibold text-muted-fg hover:text-fg"
              href={link.url || "#"}
              key={`${link.label}-${index}`}
              target={link.openInNewTab ? "_blank" : undefined}
            >
              {link.label || link.url}
            </Link>
          ))}
        </div>
      </section>
    );
  },
};

export const ContactInfoComponentConfig: PageBuilderComponentConfig<"ContactInfo"> =
{
  label: "Thông tin liên hệ",
  defaultProps: {
    title: "Liên hệ",
    address: "",
    phone: "",
    email: "",
    layoutPreset: "default",
    maxWidth: "default",
    textAlign: "left",
    textAlignFromLg: "inherit",
    positionFromLg: "inherit",
    surfaceTone: "transparent",
    surfaceBorder: "none",
    surfaceRadius: "none",
    surfacePadding: "none",
    surfaceShadow: "none",
    className: "",
  },
  fields: {
    ...puckSurfaceFields,
    title: { type: "text", label: "Tiêu đề" },
    address: { type: "textarea", label: "Địa chỉ" },
    phone: { type: "text", label: "Số điện thoại" },
    email: { type: "text", label: "Email" },
    layoutPreset: {
      type: "select",
      label: "Bố cục sẵn",
      options: [
        { label: "Mặc định", value: "default" },
        { label: "Khối liên hệ footer", value: "footerContact" },
      ],
    },
    maxWidth: {
      type: "select",
      label: "Chiều rộng tối đa",
      options: [
        { label: "Mặc định", value: "default" },
        { label: "Nhỏ (sm)", value: "sm" },
      ],
    },
    textAlign: {
      type: "select",
      label: "Canh chữ trên mobile",
      options: [
        { label: "Trái", value: "left" },
        { label: "Giữa", value: "center" },
        { label: "Phải", value: "right" },
      ],
    },
    textAlignFromLg: {
      type: "select",
      label: "Canh chữ từ desktop",
      options: [
        { label: "Giữ như mobile", value: "inherit" },
        { label: "Trái", value: "left" },
        { label: "Giữa", value: "center" },
        { label: "Phải", value: "right" },
      ],
    },
    positionFromLg: {
      type: "select",
      label: "Vị trí khối từ desktop",
      options: [
        { label: "Giữ mặc định", value: "inherit" },
        { label: "Bám trái", value: "start" },
        { label: "Giữa", value: "center" },
        { label: "Bám phải", value: "end" },
      ],
    },
    className: { type: "text", label: "Lớp CSS bổ sung" },
  },
  render: (props) => {
    const {
      title,
      address,
      phone,
      email,
      layoutPreset,
      maxWidth,
      textAlign,
      textAlignFromLg,
      positionFromLg,
      surfaceTone,
      surfaceBorder,
      surfaceRadius,
      surfacePadding,
      surfaceShadow,
      className,
    } = props;
    const id = getPuckBlockDomId((props as { id?: string }).id);
    const layoutClassName = twMerge(
      getBlockLayoutPresetClass(layoutPreset),
      getResponsiveMaxWidthClass(maxWidth),
      getResponsiveTextAlignClass(textAlign),
      textAlignFromLg === "inherit"
        ? ""
        : getResponsiveTextAlignClass(textAlignFromLg, "lg"),
      positionFromLg === "inherit"
        ? ""
        : getResponsivePositionClass(positionFromLg, "lg"),
    );

    return (
      <section
        id={id}
        className={twMerge(
          "space-y-3 text-sm",
          getSurfaceClassName(
            {
              surfaceTone,
              surfaceBorder,
              surfaceRadius,
              surfacePadding,
              surfaceShadow,
            },
            "",
          ),
          layoutClassName,
          className,
        )}
      >
        <Heading level={3} className="text-base font-bold text-fg">
          {title}
        </Heading>
        <div className="space-y-2 text-muted-fg">
          {address ? <p className="whitespace-pre-line">{address}</p> : null}
          {phone ? <p>Điện thoại: {phone}</p> : null}
          {email ? (
            <p>
              Email:{" "}
              <Link className="text-primary" href={`mailto:${email}`}>
                {email}
              </Link>
            </p>
          ) : null}
        </div>
      </section>
    );
  },
};
