import type { SharedData } from "@/types/shared";
import type {
  NavigationMenuDraft,
  NavigationResourceOption,
} from "@/lib/navigation/tree";

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
  categoryIds: number[];
  categoryNames: string[];
  slug: string;
  status: "draft" | "pending" | "published" | "rejected";
  title: string;
  updatedAt: string;
}

export interface CmsPostsPageProps extends SharedData {
  can: {
    managePosts: boolean;
    publishPosts: boolean;
  };
  posts: CmsPaginatedCollection<CmsPostTableRow>;
  categoryOptions: Array<{
    label: string;
    value: string;
  }>;
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

export interface CmsNavigationResourceCatalog {
  page: NavigationResourceOption[];
  post: NavigationResourceOption[];
  post_category: NavigationResourceOption[];
}

export type CmsNavigationMenuRow = NavigationMenuDraft;

export interface CmsNavigationPageProps extends SharedData {
  navigationMenus: CmsNavigationMenuRow[];
  navigationStateVersion: string;
}

export interface CmsNavigationShowPageProps extends SharedData {
  navigationMenuId: number;
  navigationMenuName: string;
  navigationMenus: CmsNavigationMenuRow[];
  navigationStateVersion: string;
  resourceCatalog: CmsNavigationResourceCatalog;
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

export interface CmsPositionRow {
  appointmentCount: number;
  id: number;
  isActive: boolean;
  name: string;
  slug: string;
  sortOrder: number;
  updatedAt: string;
}

export interface CmsPositionsPageProps extends SharedData {
  can: {
    managePositions: boolean;
  };
  positions: CmsPaginatedCollection<CmsPositionRow>;
}

export interface CmsUnitRow {
  appointmentCount: number;
  descriptionSummary: string | null;
  id: number;
  isActive: boolean;
  name: string;
  slug: string;
  sortOrder: number;
  updatedAt: string;
}

export interface CmsUnitsPageProps extends SharedData {
  can: {
    manageUnits: boolean;
  };
  units: CmsUnitRow[];
}

export interface CmsUnitFormPageProps extends SharedData {
  unit: {
    description: string | null;
    descriptionFormat: "blocknote_json";
    id: number | null;
    isActive: boolean;
    name: string;
    slug: string;
    sortOrder: number;
  };
}

export interface CmsUnitShowPageProps extends SharedData {
  can: {
    manageUnits: boolean;
  };
  unit: {
    appointmentCount: number;
    description: string | null;
    descriptionFormat: "blocknote_json";
    id: number;
    isActive: boolean;
    name: string;
    slug: string;
    sortOrder: number;
    updatedAt: string;
  };
}

export interface CmsPageEditorPageProps extends SharedData {
  page: {
    content: string | null;
    contentFormat: "puck_json";
    excerpt: string | null;
    id: number;
    seoDescription: string | null;
    seoTitle: string | null;
    slug: string;
    status: "draft" | "pending" | "published" | "rejected";
    title: string;
    updatedAt: string;
  };
}

export interface CmsStaffProfileRow {
  avatarUrl: string | null;
  email: string | null;
  fullName: string;
  id: number;
  isPublic: boolean;
  phone: string | null;
  slug: string;
  userEmail: string;
  updatedAt: string;
}

export interface CmsStaffProfilesPageProps extends SharedData {
  can: {
    createStaffProfile: boolean;
    deleteStaffProfile: boolean;
  };
  profiles: CmsPaginatedCollection<CmsStaffProfileRow>;
}

export interface CmsStaffProfileFormPageProps extends SharedData {
  users?: Array<{
    id: number;
    name: string;
    email: string;
  }>;
  units?: Array<{
    id: number;
    name: string;
  }>;
  positions?: Array<{
    id: number;
    name: string;
  }>;
  profile?: {
    id: number | null;
    userId?: number;
    fullName: string;
    slug: string;
    email: string | null;
    phone: string | null;
    bio: string | null;
    bioFormat: "blocknote_json";
    isPublic: boolean;
    avatarId: number | null;
    avatarUrl: string | null;
    userEmail?: string;
    userName?: string;
    appointments?: Array<{
      id?: number;
      unit_id: number;
      position_id: number;
      start_date: string;
      end_date?: string | null;
      note?: string | null;
    }>;
  };
}

export interface CmsStaffProfileShowPageProps extends SharedData {
  can: {
    manage: boolean;
    edit: boolean;
  };
  profile: {
    id: number;
    fullName: string;
    slug: string;
    email: string | null;
    phone: string | null;
    bio: string | null;
    bioFormat: "blocknote_json";
    isPublic: boolean;
    avatarUrl: string | null;
    userName: string | null;
    userEmail: string | null;
    appointments: Array<{
      id: number;
      unitName: string | null;
      positionName: string | null;
      startDate: string | null;
      endDate: string | null;
      note: string | null;
    }>;
  };
}
export interface CmsPostCategoryRow {
  childrenCount: number;
  description: string | null;
  id: number;
  isActive: boolean;
  name: string;
  parentId: number | null;
  parentName: string | null;
  postCount: number;
  slug: string;
  sortOrder: number;
  updatedAt: string;
}

export interface CmsPostCategoriesPageProps extends SharedData {
  can: {
    manageCategories: boolean;
  };
  categories: CmsPaginatedCollection<CmsPostCategoryRow>;
  parentOptions: Array<{
    label: string;
    parentId: number | null;
    value: string;
  }>;
}
