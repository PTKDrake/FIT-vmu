import { AnnouncementsCustom } from "@/components/cms/announcements-custom";
import {
  EmptyDynamicState,
  buildCategoryFieldOptions,
  parseOptionalId,
  usePuckDynamicData,
} from "./dynamic/shared";
import { getPuckBlockDomId, isPuckEditorPreview } from "./shared";
import type { PageBuilderComponentConfig } from "./types";

interface CategorySelection {
  categoryId?: string;
}

interface AnnouncementsCustomBlockProps {
  title?: string;
  actionLabel?: string;
  actionHref?: string;
  limit?: number;
  includedCategories?: CategorySelection[];
  excludedCategories?: CategorySelection[];
  className?: string;
}

function AnnouncementsCustomBlock(
  props: AnnouncementsCustomBlockProps & { id?: string },
) {
  const {
    title,
    actionLabel,
    actionHref,
    limit = 4,
    includedCategories = [],
    excludedCategories = [],
    className,
  } = props;
  const id = getPuckBlockDomId(props.id);
  const includedCategoryIds = parseCategorySelections(includedCategories);
  const excludedCategoryIds = parseCategorySelections(excludedCategories);

  // Fetch and filter posts from dynamic data
  const posts = usePuckDynamicData()
    .posts.filter((post) =>
      includedCategoryIds.length > 0
        ? post.categoryIds.some((catId) => includedCategoryIds.includes(catId))
        : true,
    )
    .filter(
      (post) =>
        !post.categoryIds.some((catId) => excludedCategoryIds.includes(catId)),
    )
    .slice(0, Math.max(1, limit));

  if (posts.length === 0) {
    if (!isPuckEditorPreview()) {
      return null;
    }

    return (
      <div id={id} className="w-full">
        <EmptyDynamicState label="Không có thông báo nào để hiển thị." />
      </div>
    );
  }

  // Map post items to expected announcement items format
  const mappedItems = posts.map((post) => ({
    title: post.title,
    date: post.date ?? undefined,
    href: post.url ?? "#",
  }));

  return (
    <div id={id} className="w-full">
      <AnnouncementsCustom
        title={title}
        actionLabel={actionLabel}
        actionHref={actionHref}
        items={mappedItems}
        className={className}
      />
    </div>
  );
}

function parseCategorySelections(
  selections: CategorySelection[] | undefined,
): number[] {
  return Array.from(
    new Set(
      (selections ?? [])
        .map((selection) => parseOptionalId(selection.categoryId))
        .filter((categoryId): categoryId is number => categoryId !== null),
    ),
  );
}

export const AnnouncementsCustomComponentConfig: PageBuilderComponentConfig<"FeaturedAnnouncements"> =
  {
    label: "Thông báo nâng cao",
    defaultProps: {
      title: "Thông báo mới nhất",
      actionLabel: "Xem tất cả thông báo",
      actionHref: "/posts",
      limit: 4,
      includedCategories: [],
      excludedCategories: [],
      className: "",
    },
    fields: {
      title: { type: "text", label: "Tiêu đề lớn" },
      actionLabel: { type: "text", label: "Nhãn xem tất cả" },
      actionHref: { type: "text", label: "Đường dẫn xem tất cả" },
      limit: { type: "number", label: "Số lượng hiển thị" },
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
    render: (props) => <AnnouncementsCustomBlock {...props} />,
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
