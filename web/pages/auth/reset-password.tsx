import { Form, Head } from "@inertiajs/react"
import type { ReactNode } from "react"
import GuestLayout from "@/layouts/guest-layout"

interface ResetPasswordPageProps {
  email: string
  token: string
}

export default function ResetPasswordPage({ email, token }: ResetPasswordPageProps) {
  return (
    <>
      <Head title="Reset Password" />
      <Form method="post" action="/reset-password" className="space-y-4">
        {({ errors, processing }) => (
          <>
            <input name="token" type="hidden" value={token} />
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">Email</label>
              <input id="email" aria-label="Email" className="w-full rounded-md border border-slate-300 px-3 py-2" name="email" type="email" defaultValue={email} />
              {errors.email ? <p className="text-sm text-red-600">{errors.email}</p> : null}
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <input id="password" aria-label="Password" className="w-full rounded-md border border-slate-300 px-3 py-2" name="password" type="password" />
              {errors.password ? <p className="text-sm text-red-600">{errors.password}</p> : null}
            </div>
            <div className="space-y-2">
              <label htmlFor="password_confirmation" className="block text-sm font-medium">Confirm Password</label>
              <input
                id="password_confirmation"
                aria-label="Confirm Password"
                className="w-full rounded-md border border-slate-300 px-3 py-2"
                name="password_confirmation"
                type="password"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              disabled={processing}
            >
              Reset Password
            </button>
          </>
        )}
      </Form>
    </>
  )
}

ResetPasswordPage.layout = (page: ReactNode) => (
  <GuestLayout
    header="Reset password"
    description="Choose a new password for your account."
  >
    {page}
  </GuestLayout>
)
