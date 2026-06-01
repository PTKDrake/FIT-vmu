import { Form, Head, Link, usePage } from "@inertiajs/react";
import type { ReactNode } from "react";
import { store as loginStore } from "@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController";
import { redirect as googleRedirect } from "@/actions/App/Http/Controllers/Auth/GoogleOAuthController";
import { create as registerCreate } from "@/actions/App/Http/Controllers/Auth/RegisteredUserController";
import GuestLayout from "@/layouts/guest-layout";
import { request as forgotPasswordRequest } from "@/routes/password";
import type { SharedData } from "@/types/shared";

interface LoginPageProps {
  canResetPassword: boolean;
  status?: string;
}

export default function LoginPage({
  canResetPassword,
  status,
}: LoginPageProps) {
  const {
    auth: {
      social: { googleEnabled },
    },
  } = usePage<SharedData>().props;

  return (
    <>
      <Head title="Login" />
      {status ? (
        <div className="mb-6 rounded-2xl border border-success-subtle bg-success-subtle px-4 py-3 text-sm text-success-subtle-fg">
          {status}
        </div>
      ) : null}
      <Form {...loginStore.form()} className="space-y-6">
        {({ errors, processing }) => (
          <>
            <div className="space-y-2.5">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-fg"
              >
                Email
              </label>
              <input
                id="email"
                aria-label="Email"
                className="h-11 w-full rounded-xl border border-input bg-bg px-4 text-sm text-fg shadow-sm transition placeholder:text-muted-fg focus:border-ring focus:outline-hidden focus:ring-4 focus:ring-ring/15"
                name="email"
                type="email"
                placeholder="m@example.com"
              />
              {errors.email ? (
                <p className="text-sm text-danger-subtle-fg">{errors.email}</p>
              ) : null}
            </div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-fg"
                >
                  Password
                </label>
                {canResetPassword ? (
                  <Link
                    href={forgotPasswordRequest.url()}
                    className="text-sm font-medium text-muted-fg underline-offset-4 transition hover:text-fg hover:underline"
                  >
                    Forgot your password?
                  </Link>
                ) : null}
              </div>
              <input
                id="password"
                aria-label="Password"
                className="h-11 w-full rounded-xl border border-input bg-bg px-4 text-sm text-fg shadow-sm transition focus:border-ring focus:outline-hidden focus:ring-4 focus:ring-ring/15"
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
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-fg shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={processing}
            >
              Login
            </button>

            {googleEnabled ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-sm text-muted-fg">
                    Or continue with
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <a
                  href={googleRedirect.url()}
                  className="inline-flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-border bg-overlay px-4 text-sm font-semibold text-fg shadow-sm transition hover:bg-muted"
                >
                  <GoogleMark />
                  Login with Google
                </a>
              </>
            ) : null}

            <p className="text-center text-sm text-muted-fg">
              Don&apos;t have an account?{" "}
              <Link
                href={registerCreate.url()}
                className="font-medium text-fg underline-offset-4 hover:underline"
              >
                Sign up
              </Link>
            </p>
          </>
        )}
      </Form>
    </>
  );
}

LoginPage.layout = (page: ReactNode) => (
  <GuestLayout
    header="Login to your account"
    description="Enter your email below to login to your account."
  >
    {page}
  </GuestLayout>
);

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-4">
      <path
        d="M21.805 12.23c0-.74-.06-1.29-.19-1.86H12.2v3.4h5.52c-.11.85-.7 2.13-2 3l-.02.11 2.77 2.1.19.02c1.77-1.6 2.79-3.96 2.79-6.77Z"
        fill="#4285F4"
      />
      <path
        d="M12.2 21.88c2.7 0 4.97-.87 6.63-2.37l-3.16-2.42c-.84.57-1.96.96-3.47.96-2.64 0-4.88-1.7-5.67-4.06l-.1.01-2.88 2.18-.03.09c1.65 3.19 5.04 5.61 8.68 5.61Z"
        fill="#34A853"
      />
      <path
        d="M6.53 13.99a5.7 5.7 0 0 1-.33-1.91c0-.66.12-1.3.31-1.91l-.01-.13-2.91-2.22-.1.04A9.67 9.67 0 0 0 2.44 12c0 1.54.38 2.99 1.05 4.27l3.04-2.28Z"
        fill="#FBBC05"
      />
      <path
        d="M12.2 5.95c1.9 0 3.19.81 3.92 1.49l2.87-2.73C17.16 3.05 14.89 2 12.2 2c-3.64 0-7.03 2.42-8.68 5.61l3.02 2.3c.8-2.36 3.04-3.96 5.67-3.96Z"
        fill="#EA4335"
      />
    </svg>
  );
}
