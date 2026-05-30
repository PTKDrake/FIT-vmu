import { Head, Link, useForm, usePage } from "@inertiajs/react";
import type { ReactNode, FormEvent } from "react";
import AppLayout from "@/layouts/app-layout";
import SettingsLayout from "@/pages/settings/settings-layout";
import type { SharedData } from "@/types/shared";

interface ProfilePageProps {
  mustVerifyEmail: boolean;
  status?: string;
}

export default function ProfilePage({
  mustVerifyEmail,
  status,
}: ProfilePageProps) {
  const { auth } = usePage<SharedData>().props;
  const form = useForm({
    name: auth.user?.name || "",
    email: auth.user?.email || "",
  });

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    form.patch("/settings/profile", {
      preserveScroll: true,
    });
  }

  return (
    <>
      <Head title="Profile" />
      <div className="space-y-6 rounded-xl border border-border bg-overlay p-6">
        <div>
          <h1 className="text-2xl font-semibold text-fg">Profile</h1>
          <p className="text-sm text-muted-fg">
            Update your name and email address.
          </p>
        </div>

        <form className="space-y-4" onSubmit={submit}>
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-fg">
              Name
            </label>
            <input
              id="name"
              name="name"
              aria-label="Name"
              className="w-full rounded-md border border-input bg-bg px-3 py-2 text-fg placeholder:text-muted-fg focus:border-ring focus:outline-hidden focus:ring-4 focus:ring-ring/15"
              value={form.data.name}
              onChange={(event) => form.setData("name", event.target.value)}
            />
            {form.errors.name ? (
              <p className="text-sm text-danger-subtle-fg">
                {form.errors.name}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="profile_email"
              className="block text-sm font-medium text-fg"
            >
              Email
            </label>
            <input
              id="profile_email"
              name="email"
              aria-label="Email"
              className="w-full rounded-md border border-input bg-bg px-3 py-2 text-fg placeholder:text-muted-fg focus:border-ring focus:outline-hidden focus:ring-4 focus:ring-ring/15"
              type="email"
              value={form.data.email}
              onChange={(event) => form.setData("email", event.target.value)}
            />
            {form.errors.email ? (
              <p className="text-sm text-danger-subtle-fg">
                {form.errors.email}
              </p>
            ) : null}
          </div>

          {mustVerifyEmail && auth.user?.email_verified_at === null ? (
            <div className="rounded-md border border-warning-subtle bg-warning-subtle p-4 text-sm text-warning-subtle-fg">
              Your email address is unverified.
              <Link
                href="/email/verification-notification"
                method="post"
                className="ml-1 underline"
              >
                Click here to re-send the verification email.
              </Link>
              {status === "verification-link-sent" ? (
                <div className="mt-2">
                  A new verification link has been sent to your email address.
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-fg"
              disabled={form.processing}
            >
              Save
            </button>
            {form.recentlySuccessful ? (
              <span className="text-sm text-muted-fg">Saved.</span>
            ) : null}
          </div>
        </form>
      </div>
    </>
  );
}

ProfilePage.layout = (page: ReactNode) => (
  <AppLayout>
    <SettingsLayout>{page}</SettingsLayout>
  </AppLayout>
);
