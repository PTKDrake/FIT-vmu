import { Form, Head } from "@inertiajs/react";
import { withAuthLayout } from "@/layouts/auth-layout";

export default function ConfirmPasswordPage() {
  return (
    <>
      <Head title="Xác nhận mật khẩu" />
      <Form method="post" action="/confirm-password" className="space-y-4">
        {({ errors, processing }) => (
          <>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-fg"
              >
                Mật khẩu
              </label>
              <input
                id="password"
                aria-label="Mật khẩu"
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
              Xác nhận mật khẩu
            </button>
          </>
        )}
      </Form>
    </>
  );
}

ConfirmPasswordPage.layout = withAuthLayout("auth/confirm-password");
