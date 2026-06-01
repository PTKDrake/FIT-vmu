import { Head, useForm } from "@inertiajs/react";
import type { FormEvent, ReactNode } from "react";
import AppLayout from "@/layouts/app-layout";
import SettingsLayout from "@/pages/settings/settings-layout";

export default function PasswordPage() {
  const form = useForm({
    current_password: "",
    password: "",
    password_confirmation: "",
  });

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    form.put("/settings/password", {
      preserveScroll: true,
      onSuccess: () => {
        form.reset();
      },
    });
  }

  return (
    <>
      <Head title="Mật khẩu" />
      <div className="space-y-6 rounded-xl border border-border bg-overlay p-6">
        <div>
          <h1 className="text-2xl font-semibold text-fg">Đổi mật khẩu</h1>
          <p className="text-sm text-muted-fg">
            Cập nhật mật khẩu để giữ tài khoản của bạn an toàn.
          </p>
        </div>

        <form className="space-y-4" onSubmit={submit}>
          {[
            ["current_password", "Mật khẩu hiện tại"],
            ["password", "Mật khẩu mới"],
            ["password_confirmation", "Xác nhận mật khẩu"],
          ].map(([field, label]) => (
            <div key={field} className="space-y-2">
              <label
                htmlFor={field}
                className="block text-sm font-medium text-fg"
              >
                {label}
              </label>
              <input
                id={field}
                name={field}
                aria-label={label}
                className="w-full rounded-md border border-input bg-bg px-3 py-2 text-fg focus:border-ring focus:outline-hidden focus:ring-4 focus:ring-ring/15"
                type="password"
                value={form.data[field as keyof typeof form.data]}
                onChange={(event) =>
                  form.setData(
                    field as keyof typeof form.data,
                    event.target.value,
                  )
                }
              />
              {form.errors[field as keyof typeof form.errors] ? (
                <p className="text-sm text-danger-subtle-fg">
                  {form.errors[field as keyof typeof form.errors]}
                </p>
              ) : null}
            </div>
          ))}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg"
              disabled={form.processing}
            >
              Lưu thay đổi
            </button>
            {form.recentlySuccessful ? (
              <span className="text-sm text-muted-fg">Đã lưu.</span>
            ) : null}
          </div>
        </form>
      </div>
    </>
  );
}

PasswordPage.layout = (page: ReactNode) => (
  <AppLayout>
    <SettingsLayout>{page}</SettingsLayout>
  </AppLayout>
);
