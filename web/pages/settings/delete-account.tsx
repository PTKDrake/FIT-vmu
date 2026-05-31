import { Head, useForm } from "@inertiajs/react";
import type { FormEvent, ReactNode } from "react";
import AppLayout from "@/layouts/app-layout";
import SettingsLayout from "@/pages/settings/settings-layout";

export default function DeleteAccountPage() {
  const form = useForm({
    password: "",
  });

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    form.delete("/settings/delete-account", {
      preserveScroll: true,
      onSuccess: () => {
        form.reset();
      },
    });
  }

  return (
    <>
      <Head title="Delete Account" />
      <div className="space-y-6 rounded-xl border border-danger-subtle bg-overlay p-6">
        <div>
          <h1 className="text-2xl font-semibold text-danger">Delete Account</h1>
          <p className="text-sm text-muted-fg">
            This action permanently deletes your account and cannot be undone.
          </p>
        </div>

        <form className="space-y-4" onSubmit={submit}>
          <div className="space-y-2">
            <label
              htmlFor="delete_password"
              className="block text-sm font-medium text-fg"
            >
              Confirm Password
            </label>
            <input
              id="delete_password"
              name="password"
              aria-label="Confirm Password"
              className="w-full rounded-md border border-input bg-bg px-3 py-2 text-fg focus:border-ring focus:outline-hidden focus:ring-4 focus:ring-ring/15"
              type="password"
              value={form.data.password}
              onChange={(event) => form.setData("password", event.target.value)}
            />
            {form.errors.password ? (
              <p className="text-sm text-danger-subtle-fg">
                {form.errors.password}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            className="rounded-md bg-danger px-4 py-2 text-sm font-medium text-danger-fg"
            disabled={form.processing}
          >
            Delete Account
          </button>
        </form>
      </div>
    </>
  );
}

DeleteAccountPage.layout = (page: ReactNode) => (
  <AppLayout>
    <SettingsLayout>{page}</SettingsLayout>
  </AppLayout>
);
