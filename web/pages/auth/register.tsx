import { Form, Head } from "@inertiajs/react"
import type { ReactNode } from "react"
import GuestLayout from "@/layouts/guest-layout"

export default function RegisterPage() {
  return (
    <>
      <Head title="Register" />
      <Form method="post" action="/register" className="space-y-4">
        {({ errors, processing }) => (
          <>
            {[
              ["name", "Name", "text"],
              ["email", "Email", "email"],
              ["password", "Password", "password"],
              ["password_confirmation", "Confirm Password", "password"],
            ].map(([name, label, type]) => (
              <div key={name} className="space-y-2">
                <label htmlFor={name} className="block text-sm font-medium">{label}</label>
                <input id={name} aria-label={label} className="w-full rounded-md border border-slate-300 px-3 py-2" name={name} type={type} />
                {errors[name as keyof typeof errors] ? (
                  <p className="text-sm text-red-600">{errors[name as keyof typeof errors]}</p>
                ) : null}
              </div>
            ))}
            <button
              type="submit"
              className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
              disabled={processing}
            >
              Create account
            </button>
          </>
        )}
      </Form>
    </>
  )
}

RegisterPage.layout = (page: ReactNode) => (
  <GuestLayout
    header="Create account"
    description="Register a new account to get started."
  >
    {page}
  </GuestLayout>
)
