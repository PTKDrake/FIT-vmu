import type { PropsWithChildren } from "react"
import { Link, usePage } from "@inertiajs/react"
import type { SharedData } from "@/types/shared"

export default function AppLayout({ children }: PropsWithChildren) {
  const { auth } = usePage<SharedData>().props

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="border-b border-slate-200">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-semibold">
            VMUFit
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/">Home</Link>
            {auth.user ? (
              <>
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/settings/profile">Settings</Link>
              </>
            ) : (
              <>
                <Link href="/login">Login</Link>
                <Link href="/register">Register</Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  )
}
