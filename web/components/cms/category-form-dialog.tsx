import { useForm } from "@inertiajs/react";
import type { FormEvent } from "react";
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
import {
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { NumberField, NumberInput } from "@/components/ui/number-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { Switch, SwitchLabel } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { TextField } from "@/components/ui/text-field";
import {
  store as storeCategory,
  update as updateCategory,
} from "@/routes/cms/post-categories";

export interface CategoryFormValues {
  id?: number;
  is_active: boolean;
  name: string;
  slug: string;
  description: string;
  parent_id: number | null;
  sort_order: number;
}

interface CategoryFormDialogProps {
  initialValues: CategoryFormValues;
  isOpen: boolean;
  mode: "create" | "edit";
  onOpenChange: (isOpen: boolean) => void;
  parentOptions: Array<{
    label: string;
    parentId: number | null;
    value: string;
  }>;
}

export function CategoryFormDialog({
  initialValues,
  isOpen,
  mode,
  onOpenChange,
  parentOptions,
}: CategoryFormDialogProps) {
  const form = useForm<CategoryFormValues>({
    description: initialValues.description,
    is_active: initialValues.is_active,
    name: initialValues.name,
    parent_id: initialValues.parent_id,
    slug: initialValues.slug,
    sort_order: initialValues.sort_order,
  });

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const payload = {
      ...form.data,
      parent_id:
        form.data.parent_id === null ? null : Number(form.data.parent_id),
    };

    if (mode === "create") {
      form.post(storeCategory.url(), {
        onSuccess: () => onOpenChange(false),
        preserveScroll: true,
      });

      return;
    }

    form.patch(updateCategory.url({ post_category: initialValues.id ?? 0 }), {
      onSuccess: () => onOpenChange(false),
      preserveScroll: true,
    });
  }

  // Filter out self to avoid circular reference
  const filteredOptions = parentOptions.filter(
    (opt) => mode === "create" || String(initialValues.id) !== opt.value,
  );

  if (!isOpen) {
    return null;
  }

  return (
    <ModalContent
      aria-label={mode === "create" ? "Tạo danh mục mới" : "Cập nhật danh mục"}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="3xl"
    >
      <form onSubmit={submit}>
        <ModalHeader>
          <ModalTitle>
            {mode === "create"
              ? "Tạo danh mục bài viết mới"
              : "Cập nhật danh mục"}
          </ModalTitle>
          <ModalDescription>
            Tạo hoặc cập nhật danh mục bài viết để phân loại tin tức và hiển thị
            trên navigation menu.
          </ModalDescription>
        </ModalHeader>

        <ModalBody className="max-h-[70vh] overflow-y-auto">
          <Fieldset>
            <Legend>Thông tin danh mục</Legend>
            <Text className="text-sm text-muted-fg">
              Các danh mục có thể tổ chức dạng cha - con để phân cấp thông tin
              rõ ràng.
            </Text>

            <FieldGroup className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextField
                  isRequired
                  name="name"
                  value={form.data.name}
                  onChange={(value) => {
                    form.setData("name", value);

                    // Proactively slugify name on create
                    if (mode === "create") {
                      const slug = value
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/[đĐ]/g, "d")
                        .replace(/([^0-9a-z-\s])/g, "")
                        .replace(/(\s+)/g, "-")
                        .replace(/-+/g, "-")
                        .replace(/^-+|-+$/g, "");
                      form.setData((prev) => ({
                        ...prev,
                        name: value,
                        slug,
                      }));
                    }
                  }}
                >
                  <Label>Tên danh mục</Label>
                  <Input placeholder="Ví dụ: Đào tạo chính quy" />
                  <FieldError>{form.errors.name}</FieldError>
                </TextField>

                <TextField
                  isRequired
                  name="slug"
                  value={form.data.slug}
                  onChange={(value) => form.setData("slug", value)}
                >
                  <Label>Slug</Label>
                  <Input placeholder="dao-tao-chinh-quy" />
                  <FieldError>{form.errors.slug}</FieldError>
                  <Description>
                    Dùng để hiển thị URL đường dẫn tĩnh.
                  </Description>
                </TextField>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select
                  aria-label="Danh mục cha"
                  selectedKey={
                    form.data.parent_id === null
                      ? "root"
                      : String(form.data.parent_id)
                  }
                  onSelectionChange={(key) => {
                    form.setData(
                      "parent_id",
                      key === "root" ? null : Number(key),
                    );
                  }}
                >
                  <Label>Danh mục cha</Label>
                  <SelectTrigger />
                  <SelectContent>
                    <SelectItem id="root" textValue="Không có danh mục cha">
                      <SelectLabel>
                        Không có danh mục cha (Cấp cao nhất)
                      </SelectLabel>
                    </SelectItem>
                    {filteredOptions.map((opt) => (
                      <SelectItem
                        key={opt.value}
                        id={opt.value}
                        textValue={opt.label}
                      >
                        <SelectLabel>{opt.label}</SelectLabel>
                      </SelectItem>
                    ))}
                  </SelectContent>
                  <FieldError>{form.errors.parent_id}</FieldError>
                </Select>

                <NumberField
                  isRequired
                  formatOptions={{ useGrouping: false }}
                  minValue={0}
                  name="sort_order"
                  value={form.data.sort_order}
                  onChange={(value) => {
                    form.setData("sort_order", Number.isNaN(value) ? 0 : value);
                  }}
                >
                  <Label>Thứ tự sắp xếp</Label>
                  <NumberInput />
                  <FieldError>{form.errors.sort_order}</FieldError>
                </NumberField>
              </div>

              <div className="rounded-2xl border border-border bg-muted/20 px-4 py-3">
                <Switch
                  isSelected={form.data.is_active}
                  onChange={(isSelected) => {
                    form.setData("is_active", isSelected);
                  }}
                >
                  <SwitchLabel>Kích hoạt danh mục</SwitchLabel>
                </Switch>
              </div>

              <div data-slot="control" className="space-y-3">
                <div className="space-y-1">
                  <Label>Mô tả chi tiết (BlockNote)</Label>
                  <Description>
                    Nội dung giới thiệu chi tiết về danh mục tin tức này.
                  </Description>
                </div>

                <BlockNoteEditor
                  content={form.data.description}
                  onChange={(value) => {
                    form.setData(
                      "description",
                      value.isEmpty ? "" : value.json,
                    );
                  }}
                />
                {form.errors.description ? (
                  <FieldError>{form.errors.description}</FieldError>
                ) : null}
              </div>
            </FieldGroup>
          </Fieldset>
        </ModalBody>

        <ModalFooter>
          <Button
            intent="outline"
            onPress={() => onOpenChange(false)}
            type="button"
          >
            Hủy
          </Button>
          <Button isDisabled={form.processing} type="submit">
            {mode === "create" ? "Tạo danh mục" : "Lưu thay đổi"}
          </Button>
        </ModalFooter>
      </form>
    </ModalContent>
  );
}
