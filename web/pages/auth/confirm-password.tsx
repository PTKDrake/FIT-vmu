import { Form, Head } from "@inertiajs/react";
import type { ReactNode } from "react";
import GuestLayout from "@/layouts/guest-layout";

export default function ConfirmPasswordPage() {
  return (
    <>
      <Head title="Confirm Password" />
      <Form method="post" action="/confirm-password" className="space-y-4">
        {({ errors, processing }) => (
          <>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-fg"
              >
                Password
              </label>
              <input
                id="password"
                aria-label="Password"
                className="w-full rounded-md border border-input bg-bg px-3 py-2 text-fg focus:border-ring focus:outline-hidden focus:ring-4 focus:ring-ring/15"
                name="password"
                type="password"
              />
              {errors.password ? (
                <p className="text-sm text-danger-subtle-fg">
                  {errors.password}
                </p>
              ) : null}
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg"
              disabled={processing}
            >
              Confirm Password
            </button>
          </>
        )}
      </Form>
    </>
  );
}

ConfirmPasswordPage.layout = (page: ReactNode) => (
  <GuestLayout
    header="Confirm password"
    description="Please confirm your password before continuing."
  >
    {page}
  </GuestLayout>
);
