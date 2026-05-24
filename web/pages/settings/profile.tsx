import { Head, Link, useForm, usePage } from "@inertiajs/react"
import type { ReactNode, FormEvent } from "react"
import AppLayout from "@/layouts/app-layout"
import SettingsLayout from "@/pages/settings/settings-layout"
import type { SharedData } from "@/types/shared"

interface ProfilePageProps {
  mustVerifyEmail: boolean
  status?: string
}

export default function ProfilePage({ mustVerifyEmail, status }: ProfilePageProps) {
  const { auth } = usePage<SharedData>().props
  const form = useForm({
    name: auth.user?.name || "",
    email: auth.user?.email || "",
  })

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    form.patch("/settings/profile", {
      preserveScroll: true,
    })
  }

  return (
    <>
      <Head title="Profile" />
      <div className="space-y-6 rounded-xl border border-slate-200 bg-white p-6">
        <div>
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="text-sm text-slate-600">Update your name and email address.</p>
        </div>

        <form className="space-y-4" onSubmit={submit}>
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">Name</label>
            <input
              id="name"
              name="name"
              aria-label="Name"
              className="w-full rounded-md border border-slate-300 px-3 py-2"
              value={form.data.name}
              onChange={(event) => form.setData("name", event.target.value)}
            />
            {form.errors.name ? <p className="text-sm text-red-600">{form.errors.name}</p> : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="profile_email" className="block text-sm font-medium">Email</label>
            <input
              id="profile_email"
              name="email"
              aria-label="Email"
              className="w-full rounded-md border border-slate-300 px-3 py-2"
              type="email"
              value={form.data.email}
              onChange={(event) => form.setData("email", event.target.value)}
            />
            {form.errors.email ? <p className="text-sm text-red-600">{form.errors.email}</p> : null}
          </div>

          {mustVerifyEmail && auth.user?.email_verified_at === null ? (
            <div className="rounded-md bg-amber-50 p-4 text-sm text-amber-800">
              Your email address is unverified.
              <Link href="/email/verification-notification" method="post" className="ml-1 underline">
                Click here to re-send the verification email.
              </Link>
              {status === "verification-link-sent" ? (
                <div className="mt-2">A new verification link has been sent to your email address.</div>
              ) : null}
            </div>
          ) : null}

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

ProfilePage.layout = (page: ReactNode) => (
  <AppLayout>
    <SettingsLayout>{page}</SettingsLayout>
  </AppLayout>
)
