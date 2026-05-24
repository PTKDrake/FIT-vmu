import { Head, useForm } from "@inertiajs/react"
import type { FormEvent, ReactNode } from "react"
import AppLayout from "@/layouts/app-layout"
import SettingsLayout from "@/pages/settings/settings-layout"

export default function PasswordPage() {
  const form = useForm({
    current_password: "",
    password: "",
    password_confirmation: "",
  })

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    form.put("/settings/password", {
      preserveScroll: true,
      onSuccess: () => {
        form.reset()
      },
    })
  }

  return (
    <>
      <Head title="Password" />
      <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6">
        <div>
          <h1 className="text-2xl font-semibold">Change Password</h1>
          <p className="text-sm text-slate-600">Update your password to keep your account secure.</p>
        </div>

        <form className="space-y-4" onSubmit={submit}>
          {[
            ["current_password", "Current Password"],
            ["password", "New Password"],
            ["password_confirmation", "Confirm Password"],
          ].map(([field, label]) => (
            <div key={field} className="space-y-2">
              <label htmlFor={field} className="block text-sm font-medium">{label}</label>
              <input
                id={field}
                name={field}
                aria-label={label}
                className="w-full rounded-md border border-slate-300 px-3 py-2"
                type="password"
                value={form.data[field as keyof typeof form.data]}
                onChange={(event) =>
                  form.setData(field as keyof typeof form.data, event.target.value)
                }
              />
              {form.errors[field as keyof typeof form.errors] ? (
                <p className="text-sm text-red-600">
                  {form.errors[field as keyof typeof form.errors]}
                </p>
              ) : null}
            </div>
          ))}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              disabled={form.processing}
            >
              Save
            </button>
            {form.recentlySuccessful ? <span className="text-sm text-slate-500">Saved.</span> : null}
          </div>
        </form>
      </div>
    </>
  )
}

PasswordPage.layout = (page: ReactNode) => (
  <AppLayout>
    <SettingsLayout>{page}</SettingsLayout>
  </AppLayout>
)
