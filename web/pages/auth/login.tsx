import { Form, Head, Link } from "@inertiajs/react"
import type { ReactNode } from "react"
import GuestLayout from "@/layouts/guest-layout"

interface LoginPageProps {
  canResetPassword: boolean
  status?: string
}

export default function LoginPage({ canResetPassword, status }: LoginPageProps) {
  return (
    <>
      <Head title="Login" />
      {status ? <div className="mb-4 text-sm text-emerald-600">{status}</div> : null}
      <Form method="post" action="/login" className="space-y-4">
        {({ errors, processing }) => (
          <>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">Email</label>
              <input id="email" aria-label="Email" className="w-full rounded-md border border-slate-300 px-3 py-2" name="email" type="email" />
              {errors.email ? <p className="text-sm text-red-600">{errors.email}</p> : null}
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium">Password</label>
              <input id="password" aria-label="Password" className="w-full rounded-md border border-slate-300 px-3 py-2" name="password" type="password" />
              {errors.password ? <p className="text-sm text-red-600">{errors.password}</p> : null}
            </div>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input aria-label="Remember me" name="remember" type="checkbox" />
              Remember me
            </label>
            {canResetPassword ? (
              <Link href="/forgot-password" className="block text-sm text-slate-600 underline">
                Forgot your password?
              </Link>
            ) : null}
            <button
              type="submit"
              className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              disabled={processing}
            >
              Log in
            </button>
          </>
        )}
      </Form>
    </>
  )
}

LoginPage.layout = (page: ReactNode) => (
  <GuestLayout
    header="Login"
    description="Sign in with your email address to continue."
  >
    {page}
  </GuestLayout>
)
