import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { Head, Link } from "@inertiajs/react";
import type { ReactNode } from "react";
import type { CmsNavigationPageProps } from "@/components/cms/types";
import CmsLayout from "@/layouts/cms-layout";
import { countNavigationItems } from "@/lib/navigation/tree";
import { show } from "@/routes/cms/navigation";

const locationLabels: Record<string, string> = {
  footer: "Footer",
  header: "Header",
};

export default function CmsNavigationIndexPage({
  navigationMenus,
}: CmsNavigationPageProps) {
  return (
    <>
      <Head title="Navigation" />

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="rounded-2xl border border-border bg-overlay">
          <div className="border-b border-border px-5 py-4">
            <p className="text-lg font-semibold text-fg">Navigation</p>
            <p className="text-sm text-muted-fg">
              Chọn một menu để chỉnh cấu trúc điều hướng.
            </p>
          </div>

          <div>
            {navigationMenus.map((menu) => (
              <Link
                key={menu.id}
                href={show.url({ navigationMenu: menu.id })}
                className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 transition hover:bg-muted/35 last:border-b-0"
              >
                <div className="min-w-0">
                  <p className="font-medium text-fg">{menu.name}</p>
                  <p className="text-sm text-muted-fg">
                    {locationLabels[menu.location] ?? menu.location} ·{" "}
                    {menu.slug}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <p className="text-sm text-muted-fg">
                    {countNavigationItems(menu.items)} mục
                  </p>
                  <ArrowRightIcon className="size-4 text-muted-fg" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

CmsNavigationIndexPage.layout = (page: ReactNode) => (
  <CmsLayout>{page}</CmsLayout>
);
