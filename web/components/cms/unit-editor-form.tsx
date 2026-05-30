import { Link } from "@inertiajs/react";
import { BlockNoteEditor } from "@/components/editor/blocknote-editor";
import { Button } from "@/components/ui/button";
import {
  Description,
  FieldError,
  FieldGroup,
  Fieldset,
  Legend,
  Label,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { NumberField, NumberInput } from "@/components/ui/number-field";
import { Switch, SwitchLabel } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { TextField } from "@/components/ui/text-field";

export interface UnitEditorFormData {
  description: string;
  description_format: "blocknote_json";
  is_active: boolean;
  name: string;
  slug: string;
  sort_order: number;
}

interface UnitEditorFormProps {
  cancelHref: string;
  data: UnitEditorFormData;
  errors: Partial<Record<keyof UnitEditorFormData, string>>;
  processing: boolean;
  submitLabel: string;
  title: string;
  onSubmit: () => void;
  onUpdate: <TKey extends keyof UnitEditorFormData>(
    key: TKey,
    value: UnitEditorFormData[TKey],
  ) => void;
}

export function UnitEditorForm({
  cancelHref,
  data,
  errors,
  processing,
  submitLabel,
  title,
  onSubmit,
  onUpdate,
}: UnitEditorFormProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <Fieldset className="rounded-2xl border border-border bg-overlay px-5 py-5">
        <Legend>{title}</Legend>
        <Text>
          Quản lý thông tin công khai của đơn vị và nội dung BlockNote dùng cho
          public website.
        </Text>

        <FieldGroup>
          <div className="grid gap-4 lg:grid-cols-2">
            <TextField
              isRequired
              name="name"
              value={data.name}
              onChange={(value) => onUpdate("name", value)}
            >
              <Label>Tên đơn vị</Label>
              <Input placeholder="Ví dụ: Khoa Công nghệ thông tin" />
              <FieldError>{errors.name}</FieldError>
            </TextField>

            <TextField
              isRequired
              name="slug"
              value={data.slug}
              onChange={(value) => onUpdate("slug", value)}
            >
              <Label>Slug</Label>
              <Input placeholder="khoa-cong-nghe-thong-tin" />
              <FieldError>{errors.slug}</FieldError>
              <Description>
                Dùng cho route nội bộ và các liên kết public.
              </Description>
            </TextField>
          </div>

          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)]">
            <NumberField
              isRequired
              formatOptions={{ useGrouping: false }}
              minValue={0}
              name="sort_order"
              value={data.sort_order}
              onChange={(value) => {
                onUpdate("sort_order", Number.isNaN(value) ? 0 : value);
              }}
            >
              <Label>Thứ tự</Label>
              <NumberInput />
              <FieldError>{errors.sort_order}</FieldError>
            </NumberField>

            <div className="rounded-2xl border border-border bg-muted/20 px-4 py-3">
              <Switch
                isSelected={data.is_active}
                onChange={(isSelected) => onUpdate("is_active", isSelected)}
              >
                <SwitchLabel>Kích hoạt đơn vị</SwitchLabel>
              </Switch>
            </div>
          </div>

          <div data-slot="control" className="space-y-3">
            <div className="space-y-1">
              <Label>Mô tả BlockNote</Label>
              <Text className="text-sm text-muted-fg">
                Nội dung này được dùng để hiển thị giới thiệu đơn vị trên public
                website.
              </Text>
            </div>

            <BlockNoteEditor
              content={data.description}
              onChange={(value) => {
                onUpdate("description", value.isEmpty ? "" : value.json);
              }}
            />

            {errors.description ? (
              <FieldError>{errors.description}</FieldError>
            ) : null}
            {errors.description_format ? (
              <FieldError>{errors.description_format}</FieldError>
            ) : null}
          </div>
        </FieldGroup>

        <div
          data-slot="control"
          className="flex flex-wrap items-center justify-end gap-3"
        >
          <Link
            href={cancelHref}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-border bg-bg px-4 text-sm font-medium text-fg transition hover:bg-muted/40"
          >
            Hủy
          </Link>
          <Button isDisabled={processing} type="submit">
            {submitLabel}
          </Button>
        </div>
      </Fieldset>
    </form>
  );
}
