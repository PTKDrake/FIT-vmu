import { useForm } from "@inertiajs/react";
import { useState } from "react";
import type { FormEvent } from "react";
import { Form } from "react-aria-components/Form";
import type { Key } from "react-aria-components/Select";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import studentGroupRoutes from "@/routes/cms/student-groups";

export interface StudentGroupFormValues {
  id?: number;
  code: string;
  name: string;
  redirect_back?: boolean;
  scope: "global" | "private";
  student_codes: string[];
}

interface StudentGroupFormDialogProps {
  allowGlobalScope: boolean;
  initialValues: StudentGroupFormValues;
  isOpen: boolean;
  mode: "create" | "edit";
  onOpenChange: (isOpen: boolean) => void;
  onCreated?: (group: {
    value: string;
    label: string;
    code: string;
    scope: "global" | "private";
  }) => void;
  onSaved?: () => void;
  submitMode?: "inertia" | "json";
}

function parseStudentCodes(value: string): string[] {
  const studentCodes = value
    .split(/[\s,;]+/)
    .map((studentCode) => studentCode.trim())
    .filter(Boolean);

  return Array.from(new Set(studentCodes));
}

export function StudentGroupFormDialog({
  allowGlobalScope,
  initialValues,
  isOpen,
  mode,
  onOpenChange,
  onCreated,
  onSaved,
  submitMode = "inertia",
}: StudentGroupFormDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <StudentGroupFormDialogContent
      allowGlobalScope={allowGlobalScope}
      initialValues={initialValues}
      mode={mode}
      onCreated={onCreated}
      onOpenChange={onOpenChange}
      onSaved={onSaved}
      submitMode={submitMode}
    />
  );
}

interface StudentGroupFormDialogContentProps {
  allowGlobalScope: boolean;
  initialValues: StudentGroupFormValues;
  mode: "create" | "edit";
  onOpenChange: (isOpen: boolean) => void;
  onCreated?: (group: {
    value: string;
    label: string;
    code: string;
    scope: "global" | "private";
  }) => void;
  onSaved?: () => void;
  submitMode: "inertia" | "json";
}

