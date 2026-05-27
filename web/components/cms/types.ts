import type { SharedData } from "@/types/shared";

export interface DashboardOverview {
  recentActivity: Array<{
    description: string;
    id: string;
    kind: string;
    status: string;
    title: string;
    updatedAt: string;
  }>;
  pendingReview: Array<{
    id: string;
    kind: string;
    owner: string;
    status: string;
    title: string;
    updatedAt: string;
  }>;
  recentDocuments: Array<{
    documentType: string;
    id: string;
    status: string;
    title: string;
    updatedAt: string;
    visibility: string;
  }>;
  stats: Array<{
    change: number;
    helper: string;
    intent: "primary" | "info" | "warning" | "success";
    key: string;
    label: string;
    value: number;
  }>;
  workspace: {
    accessibleCollections: number;
    mediaAssets: number;
    organizationNodes: number;
    studentRecords: number;
  };
}

export interface CmsDashboardPageProps extends SharedData {
  overview: DashboardOverview;
}

export interface CmsTablePaginationMeta {
  currentPage: number;
  from: number | null;
  lastPage: number;
  perPage: number;
  to: number | null;
  total: number;
}

export interface CmsPaginatedCollection<TItem> {
  data: TItem[];
  meta: CmsTablePaginationMeta;
}

export type CmsTableSortDirection = "asc" | "desc";

export interface CmsPostTableRow {
  authorName: string | null;
  excerpt: string | null;
  id: number;
  publishedAt: string | null;
  slug: string;
  status: "draft" | "pending" | "published" | "rejected";
  title: string;
  updatedAt: string;
}

export interface CmsPostsPageProps extends SharedData {
  posts: CmsPaginatedCollection<CmsPostTableRow>;
}

export interface CmsPageTableRow {
  authorName: string | null;
  excerpt: string | null;
  id: number;
  publishedAt: string | null;
  seoDescription: string | null;
  seoTitle: string | null;
  slug: string;
  status: "draft" | "pending" | "published" | "rejected";
  title: string;
  updatedAt: string;
  urlPath: string;
}

export interface CmsPagesPageProps extends SharedData {
  pages: CmsPaginatedCollection<CmsPageTableRow>;
}

export interface CmsMediaRow {
  displayName: string;
  extension: string;
  id: number;
  kind: "audio" | "image" | "video";
  mimeType: string;
  previewUrl: string;
  size: number;
  uploadedAt: string;
  uploader: {
    id: number;
    name: string;
  } | null;
  usage: {
    documents: number;
    pages: number;
    posts: number;
    staffProfiles: number;
    total: number;
  };
}

export interface CmsMediaPageProps extends SharedData {
  can: {
    deleteMedia: boolean;
    duplicateMedia: boolean;
    renameMedia: boolean;
    uploadMedia: boolean;
  };
  media: CmsPaginatedCollection<CmsMediaRow> & {
    filters: {
      uploaders: Array<{
        id: number;
        name: string;
      }>;
    };
  };
}

export interface CmsPageEditorPageProps extends SharedData {
  page: {
    content: string | null;
    contentFormat: "puck_json";
    id: number;
    slug: string;
    status: "draft" | "pending" | "published" | "rejected";
    title: string;
    updatedAt: string;
  };
}
