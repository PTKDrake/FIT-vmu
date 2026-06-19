import { measureNaturalWidth, prepareWithSegments } from "@chenglou/pretext";
import { Link as InertiaLink, router } from "@inertiajs/react";
import { useMemo, useRef, useState, type RefObject } from "react";
import { BlockNoteReadonly } from "@/components/editor/blocknote-readonly";
import { Calendar, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SearchField, SearchInput } from "@/components/ui/search-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/ui/breadcrumbs";
import { Link } from "@/components/ui/link";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { useMountEffect } from "@/hooks/use-mount-effect";

interface CategoryInfo {
  id: number;
  name: string;
  slug: string;
  description: any;
  parentId: number | null;
  children: Array<{
    id: number;
    name: string;
    slug: string;
    description: any;
  }>;
}

interface PostItem {
  id: number;
  title: string;
  slug: string;
  url: string | null;
  excerpt: string | null;
  date: string | null;
  author: string | null;
  thumbnailUrl: string | null;
  categoryNames: string[];
}

interface PaginatedPosts {
  data: PostItem[];
  current_page: number;
  last_page: number;
  next_page_url: string | null;
  prev_page_url: string | null;
  total: number;
}

interface FilterCategory {
  id: number;
  name: string;
  slug: string;
}

interface PostListSectionProps {
  category: CategoryInfo;
  posts: PaginatedPosts;
  filterCategories: FilterCategory[];
  q: string | null;
  sort: string;
}

const categoryBadgeFont =
  '500 12px "Be Vietnam Pro", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
const categoryBadgeHorizontalChrome = 18;
const categoryBadgeGap = 8;
const measuredCategoryBadgeWidths = new Map<string, number>();

function measureCategoryBadgeWidth(label: string): number {
  const cachedWidth = measuredCategoryBadgeWidths.get(label);

  if (cachedWidth !== undefined) {
    return cachedWidth;
  }

  const nextWidth =
    Math.ceil(
      measureNaturalWidth(prepareWithSegments(label, categoryBadgeFont)),
    ) + categoryBadgeHorizontalChrome;

  measuredCategoryBadgeWidths.set(label, nextWidth);

  return nextWidth;
}

function useElementInlineSize<TElement extends HTMLElement>(
  elementRef: RefObject<TElement | null>,
): number {
  const [inlineSize, setInlineSize] = useState(0);

  useMountEffect(() => {
    const element = elementRef.current;

    if (!element || typeof ResizeObserver === "undefined") {
      return;
    }

    const updateInlineSize = (nextInlineSize: number): void => {
      setInlineSize((currentInlineSize) =>
        currentInlineSize === nextInlineSize
          ? currentInlineSize
          : nextInlineSize,
      );
    };

    updateInlineSize(Math.round(element.getBoundingClientRect().width));

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) {
        return;
      }

      const borderBoxSize = Array.isArray(entry.borderBoxSize)
        ? entry.borderBoxSize[0]
        : entry.borderBoxSize;

      updateInlineSize(
        Math.round(borderBoxSize?.inlineSize ?? entry.contentRect.width),
      );
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  });

  return inlineSize;
}