function StudentGroupFormDialogContent({
  allowGlobalScope,
  initialValues,
  mode,
  onOpenChange,
  onCreated,
  onSaved,
  submitMode,
}: StudentGroupFormDialogContentProps) {
  const [studentCodesText, setStudentCodesText] = useState(
    initialValues.student_codes.join("\n"),
  );
  const form = useForm<StudentGroupFormValues>({
    code: initialValues.code,
    name: initialValues.name,
    scope:
      initialValues.scope === "global" && !allowGlobalScope
        ? "private"
        : initialValues.scope,
    student_codes: initialValues.student_codes,
  });
  const validationErrors: Record<string, string[]> = {};

  if (form.errors.code) {
    validationErrors.code = [form.errors.code];
  }

  if (form.errors.name) {
    validationErrors.name = [form.errors.name];
  }

  if (form.errors.scope) {
    validationErrors.scope = [form.errors.scope];
  }

  if (form.errors.student_codes) {
    validationErrors.student_codes = [form.errors.student_codes];
  }

  async function submit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const studentCodes = parseStudentCodes(studentCodesText);

    if (submitMode === "json" && mode === "create") {
      form.clearErrors();

      const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute("content");

      const response = await fetch(studentGroupRoutes.store.url(), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": csrfToken ?? "",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({
          code: form.data.code,
          name: form.data.name,
          scope: form.data.scope,
          student_codes: studentCodes,
        }),
        credentials: "same-origin",
      });

      if (response.status === 422) {
        const payload = (await response.json()) as {
          errors?: Record<string, string[]>;
        };

        for (const [field, messages] of Object.entries(payload.errors ?? {})) {
          form.setError(
            field as keyof StudentGroupFormValues,
            messages[0] ?? "Dữ liệu không hợp lệ.",
          );
        }

        return;
      }

      if (!response.ok) {
        form.setError("name", "Không thể tạo nhóm sinh viên lúc này.");

        return;
      }

      const payload = (await response.json()) as {
        group: {
          value: string;
          label: string;
          code: string;
          scope: "global" | "private";
        };
      };

      setStudentCodesText(studentCodes.join("\n"));
      onCreated?.(payload.group);
      form.reset();
      setStudentCodesText("");
      onOpenChange(false);

      return;
    }

    form.transform((data) => ({
      ...data,
      student_codes: studentCodes,
    }));

    if (mode === "create") {
      form.post(studentGroupRoutes.store.url(), {
        onSuccess: () => {
          setStudentCodesText(studentCodes.join("\n"));
          form.reset();
          setStudentCodesText("");
          onOpenChange(false);
          onSaved?.();
        },
        preserveScroll: true,
      });

      return;
    }

    form.patch(
      studentGroupRoutes.update.url({ student_group: initialValues.id ?? 0 }),
      {
        onSuccess: () => {
          setStudentCodesText(studentCodes.join("\n"));
          onOpenChange(false);
          onSaved?.();
        },
        preserveScroll: true,
      },
    );
  }

  return (
    <ModalContent
      aria-label={
        mode === "create" ? "Tạo nhóm sinh viên mới" : "Cập nhật nhóm sinh viên"
      }
      isOpen={true}
      onOpenChange={onOpenChange}
      size="2xl"
    >
      <Form
        onSubmit={submit}
        validationBehavior="aria"
        validationErrors={validationErrors}
      >
        <ModalHeader>
          <ModalTitle>
            {mode === "create"
              ? "Tạo nhóm sinh viên"
              : "Cập nhật nhóm sinh viên"}
          </ModalTitle>
          <ModalDescription>
            Dán danh sách mã sinh viên để tạo nhanh một group dùng lại cho các
            trang và bài viết có kiểm soát truy cập.
          </ModalDescription>
        </ModalHeader>

        <ModalBody className="min-h-0 overflow-y-auto">
          <div>
            <Fieldset>
              <FieldGroup>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="student-group-name">Tên nhóm</Label>
                    <Input
                      id="student-group-name"
                      value={form.data.name}
                      onChange={(event) =>
                        form.setData("name", event.target.value)
                      }
                    />
                    <FieldError>{form.errors.name}</FieldError>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student-group-code">Mã nhóm</Label>
                    <Input
                      id="student-group-code"
                      placeholder="TTM63DH"
                      value={form.data.code}
                      onChange={(event) =>
                        form.setData("code", event.target.value.toUpperCase())
                      }
                    />
                    <FieldError>{form.errors.code}</FieldError>
                  </div>
                </div>
                <div className="space-y-2">
                  <Select
                    className="space-y-2"
                    value={form.data.scope}
                    onChange={(key: Key | null) =>
                      form.setData(
                        "scope",
                        key as StudentGroupFormValues["scope"],
                      )
                    }
                  >
                    <Label>Phạm vi sử dụng</Label>
                    <SelectTrigger />
                    <SelectContent>
                      <SelectItem id="private" textValue="Chỉ mình tôi dùng">
                        Chỉ mình tôi dùng
                      </SelectItem>
                      {allowGlobalScope ? (
                        <SelectItem
                          id="global"
                          textValue="Dùng chung toàn hệ thống"
                        >
                          Dùng chung toàn hệ thống
                        </SelectItem>
                      ) : null}
                    </SelectContent>
                  </Select>
                  <Description>
                    Nhóm private chỉ hiện cho người tạo. Nhóm global có thể được
                    chọn lại bởi mọi biên tập viên có quyền phù hợp.
                  </Description>
                  <FieldError>{form.errors.scope}</FieldError>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-group-members">
                    Danh sách mã sinh viên
                  </Label>
                  <Textarea
                    className="field-sizing-fixed resize-y overflow-y-auto"
                    id="student-group-members"
                    placeholder={"94903\n123456\n20240001"}
                    rows={10}
                    value={studentCodesText}
                    onChange={(event) =>
                      setStudentCodesText(event.target.value)
                    }
                  />
                  <Description>
                    Mỗi dòng là một `student_code` chỉ gồm số. Hệ thống sẽ lưu
                    danh sách sau khi loại bỏ mã trùng lặp, không kiểm tra sự
                    tồn tại của tài khoản tương ứng. Có thể dán bằng dấu cách,
                    dấu phẩy hoặc xuống dòng.
                  </Description>
                  <FieldError>{form.errors.student_codes}</FieldError>
                </div>
              </FieldGroup>
            </Fieldset>
          </div>
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
            {mode === "create" ? "Tạo nhóm" : "Lưu thay đổi"}
          </Button>
        </ModalFooter>
      </Form>
    </ModalContent>
  );
}
