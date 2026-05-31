import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Head, router } from "@inertiajs/react";
import { PuckPageRender } from "@/components/page-builder/puck-page-render";
import { Button } from "@/components/ui/button";
import cmsRoutes from "@/routes/cms";

interface PageShowProps {
  page: {
    id: number;
    title: string;
    slug: string;
    content: string;
    contentFormat: string;
    seoTitle: string;
    seoDescription: string;
    excerpt: string;
  };
}

export default function PageShow({ page }: PageShowProps) {
  return (
    <>
      <Head title={`Xem trước: ${page.title}`} />

      <div className="min-h-screen bg-bg text-fg">
        {/* Fullscreen Sticky Top Header */}
        <header className="sticky top-0 z-50 w-full border-b border-border bg-bg/85 shadow-xs backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex size-2.5 items-center justify-center">
                  <span className="absolute inline-flex size-2 rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
                </span>
                <span className="text-sm font-semibold tracking-wide text-fg/80">
                  Chế độ xem trước:
                </span>
                <h1 className="text-sm font-bold text-fg line-clamp-1">
                  {page.title}
                </h1>
                <span className="hidden sm:inline-block rounded-md bg-muted px-2 py-0.5 text-xs text-muted-fg font-mono">
                  /{page.slug}
                </span>
              </div>

              <Button
                onPress={() => router.visit(cmsRoutes.pages())}
                intent="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeftIcon className="size-4" />
                Quay lại quản lý
              </Button>
            </div>
          </div>
        </header>

        {/* Preview Content Area */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="overflow-hidden">
            <PuckPageRender
              content={page.content}
              className="border-none rounded-none shadow-none p-0 bg-transparent"
            />
          </div>
        </main>
      </div>
    </>
  );
}

// We explicitly do NOT use the standard CmsLayout to allow fullscreen preview!
PageShow.layout = null;
