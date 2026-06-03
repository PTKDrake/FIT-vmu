import { ArrowLeftIcon, MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { Link } from "@inertiajs/react";
import type { PropsWithChildren, ReactNode } from "react";
import { AppLogo } from "@/components/brand/app-logo";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { home } from "@/routes";

interface GuestLayoutProps {
  description?: ReactNode;
  header?: ReactNode;
}

export default function GuestLayout({
  description = null,
  header = null,
  children,
}: PropsWithChildren<GuestLayoutProps>) {
  const { resolvedTheme, updateTheme } = useTheme();

  return (
    <div className="min-h-screen bg-bg text-fg transition-colors duration-300">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,0.96fr)_minmax(24rem,1fr)]">
        <section className="relative flex min-h-screen flex-col overflow-hidden border-border/50 bg-bg backdrop-blur-xl transition-colors duration-300 lg:border-r">
          <div className="flex items-center gap-3 px-6 pt-6 sm:px-10 lg:px-12">
            <Button
              type="button"
              intent="plain"
              size="sq-sm"
              isCircle
              onClick={() => {
                if (window.history.length > 1) {
                  window.history.back();

                  return;
                }

                window.location.assign(home.url());
              }}
              aria-label="Quay lại"
            >
              <ArrowLeftIcon className="size-4" aria-hidden />
            </Button>
            <Link
              href={home.url()}
              className="inline-flex items-center rounded-full px-1 py-1 text-sm font-semibold text-fg"
            >
              <AppLogo size="sm" />
            </Link>
            <Button
              type="button"
              intent="plain"
              size="sq-sm"
              isCircle
              className="ml-auto"
              onClick={() => {
                updateTheme(resolvedTheme === "dark" ? "light" : "dark");
              }}
              aria-label={
                resolvedTheme === "dark"
                  ? "Chuyển sang giao diện sáng"
                  : "Chuyển sang giao diện tối"
              }
            >
              {resolvedTheme === "dark" ? (
                <SunIcon className="size-4" aria-hidden />
              ) : (
                <MoonIcon className="size-4" aria-hidden />
              )}
            </Button>
          </div>

          <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10 lg:px-12">
            <div className="w-full max-w-md">
              <div className="mb-8">
                {header ? (
                  <h1 className="text-balance text-4xl font-semibold tracking-tight text-fg">
                    {header}
                  </h1>
                ) : null}
                {description ? (
                  <p className="mt-3 text-base leading-7 text-muted-fg">
                    {description}
                  </p>
                ) : null}
              </div>
              {children}
            </div>
          </div>
        </section>

        <aside className="relative hidden overflow-hidden border-l border-border bg-muted/35 transition-colors duration-300 dark:bg-muted/20 lg:flex">
          <div className="relative flex flex-1 items-center justify-center p-10 xl:p-14">
            <div className="flex h-full min-h-[38rem] w-full max-w-2xl items-center justify-center">
              <div className="flex max-w-xl flex-col items-center gap-8 px-8 text-center">
                <AppLogo size="lg" className="gap-5" />

                <div className="space-y-4">
                  <p className="text-sm font-semibold uppercase tracking-[0.32em] text-primary/80">
                    VMUFit Portal
                  </p>
                  <p className="text-balance text-2xl font-semibold leading-tight text-fg xl:text-[2.1rem]">
                    Khoa Công nghệ Thông tin – Tiên phong chuyển đổi số, kiến tạo
                    tri thức, phụng sự cộng đồng và phát triển đất nước.
                  </p>
                  <p className="mx-auto max-w-lg text-sm leading-7 text-muted-fg">
                    Hệ thống quản trị và trải nghiệm số dành cho sinh viên, giảng
                    viên và đội ngũ vận hành của khoa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
