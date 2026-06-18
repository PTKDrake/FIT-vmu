import { Head, router } from "@inertiajs/react";
import type { ReactNode } from "react";
import { useState } from "react";
import updatePageContent from "@/actions/App/Http/Controllers/Cms/UpdatePageContentController";
import type { CmsPageEditorPageProps } from "@/components/cms/types";
import { PuckPageBuilder } from "@/components/page-builder/puck-page-builder";
import CmsLayout from "@/layouts/cms-layout";
import { edit } from "@/routes/cms/pages";
import type { SharedData } from "@/types/shared";

interface CmsPageBuilderPageProps extends SharedData {
  can: {
    exportPuckJson: boolean;
  };
  page: CmsPageEditorPageProps["page"];
}

export default function CmsPageBuilder({ can, page }: CmsPageBuilderPageProps) {
  const initialJson = page.content ?? "";
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  return (
    <>
      <Head title={`Trình dựng trang - ${page.title}`} />
      <div className="flex flex-1 flex-col p-4 pt-0">
        <PuckPageBuilder
          backHref={edit.url({ page: page.id })}
          backLabel="Quay lại phần chỉnh sửa"
          canExport={can.exportPuckJson}
          canSave={isDirty}
          className="min-h-[calc(100vh-6.5rem)] rounded-xl border border-border"
          content={initialJson}
          exportName={page.slug}
          headerTitle={page.title}
          isSaving={isSaving}
          onDirtyChange={setIsDirty}
          onSave={(nextValue) => {
            setIsSaving(true);

            router.patch(
              updatePageContent.url({ page: page.id }),
              {
                content: nextValue.json,
                content_format: nextValue.format,
              },
              {
                onError: () => setIsSaving(false),
                onSuccess: () => {
                  setIsDirty(false);
                  setIsSaving(false);
                },
                preserveScroll: true,
                preserveState: true,
              },
            );
          }}
        />
      </div>
    </>
  );
}

CmsPageBuilder.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;
