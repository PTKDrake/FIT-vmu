import { Link, usePage } from "@inertiajs/react"
import type { PropsWithChildren } from "react"

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
            className={`block rounded-md px-3 py-2 text-sm transition-colors ${
              page.url === link.href ? "bg-primary text-primary-fg" : "bg-muted text-muted-fg hover:text-fg"
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
