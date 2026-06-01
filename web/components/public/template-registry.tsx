import type { ReactNode } from "react";
import { Link } from "@inertiajs/react";
import { PuckPageRender } from "@/components/page-builder/puck-page-render";
import { BlockNoteReadonly } from "@/components/editor/blocknote-readonly";
import { cn } from "@/lib/utils";

// --- TYPE DEFINITIONS ---

export interface PageDataProps {
  id?: number;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  publishedAt?: string;
  authorName?: string;
  templateKey?: string;
  templateData?: Record<string, any> | null;
}

export interface PostDataProps {
  id?: number;
  title: string;
  slug: string;
  content?: string;
  excerpt?: string;
  publishedAt?: string;
  authorName?: string;
  reviewerName?: string;
  reviewedAt?: string;
  templateKey?: string;
  templateData?: Record<string, any> | null;
  categories?: Array<{ id: number; name: string; slug: string }>;
  thumbnailUrl?: string | null;
}

export interface CategoryDataProps {
  id?: number;
  name: string;
  slug: string;
  description?: string;
  displayMode?: string;
  archiveTemplateKey?: string;
  archiveTemplateData?: Record<string, any> | null;
  posts?: PostDataProps[];
  heroData?: { title?: string; subtitle?: string; backgroundUrl?: string } | null;
  sidebarData?: { widgets?: Array<{ type: string; title: string; content?: string }> } | null;
}

// --- PAGE TEMPLATES ---

