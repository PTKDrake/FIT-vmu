import type { PropsWithChildren } from "react";
import CmsLayout from "@/layouts/cms-layout";

export function withCmsLayout({ children }: PropsWithChildren) {
  return <CmsLayout>{children}</CmsLayout>;
}
