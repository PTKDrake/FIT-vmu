import { useState } from "react";
import { usePage } from "@inertiajs/react";
import { twMerge } from "tailwind-merge";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Eye,
  FileText,
  Folder,
  ArrowRight,
} from "lucide-react";
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
  buildCategoryFieldOptions,
  parseOptionalId,
  staffDisplayName,
  usePuckDynamicData,
} from "./shared";

// Reusable Accordion Widget for Sidebar
function AccordionWidget({
  title,
  icon: Icon,
  defaultOpen = false,
  children,
  showCTA,
  ctaLink,
  ctaText,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  defaultOpen?: boolean;
  children: React.ReactNode;
  showCTA?: boolean;
  ctaLink?: string;
  ctaText?: string;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="w-full rounded-2xl border border-border/60 bg-overlay shadow-xs overflow-hidden">
      {/* Mobile Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex lg:hidden w-full items-center justify-between p-4 font-bold text-fg select-none active:bg-muted/10 transition"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
            <Icon className="size-5" />
          </span>
          <span className="text-base font-bold text-fg leading-none">
            {title}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="size-5 text-muted-fg" />
        ) : (
          <ChevronDown className="size-5 text-muted-fg" />
        )}
      </button>

      {/* Desktop Heading (Non-clickable) */}
      <div className="hidden lg:flex w-full items-center justify-between p-5 border-b border-border/40 pb-3">
        <h3 className="text-base font-bold text-fg uppercase tracking-wide">
          {title}
        </h3>
      </div>

      {/* Accordion Content */}
      <div
        className={twMerge(
          "px-4 pb-4 lg:px-5 lg:pb-5 lg:pt-4 lg:block",
          isOpen ? "block" : "hidden",
        )}
      >
        {/* Divider on mobile when expanded */}
        <div className="border-t border-border/45 mb-4 lg:hidden" />

        {children}

        {showCTA && ctaLink && (
          <div className="flex justify-center pt-4 border-t border-border/40 mt-4">
            <Link
              href={ctaLink}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-subtle-fg transition-colors"
            >
              <span>{ctaText || "Xem tất cả"}</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

const MOCK_RELATED_POSTS = [
  {
    id: 1,
    title: "Sinh viên CNTT đạt giải vàng cuộc thi Hackathon",
    slug: "sinh-vien-cntt-dat-giai-vang-hackathon",
    url: "#",
    excerpt:
      "Sáng kiến xuất sắc của các bạn sinh viên đã xuất sắc vượt qua hơn 50 đội thi toàn quốc.",
    date: "14/12/2024",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
    categoryNames: ["Hoạt động sinh viên"],
  },
  {
    id: 2,
    title: "Hợp tác doanh nghiệp về đào tạo AI",
    slug: "hop-tac-doanh-nghiep-ai",
    url: "#",
    excerpt:
      "Khoa CNTT ký kết hợp tác chiến lược cùng doanh nghiệp nhằm xây dựng lab đào tạo AI.",
    date: "10/12/2024",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=600&q=80",
    categoryNames: ["Hợp tác đối ngoại"],
  },
  {
    id: 3,
    title: "Workshop: Ứng dụng AI trong phát triển phần mềm",
    slug: "workshop-ai-phat-trien-phan-mem",
    url: "#",
    excerpt:
      "Buổi chia sẻ thực chiến thu hút đông đảo sinh viên và các kỹ sư phần mềm tham dự.",
    date: "05/12/2024",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80",
    categoryNames: ["Hội thảo khoa học"],
  },
  {
    id: 4,
    title: "Sinh viên CNTT tham gia Ngày hội việc làm 2024",
    slug: "sinh-vien-cntt-ngay-hoi-viec-lam-2024",
    url: "#",
    excerpt:
      "Cơ hội tuyển dụng trực tiếp từ hơn 30 tập đoàn công nghệ lớn tại Việt Nam.",
    date: "28/11/2024",
    thumbnailUrl:
      "https://images.unsplash.com/photo-1521791136368-1a9b7d89136d?auto=format&fit=crop&w=600&q=80",
    categoryNames: ["Tuyển dụng"],
  },
];

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
  includedCategories?: Array<{ categoryId?: string }>;
  excludedCategories?: Array<{ categoryId?: string }>;
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
    includedCategories = [],
    excludedCategories = [],
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

  const includedCategoryIds = selectedCategoryId
    ? [selectedCategoryId]
    : Array.from(
        new Set(
          includedCategories
            .map((item) => parseOptionalId(item.categoryId))
            .filter((id): id is number => id !== null),
        ),
      );
  const excludedCategoryIds = Array.from(
    new Set(
      excludedCategories
        .map((item) => parseOptionalId(item.categoryId))
        .filter((id): id is number => id !== null),
    ),
  );

  const posts = dynamicData.posts
    .filter((post) =>
      includedCategoryIds.length > 0
        ? post.categoryIds.some((id) => includedCategoryIds.includes(id))
        : true,
    )
    .filter(
      (post) =>
        !post.categoryIds.some((id) => excludedCategoryIds.includes(id)),
    )
    .slice(0, limit);

  if (posts.length === 0) {
    return <EmptyDynamicState label="Không có tin tức nào để hiển thị." />;
  }

  if (layout === "sidebar") {
    return (
      <div id={id} className={className}>
        <AccordionWidget
          title={title}
          icon={FileText}
          defaultOpen={true}
          showCTA={showCTA}
          ctaLink="/posts"
          ctaText="Xem tất cả"
        >
          <div className="divide-y divide-border/40">
            {posts.map((post) => {
              const views = post.id
                ? ((post.id * 143 + 321) % 4000) + 150
                : 1250;
              const formattedViews =
                views.toLocaleString("vi-VN") + " lượt xem";
              return (
                <Link
                  key={post.id}
                  href={post.url ?? "#"}
                  className="flex items-start gap-3 py-3 first:pt-0 last:pb-0 group"
                >
                  {post.thumbnailUrl ? (
                    <div className="w-20 aspect-video shrink-0 overflow-hidden rounded-lg border border-border/50 bg-muted/10">
                      <img
                        src={post.thumbnailUrl}
                        alt={post.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                  ) : null}
                  <div className="min-w-0 flex-1 space-y-1">
                    <Heading
                      level={4}
                      className="text-xs sm:text-sm font-bold text-fg group-hover:text-primary transition-colors leading-snug line-clamp-2"
                    >
                      {post.title}
                    </Heading>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-muted-fg font-medium">
                      <div className="flex items-center gap-1 shrink-0">
                        <Calendar className="size-3 text-muted-fg/75" />
                        <span>{post.date}</span>
                      </div>
                      <span className="hidden sm:inline text-border">|</span>
                      <div className="flex items-center gap-1 shrink-0">
                        <Eye className="size-3 text-muted-fg/75" />
                        <span>{formattedViews}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </AccordionWidget>
      </div>
    );
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
                  {record.expertise
                    ? `Đơn vị: ${record.expertise}`
                    : record.phone}
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
  const pageProps = usePage<any>().props;

  // Try page props first (relatedPosts is array), then dynamicData.posts, then MOCK_RELATED_POSTS
  const posts =
    pageProps.relatedPosts ||
    pageProps.dynamicData?.posts ||
    MOCK_RELATED_POSTS;

  const displayPosts = posts.slice(0, limit);

  if (displayPosts.length === 0) {
    return <EmptyDynamicState label="Không có tin liên quan để hiển thị." />;
  }

  return (
    <section
      className={twMerge(
        "space-y-6 py-6 w-full relative select-none",
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
      {/* Header: Indicia and Title & View All */}
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <Heading
          level={2}
          className="text-xl md:text-2xl font-extrabold text-fg tracking-tight"
        >
          {title}
        </Heading>
        <Link
          href="/posts"
          className="text-sm font-bold text-primary hover:text-primary-subtle-fg transition-colors flex items-center gap-1.5"
        >
          <span>Xem tất cả</span>
          <ArrowRight className="size-4" />
        </Link>
      </div>

      {/* Grid for PC */}
      <div className="hidden md:grid gap-6 md:grid-cols-2 lg:grid-cols-4 w-full">
        {displayPosts.map((post: any) => {
          const views = post.id ? ((post.id * 143 + 321) % 4000) + 150 : 1250;
          const formattedViews = views.toLocaleString("vi-VN") + " lượt xem";
          return (
            <Link key={post.id} href={post.url ?? "#"} className="block group">
              <Card className="overflow-hidden py-0 transition duration-300 hover:shadow-md hover:border-primary/15 flex flex-col h-full cursor-pointer bg-overlay">
                {post.thumbnailUrl ? (
                  <div className="aspect-video w-full overflow-hidden border-b border-border/30">
                    <img
                      src={post.thumbnailUrl}
                      alt={post.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ) : null}
                <CardContent className="p-4 flex-1 flex flex-col justify-between gap-4">
                  <Heading
                    level={3}
                    className="text-sm font-bold text-fg group-hover:text-primary transition-colors leading-snug line-clamp-2"
                  >
                    {post.title}
                  </Heading>
                  <div className="flex items-center justify-between text-[10px] text-muted-fg font-semibold pt-2 border-t border-border/30">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3 text-muted-fg/75" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="size-3 text-muted-fg/75" />
                      {formattedViews}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Mobile: Swipable slider/carousel with dot pagination */}
      <div className="block md:hidden w-full space-y-4">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-2">
          {displayPosts.map((post: any) => {
            const views = post.id ? ((post.id * 143 + 321) % 4000) + 150 : 1250;
            const formattedViews = views.toLocaleString("vi-VN") + " lượt xem";
            return (
              <Link
                key={post.id}
                href={post.url ?? "#"}
                className="w-[85vw] sm:w-[60vw] shrink-0 snap-center snap-always block"
              >
                <Card className="overflow-hidden py-0 flex flex-col h-full bg-overlay">
                  {post.thumbnailUrl ? (
                    <div className="aspect-video w-full overflow-hidden border-b border-border/30">
                      <img
                        src={post.thumbnailUrl}
                        alt={post.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : null}
                  <CardContent className="p-4 flex-1 flex flex-col justify-between gap-3">
                    <Heading
                      level={3}
                      className="text-sm font-bold text-fg leading-snug"
                    >
                      {post.title}
                    </Heading>
                    <div className="flex items-center justify-between text-[10px] text-muted-fg font-semibold pt-2 border-t border-border/30">
                      <span className="flex items-center gap-1">
                        <Calendar className="size-3" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="size-3" />
                        {formattedViews}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="flex justify-center gap-1.5 pt-2">
          {displayPosts.map((_: any, index: number) => (
            <div
              key={index}
              className={twMerge(
                "size-2 rounded-full transition-all duration-300",
                index === 0 ? "bg-primary w-4" : "bg-border",
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface CategoriesBlockProps extends SurfaceProps {
  layout?: string;
  limit: number;
  parentId?: string;
  title: string;
  includedCategories?: Array<{ categoryId?: string }>;
  excludedCategories?: Array<{ categoryId?: string }>;
}

function CategoriesBlock(props: CategoriesBlockProps) {
  const {
    title,
    parentId,
    limit,
    layout = "tags",
    includedCategories = [],
    excludedCategories = [],
    surfaceTone,
    surfaceBorder,
    surfaceRadius,
    surfacePadding,
    surfaceShadow,
    className,
  } = props;
  const id = getPuckBlockDomId((props as { id?: string }).id);
  const selectedParentId = parseOptionalId(parentId);

  const includedIds = Array.from(
    new Set(
      includedCategories
        .map((item) => parseOptionalId(item.categoryId))
        .filter((id): id is number => id !== null),
    ),
  );
  const excludedIds = Array.from(
    new Set(
      excludedCategories
        .map((item) => parseOptionalId(item.categoryId))
        .filter((id): id is number => id !== null),
    ),
  );

  const categories = usePuckDynamicData()
    .categories.filter((category) =>
      selectedParentId ? category.parentId === selectedParentId : true,
    )
    .filter((category) =>
      includedIds.length > 0 ? includedIds.includes(category.id) : true,
    )
    .filter((category) => !excludedIds.includes(category.id))
    .slice(0, limit);

  if (categories.length === 0) {
    return <EmptyDynamicState label="Không có danh mục để hiển thị." />;
  }

  if (layout === "sidebar") {
    return (
      <div id={id} className={className}>
        <AccordionWidget
          title={title}
          icon={Folder}
          defaultOpen={false}
          showCTA={true}
          ctaLink="/posts"
          ctaText="Xem tất cả"
        >
          <div className="divide-y divide-border/30">
            {categories.map((category) => {
              const count = category.postCount ?? 0;
              return (
                <Link
                  key={category.id}
                  href={`/${category.slug}`}
                  className="flex items-center justify-between py-2.5 first:pt-0 last:pb-0 text-sm font-semibold text-muted-fg hover:text-primary transition-colors group"
                >
                  <span className="truncate group-hover:translate-x-0.5 transition-transform duration-200">
                    {category.name}
                  </span>
                  <span className="text-xs text-muted-fg bg-muted/30 px-2 py-0.5 rounded-md border border-border/40 shrink-0">
                    {count}
                  </span>
                </Link>
              );
            })}
          </div>
        </AccordionWidget>
      </div>
    );
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

export const LatestPostsComponentConfig: PageBuilderComponentConfig<"PostFeed"> =
  {
    label: "Tin tức mới nhất",
    defaultProps: {
      title: "Tin Tức & Hoạt Động Mới",
      limit: 3,
      categoryId: "all",
      includedCategories: [],
      excludedCategories: [],
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
        label: "ID Danh mục gốc (để trống nếu lấy tất cả)",
      },
      layout: {
        type: "select",
        label: "Kiểu bố cục",
        options: [
          { label: "Dạng lưới", value: "grid" },
          { label: "Dạng danh sách", value: "list" },
          { label: "Dạng Sidebar", value: "sidebar" },
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
      includedCategories: {
        type: "array",
        label: "Chỉ lấy từ danh mục",
        defaultItemProps: { categoryId: "" },
        getItemSummary: (item) => item.categoryId || "Danh mục",
        arrayFields: {
          categoryId: {
            type: "select",
            label: "Danh mục",
            options: [{ label: "Chọn danh mục", value: "" }],
          },
        },
      },
      excludedCategories: {
        type: "array",
        label: "Loại trừ danh mục",
        defaultItemProps: { categoryId: "" },
        getItemSummary: (item) => item.categoryId || "Danh mục",
        arrayFields: {
          categoryId: {
            type: "select",
            label: "Danh mục",
            options: [{ label: "Chọn danh mục", value: "" }],
          },
        },
      },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    resolveFields: async (_data, { fields, lastFields }) => {
      const lastIncludedCategoriesField = lastFields.includedCategories;
      const lastExcludedCategoriesField = lastFields.excludedCategories;

      if (
        hasCategoryOptions(lastIncludedCategoriesField) &&
        hasCategoryOptions(lastExcludedCategoriesField)
      ) {
        return lastFields;
      }

      const options = await buildCategoryFieldOptions("Chọn danh mục");

      if (options === null) {
        return fields;
      }

      return {
        ...fields,
        includedCategories: {
          type: "array",
          label: "Chỉ lấy từ danh mục",
          defaultItemProps: { categoryId: "" },
          getItemSummary: (item) => item.categoryId || "Danh mục",
          arrayFields: {
            categoryId: {
              type: "select",
              label: "Danh mục",
              options,
            },
          },
        },
        excludedCategories: {
          type: "array",
          label: "Loại trừ danh mục",
          defaultItemProps: { categoryId: "" },
          getItemSummary: (item) => item.categoryId || "Danh mục",
          arrayFields: {
            categoryId: {
              type: "select",
              label: "Danh mục",
              options,
            },
          },
        },
      };
    },
    render: (props) => <LatestPostsBlock {...props} />,
  };

export const LatestAnnouncementsComponentConfig: PageBuilderComponentConfig<"AnnouncementFeed"> =
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

export const RelatedPostsComponentConfig: PageBuilderComponentConfig<"RelatedPostFeed"> =
  {
    label: "Tin tức liên quan",
    defaultProps: {
      title: "Bài Viết Liên Quan",
      limit: 4,
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
      limit: { type: "number", label: "Số bài viết liên quan tối đa" },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: (props) => <RelatedPostsBlock {...props} />,
  };

export const CategoriesComponentConfig: PageBuilderComponentConfig<"PostCategoryList"> =
  {
    label: "Danh mục bài viết",
    defaultProps: {
      title: "Danh mục",
      parentId: "",
      limit: 8,
      layout: "tags",
      includedCategories: [],
      excludedCategories: [],
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
      layout: {
        type: "select",
        label: "Kiểu bố cục",
        options: [
          { label: "Nút nhãn (Tags)", value: "tags" },
          { label: "Dạng danh sách Sidebar", value: "sidebar" },
        ],
      },
      includedCategories: {
        type: "array",
        label: "Chỉ hiển thị danh mục",
        defaultItemProps: { categoryId: "" },
        getItemSummary: (item) => item.categoryId || "Danh mục",
        arrayFields: {
          categoryId: {
            type: "select",
            label: "Danh mục",
            options: [{ label: "Chọn danh mục", value: "" }],
          },
        },
      },
      excludedCategories: {
        type: "array",
        label: "Loại trừ danh mục",
        defaultItemProps: { categoryId: "" },
        getItemSummary: (item) => item.categoryId || "Danh mục",
        arrayFields: {
          categoryId: {
            type: "select",
            label: "Danh mục",
            options: [{ label: "Chọn danh mục", value: "" }],
          },
        },
      },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    resolveFields: async (_data, { fields, lastFields }) => {
      const lastIncludedCategoriesField = lastFields.includedCategories;
      const lastExcludedCategoriesField = lastFields.excludedCategories;

      if (
        hasCategoryOptions(lastIncludedCategoriesField) &&
        hasCategoryOptions(lastExcludedCategoriesField)
      ) {
        return lastFields;
      }

      const options = await buildCategoryFieldOptions("Chọn danh mục");

      if (options === null) {
        return fields;
      }

      return {
        ...fields,
        includedCategories: {
          type: "array",
          label: "Chỉ hiển thị danh mục",
          defaultItemProps: { categoryId: "" },
          getItemSummary: (item) => item.categoryId || "Danh mục",
          arrayFields: {
            categoryId: {
              type: "select",
              label: "Danh mục",
              options,
            },
          },
        },
        excludedCategories: {
          type: "array",
          label: "Loại trừ danh mục",
          defaultItemProps: { categoryId: "" },
          getItemSummary: (item) => item.categoryId || "Danh mục",
          arrayFields: {
            categoryId: {
              type: "select",
              label: "Danh mục",
              options,
            },
          },
        },
      };
    },
    render: (props) => <CategoriesBlock {...props} />,
  };

export const PageLinksComponentConfig: PageBuilderComponentConfig<"PageLinkList"> =
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

function hasCategoryOptions(field: unknown): boolean {
  if (!field || typeof field !== "object" || !("arrayFields" in field)) {
    return false;
  }

  const categoryField = (
    field as {
      arrayFields?: {
        categoryId?: {
          options?: unknown[];
        };
      };
    }
  ).arrayFields?.categoryId;

  return (
    Array.isArray(categoryField?.options) && categoryField.options.length > 1
  );
}
