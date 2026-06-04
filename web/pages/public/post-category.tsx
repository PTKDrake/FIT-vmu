import { Head } from "@inertiajs/react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs, BreadcrumbsItem } from "@/components/ui/breadcrumbs";
import { Card, CardContent } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import {
  Pagination,
  PaginationGap,
  PaginationItem,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Text } from "@/components/ui/text";
import { BlockNoteReadonly } from "@/components/editor/blocknote-readonly";
import { SiteLayoutShell } from "@/components/site-layout/site-layout-shell";
import type { SiteLayoutShellData } from "@/components/site-layout/site-layout-shell";
import type { SharedData } from "@/types/shared";

interface PostCategoryPageProps extends SharedData {
  category: {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    parentId: number | null;
    children: Array<{
      id: number;
      name: string;
      slug: string;
      description: string | null;
    }>;
  };
  posts: {
    data: Array<{
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
    current_page: number;
    last_page: number;
    next_page_url: string | null;
    prev_page_url: string | null;
    total: number;
  };
  breadcrumbs: Array<{ label: string; url: string | null }>;
  layout: (SiteLayoutShellData & { id: number; key: string; name: string }) | null;
}

export default function PublicPostCategoryPage({
  category,
  posts,
  breadcrumbs,
  layout,
}: PostCategoryPageProps) {
  return (
    <>
      <Head>
        <title>{category.name}</title>
        {category.description ? (
          <meta name="description" content={category.description} />
        ) : null}
      </Head>

      <SiteLayoutShell layout={layout}>
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Breadcrumbs className="mb-6">
            {breadcrumbs.map((crumb, index) => (
              <BreadcrumbsItem
                key={index}
                href={crumb.url ?? undefined}
              >
                {crumb.label}
              </BreadcrumbsItem>
            ))}
          </Breadcrumbs>

          <div className="mb-8 space-y-3">
            <Heading level={1} className="text-3xl font-extrabold tracking-tight">
              {category.name}
            </Heading>
            {category.description ? (
              <BlockNoteReadonly content={category.description} />
            ) : null}
          </div>

          {category.children.length > 0 ? (
            <div className="mb-8 flex flex-wrap gap-2">
              {category.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/${child.slug}`}
                  className="inline-flex items-center"
                >
                  <Badge intent="secondary" isCircle={false}>
                    {child.name}
                  </Badge>
                </Link>
              ))}
            </div>
          ) : null}

          {posts.data.length > 0 ? (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {posts.data.map((post) => (
                  <Link
                    key={post.id}
                    href={post.url ?? "#"}
                    className="block"
                  >
                    <Card className="overflow-hidden py-0 transition duration-300 hover:shadow-md hover:border-primary/15 group flex flex-col h-full cursor-pointer">
                      {post.thumbnailUrl ? (
                        <div className="aspect-video w-full overflow-hidden">
                          <img
                            src={post.thumbnailUrl}
                            alt={post.title}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      ) : null}
                      <CardContent className="p-5 space-y-3 flex-1 flex flex-col">
                        <div className="flex items-center justify-between gap-2">
                          <Badge
                            intent="primary"
                            isCircle={false}
                            className="text-[9px] font-semibold tracking-wider uppercase border-primary/20 bg-primary-subtle/10 text-primary shrink-0"
                          >
                            {post.categoryNames[0] ?? "Tin tuc"}
                          </Badge>
                          {post.date ? (
                            <span className="text-[10px] text-muted-fg font-medium shrink-0">
                              {post.date}
                            </span>
                          ) : null}
                        </div>
                        <div className="space-y-2 flex-1">
                          <Heading
                            level={3}
                            className="text-base font-bold text-fg group-hover:text-primary transition-colors leading-snug"
                          >
                            {post.title}
                          </Heading>
                          {post.excerpt ? (
                            <Text className="text-xs/relaxed text-muted-fg leading-relaxed line-clamp-3">
                              {post.excerpt}
                            </Text>
                          ) : null}
                        </div>
                        {post.author ? (
                          <Text className="text-[10px] text-muted-fg font-medium">
                            {post.author}
                          </Text>
                        ) : null}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>

              {posts.last_page > 1 ? (
                <div className="mt-10">
                  <Pagination>
                    <PaginationList>
                      <PaginationPrevious
                        href={posts.prev_page_url ?? undefined}
                      />
                      {Array.from({ length: posts.last_page }, (_, i) => {
                        const pageNum = i + 1;
                        if (
                          pageNum === 1 ||
                          pageNum === posts.last_page ||
                          Math.abs(pageNum - posts.current_page) <= 1
                        ) {
                          const pageUrl = new URL(
                            window.location.href,
                          );
                          pageUrl.searchParams.set("page", String(pageNum));
                          return (
                            <PaginationItem
                              key={pageNum}
                              href={pageUrl.toString()}
                              isCurrent={pageNum === posts.current_page}
                            >
                              {pageNum}
                            </PaginationItem>
                          );
                        }
                        if (
                          pageNum === 2 &&
                          posts.current_page > 3
                        ) {
                          return <PaginationGap key="gap-start" />;
                        }
                        if (
                          pageNum === posts.last_page - 1 &&
                          posts.current_page < posts.last_page - 2
                        ) {
                          return <PaginationGap key="gap-end" />;
                        }
                        return null;
                      })}
                      <PaginationNext
                        href={posts.next_page_url ?? undefined}
                      />
                    </PaginationList>
                  </Pagination>
                </div>
              ) : null}
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center">
              <Text className="text-muted-fg">
                Chua co bai viet nao trong danh muc nay.
              </Text>
            </div>
          )}
        </div>
      </SiteLayoutShell>
    </>
  );
}
