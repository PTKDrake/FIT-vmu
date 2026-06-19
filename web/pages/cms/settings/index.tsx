import { Head, router, useForm } from "@inertiajs/react";
import type { FormEvent, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  FieldError,
  FieldGroup,
  Fieldset,
  Label,
  Legend,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { useCmsContentRealtime } from "@/hooks/use-cms-content-realtime";
import CmsLayout from "@/layouts/cms-layout";
import { update } from "@/routes/cms/settings";
import type { SharedData } from "@/types/shared";

interface LayoutOption {
  id: number;
  key: string;
  name: string;
}

interface PageOption {
  id: number;
  slug: string;
  title: string;
}

interface SiteSettingsShape {
  default_category_layout: number | null;
  default_page_layout: number | null;
  default_post_layout: number | null;
  homepage_page: number | null;
  not_found_page: number | null;
  student_home_page: number | null;
}

interface SiteSettingsFormValues {
  default_category_layout: string;
  default_page_layout: string;
  default_post_layout: string;
  homepage_page: string;
  not_found_page: string;
  student_home_page: string;
}

interface SiteSettingsPageProps extends SharedData {
  layoutOptions: LayoutOption[];
  pageOptions: PageOption[];
  settings: SiteSettingsShape;
}

function toStringId(value: number | null): string {
  return value !== null ? value.toString() : "";
}

function reloadSettings(): void {
  router.reload({ only: ["layoutOptions", "pageOptions", "settings"] });
}

export default function SiteSettingsPage({
  layoutOptions,
  pageOptions,
  settings,
}: SiteSettingsPageProps) {
  const form = useForm<SiteSettingsFormValues>({
    homepage_page: toStringId(settings.homepage_page),
    not_found_page: toStringId(settings.not_found_page),
    student_home_page: toStringId(settings.student_home_page),
    default_page_layout: toStringId(settings.default_page_layout),
    default_category_layout: toStringId(settings.default_category_layout),
    default_post_layout: toStringId(settings.default_post_layout),
  });

  useCmsContentRealtime("settings", () => {
    reloadSettings();
  });

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    form.patch(update.url(), {
      onSuccess: reloadSettings,
      preserveScroll: true,
    });
  }

  return (
    <>
      <Head title="Cài đặt site" />
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <form onSubmit={submit}>
          <Fieldset className="space-y-6 rounded-2xl border border-border bg-overlay px-5 py-5">
            <div>
              <Legend>Cài đặt site</Legend>
              <Text className="mt-1 text-muted-fg">
                Chọn trang chủ, trang 404, trang sinh viên và layout mặc định
                cho từng loại nội dung công khai.
              </Text>
            </div>

            <FieldGroup className="grid gap-5 lg:grid-cols-2">
              <SelectField
                error={form.errors.homepage_page}
                items={pageOptions.map((p) => ({
                  id: String(p.id),
                  label: p.title,
                }))}
                label="Trang chủ"
                value={form.data.homepage_page}
                onChange={(value) => form.setData("homepage_page", value)}
              />

              <SelectField
                error={form.errors.not_found_page}
                items={pageOptions.map((p) => ({
                  id: String(p.id),
                  label: p.title,
                }))}
                label="Trang 404"
                value={form.data.not_found_page}
                onChange={(value) => form.setData("not_found_page", value)}
              />

              <SelectField
                error={form.errors.student_home_page}
                items={pageOptions.map((p) => ({
                  id: String(p.id),
                  label: p.title,
                }))}
                label="Trang sinh viên"
                value={form.data.student_home_page}
                onChange={(value) => form.setData("student_home_page", value)}
              />

              <SelectField
                error={form.errors.default_page_layout}
                items={layoutOptions.map((l) => ({
                  id: String(l.id),
                  label: l.name,
                }))}
                label="Layout trang mặc định"
                value={form.data.default_page_layout}
                onChange={(value) => form.setData("default_page_layout", value)}
              />

              <SelectField
                error={form.errors.default_category_layout}
                items={layoutOptions.map((l) => ({
                  id: String(l.id),
                  label: l.name,
                }))}
                label="Layout danh mục mặc định"
                value={form.data.default_category_layout}
                onChange={(value) =>
                  form.setData("default_category_layout", value)
                }
              />

              <SelectField
                error={form.errors.default_post_layout}
                items={layoutOptions.map((l) => ({
                  id: String(l.id),
                  label: l.name,
                }))}
                label="Layout bài viết mặc định"
                value={form.data.default_post_layout}
                onChange={(value) => form.setData("default_post_layout", value)}
              />
            </FieldGroup>

            <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
              <Button isDisabled={form.processing} type="submit">
                {form.processing ? "Đang lưu..." : "Lưu cài đặt"}
              </Button>
            </div>
          </Fieldset>
        </form>
      </div>
    </>
  );
}

interface SelectFieldItem {
  id: string;
  label: string;
}

interface SelectFieldProps {
  error?: string;
  items: SelectFieldItem[];
  label: string;
  onChange: (value: string) => void;
  value: string;
}

function SelectField({
  error,
  items,
  label,
  onChange,
  value,
}: SelectFieldProps) {
  return (
    <Select
      aria-label={label}
      onChange={(key) => onChange(key ? String(key) : "")}
      value={value === "" ? null : value}
    >
      <Label>{label}</Label>
      <SelectTrigger />
      <SelectContent>
        <SelectItem id="" textValue="-- Không chọn --">
          <SelectLabel>-- Không chọn --</SelectLabel>
        </SelectItem>
        {items.map((item) => (
          <SelectItem key={item.id} id={item.id} textValue={item.label}>
            <SelectLabel>{item.label}</SelectLabel>
          </SelectItem>
        ))}
      </SelectContent>
      {error ? <FieldError>{error}</FieldError> : null}
    </Select>
  );
}

SiteSettingsPage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;
