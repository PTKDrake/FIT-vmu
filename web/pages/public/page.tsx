import { Head } from "@inertiajs/react";
import { PuckPageRender } from "@/components/page-builder/puck-page-render";
import { SiteLayoutShell } from "@/components/site-layout/site-layout-shell";
import type { SiteLayoutShellData } from "@/components/site-layout/site-layout-shell";
import type { SharedData } from "@/types/shared";

interface PublicPageProps extends SharedData {
  layout:
    | (SiteLayoutShellData & {
        id: number;
        key: string;
        name: string;
      })
    | null;
  page: {
    content: string | null;
    contentFormat: "puck_json";
    excerpt: string | null;
    id: number;
    seoDescription: string | null;
    seoTitle: string | null;
    slug: string;
    title: string;
  };
}

export default function PublicPage({ layout, page }: PublicPageProps) {
  return (
    <>
      <Head>
        <title>{page.seoTitle || page.title}</title>
        {page.seoDescription ? (
          <meta name="description" content={page.seoDescription} />
        ) : null}
      </Head>

      <SiteLayoutShell layout={layout} isPuckPage={true}>
        <PuckPageRender content={page.content} />
      </SiteLayoutShell>
    </>
  );
}
