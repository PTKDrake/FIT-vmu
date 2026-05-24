import type { PropsWithChildren } from "react"
import { Link, usePage } from "@inertiajs/react"

const links = [
  { href: "/settings/profile", label: "Profile" },
  { href: "/settings/password", label: "Password" },
  { href: "/settings/appearance", label: "Appearance" },
  { href: "/settings/delete-account", label: "Delete Account" },
]

export default function SettingsLayout({ children }: PropsWithChildren) {
  const page = usePage()

  return (
    <div className="grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
      <aside className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block rounded-md px-3 py-2 text-sm ${
              page.url === link.href ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </aside>
      <div>{children}</div>
    </div>
  )
}
