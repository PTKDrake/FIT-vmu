import { useForm } from "@inertiajs/react";
import type { FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldError, FieldGroup, Fieldset, Label } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import { TextField } from "@/components/ui/text-field";
import rolesPermissions from "@/routes/cms/roles-permissions";

interface RoleData {
  id: number;
  name: string;
  guardName: string;
  isProtected: boolean;
  permissions: string[];
  permissionCount: number;
}

interface RoleActionDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  mode: "copy" | "rename" | "delete";
  role: RoleData;
}

interface ActionFormValues {
  name: string;
  permissions: string[];
}

function roleRouteArgument<TRouteArgument>(roleId: number): TRouteArgument {
  return { id: roleId } as unknown as TRouteArgument;
}

export function RoleActionDialog({
  isOpen,
  onOpenChange,
  mode,
  role,
}: RoleActionDialogProps) {
  const form = useForm<ActionFormValues>({
    name: mode === "copy" ? `${role.name}-sao-chep` : role.name,
    permissions: role.permissions,
  });

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (mode === "copy") {
      form.post(rolesPermissions.store.url(), {
        onSuccess: () => {
          toast.success(
            `Đã sao chép vai trò thành công thành "${form.data.name}".`,
          );
          onOpenChange(false);
        },
        onError: () => {
          toast.error("Có lỗi xảy ra khi sao chép vai trò.");
        },
        preserveScroll: true,
      });

      return;
    }

    if (mode === "rename") {
      form.patch(
        rolesPermissions.update.url(
          roleRouteArgument<Parameters<typeof rolesPermissions.update.url>[0]>(
            role.id,
          ),
        ),
        {
          onSuccess: () => {
            toast.success(`Đã đổi tên vai trò thành "${form.data.name}".`);
            onOpenChange(false);
          },
          onError: () => {
            toast.error("Có lỗi xảy ra khi đổi tên vai trò.");
          },
          preserveScroll: true,
        },
      );

      return;
    }

    if (mode === "delete") {
      form.delete(
        rolesPermissions.delete.url(
          roleRouteArgument<Parameters<typeof rolesPermissions.delete.url>[0]>(
            role.id,
          ),
        ),
        {
          onSuccess: () => {
            toast.success(`Đã xóa vai trò "${role.name}" thành công.`);
            onOpenChange(false);
          },
          onError: () => {
            toast.error("Có lỗi xảy ra khi xóa vai trò.");
          },
          preserveScroll: true,
        },
      );

      return;
    }
  }

  if (!isOpen) {
    return null;
  }

  const getTitle = () => {
    switch (mode) {
      case "copy":
        return `Sao chép vai trò: ${role.name}`;
      case "rename":
        return `Đổi tên vai trò: ${role.name}`;
      case "delete":
        return `Xóa vai trò: ${role.name}`;
    }
  };

  const getDescription = () => {
    switch (mode) {
      case "copy":
        return `Tạo một vai trò mới thừa hưởng toàn bộ ${role.permissionCount} quyền hạn hiện tại của "${role.name}".`;
      case "rename":
        return `Đặt lại tên hiển thị cho vai trò này. Các quyền hạn được gán sẽ được giữ nguyên.`;
      case "delete":
        return `Hành động này không thể hoàn tác. Vai trò "${role.name}" sẽ bị xóa vĩnh viễn khỏi hệ thống.`;
    }
  };

  return (
    <ModalContent
      aria-label={getTitle()}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="md"
      role={mode === "delete" ? "alertdialog" : "dialog"}
    >
      <form onSubmit={submit}>
        <ModalHeader>
          <ModalTitle>{getTitle()}</ModalTitle>
          <ModalDescription>{getDescription()}</ModalDescription>
        </ModalHeader>

        <ModalBody className="space-y-4">
          {mode !== "delete" ? (
            <Fieldset disabled={form.processing}>
              <FieldGroup>
                <TextField
                  isRequired
                  name="name"
                  value={form.data.name}
                  onChange={(value) => form.setData("name", value)}
                >
                  <Label>Tên vai trò mới</Label>
                  <Input placeholder="Nhập tên vai trò..." />
                  <FieldError>{form.errors.name}</FieldError>
                </TextField>
              </FieldGroup>
            </Fieldset>
          ) : (
            <div className="rounded-lg border border-danger-subtle bg-danger-subtle/10 p-3">
              <Text className="text-danger-fg text-xs font-semibold">
                Cảnh báo: Người dùng đang gán vai trò này sẽ bị mất các quyền
                tương ứng trừ khi họ được gán vai trò khác.
              </Text>
            </div>
          )}
        </ModalBody>

        <ModalFooter className="space-x-2">
          <Button
            type="button"
            intent="secondary"
            onPress={() => onOpenChange(false)}
            isDisabled={form.processing}
          >
            Hủy
          </Button>
          <Button
            type="submit"
            intent={mode === "delete" ? "danger" : "primary"}
            isDisabled={form.processing}
          >
            {form.processing
              ? "Đang xử lý..."
              : mode === "copy"
                ? "Sao chép"
                : mode === "rename"
                  ? "Đổi tên"
                  : "Xóa vai trò"}
          </Button>
        </ModalFooter>
      </form>
    </ModalContent>
  );
}