export function PageDefaultTemplate({ page }: { page: PageDataProps }) {
  const contentValue = page.content ? JSON.parse(page.content) : undefined;
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
        <div className="lg:col-span-3 space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-fg sm:text-5xl">
            {page.title}
          </h1>
          {page.excerpt && (
            <p className="text-xl text-muted-fg leading-relaxed border-l-4 border-primary pl-4 py-1">
              {page.excerpt}
            </p>
          )}
          <div className="mt-8">
            <PuckPageRender content={contentValue} className="border-none p-0 bg-transparent shadow-none" />
          </div>
        </div>
        <div className="space-y-6 lg:col-span-1 border-t lg:border-t-0 lg:border-l border-border/45 pt-8 lg:pt-0 lg:pl-8">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-fg uppercase tracking-wider">Thông tin trang</h3>
            <div className="text-sm space-y-1">
              <p><span className="text-muted-fg">Tác giả:</span> <span className="font-medium text-fg">{page.authorName || "Quản trị viên"}</span></p>
              {page.publishedAt && (
                <p><span className="text-muted-fg">Cập nhật:</span> <span className="font-medium text-fg">{new Date(page.publishedAt).toLocaleDateString("vi-VN")}</span></p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PageLandingTemplate({ page }: { page: PageDataProps }) {
  const contentValue = page.content ? JSON.parse(page.content) : undefined;
  return (
    <div className="w-full">
      {/* Hero section if title should be shown or if custom landing styles apply */}
      <div className="bg-gradient-to-b from-primary/10 to-transparent py-16 px-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-fg sm:text-6xl">
          {page.title}
        </h1>
        {page.excerpt && (
          <p className="mx-auto mt-4 max-w-2xl text-xl text-muted-fg">
            {page.excerpt}
          </p>
        )}
      </div>
      <div className="w-full">
        <PuckPageRender content={contentValue} className="border-none rounded-none p-0 bg-transparent shadow-none" />
      </div>
    </div>
  );
}

export function PageFullwidthTemplate({ page }: { page: PageDataProps }) {
  const contentValue = page.content ? JSON.parse(page.content) : undefined;
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-6">
      <h1 className="text-4xl font-extrabold tracking-tight text-fg text-center">
        {page.title}
      </h1>
      <div className="mt-8">
        <PuckPageRender content={contentValue} className="border-none p-0 bg-transparent shadow-none" />
      </div>
    </div>
  );
}

export function PageBlankTemplate({ page }: { page: PageDataProps }) {
  const contentValue = page.content ? JSON.parse(page.content) : undefined;
  return (
    <div className="w-full h-full min-h-[50vh]">
      <PuckPageRender content={contentValue} className="border-none rounded-none p-0 bg-transparent shadow-none" />
    </div>
  );
}

export function PageSidebarRightTemplate({ page }: { page: PageDataProps }) {
  const contentValue = page.content ? JSON.parse(page.content) : undefined;
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-3xl font-extrabold text-fg sm:text-4xl">{page.title}</h1>
          <div className="mt-6">
            <PuckPageRender content={contentValue} className="border-none p-0 bg-transparent shadow-none" />
          </div>
        </div>
        <div className="space-y-6 md:col-span-1 border-t md:border-t-0 md:border-l border-border/40 pt-6 md:pt-0 md:pl-6">
          <div className="rounded-2xl border border-border/50 bg-overlay p-6 space-y-4">
            <h3 className="font-bold text-lg text-fg border-b border-border/30 pb-2">Thông tin thêm</h3>
            <div className="text-sm text-muted-fg space-y-2">
              <p>Mục này chứa nội dung tham khảo bên lề.</p>
              {page.publishedAt && (
                <p>Xuất bản: {new Date(page.publishedAt).toLocaleDateString("vi-VN")}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- POST TEMPLATES ---

export function PostArticleTemplate({ post }: { post: PostDataProps }) {
  const contentValue = post.content ? JSON.parse(post.content) : undefined;
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8 space-y-6">
      {/* Category badges */}
      {post.categories && post.categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {post.categories.map((c) => (
            <Link
              key={c.id}
              href={`/categories/${c.slug}`}
              className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary transition hover:bg-primary/20"
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      <h1 className="text-4xl font-extrabold tracking-tight text-fg sm:text-5xl leading-tight">
        {post.title}
      </h1>

      <div className="flex items-center gap-4 text-sm text-muted-fg border-y border-border/30 py-3">
        <div className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
            {post.authorName ? post.authorName[0].toUpperCase() : "A"}
          </span>
          <span className="font-medium text-fg">{post.authorName || "Tác giả"}</span>
        </div>
        <span>&bull;</span>
        <span>
          {post.publishedAt
            ? new Date(post.publishedAt).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "Chưa xuất bản"}
        </span>
      </div>

      {post.thumbnailUrl && (
        <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border/40 shadow-sm">
          <img src={post.thumbnailUrl} alt={post.title} className="h-full w-full object-cover" />
        </div>
      )}

      {post.excerpt && (
        <p className="text-lg text-muted-fg font-medium leading-relaxed italic border-l-4 border-primary pl-4">
          {post.excerpt}
        </p>
      )}

      <div className="prose prose-lg dark:prose-invert max-w-none mt-8">
        <BlockNoteReadonly content={contentValue} className="border-none shadow-none bg-transparent p-0" />
      </div>
    </article>
  );
}

export function PostNewsTemplate({ post }: { post: PostDataProps }) {
  const contentValue = post.content ? JSON.parse(post.content) : undefined;
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <article className="lg:col-span-2 space-y-6">
          <span className="text-xs uppercase font-extrabold tracking-wider text-primary">Bản tin</span>
          <h1 className="text-3xl font-extrabold text-fg sm:text-4xl">{post.title}</h1>
          <div className="text-xs text-muted-fg flex gap-2">
            <span>Đăng ngày: {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("vi-VN") : "Hôm nay"}</span>
            <span>&bull;</span>
            <span>Viết bởi: {post.authorName || "Admin"}</span>
          </div>
          {post.thumbnailUrl && (
            <img src={post.thumbnailUrl} alt={post.title} className="w-full h-80 object-cover rounded-xl" />
          )}
          <div className="mt-6">
            <BlockNoteReadonly content={contentValue} className="border-none shadow-none bg-transparent p-0" />
          </div>
        </article>
        <aside className="space-y-6 border-t lg:border-t-0 lg:border-l border-border/40 pt-6 lg:pt-0 lg:pl-6">
          <div className="rounded-2xl border border-border/50 bg-overlay p-6 space-y-4">
            <h3 className="font-bold text-lg text-fg">Tin liên quan</h3>
            <p className="text-sm text-muted-fg">Các bản tin khác sẽ được liệt kê ở đây.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export function PostAnnouncementTemplate({ post }: { post: PostDataProps }) {
  const contentValue = post.content ? JSON.parse(post.content) : undefined;
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-6">
      <div className="bg-red-500/10 border-l-4 border-red-500 rounded-r-xl p-4">
        <span className="text-xs uppercase font-extrabold tracking-wider text-red-500">Thông báo chính thức</span>
        <h1 className="text-3xl font-extrabold text-fg mt-2">{post.title}</h1>
        <p className="text-xs text-muted-fg mt-1">
          Ngày ban hành: {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("vi-VN") : "---"}
        </p>
      </div>
      <div className="border border-border/50 rounded-2xl bg-overlay p-6 sm:p-8">
        <BlockNoteReadonly content={contentValue} className="border-none shadow-none bg-transparent p-0" />
      </div>
    </div>
  );
}

export function PostResearchTemplate({ post }: { post: PostDataProps }) {
  const contentValue = post.content ? JSON.parse(post.content) : undefined;
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center space-y-4">
        <span className="text-xs uppercase font-extrabold tracking-wider text-primary border border-primary px-3 py-1 rounded-full">
          Bài viết Nghiên cứu
        </span>
        <h1 className="text-3xl font-extrabold text-fg sm:text-4xl leading-tight max-w-3xl mx-auto">
          {post.title}
        </h1>
        <div className="text-sm text-muted-fg">
          <p className="font-semibold text-fg">{post.authorName || "Nhà nghiên cứu"}</p>
          <p className="text-xs mt-1">VMUFit Research Group &bull; {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("vi-VN") : "---"}</p>
        </div>
      </div>
      
      {post.excerpt && (
        <div className="rounded-2xl border border-border/50 bg-overlay p-6 space-y-2">
          <h4 className="font-bold text-xs uppercase text-muted-fg tracking-widest">Tóm tắt / Abstract</h4>
          <p className="text-sm leading-relaxed italic text-muted-fg">{post.excerpt}</p>
        </div>
      )}

      <div className="border border-border/30 rounded-2xl p-6">
        <BlockNoteReadonly content={contentValue} className="border-none shadow-none bg-transparent p-0" />
      </div>
    </div>
  );
}

export function PostEventTemplate({ post }: { post: PostDataProps }) {
  const contentValue = post.content ? JSON.parse(post.content) : undefined;
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <article className="lg:col-span-2 space-y-6">
          <span className="bg-primary text-primary-fg px-3 py-1 rounded-md text-xs font-semibold uppercase">Sự kiện</span>
          <h1 className="text-3xl font-extrabold text-fg sm:text-4xl">{post.title}</h1>
          {post.thumbnailUrl && (
            <img src={post.thumbnailUrl} alt={post.title} className="w-full h-80 object-cover rounded-xl" />
          )}
          <div className="mt-6">
            <BlockNoteReadonly content={contentValue} className="border-none shadow-none bg-transparent p-0" />
          </div>
        </article>
        <aside className="space-y-6 border-t lg:border-t-0 lg:border-l border-border/40 pt-6 lg:pt-0 lg:pl-6">
          <div className="rounded-2xl border border-border/50 bg-overlay p-6 space-y-4 shadow-sm">
            <h3 className="font-bold text-lg text-fg border-b border-border/20 pb-2">Thông tin Sự kiện</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-muted-fg">Thời gian</p>
                <p className="text-fg">{post.templateData?.eventDate || "Liên hệ ban tổ chức"}</p>
              </div>
              <div>
                <p className="font-semibold text-muted-fg">Địa điểm</p>
                <p className="text-fg">{post.templateData?.eventLocation || "Đang cập nhật"}</p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

// --- CATEGORY TEMPLATES ---

export function CategoryArchiveDefaultTemplate({ category }: { category: CategoryDataProps }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 space-y-8 animate-fade-in">
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-fg">{category.name}</h1>
        {category.description && (
          <p className="text-muted-fg text-sm">{category.description}</p>
        )}
      </div>

      {category.posts && category.posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-overlay transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="aspect-video w-full bg-muted/30 overflow-hidden border-b border-border/30">
                {post.thumbnailUrl ? (
                  <img
                    src={post.thumbnailUrl}
                    alt={post.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-semibold text-muted-fg bg-gradient-to-br from-primary/5 to-accent/5">
                    VMUFit
                  </div>
                )}
              </div>
              <div className="flex-1 p-5 space-y-2">
                <h3 className="font-bold text-fg group-hover:text-primary transition line-clamp-2">
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-xs text-muted-fg line-clamp-2">{post.excerpt}</p>
                )}
                <div className="flex items-center justify-between text-[11px] text-muted-fg pt-3 border-t border-border/30 mt-auto">
                  <span>{post.authorName || "Tác giả"}</span>
                  <span>
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("vi-VN") : "---"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border border-dashed border-border/60 rounded-3xl">
          <p className="text-muted-fg">Hiện chưa có bài viết nào thuộc chuyên mục này.</p>
        </div>
      )}
    </div>
  );
}

export function CategoryArchiveLandingTemplate({ category }: { category: CategoryDataProps }) {
  const hero = category.heroData || {};
  return (
    <div className="w-full">
      {/* Category Hero Header */}
      <div 
        className={cn(
          "bg-slate-900 text-white py-24 px-4 text-center relative overflow-hidden bg-cover bg-center",
          !hero.backgroundUrl && "bg-gradient-to-r from-primary to-accent"
        )}
        style={hero.backgroundUrl ? { backgroundImage: `url(${hero.backgroundUrl})` } : undefined}
      >
        {hero.backgroundUrl && <div className="absolute inset-0 bg-black/60 z-0"></div>}
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl font-extrabold sm:text-6xl">{hero.title || category.name}</h1>
          <p className="text-lg opacity-90">{hero.subtitle || category.description}</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
        <h2 className="text-2xl font-bold text-fg border-b border-border/35 pb-2">Danh sách Bài viết</h2>
        {category.posts && category.posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {category.posts.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="group flex flex-col md:flex-row overflow-hidden rounded-2xl border border-border/50 bg-overlay shadow-xs transition hover:shadow-md"
              >
                <div className="w-full md:w-44 bg-muted/40 aspect-video md:aspect-auto overflow-hidden">
                  {post.thumbnailUrl ? (
                    <img src={post.thumbnailUrl} alt={post.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full min-h-[120px] items-center justify-center text-muted-fg bg-gradient-to-tr from-primary/5 to-accent/5">
                      VMUFit
                    </div>
                  )}
                </div>
                <div className="flex-1 p-5 space-y-2">
                  <h3 className="font-bold text-fg group-hover:text-primary transition leading-tight">
                    {post.title}
                  </h3>
                  <p className="text-xs text-muted-fg line-clamp-2">{post.excerpt}</p>
                  <p className="text-[11px] text-muted-fg mt-auto pt-2 border-t border-border/20">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("vi-VN") : "---"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-muted-fg text-center py-12">Đang cập nhật nội dung...</p>
        )}
      </div>
    </div>
  );
}

export function CategoryArchiveFeaturedTemplate({ category }: { category: CategoryDataProps }) {
  const posts = category.posts || [];
  const featured = posts[0];
  const others = posts.slice(1);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 space-y-12">
      <div className="space-y-2">
        <span className="text-xs uppercase font-extrabold tracking-widest text-primary">Tiêu điểm</span>
        <h1 className="text-3xl font-extrabold text-fg">{category.name}</h1>
      </div>

      {featured && (
        <Link
          href={`/posts/${featured.slug}`}
          className="group grid grid-cols-1 lg:grid-cols-2 overflow-hidden rounded-3xl border border-border/60 bg-overlay transition hover:shadow-xl"
        >
          <div className="aspect-video lg:aspect-auto bg-muted/30 overflow-hidden">
            {featured.thumbnailUrl ? (
              <img
                src={featured.thumbnailUrl}
                alt={featured.title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-bold text-muted-fg bg-gradient-to-br from-primary/10 to-accent/10">
                FEATURED
              </div>
            )}
          </div>
          <div className="p-8 flex flex-col justify-center space-y-4">
            <span className="text-xs font-bold text-primary">Mới nhất</span>
            <h2 className="text-2xl font-extrabold text-fg group-hover:text-primary transition leading-tight">
              {featured.title}
            </h2>
            <p className="text-sm text-muted-fg line-clamp-3 leading-relaxed">{featured.excerpt}</p>
            <div className="text-xs text-muted-fg pt-4 border-t border-border/30 flex gap-4">
              <span>{featured.authorName}</span>
              <span>{featured.publishedAt ? new Date(featured.publishedAt).toLocaleDateString("vi-VN") : "---"}</span>
            </div>
          </div>
        </Link>
      )}

      {others.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {others.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border/50 bg-overlay transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="aspect-video w-full bg-muted/30 overflow-hidden">
                {post.thumbnailUrl ? (
                  <img src={post.thumbnailUrl} alt={post.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-semibold text-muted-fg">
                    VMUFit
                  </div>
                )}
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-bold text-fg group-hover:text-primary transition line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-xs text-muted-fg line-clamp-2">{post.excerpt}</p>
                <p className="text-[11px] text-muted-fg pt-3 border-t border-border/20 mt-auto">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("vi-VN") : "---"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function CategoryArchiveSidebarTemplate({ category }: { category: CategoryDataProps }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1 border-r border-border/40 pr-6 space-y-6">
          <div className="space-y-3">
            <h3 className="font-bold text-fg border-b border-border/20 pb-2">Danh mục</h3>
            <p className="text-xs text-muted-fg">Xem bài viết thuộc các chuyên mục liên quan.</p>
          </div>
        </aside>
        <div className="lg:col-span-3 space-y-6">
          <h1 className="text-2xl font-extrabold text-fg">{category.name}</h1>
          <div className="grid grid-cols-1 gap-6">
            {category.posts?.map((post) => (
              <Link
                key={post.id}
                href={`/posts/${post.slug}`}
                className="group flex flex-col md:flex-row gap-6 p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition"
              >
                {post.thumbnailUrl && (
                  <img src={post.thumbnailUrl} alt={post.title} className="w-full md:w-36 h-24 object-cover rounded-lg" />
                )}
                <div className="flex-1 space-y-2">
                  <h3 className="font-bold text-fg group-hover:text-primary transition">
                    {post.title}
                  </h3>
                  <p className="text-xs text-muted-fg line-clamp-2">{post.excerpt}</p>
                  <p className="text-[11px] text-muted-fg">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("vi-VN") : "---"}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- TEMPLATE REGISTRY ---

export const pageTemplates: Record<string, (props: { page: PageDataProps }) => ReactNode> = {
  default: (props) => <PageDefaultTemplate {...props} />,
  landing: (props) => <PageLandingTemplate {...props} />,
  fullwidth: (props) => <PageFullwidthTemplate {...props} />,
  blank: (props) => <PageBlankTemplate {...props} />,
  "sidebar-right": (props) => <PageSidebarRightTemplate {...props} />,
};

export const postTemplates: Record<string, (props: { post: PostDataProps }) => ReactNode> = {
  article: (props) => <PostArticleTemplate {...props} />,
  news: (props) => <PostNewsTemplate {...props} />,
  announcement: (props) => <PostAnnouncementTemplate {...props} />,
  research: (props) => <PostResearchTemplate {...props} />,
  event: (props) => <PostEventTemplate {...props} />,
};

export const categoryTemplates: Record<string, (props: { category: CategoryDataProps }) => ReactNode> = {
  "archive-default": (props) => <CategoryArchiveDefaultTemplate {...props} />,
  "archive-landing": (props) => <CategoryArchiveLandingTemplate {...props} />,
  "archive-featured": (props) => <CategoryArchiveFeaturedTemplate {...props} />,
  "archive-sidebar": (props) => <CategoryArchiveSidebarTemplate {...props} />,
};
