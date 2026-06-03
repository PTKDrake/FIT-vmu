import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { StudentGroupFormDialog } from "@/components/cms/student-group-form-dialog";
import type { StudentGroupFormValues } from "@/components/cms/student-group-form-dialog";
import {
  Description,
  FieldError,
  Label,
} from "@/components/ui/field";
import {
  MultipleSelect,
  MultipleSelectContent,
  MultipleSelectItem,
} from "@/components/ui/multiple-select";
import { Button } from "@/components/ui/button";

interface StudentGroupPickerProps {
  allowGlobalScope: boolean;
  error?: string;
  onChange: (groupIds: number[]) => void;
  options: Array<{
    value: string;
    label: string;
    code: string;
    scope: "global" | "private";
  }>;
  selectedIds: number[];
}

const emptyStudentGroupFormValues: StudentGroupFormValues = {
  code: "",
  name: "",
  scope: "private",
  student_codes: [],
};

export function StudentGroupPicker({
  allowGlobalScope,
  error,
  onChange,
  options,
  selectedIds,
}: StudentGroupPickerProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [availableOptions, setAvailableOptions] = useState(options);

  const selectedValues = selectedIds.map((id) => String(id));
  const selectOptions = availableOptions.map((group) => ({
    id: group.value,
    name: `${group.label} (${group.code})${group.scope === "private" ? " • Riêng tư" : ""}`,
  }));

  return (
    <div className="space-y-2">
      <MultipleSelect
        className="space-y-2"
        placeholder="Chọn nhóm sinh viên..."
        value={selectedValues}
        onChange={(keys) =>
          onChange(
            keys
              .map((key) => Number(key))
              .filter((value) => Number.isInteger(value)),
          )
        }
      >
        <Label>Nhóm sinh viên được phép xem</Label>
        <MultipleSelectContent items={selectOptions}>
          {(item) => (
            <MultipleSelectItem id={item.id} textValue={item.name}>
              {item.name}
            </MultipleSelectItem>
          )}
        </MultipleSelectContent>
        <FieldError>{error}</FieldError>
      </MultipleSelect>

      <div className="flex items-center justify-between gap-3">
        <Description>
          Chỉ sinh viên thuộc các nhóm đã chọn mới xem được nội dung này.
        </Description>
        <Button intent="outline" size="sm" onPress={() => setIsDialogOpen(true)}>
          <PlusIcon />
          Tạo nhanh group
        </Button>
      </div>

      {options.length === 0 ? (
        <Description>
          Chưa có nhóm sinh viên khả dụng. Bạn có thể tạo nhanh ngay tại đây.
        </Description>
      ) : null}

      <StudentGroupFormDialog
        allowGlobalScope={allowGlobalScope}
        initialValues={emptyStudentGroupFormValues}
        isOpen={isDialogOpen}
        mode="create"
        onOpenChange={setIsDialogOpen}
        onCreated={(group) => {
          setAvailableOptions((currentOptions) => [...currentOptions, group]);
          onChange([...selectedIds, Number(group.value)]);
        }}
        submitMode="json"
      />
    </div>
  );
}