function PostCategoryBadges({ categoryNames }: { categoryNames: string[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const containerInlineSize = useElementInlineSize(containerRef);
  const normalizedCategoryNames = useMemo(() => {
    const uniqueCategoryNames = new Set<string>();

    for (const categoryName of categoryNames) {
      const normalizedCategoryName = categoryName.trim();

      if (normalizedCategoryName.length === 0) {
        continue;
      }

      uniqueCategoryNames.add(normalizedCategoryName);
    }

    return [...uniqueCategoryNames];
  }, [categoryNames]);
  const visibleCategoryBadges = useMemo(() => {
    if (normalizedCategoryNames.length === 0) {
      return {
        hiddenCount: 0,
        visibleNames: ["Tin tức"],
      };
    }

    if (containerInlineSize <= 0) {
      return {
        hiddenCount: Math.max(normalizedCategoryNames.length - 1, 0),
        visibleNames: normalizedCategoryNames.slice(0, 1),
      };
    }

    const categoryWidths = normalizedCategoryNames.map((categoryName) =>
      measureCategoryBadgeWidth(categoryName),
    );
    const totalCategoryWidth = categoryWidths.reduce(
      (sum, width) => sum + width,
      0,
    );
    const fullWidth =
      totalCategoryWidth +
      Math.max(categoryWidths.length - 1, 0) * categoryBadgeGap;

    if (fullWidth <= containerInlineSize) {
      return {
        hiddenCount: 0,
        visibleNames: normalizedCategoryNames,
      };
    }

    for (
      let visibleCount = normalizedCategoryNames.length - 1;
      visibleCount >= 0;
      visibleCount -= 1
    ) {
      const hiddenCount = normalizedCategoryNames.length - visibleCount;
      const visibleWidth = categoryWidths
        .slice(0, visibleCount)
        .reduce((sum, width) => sum + width, 0);
      const overflowWidth = measureCategoryBadgeWidth(`+${hiddenCount}`);
      const renderedBadgeCount = visibleCount + 1;
      const occupiedWidth =
        visibleWidth +
        overflowWidth +
        Math.max(renderedBadgeCount - 1, 0) * categoryBadgeGap;

      if (occupiedWidth <= containerInlineSize) {
        return {
          hiddenCount,
          visibleNames: normalizedCategoryNames.slice(0, visibleCount),
        };
      }
    }

    return {
      hiddenCount: normalizedCategoryNames.length,
      visibleNames: [],
    };
  }, [containerInlineSize, normalizedCategoryNames]);

  return (
    <div ref={containerRef} className="min-w-0">
      <div className="flex min-w-0 items-center gap-2 overflow-hidden">
        {visibleCategoryBadges.visibleNames.map((categoryName) => (
          <Badge
            key={categoryName}
            intent="primary"
            isCircle={true}
            className="max-w-full shrink-0"
          >
            {categoryName}
          </Badge>
        ))}
        {visibleCategoryBadges.hiddenCount > 0 ? (
          <Badge intent="primary" isCircle={true} className="shrink-0">
            +{visibleCategoryBadges.hiddenCount}
          </Badge>
        ) : null}
      </div>
    </div>
  );
}

function PostListToolbar({
  category,
  filterCategories,
  initialSearch,
  sort,
}: {
  category: CategoryInfo;
  filterCategories: FilterCategory[];
  initialSearch: string;
  sort: string;
}) {
  const [localSearch, setLocalSearch] = useState(initialSearch);

  const handleSearch = (searchTerm: string) => {
    const params: Record<string, string> = {};
    if (searchTerm.trim() !== "") {
      params.q = searchTerm.trim();
    }
    if (sort && sort !== "latest") {
      params.sort = sort;
    }
    router.get(window.location.pathname, params, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch(localSearch);
    }
  };

  const handleSortChange = (newSort: string) => {
    const params: Record<string, string> = {};
    if (localSearch.trim() !== "") {
      params.q = localSearch.trim();
    }
    if (newSort !== "latest") {
      params.sort = newSort;
    }
    router.get(window.location.pathname, params, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleClear = () => {
    setLocalSearch("");
    handleSearch("");
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <SearchField
          value={localSearch}
          onChange={setLocalSearch}
          onSubmit={(value) => handleSearch(value)}
          onClear={handleClear}
          className="flex-1"
        >
          <SearchInput
            placeholder="Tìm kiếm bài viết..."
            onKeyDown={handleKeyDown}
            className="bg-muted/15 border-border focus:border-primary focus:bg-bg transition"
          />
        </SearchField>

        <div className="flex items-center shrink-0 w-full md:w-auto">
          <Select
            value={sort}
            onChange={(value) => handleSortChange(value as string)}
            aria-label="Sắp xếp bài viết"
            className="w-full md:w-44"
          >
            <SelectTrigger prefix="Sắp xếp:" />
            <SelectContent>
              <SelectItem id="latest">Mới nhất</SelectItem>
              <SelectItem id="oldest">Cũ nhất</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filterCategories && filterCategories.length > 0 ? (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {filterCategories.map((filterCategory) => {
            const isTagActive = filterCategory.slug === category.slug;
            const url =
              `/${filterCategory.slug}` +
              (localSearch.trim()
                ? `?q=${encodeURIComponent(localSearch.trim())}`
                : "");

            return (
              <Link
                key={filterCategory.id}
                href={url}
                className={twMerge(
                  "inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-full whitespace-nowrap transition cursor-pointer shrink-0 border",
                  isTagActive
                    ? "bg-primary border-primary text-primary-fg shadow-xs hover:bg-primary"
                    : "bg-primary-subtle border-transparent text-primary-subtle-fg hover:bg-primary/20 hover:border-transparent",
                )}
              >
                {filterCategory.name}
              </Link>
            );
          })}
        </div>
      ) : null}
    </>
  );
}

export function PostListSection({
  category,
  posts,
  filterCategories,
  q,
  sort,
}: PostListSectionProps) {
  const getViewsCount = (id: number) => {
    const views = ((id * 47) % 800) + 120;
    return views.toLocaleString("vi-VN") + " lượt xem";
  };

  return (
    <div className="mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8 flex flex-col justify-center items-center">
      {/* 01. Hero / Header danh mục */}
      {/* Desktop view */}
      <div className="hidden md:flex min-h-[260px] items-stretch justify-between relative overflow-hidden rounded-3xl bg-[#023fa9] text-white shadow-xs">
        {/* SVG background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg
            id="visual-desktop"
            viewBox="0 0 960 540"
            className="w-full h-full object-cover"
            preserveAspectRatio="none"
          >
            <path
              d="M748 540L762.3 517.5C776.7 495 805.3 450 813.3 405C821.3 360 808.7 315 789.5 270C770.3 225 744.7 180 751 135C757.3 90 795.7 45 814.8 22.5L834 0L960 0L960 22.5C960 45 960 90 960 135C960 180 960 225 960 270C960 315 960 360 960 405C960 450 960 495 960 517.5L960 540Z"
              fill="#4b83de"
            />
            <path
              d="M652 540L664.8 517.5C677.7 495 703.3 450 693.7 405C684 360 639 315 602.2 270C565.3 225 536.7 180 541.5 135C546.3 90 584.7 45 603.8 22.5L623 0L835 0L815.8 22.5C796.7 45 758.3 90 752 135C745.7 180 771.3 225 790.5 270C809.7 315 822.3 360 814.3 405C806.3 450 777.7 495 763.3 517.5L749 540Z"
              fill="#366ccd"
            />
            <path
              d="M412 540L421.5 517.5C431 495 450 450 446.8 405C443.7 360 418.3 315 367.2 270C316 225 239 180 229.3 135C219.7 90 277.3 45 306.2 22.5L335 0L624 0L604.8 22.5C585.7 45 547.3 90 542.5 135C537.7 180 566.3 225 603.2 270C640 315 685 360 694.7 405C704.3 450 678.7 495 665.8 517.5L653 540Z"
              fill="#2056bb"
            />
          </svg>
        </div>

        {/* Hidden SVG mask for image clipping */}
        <svg className="absolute w-0 h-0" aria-hidden="true">
          <defs>
            <mask id="hero-image-mask" maskContentUnits="objectBoundingBox">
              <rect width="1" height="1" fill="white" />
              <path d="M 0,0 L 0.15,0 C 0.05,0.2 0.02,0.55 0.15,1 L 0,1 Z" fill="black" />
            </mask>
          </defs>
        </svg>

        <div className="flex-1 p-8 lg:p-12 relative z-10">
          <div className="mb-4">
            <Breadcrumbs className="text-white/80 select-none [&_span]:text-white/40 [&_svg]:text-white/40">
              <BreadcrumbsItem
                href="/"
                className="[&_a]:text-white/80 [&_a]:hover:text-white"
              >
                Trang chủ
              </BreadcrumbsItem>
              <BreadcrumbsItem className="text-white font-semibold">
                {category.name}
              </BreadcrumbsItem>
            </Breadcrumbs>
          </div>

          <Heading
            level={1}
            className="text-3xl lg:text-4xl font-extrabold tracking-tight mb-3 !text-white"
          >
            {category.name}
          </Heading>

          {category.description ? (
            <BlockNoteReadonly
              content={category.description}
              className="!bg-transparent !text-white/95 [--bn-colors-editor-text:rgba(255,255,255,0.95)] [&_.bn-editor]:!py-0 [&_.bn-editor]:!px-0 [&_.bn-editor]:!text-white/95 [&_.bn-root]:!bg-transparent [&_.bn-editor]:!bg-transparent text-sm lg:text-base leading-relaxed max-w-2xl font-light"
            />
          ) : null}
        </div>

        <div className="relative w-[30%] shrink-0 z-10">
          <div
            className="w-full h-full"
            style={{
              maskImage: 'url(#hero-image-mask)',
              WebkitMaskImage: 'url(#hero-image-mask)'
            }}
          >
            <img
              src="/vmu/vmu.jpg"
              className="h-full w-full object-cover"
              alt={category.name}
            />
          </div>

          {/* White Highlight aligned with the mask curve */}
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full z-20 pointer-events-none"
          >
            <path
              d="M 15,0 C 5,20 2,55 15,100"
              fill="none"
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* Mobile view */}
      <div className="flex md:hidden flex-col overflow-hidden rounded-2xl bg-[#023fa9] text-white shadow-xs relative">
        {/* SVG background */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg
            id="visual-mobile"
            viewBox="0 0 960 540"
            className="w-full h-full object-cover"
            preserveAspectRatio="none"
          >
            <path
              d="M748 540L762.3 517.5C776.7 495 805.3 450 813.3 405C821.3 360 808.7 315 789.5 270C770.3 225 744.7 180 751 135C757.3 90 795.7 45 814.8 22.5L834 0L960 0L960 22.5C960 45 960 90 960 135C960 180 960 225 960 270C960 315 960 360 960 405C960 450 960 495 960 517.5L960 540Z"
              fill="#4b83de"
            />
            <path
              d="M652 540L664.8 517.5C677.7 495 703.3 450 693.7 405C684 360 639 315 602.2 270C565.3 225 536.7 180 541.5 135C546.3 90 584.7 45 603.8 22.5L623 0L835 0L815.8 22.5C796.7 45 758.3 90 752 135C745.7 180 771.3 225 790.5 270C809.7 315 822.3 360 814.3 405C806.3 450 777.7 495 763.3 517.5L749 540Z"
              fill="#366ccd"
            />
            <path
              d="M412 540L421.5 517.5C431 495 450 450 446.8 405C443.7 360 418.3 315 367.2 270C316 225 239 180 229.3 135C219.7 90 277.3 45 306.2 22.5L335 0L624 0L604.8 22.5C585.7 45 547.3 90 542.5 135C537.7 180 566.3 225 603.2 270C640 315 685 360 694.7 405C704.3 450 678.7 495 665.8 517.5L653 540Z"
              fill="#2056bb"
            />
            <path
              d="M0 540L0 517.5C0 495 0 450 0 405C0 360 0 315 0 270C0 225 0 180 0 135C0 90 0 45 0 22.5L0 0L336 0L307.2 22.5C278.3 45 220.7 90 230.3 135C240 180 317 225 368.2 270C419.3 315 444.7 360 447.8 405C451 450 432 495 422.5 517.5L413 540Z"
              fill="#023fa9"
            />
          </svg>
        </div>

        <div className="p-6 pb-8 flex flex-col gap-3 relative z-10">
          <Breadcrumbs className="text-white/85 select-none [&_span]:text-white/40 [&_svg]:text-white/40">
            <BreadcrumbsItem
              href="/"
              className="[&_a]:text-white/85 [&_a]:hover:text-white"
            >
              Trang chủ
            </BreadcrumbsItem>
            <BreadcrumbsItem className="text-white font-semibold">
              {category.name}
            </BreadcrumbsItem>
          </Breadcrumbs>

          <Heading
            level={1}
            className="text-2xl font-bold tracking-tight !text-white"
          >
            {category.name}
          </Heading>

          {category.description ? (
            <BlockNoteReadonly
              content={category.description}
              className="!bg-transparent !text-white/95 [--bn-colors-editor-text:rgba(255,255,255,0.95)] [&_.bn-editor]:!py-0 [&_.bn-editor]:!px-0 [&_.bn-editor]:!text-white/95 [&_.bn-root]:!bg-transparent [&_.bn-editor]:!bg-transparent text-xs leading-relaxed font-light"
            />
          ) : null}
        </div>
        <div className="relative h-44 overflow-hidden z-10">
          <div className="absolute top-0 inset-x-0 h-6 -translate-y-[1px] z-10 pointer-events-none">
            <svg
              viewBox="0 0 1440 120"
              preserveAspectRatio="none"
              className="w-full h-full rotate-180"
            >
              <defs>
                <linearGradient id="mobile-wave-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#023fa9" />
                  <stop offset="35%" stopColor="#023fa9" />
                  <stop offset="45%" stopColor="#2056bb" />
                  <stop offset="60%" stopColor="#2056bb" />
                  <stop offset="70%" stopColor="#366ccd" />
                  <stop offset="78%" stopColor="#366ccd" />
                  <stop offset="85%" stopColor="#4b83de" />
                  <stop offset="100%" stopColor="#4b83de" />
                </linearGradient>
              </defs>
              <path
                d="M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,120L1320,120C1200,120,960,120,720,120C480,120,240,120,120,120L0,120Z"
                fill="url(#mobile-wave-grad)"
              />
            </svg>
          </div>
          <img
            src="/vmu/vmu.jpg"
            className="h-full w-full object-cover"
            alt={category.name}
          />
        </div>
      </div>

      <div className="max-w-6xl space-y-8">
        {/* 02. Thanh tìm kiếm & Bộ lọc */}
        <div className="bg-white border border-border rounded-3xl p-5 md:p-6 shadow-xs flex flex-col gap-4">
          <PostListToolbar
            key={q ?? ""}
            category={category}
            filterCategories={filterCategories}
            initialSearch={q ?? ""}
            sort={sort}
          />
        </div>
        {/* 03. Danh sách bài viết & 04. Phân trang */}
        <div>
          <div className="flex items-center gap-2.5 mb-6">
            <Badge
              intent="primary"
              isCircle={false}
              className="rounded-md font-bold px-2 py-0.5"
            >
              {posts.total}
            </Badge>
            <Heading
              level={2}
              className="text-lg font-extrabold tracking-tight text-fg uppercase"
            >
              Danh sách bài viết
            </Heading>
          </div>
          {posts.data.length > 0 ? (
            <div className="space-y-10">
              {/* Posts Grid */}
              <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.data.map((post) => (
                  <Link
                    key={post.id}
                    href={post.url ?? "#"}
                    className="block group"
                  >
                    <Card className="overflow-hidden p-0 gap-0 transition duration-300 border-border hover:border-primary/20 hover:shadow-lg hover:shadow-gray-100/50 flex flex-col h-full bg-white">
                      {/* Thumbnail */}
                      <div className="aspect-[16/10] w-full overflow-hidden bg-gray-50 relative shrink-0">
                        {post.thumbnailUrl ? (
                          <img
                            src={post.thumbnailUrl}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-muted-fg bg-gray-50 text-xs">
                            Không có ảnh đại diện
                          </div>
                        )}
                      </div>
                      {/* Card Content */}
                      <CardContent className="p-5 flex-1 flex flex-col gap-3 py-5 px-5">
                        {/* Category badge */}
                        <PostCategoryBadges categoryNames={post.categoryNames} />
                        {/* Title */}
                        <Heading
                          level={3}
                          className="text-base font-bold text-fg group-hover:text-primary transition-colors leading-snug line-clamp-2 min-h-[2.75rem]"
                        >
                          {post.title}
                        </Heading>
                        {/* Excerpt */}
                        {post.excerpt && (
                          <Text className="text-xs leading-relaxed line-clamp-3 mb-2 flex-1">
                            {post.excerpt}
                          </Text>
                        )}
                        {/* Card Footer Meta */}
                        <div className="flex items-center justify-between border-t border-border pt-3 text-[11px] font-medium text-muted-fg shrink-0">
                          {post.date ? (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{post.date}</span>
                            </div>
                          ) : (
                            <div />
                          )}
                          <div className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{getViewsCount(post.id)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
              {/* 04. Phân trang (Pagination) - Combined with Post List */}
              {posts.last_page > 1 && (
                <div className="flex justify-center items-center gap-1.5 pt-6 border-t border-border">
                  {/* Previous page */}
                  <InertiaLink
                    href={posts.prev_page_url ?? "#"}
                    className={twMerge(
                      "flex items-center justify-center w-9 h-9 rounded-xl border text-sm font-semibold transition cursor-pointer",
                      posts.prev_page_url
                        ? "border-border text-fg hover:bg-muted"
                        : "border-border/50 text-muted-fg/40 pointer-events-none",
                    )}
                    preserveScroll
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </InertiaLink>
                  {/* Pages list */}
                  {Array.from({ length: posts.last_page }, (_, i) => {
                    const pageNum = i + 1;
                    const isActive = pageNum === posts.current_page;
                    const showPage =
                      pageNum === 1 ||
                      pageNum === posts.last_page ||
                      Math.abs(pageNum - posts.current_page) <= 1;
                    if (!showPage) {
                      if (pageNum === 2 && posts.current_page > 3) {
                        return (
                          <span
                            key="gap-start"
                            className="w-9 text-center font-semibold text-muted-fg"
                          >
                            ...
                          </span>
                        );
                      }
                      if (
                        pageNum === posts.last_page - 1 &&
                        posts.current_page < posts.last_page - 2
                      ) {
                        return (
                          <span
                            key="gap-end"
                            className="w-9 text-center font-semibold text-muted-fg"
                          >
                            ...
                          </span>
                        );
                      }
                      return null;
                    }
                    const pageUrl = new URL(window.location.href);
                    pageUrl.searchParams.set("page", String(pageNum));
                    return (
                      <InertiaLink
                        key={pageNum}
                        href={isActive ? undefined : pageUrl.toString()}
                        className={twMerge(
                          "flex items-center justify-center w-9 h-9 rounded-xl text-sm font-semibold transition cursor-pointer",
                          isActive
                            ? "bg-primary text-primary-fg shadow-xs"
                            : "border border-border text-fg hover:bg-muted",
                        )}
                        preserveScroll
                      >
                        {pageNum}
                      </InertiaLink>
                    );
                  })}
                  {/* Next page */}
                  <InertiaLink
                    href={posts.next_page_url ?? "#"}
                    className={twMerge(
                      "flex items-center justify-center w-9 h-9 rounded-xl border text-sm font-semibold transition cursor-pointer",
                      posts.next_page_url
                        ? "border-border text-fg hover:bg-muted"
                        : "border-border/50 text-muted-fg/40 pointer-events-none",
                    )}
                    preserveScroll
                  >
                    <ChevronRight className="w-4 h-4" />
                  </InertiaLink>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-border p-16 text-center bg-muted/15">
              <Text className="text-muted-fg text-sm font-medium">
                Chưa có bài viết nào phù hợp trong danh mục này.
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
