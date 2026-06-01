import { Form, Head } from "@inertiajs/react";
import type { ReactNode } from "react";
import GuestLayout from "@/layouts/guest-layout";

interface ForgotPasswordPageProps {
  status?: string;
}

export default function ForgotPasswordPage({
  status,
}: ForgotPasswordPageProps) {
  return (
    <>
      <Head title="Quên mật khẩu" />
      {status ? (
        <div className="mb-4 rounded-xl border border-success-subtle bg-success-subtle px-4 py-3 text-sm text-success-subtle-fg">
          {status}
        </div>
      ) : null}
      <Form method="post" action="/forgot-password" className="space-y-4">
        {({ errors, processing }) => (
          <>
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
              />
              {errors.email ? (
                <p className="text-sm text-danger-subtle-fg">{errors.email}</p>
              ) : null}
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg"
              disabled={processing}
            >
              Gửi liên kết đặt lại mật khẩu
            </button>
          </>
        )}
      </Form>
    </>
  );
}

ForgotPasswordPage.layout = (page: ReactNode) => (
  <GuestLayout
    header="Quên mật khẩu"
    description="Nhập địa chỉ email của bạn và chúng tôi sẽ gửi liên kết đặt lại mật khẩu."
  >
    {page}
  </GuestLayout>
);
