import { Head, useForm } from "@inertiajs/react";
import type { ReactNode } from "react";
import type { CmsUnitFormPageProps } from "@/components/cms/types";
import { UnitEditorForm } from "@/components/cms/unit-editor-form";
import type { UnitEditorFormData } from "@/components/cms/unit-editor-form";
import CmsLayout from "@/layouts/cms-layout";
import { units as unitsIndex } from "@/routes/cms";
import { store } from "@/routes/cms/units";
import { useRegisterUnsavedChanges } from "@/hooks/use-unsaved-changes";

export default function CmsUnitCreatePage({ unit }: CmsUnitFormPageProps) {
  const form = useForm<UnitEditorFormData>({
    description: unit.description ?? "",
    description_format: unit.descriptionFormat,
    is_active: unit.isActive,
    name: unit.name,
    slug: unit.slug,
    sort_order: unit.sortOrder,
  });

  const handleSave = () => {
    form.post(store.url(), {
      preserveScroll: true,
    });
  };

  useRegisterUnsavedChanges({
    isDirty: form.isDirty,
    onSave: handleSave,
  }, "unit-create");

  return (
    <>
      <Head title="Tạo đơn vị" />

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <UnitEditorForm
          cancelHref={unitsIndex.url()}
          data={form.data}
          errors={form.errors}
          processing={form.processing}
          submitLabel="Tạo đơn vị"
          title="Tạo đơn vị mới"
          onSubmit={handleSave}
          onUpdate={(key, value) => form.setData(key, value as never)}
        />
      </div>
    </>
  );
}


CmsUnitCreatePage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;
