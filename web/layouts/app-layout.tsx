import { Link, usePage } from "@inertiajs/react";
import type { PropsWithChildren } from "react";
import {
  create,
  destroy,
} from "@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController";
import { AppLogo } from "@/components/brand/app-logo";
import { home, register } from "@/routes";
import { dashboard as cmsDashboard } from "@/routes/cms";
import { edit } from "@/routes/profile";
import type { SharedData } from "@/types/shared";

export default function AppLayout({ children }: PropsWithChildren) {
  const { auth } = usePage<SharedData>().props;
  const canAccessAdmin = auth.permissions.includes("view admin dashboard");

  return (
    <div className="min-h-screen bg-bg text-fg">
      <header className="border-b border-border bg-overlay">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href={home.url()} className="text-fg">
            <AppLogo size="sm" />
          </Link>
          <nav className="flex items-center gap-4 text-sm text-muted-fg">
            <Link href={home.url()} className="transition hover:text-fg">
              Trang chủ
            </Link>
            {auth.user ? (
              <>
                {canAccessAdmin ? (
                  <Link
                    href={cmsDashboard.url()}
                    className="transition hover:text-fg"
                  >
                    CMS
                  </Link>
                ) : null}
                <Link href={edit.url()} className="transition hover:text-fg">
                  Cài đặt
                </Link>
                <Link
                  href={destroy.url()}
                  method="post"
                  as="button"
                  className="transition hover:text-fg"
                >
                  Đăng xuất
                </Link>
              </>
            ) : (
              <>
                <Link href={create.url()} className="transition hover:text-fg">
                  Đăng nhập
                </Link>
                <Link
                  href={register.url()}
                  className="transition hover:text-fg"
                >
                  Đăng ký
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
