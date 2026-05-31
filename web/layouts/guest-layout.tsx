import { HomeModernIcon } from "@heroicons/react/24/outline";
import { Link } from "@inertiajs/react";
import type { PropsWithChildren, ReactNode } from "react";
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
  return (
    <div className="min-h-screen bg-bg text-fg">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,0.96fr)_minmax(24rem,1fr)]">
        <section className="relative flex min-h-screen flex-col overflow-hidden bg-bg">
          <div className="px-6 pt-6 sm:px-10 lg:px-12">
            <Link
              href={home.url()}
              className="inline-flex items-center gap-3 rounded-full px-1 py-1 text-sm font-semibold text-fg"
            >
              <span className="inline-flex size-8 items-center justify-center rounded-full bg-primary text-primary-fg shadow-sm">
                <HomeModernIcon className="size-4" />
              </span>
              VMUFit
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10 lg:px-12">
            <div className="w-full max-w-md">
              <div className="mb-8">
                {header ? (
                  <h1 className="text-4xl font-semibold tracking-tight text-fg">
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

        <aside className="relative hidden overflow-hidden border-l border-border bg-muted/35 lg:flex">
          <div className="relative flex flex-1 items-center justify-center p-10 xl:p-14">
            <div className="relative flex h-full min-h-[38rem] w-full max-w-2xl items-center justify-center overflow-hidden rounded-[2.5rem] border border-border bg-overlay shadow-sm">
              <div className="absolute inset-6 rounded-[2rem] border border-border/80" />
              <div className="absolute size-[28rem] rounded-full border border-border/70" />
              <div className="absolute size-[19rem] rounded-full border border-border/80" />
              <div className="absolute size-[8rem] rounded-full border border-border bg-overlay shadow-sm" />
              <div className="absolute h-px w-[28rem] bg-border/70" />
              <div className="absolute h-[28rem] w-px bg-border/70" />
              <div className="absolute h-[23rem] w-px rotate-45 bg-border/60" />
              <div className="absolute h-[23rem] w-px -rotate-45 bg-border/60" />
              <div className="absolute flex size-10 items-center justify-center rounded-2xl border border-border bg-muted text-muted-fg shadow-sm">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  aria-hidden
                >
                  <path
                    d="M4 7.75C4 6.78 4.78 6 5.75 6H18.25C19.22 6 20 6.78 20 7.75V16.25C20 17.22 19.22 18 18.25 18H5.75C4.78 18 4 17.22 4 16.25V7.75Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M4.75 15.25L9.5 11L13 14L16 11L19.25 14.25"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle cx="15.5" cy="8.5" r="1.25" fill="currentColor" />
                </svg>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
