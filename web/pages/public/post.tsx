import { Head } from "@inertiajs/react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/ui/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import { BlockNoteReadonly } from "@/components/editor/blocknote-readonly";
import { PuckPageRender } from "@/components/page-builder/puck-page-render";
import { SiteLayoutShell } from "@/components/site-layout/site-layout-shell";
import type { SiteLayoutShellData } from "@/components/site-layout/site-layout-shell";
import type { SharedData } from "@/types/shared";

interface PublicPostPageProps extends SharedData {
  post: {
    id: number;
    title: string;
    slug: string;
    url: string;
    excerpt: string | null;
    content: string | null;
    contentFormat: "blocknote_json" | "puck_json";
    date: string | null;
    author: string | null;
    thumbnailUrl: string | null;
    categories: Array<{ name: string; url: string }>;
  };
  breadcrumbs: Array<{ label: string; url: string | null }>;
  relatedPosts: Array<{
    id: number;
    title: string;
    slug: string;
    url: string | null;
    excerpt: string | null;
    date: string | null;
    author: string | null;
    thumbnailUrl: string | null;
    categoryNames: string[];
  }>;
  layout: (SiteLayoutShellData & { id: number; key: string; name: string }) | null;
}

export default function PublicPost({
  post,
  breadcrumbs,
  relatedPosts,
  layout,
}: PublicPostPageProps) {
  return (
    <>
      <Head>
        <title>{post.title}</title>
        {post.excerpt ? (
          <meta name="description" content={post.excerpt} />
        ) : null}
      </Head>

      <SiteLayoutShell layout={layout}>
        <article className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <Breadcrumbs className="mb-6">
            {breadcrumbs.map((crumb, index) => (
              <BreadcrumbsItem
                key={index}
                href={crumb.url ?? undefined}
                isCurrent={crumb.url === null}
              >
                {crumb.label}
              </BreadcrumbsItem>
            ))}
          </Breadcrumbs>

          <header className="mb-8 space-y-4">
            {post.categories.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {post.categories.map((cat) => (
                  <Link key={cat.url} href={cat.url}>
                    <Badge intent="primary" isCircle={false}>
                      {cat.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            ) : null}

            <Heading level={1} className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              {post.title}
            </Heading>

            {post.excerpt ? (
              <Text className="text-lg text-muted-fg leading-relaxed">
                {post.excerpt}
              </Text>
            ) : null}

            <div className="flex items-center gap-3 text-sm text-muted-fg">
              {post.author ? (
                <span className="font-medium">{post.author}</span>
              ) : null}
              {post.author && post.date ? <span>&middot;</span> : null}
              {post.date ? <span>{post.date}</span> : null}
            </div>

            {post.thumbnailUrl ? (
              <div className="aspect-video w-full overflow-hidden rounded-xl border border-border">
                <img
                  src={post.thumbnailUrl}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
              </div>
            ) : null}
          </header>

          <div className="prose prose-lg max-w-none">
            {post.contentFormat === "puck_json" ? (
              <PuckPageRender content={post.content} />
            ) : (
              <BlockNoteReadonly content={post.content ?? undefined} />
            )}
          </div>
        </article>

        {relatedPosts.length > 0 ? (
          <section className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
            <Heading level={2} className="mb-6 text-xl font-bold">
              Bai viet lien quan
            </Heading>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((related) => (
                <Link
                  key={related.id}
                  href={related.url ?? "#"}
                  className="block"
                >
                  <Card className="overflow-hidden py-0 transition duration-300 hover:shadow-md hover:border-primary/15 group flex flex-col h-full cursor-pointer">
                    {related.thumbnailUrl ? (
                      <div className="aspect-video w-full overflow-hidden">
                        <img
                          src={related.thumbnailUrl}
                          alt={related.title}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    ) : null}
                    <CardContent className="p-4 space-y-2 flex-1 flex flex-col">
                      {related.categoryNames[0] ? (
                        <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                          {related.categoryNames[0]}
                        </span>
                      ) : null}
                      <Heading
                        level={3}
                        className="text-sm font-bold text-fg group-hover:text-primary transition-colors leading-snug"
                      >
                        {related.title}
                      </Heading>
                      {related.excerpt ? (
                        <Text className="text-xs text-muted-fg leading-relaxed line-clamp-2 flex-1">
                          {related.excerpt}
                        </Text>
                      ) : null}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </SiteLayoutShell>
    </>
  );
}
