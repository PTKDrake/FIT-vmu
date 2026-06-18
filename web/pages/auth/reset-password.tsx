import { Form, Head } from "@inertiajs/react";
import { withAuthLayout } from "@/layouts/auth-layout";

interface ResetPasswordPageProps {
  email: string;
  token: string;
}

export default function ResetPasswordPage({
  email,
  token,
}: ResetPasswordPageProps) {
  return (
    <>
      <Head title="Đặt lại mật khẩu" />
      <Form method="post" action="/reset-password" className="space-y-4">
        {({ errors, processing }) => (
          <>
            <input name="token" type="hidden" value={token} />
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-fg"
              >
                Email
              </label>
              <input
                id="email"
                aria-label="Email"
                className="w-full rounded-md border border-input bg-bg px-3 py-2 text-fg placeholder:text-muted-fg focus:border-ring focus:outline-hidden focus:ring-4 focus:ring-ring/15"
                name="email"
                type="email"
                defaultValue={email}
              />
              {errors.email ? (
                <p className="text-sm text-danger-subtle-fg">{errors.email}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-fg"
              >
                Mật khẩu mới
              </label>
              <input
                id="password"
                aria-label="Mật khẩu mới"
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
            <div className="space-y-2">
              <label
                htmlFor="password_confirmation"
                className="block text-sm font-medium text-fg"
              >
                Xác nhận mật khẩu
              </label>
              <input
                id="password_confirmation"
                aria-label="Xác nhận mật khẩu"
                className="w-full rounded-md border border-input bg-bg px-3 py-2 text-fg focus:border-ring focus:outline-hidden focus:ring-4 focus:ring-ring/15"
                name="password_confirmation"
                type="password"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg"
              disabled={processing}
            >
              Đặt lại mật khẩu
            </button>
          </>
        )}
      </Form>
    </>
  );
}

ResetPasswordPage.layout = withAuthLayout("auth/reset-password");
