import { NewsCustom } from "@/components/cms/news";
import {
  EmptyDynamicState,
  buildCategoryFieldOptions,
  parseOptionalId,
  usePuckDynamicData,
} from "./dynamic/shared";
import { getPuckBlockDomId } from "./shared";
import type { PageBuilderComponentConfig } from "./types";

interface NewsCategorySelection {
  categoryId?: string;
}

interface NewsCustomBlockProps {
  categoryId?: string;
  excludedCategories?: NewsCategorySelection[];
  includedCategories?: NewsCategorySelection[];
  limit?: number;
  title?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
}

function NewsCustomBlock(props: NewsCustomBlockProps & { id?: string }) {
  const {
    categoryId,
    excludedCategories = [],
    includedCategories = [],
    limit = 4,
    title,
    viewAllHref,
    viewAllLabel,
  } = props;
  const id = getPuckBlockDomId(props.id);
  const selectedCategoryId = parseOptionalId(categoryId);
  const includedCategoryIds = selectedCategoryId
    ? [selectedCategoryId]
    : parseCategorySelections(includedCategories);
  const excludedCategoryIds = parseCategorySelections(excludedCategories);
  const posts = usePuckDynamicData()
    .posts.filter((post) =>
      includedCategoryIds.length > 0
        ? post.categoryIds.some((categoryId) =>
            includedCategoryIds.includes(categoryId),
          )
        : true,
    )
    .filter(
      (post) =>
        !post.categoryIds.some((categoryId) =>
          excludedCategoryIds.includes(categoryId),
        ),
    )
    .slice(0, Math.max(1, limit));
  const [featuredPost, ...secondaryPosts] = posts;

  if (!featuredPost) {
    return (
      <div id={id} className="w-full">
        <EmptyDynamicState label="Không có tin tức nào để hiển thị." />
      </div>
    );
  }

  return (
    <div id={id} className="w-full">
      <NewsCustom
        title={title}
        viewAllLabel={viewAllLabel}
        viewAllHref={viewAllHref}
        featured={{
          imageUrl: featuredPost.thumbnailUrl,
          date: featuredPost.date ?? undefined,
          title: featuredPost.title,
          description: featuredPost.excerpt ?? undefined,
          href: featuredPost.url ?? "#",
        }}
        items={secondaryPosts.map((post) => ({
          imageUrl: post.thumbnailUrl,
          date: post.date ?? undefined,
          title: post.title,
          href: post.url ?? "#",
        }))}
      />
    </div>
  );
}

function parseCategorySelections(
  selections: NewsCategorySelection[] | undefined,
): number[] {
  return Array.from(
    new Set(
      (selections ?? [])
        .map((selection) => parseOptionalId(selection.categoryId))
        .filter((categoryId): categoryId is number => categoryId !== null),
    ),
  );
}

export const NewsCustomComponentConfig: PageBuilderComponentConfig<"NewsCustom"> =
  {
    label: "Tin tức nổi bật",
    defaultProps: {
      title: "Tin tức nổi bật",
      viewAllLabel: "Xem tất cả",
      viewAllHref: "/posts",
      limit: 4,
      categoryId: "all",
      includedCategories: [],
      excludedCategories: [],
    },
    fields: {
      title: { type: "text", label: "Tiêu đề lớn" },
      viewAllLabel: { type: "text", label: "Nhãn liên kết xem tất cả" },
      viewAllHref: { type: "text", label: "Đường dẫn xem tất cả" },
      limit: { type: "number", label: "Tổng số bài viết hiển thị" },
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
    render: (props) => <NewsCustomBlock {...props} />,
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
