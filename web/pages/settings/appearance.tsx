import { Head } from "@inertiajs/react"
import type { ReactNode } from "react"
import AppLayout from "@/layouts/app-layout"
import SettingsLayout from "@/pages/settings/settings-layout"
import { type Theme, useTheme } from "@/hooks/use-theme"

const options: Theme[] = ["light", "dark", "system"]

export default function AppearancePage() {
  const { theme, updateTheme } = useTheme()

  return (
    <>
      <Head title="Appearance" />
      <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6">
        <div>
          <h1 className="text-2xl font-semibold">Appearance</h1>
          <p className="text-sm text-slate-600">Choose how the interface should look.</p>
        </div>

        <div className="flex gap-3">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => updateTheme(option)}
              className={`rounded-md px-4 py-2 text-sm font-medium ${
                theme === option ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

AppearancePage.layout = (page: ReactNode) => (
  <AppLayout>
    <SettingsLayout>{page}</SettingsLayout>
  </AppLayout>
)
