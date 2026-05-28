import type { Data } from "@puckeditor/core";

export const PUCK_PAGE_CONTENT_FORMAT = "puck_json" as const;

export interface VmuFitPageBuilderComponents {
  HeroBanner: {
    eyebrow: string;
    title: string;
    description: string;
    primaryActionHref: string;
    primaryActionLabel: string;
    secondaryActionHref: string;
    secondaryActionLabel: string;
  };
  HighlightsGrid: {
    firstBody: string;
    firstTitle: string;
    secondBody: string;
    secondTitle: string;
    sectionTitle: string;
    thirdBody: string;
    thirdTitle: string;
  };
  RichTextSection: {
    body: string;
    title: string;
  };
}

export type VmuFitPageBuilderData = Data<VmuFitPageBuilderComponents>;

export type VmuFitPageBuilderValue =
  | Partial<VmuFitPageBuilderData>
  | string
  | null
  | undefined;

const DEFAULT_PAGE_DATA: VmuFitPageBuilderData = {
  root: {
    props: {
      title: "Trang VMUFit",
    },
  },
  content: [
    {
      type: "HeroBanner",
      props: {
        id: "hero-banner-default",
        eyebrow: "Trang mẫu VMUFit",
        title: "Nội dung trang được kiểm soát bằng Puck JSON",
        description:
          "Wrapper này chỉ phục vụ cho pages.content. Bài viết, tài liệu và tiểu sử cán bộ vẫn tiếp tục dùng BlockNote theo đúng guideline của dự án.",
        primaryActionHref: "/",
        primaryActionLabel: "Xem trang công khai",
        secondaryActionHref: "/dashboard",
        secondaryActionLabel: "Quay lại CMS",
      },
    },
    {
      type: "HighlightsGrid",
      props: {
        id: "highlights-grid-default",
        sectionTitle: "Palette khối nội dung đang được giới hạn",
        firstTitle: "Hero có CTA",
        firstBody:
          "Dùng cho phần mở đầu của trang published mà không cần hardcode layout vào template Blade hoặc React riêng.",
        secondTitle: "Section văn bản",
        secondBody:
          "Cho các đoạn mô tả, giới thiệu đơn vị hoặc hướng dẫn ngắn. Dữ liệu vẫn được lưu dưới dạng JSON trong pages.content.",
        thirdTitle: "Lưới highlight",
        thirdBody:
          "Dùng để gom các điểm nhấn nhỏ và giữ cho component palette có kiểm soát trước khi mở rộng ở task module Pages.",
      },
    },
    {
      type: "RichTextSection",
      props: {
        id: "rich-text-section-default",
        title: "Phạm vi task 4.5",
        body: "Task này tạo nền tảng page builder, parser/serializer và render published cơ bản.\n\nNó chưa thay thế workflow CRUD Pages hoàn chỉnh, chưa nối backend lưu thật, và cũng không mở Puck cho posts/documents/staff bio.",
      },
    },
  ],
};

export function createDefaultPuckPageData(): VmuFitPageBuilderData {
  return clonePuckPageData(DEFAULT_PAGE_DATA);
}

export function clonePuckPageData(
  data: Partial<VmuFitPageBuilderData>,
): VmuFitPageBuilderData {
  return JSON.parse(JSON.stringify(normalizePuckPageData(data))) as VmuFitPageBuilderData;
}

export function getPuckPageContentFormat(): typeof PUCK_PAGE_CONTENT_FORMAT {
  return PUCK_PAGE_CONTENT_FORMAT;
}

export function isEmptyPuckPageData(data: VmuFitPageBuilderData): boolean {
  return data.content.length === 0;
}

export function parsePuckPageData(
  value: VmuFitPageBuilderValue,
): VmuFitPageBuilderData {
  if (!value) {
    return createDefaultPuckPageData();
  }

  if (typeof value === "string") {
    try {
      const parsedValue = JSON.parse(value) as unknown;

      if (isPuckPageData(parsedValue)) {
        return clonePuckPageData(parsedValue);
      }
    } catch {
      return createDefaultPuckPageData();
    }

    return createDefaultPuckPageData();
  }

  if (isPuckPageData(value)) {
    return clonePuckPageData(value);
  }

  return createDefaultPuckPageData();
}

export function serializePuckPageData(data: VmuFitPageBuilderData): string {
  return JSON.stringify(data, null, 2);
}

function isPuckPageData(value: unknown): value is Partial<VmuFitPageBuilderData> {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as {
    content?: unknown;
    root?: { props?: unknown } | null;
    zones?: unknown;
  };

  if (!candidate.root || typeof candidate.root !== "object") {
    return false;
  }

  return Array.isArray(candidate.content);
}

function normalizePuckPageData(
  data: Partial<VmuFitPageBuilderData>,
): VmuFitPageBuilderData {
  return {
    root: {
      props:
        data.root && typeof data.root === "object" && "props" in data.root
          ? ((data.root.props as { title?: string } | undefined) ?? {})
          : {},
    },
    content: Array.isArray(data.content) ? data.content : [],
    ...(data.zones ? { zones: data.zones } : {}),
  };
}
