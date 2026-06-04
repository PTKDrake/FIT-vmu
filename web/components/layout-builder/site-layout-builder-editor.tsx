import { router, useForm } from "@inertiajs/react";
import { PuckLayoutBuilder } from "@/components/layout-builder/puck-layout-builder";
import { layoutBuilderConfig } from "@/lib/puck/page-builder-config";
import type { VmuFitPageBuilderData } from "@/lib/puck/page-builder-data";
import {
  createCombinedSiteLayoutData,
  sanitizeCombinedSiteLayoutData,
  splitCombinedSiteLayoutData,
} from "@/lib/puck/site-layout-builder-data";
import layoutRoutes from "@/routes/cms/layouts";

interface SiteLayoutBuilderEditorProps {
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

    form.setData("header_data", slotData.header_data);
    form.setData("left_data", slotData.left_data);
    form.setData("right_data", slotData.right_data);
    form.setData("footer_data", slotData.footer_data);

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
        config={layoutBuilderConfig}
        content={combinedLayoutData}
        editorKey={`site-layout-${layout.id}`}
        headerTitle="Site layout"
        isSaving={form.processing}
        normalizeData={sanitizeCombinedSiteLayoutData}
        onChange={(value) => applySlotData(value.data)}
        onSave={(value) => saveCombinedLayout(value.data)}
        className="min-h-0 flex-1"
      />
    </div>
  );
}
