import { useForm } from "@inertiajs/react";
import type { FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { TextField } from "@/components/ui/text-field";
import rolesPermissions from "@/routes/cms/roles-permissions";

export interface RoleFormValues {
  id?: number;
  name: string;
  permissions: string[];
}

interface PermissionData {
  id: number;
  name: string;
  guardName: string;
  roles: string[];
  roleCount: number;
}

interface RoleFormDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  mode: "create" | "edit";
  initialValues: RoleFormValues;
  allPermissions: PermissionData[];
  canManagePermissions: boolean;
  protectedRoleNames: string[];
}

const categoryTranslations: Record<string, string> = {
  posts: "Bài viết (posts)",
  pages: "Trang (pages)",
  roles: "Vai trò (roles)",
  permissions: "Quyền hạn (permissions)",
  users: "Người dùng (users)",
  "staff profiles": "Hồ sơ cán bộ (staff profiles)",
  "staff-profiles": "Hồ sơ cán bộ (staff profiles)",
  staff: "Cán bộ (staff)",
  units: "Đơn vị (units)",
  media: "Thư viện media (media)",
  navigation: "Menu điều hướng (navigation)",
  "navigation menus": "Menu điều hướng (navigation)",
  positions: "Chức vụ (positions)",
  "post categories": "Danh mục bài viết (post-categories)",
  "post-categories": "Danh mục bài viết (post-categories)",
};

const getCategory = (permissionName: string) => {
  const parts = permissionName.split(" ");

  if (parts.length > 1) {
    const rawCategory = parts.slice(1).join(" ");

    return (
      categoryTranslations[rawCategory] ||
      `${rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1)}`
    );
  }

  return "Hệ thống";
};

function roleRouteArgument<TRouteArgument>(roleId: number): TRouteArgument {
  return { id: roleId } as unknown as TRouteArgument;
}

