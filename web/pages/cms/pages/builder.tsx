import { Head, router } from "@inertiajs/react";
import type { ReactNode } from "react";
import { useState } from "react";
import updatePageContent from "@/actions/App/Http/Controllers/Cms/UpdatePageContentController";
import type { CmsPageEditorPageProps } from "@/components/cms/types";
import { PuckPageBuilder } from "@/components/page-builder/puck-page-builder";
import CmsLayout from "@/layouts/cms-layout";
import { edit } from "@/routes/cms/pages";

export default function CmsPageBuilder({ page }: CmsPageEditorPageProps) {
  const initialJson = page.content ?? "";
  const [draftJson, setDraftJson] = useState(initialJson);
  const [savedJson, setSavedJson] = useState(initialJson);
  const [isSaving, setIsSaving] = useState(false);

  return (
    <>
      <Head title={`Trình dựng trang - ${page.title}`} />
      <div className="flex flex-1 flex-col p-4 pt-0">
        <PuckPageBuilder
          backHref={edit.url({ page: page.id })}
          backLabel="Quay lại chỉnh sửa"
          canSave={draftJson !== savedJson}
          className="min-h-[calc(100vh-6.5rem)] rounded-xl border border-border"
          content={draftJson}
          headerTitle={page.title}
          isSaving={isSaving}
          onChange={(nextValue) => {
            setDraftJson(nextValue.json);
          }}
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
                  setSavedJson(nextValue.json);
                  setDraftJson(nextValue.json);
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
