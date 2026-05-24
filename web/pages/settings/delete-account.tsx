import { Head, useForm } from "@inertiajs/react"
import type { FormEvent, ReactNode } from "react"
import AppLayout from "@/layouts/app-layout"
import SettingsLayout from "@/pages/settings/settings-layout"

export default function DeleteAccountPage() {
  const form = useForm({
    password: "",
  })

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    form.delete("/settings/delete-account", {
      preserveScroll: true,
      onSuccess: () => {
        form.reset()
      },
    })
  }

  return (
    <>
      <Head title="Delete Account" />
      <div className="space-y-6 rounded-xl border border-red-200 bg-white p-6">
        <div>
          <h1 className="text-2xl font-semibold text-red-700">Delete Account</h1>
          <p className="text-sm text-slate-600">
            This action permanently deletes your account and cannot be undone.
          </p>
        </div>

        <form className="space-y-4" onSubmit={submit}>
          <div className="space-y-2">
            <label htmlFor="delete_password" className="block text-sm font-medium">Confirm Password</label>
            <input
              id="delete_password"
              name="password"
              aria-label="Confirm Password"
              className="w-full rounded-md border border-slate-300 px-3 py-2"
              type="password"
              value={form.data.password}
              onChange={(event) => form.setData("password", event.target.value)}
            />
            {form.errors.password ? <p className="text-sm text-red-600">{form.errors.password}</p> : null}
          </div>

          <button
            type="submit"
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white"
            disabled={form.processing}
          >
            Delete Account
          </button>
        </form>
      </div>
    </>
  )
}

DeleteAccountPage.layout = (page: ReactNode) => (
  <AppLayout>
    <SettingsLayout>{page}</SettingsLayout>
  </AppLayout>
)