export function RoleFormDialog({
  isOpen,
  onOpenChange,
  mode,
  initialValues,
  allPermissions,
  canManagePermissions,
  protectedRoleNames,
}: RoleFormDialogProps) {
  const form = useForm<RoleFormValues>({
    name: initialValues.name,
    permissions: initialValues.permissions,
  });

  const isProtectedRole =
    mode === "edit" && protectedRoleNames.includes(initialValues.name);

  // Group permissions for grouped UI
  const groupedPermissions = (() => {
    const groups: Record<string, PermissionData[]> = {};
    allPermissions.forEach((permission) => {
      const cat = getCategory(permission.name);

      if (!groups[cat]) {
        groups[cat] = [];
      }

      groups[cat].push(permission);
    });

    return groups;
  })();

  function togglePermission(name: string): void {
    if (!canManagePermissions || isProtectedRole) {
      return;
    }

    const current = [...form.data.permissions];
    const index = current.indexOf(name);

    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(name);
    }

    form.setData("permissions", current);
  }

  function handleToggleAllInCategory(
    categoryName: string,
    permissionNames: string[],
    allSelected: boolean,
  ): void {
    if (!canManagePermissions || isProtectedRole) {
      return;
    }

    let updated = [...form.data.permissions];

    if (allSelected) {
      // Remove all from this category
      updated = updated.filter((p) => !permissionNames.includes(p));
    } else {
      // Add all from this category (without duplicates)
      permissionNames.forEach((name) => {
        if (!updated.includes(name)) {
          updated.push(name);
        }
      });
    }

    form.setData("permissions", updated);
  }

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (mode === "create") {
      form.post(rolesPermissions.store.url(), {
        onSuccess: () => {
          toast.success("Tạo vai trò thành công!");
          onOpenChange(false);
        },
        onError: () => {
          toast.error("Có lỗi xảy ra khi tạo vai trò.");
        },
        preserveScroll: true,
      });

      return;
    }

    if (initialValues.id === undefined) {
      toast.error("Không tìm thấy vai trò cần cập nhật.");

      return;
    }

    form.patch(
      rolesPermissions.update.url(
        roleRouteArgument<Parameters<typeof rolesPermissions.update.url>[0]>(
          initialValues.id,
        ),
      ),
      {
        onSuccess: () => {
          toast.success("Cập nhật vai trò thành công!");
          onOpenChange(false);
        },
        onError: () => {
          toast.error("Có lỗi xảy ra khi cập nhật vai trò.");
        },
        preserveScroll: true,
      },
    );
  }

  if (!isOpen) {
    return null;
  }

  return (
    <ModalContent
      aria-label={mode === "create" ? "Tạo vai trò mới" : "Cập nhật vai trò"}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="4xl"
    >
      <form onSubmit={submit} className="flex flex-col h-full max-h-[85vh]">
        <ModalHeader className="border-b border-border pb-4">
          <ModalTitle>
            {mode === "create"
              ? "Tạo vai trò mới"
              : `Cập nhật vai trò: ${initialValues.name}`}
          </ModalTitle>
          <ModalDescription>
            {mode === "create"
              ? "Khai báo vai trò mới và định cấu hình các quyền hạn được gán."
              : "Thay đổi tên vai trò hoặc định cấu hình lại ánh xạ quyền truy cập cho vai trò này."}
          </ModalDescription>
        </ModalHeader>

        <ModalBody className="overflow-y-auto py-6 space-y-6 flex-1 min-h-0">
          {isProtectedRole ? (
            <div className="rounded-lg border border-warning-subtle bg-warning-subtle/10 p-4">
              <Text className="text-warning-fg text-sm font-medium">
                Đây là vai trò hệ thống quan trọng (
                <strong>{initialValues.name}</strong>). Để đảm bảo tính toàn vẹn
                của hệ thống, vai trò này không được đổi tên hoặc thay đổi quyền
                trực tiếp từ giao diện CMS.
              </Text>
            </div>
          ) : null}

          <Fieldset disabled={form.processing || isProtectedRole}>
            <FieldGroup>
              <TextField
                isRequired
                name="name"
                value={form.data.name}
                onChange={(value) => form.setData("name", value)}
                isDisabled={isProtectedRole}
              >
                <Label>Tên vai trò (Role Name)</Label>
                <Input placeholder="Ví dụ: content-manager, branch-admin" />
                <FieldError>{form.errors.name}</FieldError>
              </TextField>
            </FieldGroup>
          </Fieldset>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-2">
              <h3 className="text-base font-semibold text-fg">
                Quyền hạn được gán ({form.data.permissions.length} quyền)
              </h3>
              {!canManagePermissions ? (
                <span className="text-xs text-muted-fg italic">
                  Bạn không có quyền quản lý cấu hình mapping permissions.
                </span>
              ) : null}
            </div>

            {form.errors.permissions && (
              <p className="text-sm font-medium text-danger">
                {form.errors.permissions}
              </p>
            )}

            <div className="space-y-6">
              {Object.entries(groupedPermissions).map(([category, items]) => {
                const itemNames = items.map((i) => i.name);
                const selectedInGroup = items.filter((i) =>
                  form.data.permissions.includes(i.name),
                );
                const allSelected = selectedInGroup.length === items.length;
                const isSomeSelected =
                  selectedInGroup.length > 0 && !allSelected;

                return (
                  <div
                    key={category}
                    className="rounded-lg border border-border bg-bg-light/20 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-semibold text-fg capitalize">
                        {category} ({selectedInGroup.length}/{items.length})
                      </h4>
                      {canManagePermissions && !isProtectedRole ? (
                        <Button
                          type="button"
                          intent="outline"
                          size="xs"
                          onPress={() =>
                            handleToggleAllInCategory(
                              category,
                              itemNames,
                              allSelected,
                            )
                          }
                        >
                          {allSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                        </Button>
                      ) : null}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {items.map((permission) => {
                        const isChecked = form.data.permissions.includes(
                          permission.name,
                        );

                        return (
                          <div
                            key={permission.id}
                            className={`flex items-center space-x-2 rounded-md p-2 border border-dashed transition duration-200 ${
                              isChecked
                                ? "bg-primary-subtle/10 border-primary-subtle text-fg"
                                : "bg-bg border-border text-muted-fg"
                            }`}
                          >
                            <Checkbox
                              isSelected={isChecked}
                              onChange={() => togglePermission(permission.name)}
                              isDisabled={
                                !canManagePermissions ||
                                isProtectedRole ||
                                form.processing
                              }
                            >
                              <span className="text-xs font-mono">
                                {permission.name}
                              </span>
                            </Checkbox>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="border-t border-border pt-4">
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
            intent="primary"
            isDisabled={form.processing || isProtectedRole}
          >
            {form.processing
              ? "Đang lưu..."
              : mode === "create"
                ? "Tạo vai trò"
                : "Lưu thay đổi"}
          </Button>
        </ModalFooter>
      </form>
    </ModalContent>
  );
}
