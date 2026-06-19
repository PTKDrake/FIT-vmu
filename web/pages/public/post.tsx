import { Head } from "@inertiajs/react";
import { BlockNoteReadonly } from "@/components/editor/blocknote-readonly";
import { LazyPuckPageRender } from "@/components/page-builder/lazy-puck-page-render";
import { SiteLayoutShell } from "@/components/site-layout/site-layout-shell";
import type { SiteLayoutShellData } from "@/components/site-layout/site-layout-shell";
import type { SharedData } from "@/types/shared";

interface PublicPostPageProps extends SharedData {
  post: {
    title: string;
    excerpt: string | null;
    content: string | null;
    contentFormat: "blocknote_json" | "puck_json";
  };
  layout:
    | (SiteLayoutShellData & { id: number; key: string; name: string })
    | null;
}

export default function PublicPost({ post, layout }: PublicPostPageProps) {
  return (
    <>
      <Head>
        <title>{post.title}</title>
        {post.excerpt ? (
          <meta name="description" content={post.excerpt} />
        ) : null}
      </Head>

      <SiteLayoutShell layout={layout} disableMaxWidth={true}>
        {post.contentFormat === "puck_json" ? (
          <LazyPuckPageRender content={post.content} />
        ) : (
          <BlockNoteReadonly content={post.content ?? undefined} />
        )}
      </SiteLayoutShell>
    </>
  );
}
