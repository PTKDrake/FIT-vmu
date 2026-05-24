import { Form, Head } from "@inertiajs/react"
import type { ReactNode } from "react"
import GuestLayout from "@/layouts/guest-layout"

interface ForgotPasswordPageProps {
  status?: string
}

export default function ForgotPasswordPage({ status }: ForgotPasswordPageProps) {
  return (
    <>
      <Head title="Forgot Password" />
      {status ? <div className="mb-4 text-sm text-emerald-600">{status}</div> : null}
      <Form method="post" action="/forgot-password" className="space-y-4">
        {({ errors, processing }) => (
          <>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">Email</label>
              <input id="email" aria-label="Email" className="w-full rounded-md border border-slate-300 px-3 py-2" name="email" type="email" />
              {errors.email ? <p className="text-sm text-red-600">{errors.email}</p> : null}
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              disabled={processing}
            >
              Email Password Reset Link
            </button>
          </>
        )}
      </Form>
    </>
  )
}

ForgotPasswordPage.layout = (page: ReactNode) => (
  <GuestLayout
    header="Forgot password"
    description="Enter your email address and we will send you a reset link."
  >
    {page}
  </GuestLayout>
)
