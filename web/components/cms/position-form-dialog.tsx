import { useForm } from "@inertiajs/react";
import type { FormEvent } from "react";
import updatePosition from "@/actions/App/Http/Controllers/Cms/UpdatePositionController";
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
import { Switch, SwitchLabel } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { TextField } from "@/components/ui/text-field";
import { store as storePosition } from "@/routes/cms/positions";

export interface PositionFormValues {
  id?: number;
  is_active: boolean;
  name: string;
  slug: string;
  sort_order: number;
}

interface PositionFormDialogProps {
  initialValues: PositionFormValues;
  isOpen: boolean;
  mode: "create" | "edit";
  onOpenChange: (isOpen: boolean) => void;
}

export function PositionFormDialog({
  initialValues,
  isOpen,
  mode,
  onOpenChange,
}: PositionFormDialogProps) {
  const form = useForm<PositionFormValues>({
    is_active: initialValues.is_active,
    name: initialValues.name,
    slug: initialValues.slug,
    sort_order: initialValues.sort_order,
  });

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (mode === "create") {
      form.post(storePosition.url(), {
        onSuccess: () => onOpenChange(false),
        preserveScroll: true,
      });

      return;
    }

    form.patch(updatePosition.url({ position: initialValues.id ?? 0 }), {
      onSuccess: () => onOpenChange(false),
      preserveScroll: true,
    });
  }

  if (!isOpen) {
    return null;
  }

  return (
    <ModalContent
      aria-label={mode === "create" ? "Tạo chức vụ mới" : "Cập nhật chức vụ"}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
    >
      <form onSubmit={submit}>
        <ModalHeader>
          <ModalTitle>
            {mode === "create" ? "Tạo chức vụ mới" : "Cập nhật chức vụ"}
          </ModalTitle>
          <ModalDescription>
            Khai báo danh mục chức vụ để tái sử dụng cho staff appointments và
            sắp xếp hiển thị.
          </ModalDescription>
        </ModalHeader>

        <ModalBody>
          <Fieldset>
            <Legend>Thông tin chức vụ</Legend>
            <Text>
              Danh mục này nên ngắn gọn, ổn định và đủ rõ nghĩa cho cả biên tập
              viên lẫn người xem public.
            </Text>

            <FieldGroup>
              <TextField
                isRequired
                name="name"
                value={form.data.name}
                onChange={(value) => form.setData("name", value)}
              >
                <Label>Tên chức vụ</Label>
                <Input placeholder="Ví dụ: Trưởng bộ môn" />
                <FieldError>{form.errors.name}</FieldError>
              </TextField>

              <TextField
                isRequired
                name="slug"
                value={form.data.slug}
                onChange={(value) => form.setData("slug", value)}
              >
                <Label>Slug</Label>
                <Input placeholder="truong-bo-mon" />
                <FieldError>{form.errors.slug}</FieldError>
                <Description>
                  Dùng để tham chiếu nội bộ và tránh trùng lặp dữ liệu theo tên
                  hiển thị.
                </Description>
              </TextField>

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

              <div className="rounded-2xl border border-border bg-muted/20 px-4 py-3">
                <Switch
                  isSelected={form.data.is_active}
                  onChange={(isSelected) => {
                    form.setData("is_active", isSelected);
                  }}
                >
                  <SwitchLabel>Kích hoạt chức vụ</SwitchLabel>
                </Switch>
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
            {mode === "create" ? "Tạo chức vụ" : "Lưu thay đổi"}
          </Button>
        </ModalFooter>
      </form>
    </ModalContent>
  );
}
