import { Head } from "@inertiajs/react";
import { SiteLayoutShell } from "@/components/site-layout/site-layout-shell";
import type { SiteLayoutShellData } from "@/components/site-layout/site-layout-shell";
import type { SharedData } from "@/types/shared";
import { PostListSection } from "@/components/public/post-list-section";

interface PostCategoryPageProps extends SharedData {
  category: {
    id: number;
    name: string;
    slug: string;
    description: any;
    parentId: number | null;
    children: Array<{
      id: number;
      name: string;
      slug: string;
      description: any;
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
  layout:
    | (SiteLayoutShellData & { id: number; key: string; name: string })
    | null;
  filterCategories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  q: string | null;
  sort: string;
}

export default function PublicPostCategoryPage({
  category,
  posts,
  breadcrumbs,
  layout,
  filterCategories,
  q,
  sort,
}: PostCategoryPageProps) {
  return (
    <>
      <Head>
        <title>{category.name}</title>
        {category.description ? (
          <meta name="description" content={category.name} />
        ) : null}
      </Head>

      <SiteLayoutShell layout={layout}>
        <PostListSection
          category={category}
          posts={posts}
          filterCategories={filterCategories}
          q={q}
          sort={sort}
        />
      </SiteLayoutShell>
    </>
  );
}
