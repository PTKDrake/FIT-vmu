export interface StaffProfileData {
  id: number;
  academic_title: string | null;
  full_name: string;
  slug: string;
  avatar_id: number | null;
  avatar_url: string | null;
  email: string | null;
  phone: string | null;
  bio: string | null;
  bio_format: "blocknote_json";
  is_public: boolean;
}

export interface AuthUser {
  email: string;
  email_verified_at: string | null;
  gravatar: string;
  id: number;
  name: string;
  staffProfile: StaffProfileData | null;
}

export interface FlashData {
  data?: unknown;
  message: string;
  type: "error" | "info" | "success" | "warning";
}

export interface SharedData extends Record<string, unknown> {
  auth: {
    permissions: string[];
    social: {
      googleEnabled: boolean;
    };
    user: AuthUser | null;
  };
  features: {
    blocknoteAiEnabled: boolean;
  };
  flash: FlashData | null;
  sidebarOpen: boolean;
  layout: any;
  dynamicData: any;
}
