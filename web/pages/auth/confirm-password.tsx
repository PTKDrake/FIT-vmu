import { Form, Head } from "@inertiajs/react"
import type { ReactNode } from "react"
import GuestLayout from "@/layouts/guest-layout"

export default function ConfirmPasswordPage() {
  return (
    <>
      <Head title="Confirm Password" />
      <Form method="post" action="/confirm-password" className="space-y-4">
        {({ errors, processing }) => (
          <>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <input id="password" aria-label="Password" className="w-full rounded-md border border-slate-300 px-3 py-2" name="password" type="password" />
              {errors.password ? <p className="text-sm text-red-600">{errors.password}</p> : null}
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              disabled={processing}
            >
              Confirm Password
            </button>
          </>
        )}
      </Form>
    </>
  )
}

ConfirmPasswordPage.layout = (page: ReactNode) => (
  <GuestLayout
    header="Confirm password"
    description="Please confirm your password before continuing."
  >
    {page}
  </GuestLayout>
)
