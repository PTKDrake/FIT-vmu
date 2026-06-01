import { Form, Head } from "@inertiajs/react";
import type { ReactNode } from "react";
import GuestLayout from "@/layouts/guest-layout";

interface VerifyEmailPageProps {
  status?: string;
}

export default function VerifyEmailPage({ status }: VerifyEmailPageProps) {
  return (
    <>
      <Head title="Xác thực email" />
      {status ? (
        <div className="mb-4 rounded-xl border border-success-subtle bg-success-subtle px-4 py-3 text-sm text-success-subtle-fg">
          {status}
        </div>
      ) : null}
      <div className="space-y-4">
        <p className="text-sm text-muted-fg">
          Cảm ơn bạn đã đăng ký. Trước khi bắt đầu, hãy xác thực địa chỉ email
          của bạn bằng cách bấm vào liên kết mà chúng tôi vừa gửi.
        </p>
        <Form method="post" action="/email/verification-notification">
          {({ processing }) => (
            <button
              type="submit"
              className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg"
              disabled={processing}
            >
              Gửi lại email xác thực
            </button>
          )}
        </Form>
      </div>
    </>
  );
}

VerifyEmailPage.layout = (page: ReactNode) => (
  <GuestLayout
    header="Xác thực email"
    description="Kiểm tra hộp thư và xác nhận địa chỉ của bạn."
  >
    {page}
  </GuestLayout>
);
