import { twMerge } from "tailwind-merge";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import { getPuckBlockDomId } from "../shared";
import { getSurfaceClassName, puckSurfaceFields } from "../surface";
import type { PageBuilderComponentConfig } from "../types";
import {
  EmptyDynamicState,
  buildStaffFieldOptions,
  parseOptionalId,
  staffDisplayName,
  usePuckDynamicData,
} from "./shared";

interface SurfaceProps {
  className?: string;
  surfaceBorder?: "none" | "subtle" | "default" | "strong" | "dashed";
  surfacePadding?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  surfaceRadius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  surfaceShadow?: "none" | "sm" | "md";
  surfaceTone?: "transparent" | "bg" | "overlay" | "muted" | "subtle";
}

interface LatestPostsBlockProps extends SurfaceProps {
  categoryId?: string;
  layout?: string;
  limit: number;
  showCTA?: boolean;
  title: string;
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
          <Link key={post.id} href={post.url ?? "#"} className="block">
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

      {showCTA ? (
        <div className="flex justify-center pt-2">
          <Link
            href="/posts"
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-border bg-bg px-5 py-2 text-xs font-semibold text-fg hover:bg-secondary transition"
          >
            Xem tất cả tin tức
          </Link>
        </div>
      ) : null}
    </section>
  );
}

interface LatestAnnouncementsBlockProps extends SurfaceProps {
  layout?: string;
  limit: number;
  showCTA?: boolean;
  title: string;
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
        {announcements.map((announcement) => (
          <Link
            key={announcement.id}
            href={announcement.url ?? "#"}
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
              {(announcement.categoryNames[0] ?? "TB").substring(0, 2)}
            </div>
            <div className="space-y-1 flex-1">
              <Heading
                level={3}
                className="text-sm font-bold text-fg group-hover:text-primary transition-colors leading-snug"
              >
                {announcement.title}
              </Heading>
              <div className="flex items-center gap-3 text-[10px] text-muted-fg font-medium">
                <span>{announcement.date ?? "Chưa có ngày"}</span>
                <span>•</span>
                <span>{announcement.categoryNames[0] ?? "Thông báo"}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {showCTA ? (
        <div className="flex justify-center pt-2">
          <Link
            href="/announcements"
            className="inline-flex min-h-10 items-center justify-center rounded-full border border-border bg-bg px-5 py-2 text-xs font-semibold text-fg hover:bg-secondary transition"
          >
            Xem tất cả thông báo
          </Link>
        </div>
      ) : null}
    </section>
  );
}

interface StaffGridBlockProps extends SurfaceProps {
  departmentId?: string;
  limit: number;
  title: string;
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
        {staff.map((record) => (
          <Card
            key={record.id}
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
                src={record.avatarUrl ?? ""}
                alt={staffDisplayName(record)}
                initials={record.fullName.split(" ").pop()?.substring(0, 2)}
                size="xl"
                className="shadow-xs group-hover:scale-105 transition duration-300"
              />
              <div className="space-y-1">
                <Heading
                  level={3}
                  className="text-base font-bold text-fg group-hover:text-primary transition-colors"
                >
                  {staffDisplayName(record)}
                </Heading>
                <Text className="text-xs font-bold text-primary uppercase tracking-wider text-[10px]">
                  {record.position ?? "Cán bộ"}
                </Text>
                <Text className="text-xs text-muted-fg leading-relaxed">
                  {record.expertise ? `Đơn vị: ${record.expertise}` : record.phone}
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
                <span>{record.email ?? "Chưa có email"}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

interface StaffProfileCardBlockProps extends SurfaceProps {
  fallbackRole?: string;
  showEmail?: boolean;
  showPosition?: boolean;
  staffId?: string;
  title?: string;
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

interface UnitListBlockProps extends SurfaceProps {
  limit: number;
  title: string;
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
        {units.map((unit) => (
          <Card
            key={unit.id}
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
                    {unit.name}
                  </Heading>
                  {unit.head ? (
                    <span className="text-[10px] text-muted-fg font-medium">
                      Phụ trách: {unit.head}
                    </span>
                  ) : null}
                </div>
              </div>
              <Text className="text-xs/relaxed text-muted-fg leading-relaxed">
                {unit.description ?? "Chưa có mô tả công khai."}
              </Text>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

interface RelatedPostsBlockProps extends SurfaceProps {
  limit: number;
  title: string;
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
          <Link key={post.id} href={post.url ?? "#"} className="block">
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

interface CategoriesBlockProps extends SurfaceProps {
  limit: number;
  parentId?: string;
  title: string;
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

interface PageLinksBlockProps extends SurfaceProps {
  limit: number;
  title: string;
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

      const options = await buildStaffFieldOptions("Chưa chọn cán bộ");

      if (options === null) {
        return fields;
      }

      return {
        ...fields,
        staffId: {
          type: "select",
          label: "Cán bộ",
          options,
        },
      };
    },
    render: (props) => <StaffProfileCardBlock {...props} />,
  };

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
