import { Link, router, useForm } from "@inertiajs/react";
import { PuckLayoutBuilder } from "@/components/layout-builder/puck-layout-builder";
import { Button } from "@/components/ui/button";
import {
  FieldError,
  FieldGroup,
  Fieldset,
  Label,
  Legend,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectContent,
} from "@/components/ui/native-select";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { layoutBuilderConfig } from "@/lib/puck/page-builder-config";
import {
  createEmptyPuckData,
  serializePuckPageData,
} from "@/lib/puck/page-builder-data";
import type { VmuFitPageBuilderData } from "@/lib/puck/page-builder-data";
import {
  createCombinedSiteLayoutData,
  splitCombinedSiteLayoutData,
} from "@/lib/puck/site-layout-builder-data";
import { layouts } from "@/routes/cms";
import layoutRoutes from "@/routes/cms/layouts";

const emptySlotJson = serializePuckPageData(createEmptyPuckData());

interface SiteLayoutFormValues extends Record<string, boolean | string> {
  footer_data: string;
  header_data: string;
  is_default: boolean;
  key: string;
  left_data: string;
  name: string;
  right_data: string;
  status: "draft" | "published";
}

interface SiteLayoutFormProps {
  layout?: {
    footerData: string | null;
    headerData: string | null;
    id: number;
    isDefault: boolean;
    key: string;
    leftData: string | null;
    name: string;
    rightData: string | null;
    status: "draft" | "published";
  };
}

export function SiteLayoutForm({ layout }: SiteLayoutFormProps) {
  const isEditing = !!layout;
  const form = useForm<SiteLayoutFormValues>({
    name: layout?.name ?? "",
    key: layout?.key ?? "",
    status: layout?.status ?? "draft",
    is_default: layout?.isDefault ?? false,
    header_data: layout?.headerData ?? emptySlotJson,
    footer_data: layout?.footerData ?? emptySlotJson,
    left_data: layout?.leftData ?? emptySlotJson,
    right_data: layout?.rightData ?? emptySlotJson,
  });

  function submit(): void {
    if (layout) {
      form.patch(layoutRoutes.update.url({ siteLayout: layout.id }), {
        preserveScroll: true,
      });

      return;
    }

    form.post(layoutRoutes.store.url());
  }

  function applySlotData(
    nextData: VmuFitPageBuilderData,
  ): SiteLayoutFormValues {
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

    if (layout) {
      router.patch(
        layoutRoutes.update.url({ siteLayout: layout.id }),
        payload,
        {
          preserveScroll: true,
        },
      );

      return;
    }

    router.post(layoutRoutes.store.url(), payload);
  }

  const combinedLayoutData = createCombinedSiteLayoutData({
    headerData: form.data.header_data,
    leftData: form.data.left_data,
    rightData: form.data.right_data,
    footerData: form.data.footer_data,
  });

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <Fieldset className="space-y-6 rounded-2xl border border-border bg-overlay px-5 py-5">
          <div>
            <Legend>{isEditing ? "Chỉnh sửa layout" : "Tạo layout"}</Legend>
            <Text className="mt-1 text-muted-fg">
              Cấu hình định danh, trạng thái và layout mặc định cho shell
              public.
            </Text>
          </div>
          <FieldGroup className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="layout-name">Tên layout</Label>
              <Input
                id="layout-name"
                value={form.data.name}
                onChange={(event) => form.setData("name", event.target.value)}
              />
              {form.errors.name ? (
                <FieldError>{form.errors.name}</FieldError>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="layout-key">Key</Label>
              <Input
                id="layout-key"
                value={form.data.key}
                onChange={(event) => form.setData("key", event.target.value)}
              />
              {form.errors.key ? (
                <FieldError>{form.errors.key}</FieldError>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="layout-status">Trạng thái</Label>
              <NativeSelect>
                <NativeSelectContent
                  id="layout-status"
                  value={form.data.status}
                  onChange={(event) =>
                    form.setData(
                      "status",
                      event.target.value as "draft" | "published",
                    )
                  }
                >
                  <option value="draft">Bản nháp</option>
                  <option value="published">Đã xuất bản</option>
                </NativeSelectContent>
              </NativeSelect>
              {form.errors.status ? (
                <FieldError>{form.errors.status}</FieldError>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="layout-default">Layout mặc định</Label>
              <div className="flex min-h-10 items-center">
                <Switch
                  id="layout-default"
                  isSelected={form.data.is_default}
                  onChange={(value) => form.setData("is_default", value)}
                />
              </div>
              {form.errors.is_default ? (
                <FieldError>{form.errors.is_default}</FieldError>
              ) : null}
            </div>
          </FieldGroup>
          <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
            <Link
              className="inline-flex min-h-10 items-center justify-center rounded-lg border border-border bg-bg px-4 text-sm font-medium text-fg transition hover:bg-muted/40"
              href={layouts.url()}
            >
              Hủy
            </Link>
            <Button isDisabled={form.processing} type="submit">
              {form.processing ? "Đang lưu..." : "Lưu layout"}
            </Button>
          </div>
        </Fieldset>
      </form>
      <PuckLayoutBuilder
        config={layoutBuilderConfig}
        content={combinedLayoutData}
        editorKey={`site-layout-${layout?.id ?? "new"}`}
        headerTitle="Site layout"
        isSaving={form.processing}
        onChange={(value) => applySlotData(value.data)}
        onSave={(value) => saveCombinedLayout(value.data)}
      />
    </div>
  );
}
