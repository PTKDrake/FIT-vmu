import { Head, useForm } from "@inertiajs/react";
import type { ReactNode } from "react";
import type { CmsUnitFormPageProps } from "@/components/cms/types";
import { UnitEditorForm } from "@/components/cms/unit-editor-form";
import type { UnitEditorFormData } from "@/components/cms/unit-editor-form";
import { useRegisterUnsavedChanges } from "@/hooks/use-unsaved-changes";
import CmsLayout from "@/layouts/cms-layout";
import { show, update } from "@/routes/cms/units";

export default function CmsUnitEditPage({ unit }: CmsUnitFormPageProps) {
  const form = useForm<UnitEditorFormData>({
    description: unit.description ?? "",
    description_format: unit.descriptionFormat,
    is_active: unit.isActive,
    name: unit.name,
    slug: unit.slug,
    sort_order: unit.sortOrder,
  });

  const handleSave = () => {
    form.patch(update.url({ unit: unit.id ?? 0 }), {
      preserveScroll: true,
    });
  };

  useRegisterUnsavedChanges({
    isDirty: form.isDirty,
    onSave: handleSave,
  }, "unit-edit");

  return (
    <>
      <Head title={`Chỉnh sửa ${unit.name}`} />

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <UnitEditorForm
          cancelHref={show.url({ unit: unit.id ?? 0 })}
          data={form.data}
          errors={form.errors}
          processing={form.processing}
          submitLabel="Lưu thay đổi"
          title={`Chỉnh sửa ${unit.name}`}
          onSubmit={handleSave}
          onUpdate={(key, value) => form.setData(key, value as never)}
        />
      </div>
    </>
  );
}


CmsUnitEditPage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;
