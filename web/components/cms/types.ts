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
