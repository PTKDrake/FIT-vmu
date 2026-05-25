export interface AuthUser {
  email: string
  email_verified_at: string | null
  gravatar: string
  id: number
  name: string
}

export interface FlashData {
  data?: unknown
  message: string
  type: "error" | "info" | "success" | "warning"
}

export interface SharedData extends Record<string, unknown> {
  auth: {
    permissions: string[]
    social: {
      googleEnabled: boolean
    }
    user: AuthUser | null
  }
  flash: FlashData | null
  sidebarOpen: boolean
}
