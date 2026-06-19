import { useState } from "react";
import { usePage } from "@inertiajs/react";
import { twMerge } from "tailwind-merge";
import {
  Calendar,
  User,
  Eye,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  BookOpen,
  Library,
  Briefcase,
  Link as LinkIcon,
  Headphones,
  MessageSquare,
  Home,
  ArrowRight,
  FileText,
  Folder,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/ui/breadcrumbs";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import { getPuckBlockDomId } from "./shared";
import type { PageBuilderComponentConfig } from "./types";

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

// MOCK data for CMS Editor
const MOCK_POST = {
  id: 1,
  title: 'Hội thảo "Trí tuệ nhân tạo trong chuyển đổi số"',
  slug: "tri-tue-nhan-tao-chuyen-doi-so",
  url: "#",
  excerpt:
    "Hội thảo giới thiệu các ứng dụng AI mới nhất và chiến lược chuyển đổi số trong giáo dục đại học.",
  date: "16/12/2024",
  author: "Khoa CNTT",
  thumbnailUrl: null,
  categories: [{ name: "TIN TỨC", url: "#" }],
};

const MOCK_BREADCRUMBS = [
  { label: "Trang chủ", url: "/" },
  { label: "Tin tức", url: "/posts" },
  { label: 'Hội thảo "Trí tuệ nhân tạo trong chuyển đổi số"', url: null },
];

const QuickLinkIcons = {
  graduation: GraduationCap,
  program: BookOpen,
  library: Library,
  handshake: Briefcase,
  link: LinkIcon,
};

interface PostHeaderBlockProps {
  id?: string;
  showBreadcrumbs?: boolean;
  showCategories?: boolean;
  showAuthor?: boolean;
  showDate?: boolean;
  showViews?: boolean;
  viewsCount?: number;
  className?: string;
}

function PostHeaderBlock({
  id: blockId,
  showBreadcrumbs = true,
  showCategories = true,
  showAuthor = true,
  showDate = true,
  showViews = true,
  viewsCount = 1250,
  className,
}: PostHeaderBlockProps) {
  const id = getPuckBlockDomId(blockId);
  const pageProps = usePage<any>().props;

  // Use actual post and breadcrumbs from Inertia props, fall back to mock.
  const post = pageProps.post || MOCK_POST;
  const breadcrumbs = pageProps.breadcrumbs || MOCK_BREADCRUMBS;

  const views = post.id ? ((post.id * 143 + 321) % 4000) + 150 : viewsCount;
  const formattedViews = `${views.toLocaleString("vi-VN")} lượt xem`;

  return (
    <header id={id} className={twMerge("w-full py-6 select-none", className)}>
      {showBreadcrumbs && breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs className="mb-6 flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-muted-fg font-medium">
          {breadcrumbs.map((crumb: any, index: number) => (
            <BreadcrumbsItem
              key={`${crumb.url ?? "current"}-${crumb.label}-${index}`}
              href={crumb.url ?? undefined}
              className="flex items-center"
            >
              {index === 0 && (
                <Home data-slot="icon" className="text-primary shrink-0" />
              )}
              <span className="sm:max-w-none">{crumb.label}</span>
            </BreadcrumbsItem>
          ))}
        </Breadcrumbs>
      )}

      {showCategories && post.categories && post.categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.categories.map((cat: any) => (
            <Link key={cat.url} href={cat.url}>
              <Badge
                intent="primary"
                isCircle={false}
                className="bg-primary text-primary-fg font-bold text-xs uppercase px-3 py-1.5 rounded-lg tracking-wider"
              >
                {cat.name}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      <Heading
        level={1}
        className="text-3xl sm:text-4xl font-extrabold tracking-tight text-fg leading-tight mb-6"
      >
        {post.title}
      </Heading>

      <div className="flex items-center gap-3 text-sm text-muted-fg border-b border-border/40 pb-6">
        <div className="hidden sm:flex items-center gap-4">
          {showDate && post.date && (
            <div className="flex items-center gap-2">
              <Calendar className="size-4.5 text-muted-fg/75" />
              <span>{post.date}</span>
            </div>
          )}
          {showDate && post.date && showAuthor && post.author && (
            <span className="text-border">|</span>
          )}
          {showAuthor && post.author && (
            <div className="flex items-center gap-2">
              <User className="size-4.5 text-muted-fg/75" />
              <span>Đăng bởi: {post.author}</span>
            </div>
          )}
          {((showAuthor && post.author) || (showDate && post.date)) &&
            showViews && <span className="text-border">|</span>}
          {showViews && (
            <div className="flex items-center gap-2">
              <Eye className="size-4.5 text-muted-fg/75" />
              <span>{formattedViews}</span>
            </div>
          )}
        </div>

        <div className="flex sm:hidden w-full items-center justify-between gap-4">
          {showDate && post.date && (
            <div className="flex items-center gap-2 shrink-0">
              <Calendar className="size-4.5 text-muted-fg/75" />
              <span className="font-semibold">{post.date}</span>
            </div>
          )}
          {(showAuthor || showViews) && (
            <>
              <div className="h-8 border-l border-border/80" />
              <div className="flex-1 flex flex-col gap-1 text-xs font-medium">
                {showAuthor && post.author && (
                  <div className="flex items-center gap-1.5">
                    <User className="size-3.5 text-muted-fg/75" />
                    <span>Đăng bởi: {post.author}</span>
                  </div>
                )}
                {showViews && (
                  <div className="flex items-center gap-1.5">
                    <Eye className="size-3.5 text-muted-fg/75" />
                    <span>{formattedViews}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

// ==========================================
// 1. POST HEADER COMPONENT
// ==========================================
export const PostHeaderComponentConfig: PageBuilderComponentConfig<"PostDetailHeader"> =
  {
    label: "Header Chi tiết Bài viết",
    defaultProps: {
      showBreadcrumbs: true,
      showCategories: true,
      showAuthor: true,
      showDate: true,
      showViews: true,
      viewsCount: 1250,
      className: "",
    },
    fields: {
      showBreadcrumbs: {
        type: "radio",
        label: "Hiển thị Breadcrumbs",
        options: [
          { label: "Có", value: true },
          { label: "Không", value: false },
        ],
      },
      showCategories: {
        type: "radio",
        label: "Hiển thị Danh mục",
        options: [
          { label: "Có", value: true },
          { label: "Không", value: false },
        ],
      },
      showAuthor: {
        type: "radio",
        label: "Hiển thị Tác giả",
        options: [
          { label: "Có", value: true },
          { label: "Không", value: false },
        ],
      },
      showDate: {
        type: "radio",
        label: "Hiển thị Ngày đăng",
        options: [
          { label: "Có", value: true },
          { label: "Không", value: false },
        ],
      },
      showViews: {
        type: "radio",
        label: "Hiển thị Lượt xem",
        options: [
          { label: "Có", value: true },
          { label: "Không", value: false },
        ],
      },
      viewsCount: {
        type: "number",
        label: "Số lượt xem (Mặc định nếu không có)",
      },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: (props) => <PostHeaderBlock {...props} />,
  };

// ==========================================
// 2. SIDEBAR QUICK LINKS COMPONENT
// ==========================================
export const SidebarQuickLinksComponentConfig: PageBuilderComponentConfig<"SidebarQuickLinks"> =
  {
    label: "Sidebar Liên kết nhanh",
    defaultProps: {
      title: "Liên kết nhanh",
      links: [
        { label: "Tuyển sinh", url: "/tuyen-sinh", icon: "graduation" },
        {
          label: "Chương trình đào tạo",
          url: "/chuong-trinh-dao-tao",
          icon: "program",
        },
        { label: "Thư viện - Tài nguyên", url: "/thu-vien", icon: "library" },
        {
          label: "Hợp tác doanh nghiệp",
          url: "/hop-tac-doanh-nghiep",
          icon: "handshake",
        },
      ],
      className: "",
    },
    fields: {
      title: { type: "text", label: "Tiêu đề khối" },
      links: {
        type: "array",
        label: "Danh sách liên kết",
        getItemSummary: (item) => item.label || "Liên kết",
        defaultItemProps: { label: "Liên kết mới", url: "#", icon: "link" },
        arrayFields: {
          label: { type: "text", label: "Nhãn hiển thị" },
          url: { type: "text", label: "Đường dẫn (URL)" },
          icon: {
            type: "select",
            label: "Biểu tượng",
            options: [
              { label: "Tuyển sinh (Mũ tốt nghiệp)", value: "graduation" },
              { label: "Chương trình (Học bạ/Bằng)", value: "program" },
              { label: "Thư viện (Tài liệu)", value: "library" },
              { label: "Hợp tác (Bắt tay/Vali)", value: "handshake" },
              { label: "Mặc định (Liên kết)", value: "link" },
            ],
          },
        },
      },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: (props) => {
      const { title = "Liên kết nhanh", links = [], className } = props;
      const id = getPuckBlockDomId((props as { id?: string }).id);

      return (
        <div id={id} className={className}>
          <AccordionWidget title={title} icon={LinkIcon} defaultOpen={false}>
            <div className="flex flex-col gap-4">
              {links.map((link: any, index: number) => {
                const IconComponent =
                  QuickLinkIcons[link.icon as keyof typeof QuickLinkIcons] ||
                  LinkIcon;
                return (
                  <Link
                    key={index}
                    href={link.url || "#"}
                    className="flex items-center gap-4 group cursor-pointer"
                  >
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/5 shrink-0 transition-colors group-hover:bg-primary group-hover:text-primary-fg shadow-xs">
                      <IconComponent className="size-5" />
                    </div>
                    <span className="text-sm font-semibold text-fg group-hover:text-primary transition-colors leading-snug">
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </AccordionWidget>
        </div>
      );
    },
  };

// ==========================================
// 3. SIDEBAR SUPPORT COMPONENT
// ==========================================
export const SidebarSupportComponentConfig: PageBuilderComponentConfig<"SidebarSupport"> =
  {
    label: "Sidebar Khối hỗ trợ",
    defaultProps: {
      title: "Cần hỗ trợ?",
      description: "Đội ngũ của Khoa CNTT luôn sẵn sàng hỗ trợ bạn.",
      buttonLabel: "Liên hệ ngay",
      buttonHref: "/lien-he",
      className: "",
    },
    fields: {
      title: { type: "text", label: "Tiêu đề khối" },
      description: { type: "textarea", label: "Mô tả ngắn" },
      buttonLabel: { type: "text", label: "Nhãn nút" },
      buttonHref: { type: "text", label: "Đường dẫn nút" },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: (props) => {
      const {
        title = "Cần hỗ trợ?",
        description = "Đội ngũ của Khoa CNTT luôn sẵn sàng hỗ trợ bạn.",
        buttonLabel = "Liên hệ ngay",
        buttonHref = "/lien-he",
        className,
      } = props;
      const id = getPuckBlockDomId((props as { id?: string }).id);

      return (
        <div
          id={id}
          className={twMerge("w-full h-full select-none", className)}
        >
          <div className="relative overflow-hidden rounded-2xl bg-primary p-6 text-primary-fg shadow-xs flex flex-col gap-4 justify-between h-full min-h-[170px]">
            {/* Background Watermark Icon */}
            <div className="absolute right-2 bottom-2 pointer-events-none text-white/10 shrink-0">
              {/* Desktop: Headphones, Mobile: MessageSquare */}
              <Headphones className="hidden lg:block size-24" />
              <MessageSquare className="block lg:hidden size-24" />
            </div>

            <div className="relative z-10 space-y-2 max-w-[75%] lg:max-w-none">
              <h3 className="text-lg font-bold text-white uppercase tracking-wide leading-none">
                {title}
              </h3>
              <p className="text-xs/relaxed text-white/80 leading-normal">
                {description}
              </p>
            </div>

            <div className="relative z-10 pt-2 shrink-0">
              <Link
                href={buttonHref}
                className="inline-flex min-h-10 items-center justify-center rounded-xl bg-white px-5 py-2 text-xs font-bold text-primary hover:bg-white/95 active:scale-[0.98] transition shadow-xs gap-1.5 cursor-pointer"
              >
                <span>{buttonLabel}</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </div>
      );
    },
  };
