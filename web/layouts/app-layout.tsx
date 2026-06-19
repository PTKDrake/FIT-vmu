import { usePage } from "@inertiajs/react";
import type { PropsWithChildren } from "react";
import { SiteLayoutShell } from "@/components/site-layout/site-layout-shell";
import type { SharedData } from "@/types/shared";

export default function AppLayout({ children }: PropsWithChildren) {
  const { layout } = usePage<SharedData>().props;

  return (
    <SiteLayoutShell layout={layout}>
      <div className="mx-auto max-w-5xl px-6 py-10">
        {children}
      </div>
    </SiteLayoutShell>
  );
}
