import { Form, Head } from "@inertiajs/react"
import type { ReactNode } from "react"
import GuestLayout from "@/layouts/guest-layout"

interface VerifyEmailPageProps {
  status?: string
}

export default function VerifyEmailPage({ status }: VerifyEmailPageProps) {
  return (
    <>
      <Head title="Verify Email" />
      {status ? (
        <div className="mb-4 rounded-xl border border-success-subtle bg-success-subtle px-4 py-3 text-sm text-success-subtle-fg">
          {status}
        </div>
      ) : null}
      <div className="space-y-4">
        <p className="text-sm text-muted-fg">
          Thanks for signing up. Before getting started, verify your email address by clicking the link we just emailed to you.
        </p>
        <Form method="post" action="/email/verification-notification">
          {({ processing }) => (
            <button
              type="submit"
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg"
              disabled={processing}
            >
              Resend Verification Email
            </button>
          )}
        </Form>
      </div>
    </>
  )
}

VerifyEmailPage.layout = (page: ReactNode) => (
  <GuestLayout
    header="Verify email"
    description="Check your inbox and confirm your address."
  >
    {page}
  </GuestLayout>
)
