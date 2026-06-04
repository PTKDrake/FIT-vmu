import { usePage } from "@inertiajs/react";
import { twMerge } from "tailwind-merge";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { NavbarItem, NavbarMenu, NavbarSubmenu } from "@/components/ui/navbar";
import { Text } from "@/components/ui/text";
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
  title: string;
}

interface PuckDynamicCategory {
  description: string | null;
  id: number;
  name: string;
  parentId: number | null;
  slug: string;
}

interface PuckDynamicStaff {
  avatarUrl: string | null;
  email: string | null;
  expertise: string | null;
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

interface PuckDynamicData {
  categories: PuckDynamicCategory[];
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

function EmptyDynamicState({ label }: { label: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border/80 p-8 text-center text-sm text-muted-fg">
      {label}
    </div>
  );
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
          <Card
            key={post.id}
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
          <div
            key={ann.id}
            className={twMerge(
              "group relative flex items-start gap-4 transition hover:bg-overlay hover:border-primary/20 hover:shadow-xs",
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
          </div>
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
            <CardContent className="p-6 space-y-4 flex flex-col items-center text-center">
              <Avatar
                src={st.avatarUrl ?? ""}
                alt={st.name}
                initials={st.name.split(" ").pop()?.substring(0, 2)}
                size="xl"
                className="shadow-xs group-hover:scale-105 transition duration-300"
              />
              <div className="space-y-1">
                <Heading
                  level={3}
                  className="text-base font-bold text-fg group-hover:text-primary transition-colors"
                >
                  {st.name}
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
          <Card
            key={post.id}
            className={twMerge(
              "py-0 shadow-none hover:shadow-md transition-shadow group flex flex-col justify-between",
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
        ))}
      </div>
    </section>
  );
}

interface NavigationMenuBlockProps {
  className?: string;
  menuId?: string;
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
      {title ? (
        <Heading level={3} className="text-sm font-bold text-fg">
          {title}
        </Heading>
      ) : null}
      <nav
        aria-label={menu.name}
        className="w-full"
      >
        <div
          className={twMerge(
            "flex justify-between",
            orientation === "vertical"
              ? "flex-col items-stretch"
              : "flex-wrap items-center",
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
            href={`/post-categories/${category.slug}`}
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
          isVertical ? "w-full" : "min-w-0",
        )}
      >
        <div
          className={twMerge(
            "inline-flex min-h-10 items-center rounded-md px-4 py-2 text-sm font-medium",
            isCurrent ? "bg-secondary/50 text-fg" : "text-fg",
            isVertical ? "w-full justify-start" : "w-full md:w-auto",
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
        isVertical ? "w-full" : "flex max-w-full flex-col",
      )}
      delayCloseMs={isVertical ? 0 : 150}
    >
      <NavbarItem
        className={twMerge(
          "min-h-10",
          isVertical ? "w-full justify-start" : "w-full md:w-auto",
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
    className: { type: "text", label: "Lớp CSS bổ sung" },
  },
  render: (props) => {
    const {
      title,
      address,
      phone,
      email,
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
