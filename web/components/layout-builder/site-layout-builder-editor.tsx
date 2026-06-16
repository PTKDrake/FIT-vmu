import { router, useForm } from "@inertiajs/react";
import { PuckLayoutBuilder } from "@/components/layout-builder/puck-layout-builder";
import { createSiteLayoutOutlinePlugin } from "@/components/layout-builder/site-layout-outline-plugin";
import { layoutBuilderConfig } from "@/lib/puck/page-builder-config";
import type { VmuFitPageBuilderData } from "@/lib/puck/page-builder-data";
import {
  createCombinedSiteLayoutData,
  sanitizeCombinedSiteLayoutData,
  splitCombinedSiteLayoutData,
} from "@/lib/puck/site-layout-builder-data";
import layoutRoutes from "@/routes/cms/layouts";

interface SiteLayoutBuilderEditorProps {
  canExport?: boolean;
  layout: {
    footerData: string | null;
    headerData: string | null;
    id: number;
    key: string;
    leftData: string | null;
    name: string;
    rightData: string | null;
  };
}

interface SiteLayoutBuilderFormValues extends Record<string, string> {
  footer_data: string;
  header_data: string;
  key: string;
  left_data: string;
  name: string;
  right_data: string;
}

export function SiteLayoutBuilderEditor({
  canExport = false,
  layout,
}: SiteLayoutBuilderEditorProps) {
  const form = useForm<SiteLayoutBuilderFormValues>({
    name: layout.name,
    key: layout.key,
    header_data: layout.headerData ?? "",
    footer_data: layout.footerData ?? "",
    left_data: layout.leftData ?? "",
    right_data: layout.rightData ?? "",
  });

  function applySlotData(
    nextData: VmuFitPageBuilderData,
  ): SiteLayoutBuilderFormValues {
    const slotData = splitCombinedSiteLayoutData(nextData);
    const payload = {
      ...form.data,
      ...slotData,
    };

    form.setData(payload);

    return payload;
  }

  function saveCombinedLayout(nextData: VmuFitPageBuilderData): void {
    const payload = applySlotData(nextData);

    router.patch(
      layoutRoutes.update.url({ siteLayout: layout.id }),
      payload,
      {
        preserveScroll: true,
      },
    );
  }

  const combinedLayoutData = createCombinedSiteLayoutData({
    headerData: form.data.header_data,
    leftData: form.data.left_data,
    rightData: form.data.right_data,
    footerData: form.data.footer_data,
  });

  return (
    <div className="flex flex-1 flex-col p-4 pt-0">
      <PuckLayoutBuilder
        canExport={canExport}
        config={layoutBuilderConfig}
        content={combinedLayoutData}
        editorKey={`site-layout-${layout.id}`}
        exportName={layout.key}
        headerTitle="Site layout"
        isSaving={form.processing}
        normalizeData={sanitizeCombinedSiteLayoutData}
        onSave={(value) => saveCombinedLayout(value.data)}
        plugins={[createSiteLayoutOutlinePlugin()]}
        className="min-h-0 flex-1"
      />
    </div>
  );
}
