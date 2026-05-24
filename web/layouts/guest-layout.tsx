import type { PropsWithChildren, ReactNode } from "react"
import { Link } from "@inertiajs/react"

interface GuestLayoutProps {
  description?: ReactNode
  header?: ReactNode
}

export default function GuestLayout({
  description = null,
  header = null,
  children,
}: PropsWithChildren<GuestLayoutProps>) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="font-semibold text-slate-900">
            VMUFit
          </Link>
          {header ? <h1 className="mt-4 text-2xl font-semibold text-slate-900">{header}</h1> : null}
          {description ? <p className="mt-2 text-sm text-slate-600">{description}</p> : null}
        </div>
        {children}
      </div>
    </div>
  )
}
