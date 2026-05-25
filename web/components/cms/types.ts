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
