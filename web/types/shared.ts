export interface AuthUser {
  email: string
  email_verified_at: string | null
  id: number
  name: string
}

export interface FlashData {
  message: string
  type: "error" | "info" | "success" | "warning"
}

export interface SharedData extends Record<string, unknown> {
  auth: {
    user: AuthUser | null
  }
  flash: FlashData | null
}
