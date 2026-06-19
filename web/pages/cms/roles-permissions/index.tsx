import {
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@heroicons/react/20/solid";
import {
  EllipsisVerticalIcon,
  PlusIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { Head } from "@inertiajs/react";
import { Fragment, useDeferredValue, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { RoleActionDialog } from "@/components/cms/role-action-dialog";
import { RoleFormDialog } from "@/components/cms/role-form-dialog";
import type { RoleFormValues } from "@/components/cms/role-form-dialog";
import { StickyActionBar } from "@/components/cms/sticky-action-bar";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SearchField, SearchInput } from "@/components/ui/search-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { Code, Text } from "@/components/ui/text";
import { useRegisterUnsavedChanges } from "@/hooks/use-unsaved-changes";
import CmsLayout from "@/layouts/cms-layout";
import { roleRouteArgument } from "@/lib/role-route-argument";
import { includesNormalizedSearch, normalizeSearchText } from "@/lib/search";
import rolesPermissions from "@/routes/cms/roles-permissions";

interface RoleData {
  id: number;
  name: string;
  guardName: string;
  isProtected: boolean;
  permissions: string[];
  permissionCount: number;
}

interface PermissionData {
  id: number;
  name: string;
  guardName: string;
  roles: string[];
  roleCount: number;
}

interface CmsRolesPermissionsPageProps {
  can: {
    manageRoles: boolean;
    managePermissions: boolean;
    createRoles: boolean;
  };
  roles: RoleData[];
  permissions: PermissionData[];
  protectedRoleNames: string[];
}

const categoryTranslations: Record<string, string> = {
  media: "Thư viện media",
  navigation: "Điều hướng",
  "navigation menus": "Điều hướng",
  pages: "Trang",
  permissions: "Quyền hệ thống",
  positions: "Chức vụ",
  "post categories": "Danh mục bài viết",
  "post-categories": "Danh mục bài viết",
  posts: "Bài viết",
  roles: "Vai trò",
  staff: "Cán bộ",
  "staff profiles": "Hồ sơ cán bộ",
  "staff-profiles": "Hồ sơ cán bộ",
  units: "Đơn vị",
  users: "Người dùng",
};

function csrfToken(): string {
  return (
    document
      .querySelector<HTMLMetaElement>('meta[name="csrf-token"]')
      ?.content.trim() ?? ""
  );
}

function getCategoryLabel(permissionName: string): string {
  const parts = permissionName.split(" ");

  if (parts.length <= 1) {
    return "Hệ thống";
  }

  const rawCategory = parts.slice(1).join(" ");

  return (
    categoryTranslations[rawCategory] ??
    rawCategory.charAt(0).toUpperCase() + rawCategory.slice(1)
  );
}

function getRoleInitials(roleName: string): string {
  return roleName
    .split(/[\s-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment.charAt(0).toUpperCase())
    .join("");
}

function normalizePermissionList(values: string[]): string[] {
  return Array.from(new Set(values)).sort((left, right) =>
    left.localeCompare(right, "vi", { sensitivity: "base" }),
  );
}

function sortByLabel(values: string[]): string[] {
  return values.toSorted((left, right) =>
    left.localeCompare(right, "vi", { sensitivity: "base" }),
  );
}

function arraysAreEqual(left: string[], right: string[]): boolean {
  if (left.length !== right.length) {
    return false;
  }

  return left.every((value, index) => value === right[index]);
}

export default function CmsRolesPermissionsPage({
  can,
  roles,
  permissions,
  protectedRoleNames,
}: CmsRolesPermissionsPageProps) {
  const [roleItems, setRoleItems] = useState<RoleData[]>(() =>
    roles.map((role) => ({
      ...role,
      permissions: normalizePermissionList(role.permissions),
    })),
  );
  const [draftPermissionsByRole, setDraftPermissionsByRole] = useState<
    Record<number, string[]>
  >({});
  const [isSavingChanges, setIsSavingChanges] = useState(false);

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [formInitialValues, setFormInitialValues] = useState<RoleFormValues>({
    name: "",
    permissions: [],
  });

  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [actionDialogMode, setActionDialogMode] = useState<
    "copy" | "rename" | "delete"
  >("copy");
  const [actionRole, setActionRole] = useState<RoleData | null>(null);

  const allCategories = sortByLabel(
    Array.from(
      new Set(
        permissions.map((permission) => getCategoryLabel(permission.name)),
      ),
    ),
  );
  const allRoleNames = sortByLabel(roleItems.map((role) => role.name));

  const [selectedCategories, setSelectedCategories] =
    useState<string[]>(allCategories);
  const [selectedRoles, setSelectedRoles] = useState<string[]>(allRoleNames);
  const [categorySearch, setCategorySearch] = useState("");
  const [roleSearch, setRoleSearch] = useState("");
  const [matrixSearchQuery, setMatrixSearchQuery] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<
    Record<string, boolean>
  >(() =>
    Object.fromEntries(allCategories.map((category) => [category, false])),
  );
  const [expandCollapseValue, setExpandCollapseValue] =
    useState<string>("collapsed");

  const deferredMatrixSearch = useDeferredValue(matrixSearchQuery);

  const roleItemsById = new Map(roleItems.map((role) => [role.id, role]));

  const filteredRoles = roleItems.filter((role) =>
    selectedRoles.includes(role.name),
  );

  const groupedPermissions = (() => {
    const groups = new Map<string, PermissionData[]>();
    const searchTerm = normalizeSearchText(deferredMatrixSearch);

    permissions.forEach((permission) => {
      const category = getCategoryLabel(permission.name);

      if (!selectedCategories.includes(category)) {
        return;
      }

      if (
        searchTerm !== "" &&
        !includesNormalizedSearch(permission.name, searchTerm) &&
        !includesNormalizedSearch(category, searchTerm)
      ) {
        return;
      }

      const currentGroup = groups.get(category) ?? [];
      currentGroup.push(permission);
      groups.set(category, currentGroup);
    });

    return Array.from(groups.entries()).sort(([left], [right]) =>
      left.localeCompare(right, "vi", { sensitivity: "base" }),
    );
  })();

  const filteredCategoryOptions = (() => {
    if (categorySearch.trim() === "") {
      return allCategories;
    }

    const keyword = normalizeSearchText(categorySearch);

    return allCategories.filter((category) =>
      includesNormalizedSearch(category, keyword),
    );
  })();

  const filteredRoleOptions = (() => {
    if (roleSearch.trim() === "") {
      return allRoleNames;
    }

    const keyword = normalizeSearchText(roleSearch);

    return allRoleNames.filter((roleName) =>
      includesNormalizedSearch(roleName, keyword),
    );
  })();

  const dirtyRoleIds = Object.entries(draftPermissionsByRole)
    .filter(([roleId, nextPermissions]) => {
      const baseRole = roleItemsById.get(Number(roleId));

      if (!baseRole) {
        return false;
      }

      return !arraysAreEqual(baseRole.permissions, nextPermissions);
    })
    .map(([roleId]) => Number(roleId));

  const dirtyPermissionCount = dirtyRoleIds.reduce((count, roleId) => {
    const role = roleItemsById.get(roleId);
    const draftPermissions = draftPermissionsByRole[roleId];

    if (!role || !draftPermissions) {
      return count;
    }

    const basePermissions = new Set(role.permissions);
    const nextPermissions = new Set(draftPermissions);
    const changedPermissions = Array.from(
      new Set([...role.permissions, ...draftPermissions]),
    ).filter(
      (permission) =>
        basePermissions.has(permission) !== nextPermissions.has(permission),
    );

    return count + changedPermissions.length;
  }, 0);

  function getEffectivePermissions(roleId: number): string[] {
    return (
      draftPermissionsByRole[roleId] ??
      roleItemsById.get(roleId)?.permissions ??
      []
    );
  }

  function handleCreateRole(): void {
    setDialogMode("create");
    setFormInitialValues({
      name: "",
      permissions: [],
    });
    setIsFormDialogOpen(true);
  }

  function handleRoleAction(
    mode: "copy" | "rename" | "delete",
    role: RoleData,
  ): void {
    setActionDialogMode(mode);
    setActionRole(role);
    setIsActionDialogOpen(true);
  }

  function toggleCategoryExpansion(categoryName: string): void {
    setExpandedCategories((current) => ({
      ...current,
      [categoryName]: !current[categoryName],
    }));
  }

  function toggleCategorySelection(categoryName: string): void {
    setSelectedCategories((current) =>
      current.includes(categoryName)
        ? current.filter((item) => item !== categoryName)
        : [...current, categoryName],
    );
  }

  function toggleRoleSelection(roleName: string): void {
    setSelectedRoles((current) =>
      current.includes(roleName)
        ? current.filter((item) => item !== roleName)
        : [...current, roleName],
    );
  }

  function resetDraftChanges(): void {
    setDraftPermissionsByRole({});
  }

  function togglePermission(roleId: number, permissionName: string): void {
    const role = roleItemsById.get(roleId);

    if (
      !role ||
      !can.managePermissions ||
      role.isProtected ||
      isSavingChanges
    ) {
      return;
    }

    setDraftPermissionsByRole((current) => {
      const currentPermissions = current[roleId] ?? role.permissions;
      const nextPermissions = currentPermissions.includes(permissionName)
        ? currentPermissions.filter((item) => item !== permissionName)
        : [...currentPermissions, permissionName];
      const normalizedNextPermissions =
        normalizePermissionList(nextPermissions);

      if (arraysAreEqual(role.permissions, normalizedNextPermissions)) {
        const rest = { ...current };
        delete rest[roleId];

        return rest;
      }

      return {
        ...current,
        [roleId]: normalizedNextPermissions,
      };
    });
  }

  async function saveDraftChanges(): Promise<boolean> {
    if (dirtyRoleIds.length === 0) {
      return true;
    }

    setIsSavingChanges(true);

    try {
      for (const roleId of dirtyRoleIds) {
        const role = roleItemsById.get(roleId);
        const nextPermissions = draftPermissionsByRole[roleId];

        if (!role || !nextPermissions) {
          continue;
        }

        const response = await fetch(
          rolesPermissions.update.url(
            roleRouteArgument<
              Parameters<typeof rolesPermissions.update.url>[0]
            >(roleId),
          ),
          {
            method: "PATCH",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "X-CSRF-TOKEN": csrfToken(),
              "X-Requested-With": "XMLHttpRequest",
            },
            credentials: "same-origin",
            body: JSON.stringify({
              name: role.name,
              permissions: nextPermissions,
            }),
          },
        );

        if (!response.ok) {
          let errorMessage = `Không thể cập nhật vai trò "${role.name}".`;
          const contentType = response.headers.get("content-type") ?? "";

          if (contentType.includes("application/json")) {
            const payload = (await response.json()) as {
              message?: string;
              errors?: Record<string, string[]>;
            };

            errorMessage =
              payload.errors?.permissions?.[0] ??
              payload.errors?.name?.[0] ??
              payload.message ??
              errorMessage;
          }

          toast.error(errorMessage);
          setIsSavingChanges(false);

          return false;
        }
      }

      setRoleItems((current) =>
        current.map((role) => {
          const nextPermissions = draftPermissionsByRole[role.id];

          if (!nextPermissions) {
            return role;
          }

          return {
            ...role,
            permissionCount: nextPermissions.length,
            permissions: nextPermissions,
          };
        }),
      );
      setDraftPermissionsByRole({});
      toast.success(
        `Đã lưu ${dirtyRoleIds.length} vai trò với ${dirtyPermissionCount} thay đổi quyền.`,
      );
      setIsSavingChanges(false);

      return true;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Không thể lưu thay đổi vai trò.";

      toast.error(message);
      setIsSavingChanges(false);

      return false;
    }
  }

  useRegisterUnsavedChanges(
    {
      isDirty: dirtyRoleIds.length > 0,
      onSave: saveDraftChanges,
    },
    "roles-permissions-matrix",
  );

  return (
    <>
      <Head title="Vai trò & quyền hạn" />

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Card className="border-border/80 bg-overlay">
          <CardHeader>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl space-y-2">
                <CardTitle className="text-xl">
                  Ma trận role-permission
                </CardTitle>
                <CardDescription>
                  Tick trực tiếp vào từng ô để gán hoặc bỏ permission cho role.
                  Thay đổi chỉ được lưu khi bạn bấm nút ở thanh hành động cố
                  định phía dưới.
                </CardDescription>
              </div>

              {can.createRoles ? (
                <CardAction className="shrink-0">
                  <Button intent="primary" onPress={handleCreateRole}>
                    <PlusIcon className="size-4" />
                    Tạo vai trò mới
                  </Button>
                </CardAction>
              ) : null}
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid gap-3 xl:grid-cols-[1.2fr_1fr_1fr_auto]">
              <SearchField
                aria-label="Tìm permission trong ma trận"
                value={matrixSearchQuery}
                onChange={setMatrixSearchQuery}
                onClear={() => setMatrixSearchQuery("")}
              >
                <SearchInput placeholder="Tìm permission hoặc nhóm quyền..." />
              </SearchField>

              <CategoryFilterPopover
                allCategories={allCategories}
                filteredOptions={filteredCategoryOptions}
                onClearAll={() => setSelectedCategories([])}
                onSearchChange={setCategorySearch}
                onSelectAll={() => setSelectedCategories(allCategories)}
                onToggleCategory={toggleCategorySelection}
                searchValue={categorySearch}
                selectedCategories={selectedCategories}
              />

              <RoleFilterPopover
                allRoleNames={allRoleNames}
                filteredOptions={filteredRoleOptions}
                onClearAll={() => setSelectedRoles([])}
                onSearchChange={setRoleSearch}
                onSelectAll={() => setSelectedRoles(allRoleNames)}
                onToggleRole={toggleRoleSelection}
                searchValue={roleSearch}
                selectedRoles={selectedRoles}
              />

              <div className="w-full xl:w-44">
                <Select
                  aria-label="Điều khiển mở rộng nhóm quyền"
                  onChange={(key) => {
                    const nextValue = String(key);

                    setExpandCollapseValue(nextValue);
                    setExpandedCategories(
                      Object.fromEntries(
                        allCategories.map((category) => [
                          category,
                          nextValue === "expanded",
                        ]),
                      ),
                    );
                  }}
                  value={expandCollapseValue}
                >
                  <SelectTrigger />
                  <SelectContent>
                    <SelectItem id="collapsed" textValue="Thu gọn tất cả">
                      <SelectLabel>Thu gọn tất cả</SelectLabel>
                    </SelectItem>
                    <SelectItem id="expanded" textValue="Mở tất cả">
                      <SelectLabel>Mở tất cả</SelectLabel>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge intent="outline">
                {selectedCategories.length}/{allCategories.length} nhóm quyền
              </Badge>
              <Badge intent="outline">
                {selectedRoles.length}/{roleItems.length} vai trò
              </Badge>
              {dirtyRoleIds.length > 0 ? (
                <Badge intent="warning">
                  {dirtyRoleIds.length} role đang có thay đổi nháp
                </Badge>
              ) : null}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-overlay">
          <CardContent className="px-0 [content-visibility:auto] [contain-intrinsic-size:auto_1200px]">
            {filteredRoles.length > 0 && groupedPermissions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr className="border-y border-border/60 bg-muted/15">
                      <th className="sticky left-0 z-20 min-w-72 bg-overlay px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-muted-fg">
                        Nhóm quyền / permission
                      </th>
                      {filteredRoles.map((role) => {
                        const effectivePermissions = getEffectivePermissions(
                          role.id,
                        );
                        const isDirty = dirtyRoleIds.includes(role.id);

                        return (
                          <th
                            key={role.id}
                            className="min-w-56 border-l border-border/50 px-4 py-3 text-left align-top"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <Avatar
                                    size="xs"
                                    initials={getRoleInitials(role.name)}
                                    alt={role.name}
                                    className={
                                      role.isProtected
                                        ? "bg-warning-subtle text-warning-subtle-fg"
                                        : "bg-primary-subtle text-primary-subtle-fg"
                                    }
                                  />
                                  <span className="font-semibold text-fg">
                                    {role.name}
                                  </span>
                                  {role.isProtected ? (
                                    <ShieldCheckIcon
                                      className="size-4 text-warning-fg"
                                      title="Vai trò hệ thống được bảo vệ"
                                    />
                                  ) : null}
                                </div>

                                <div className="flex flex-wrap gap-1.5">
                                  <Badge
                                    intent={
                                      role.isProtected ? "warning" : "secondary"
                                    }
                                  >
                                    {effectivePermissions.length} quyền
                                  </Badge>
                                  {isDirty ? (
                                    <Badge intent="warning">Nháp</Badge>
                                  ) : null}
                                </div>
                              </div>

                              {can.manageRoles ? (
                                <RoleMenu
                                  onRoleAction={handleRoleAction}
                                  role={role}
                                />
                              ) : null}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>

                  <tbody>
                    {groupedPermissions.map(([category, items]) => {
                      const isExpanded = expandedCategories[category] ?? false;

                      return (
                        <Fragment key={category}>
                          <tr className="border-b border-border/60 bg-muted/10">
                            <td className="sticky left-0 z-10 bg-overlay px-5 py-3">
                              <button
                                type="button"
                                className="flex w-full items-center gap-3 text-left"
                                onClick={() =>
                                  toggleCategoryExpansion(category)
                                }
                              >
                                {isExpanded ? (
                                  <ChevronDownIcon className="size-4 text-muted-fg" />
                                ) : (
                                  <ChevronRightIcon className="size-4 text-muted-fg" />
                                )}
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-fg">
                                      {category}
                                    </span>
                                    <Badge intent="secondary">
                                      {items.length} quyền
                                    </Badge>
                                  </div>
                                  <Text className="text-xs">
                                    {isExpanded ? "Thu gọn" : "Mở rộng"} nhóm
                                    quyền này.
                                  </Text>
                                </div>
                              </button>
                            </td>

                            {filteredRoles.map((role) => {
                              const effectivePermissions = new Set(
                                getEffectivePermissions(role.id),
                              );
                              const checkedCount = items.filter((permission) =>
                                effectivePermissions.has(permission.name),
                              ).length;

                              return (
                                <td
                                  key={role.id}
                                  className="border-l border-border/50 px-4 py-3"
                                >
                                  <div className="flex items-center justify-between gap-3">
                                    <span className="text-xs text-muted-fg">
                                      {checkedCount}/{items.length}
                                    </span>
                                    <div className="w-24 rounded-full bg-secondary">
                                      <div
                                        className="h-2 rounded-full bg-primary transition-[width]"
                                        style={{
                                          width: `${
                                            items.length === 0
                                              ? 0
                                              : Math.round(
                                                  (checkedCount /
                                                    items.length) *
                                                    100,
                                                )
                                          }%`,
                                        }}
                                      />
                                    </div>
                                  </div>
                                </td>
                              );
                            })}
                          </tr>

                          {isExpanded
                            ? items.map((permission) => (
                                <tr
                                  key={permission.id}
                                  className="border-b border-border/40 hover:bg-muted/5"
                                >
                                  <td className="sticky left-0 z-10 bg-overlay px-5 py-3">
                                    <div className="flex items-start gap-3 pl-7">
                                      <div className="mt-1 size-1.5 rounded-full bg-border" />
                                      <div className="space-y-1">
                                        <Code className="text-xs">
                                          {permission.name}
                                        </Code>
                                        <Text className="text-xs">
                                          {permission.roleCount} role đang sử
                                          dụng
                                        </Text>
                                      </div>
                                    </div>
                                  </td>

                                  {filteredRoles.map((role) => {
                                    const hasPermission =
                                      getEffectivePermissions(role.id).includes(
                                        permission.name,
                                      );
                                    const isDisabled =
                                      !can.managePermissions ||
                                      role.isProtected ||
                                      isSavingChanges;

                                    return (
                                      <td
                                        key={role.id}
                                        className="border-l border-border/40 px-4 py-3 text-center"
                                      >
                                        <div className="flex items-center justify-center">
                                          <Checkbox
                                            aria-label={`${role.name} - ${permission.name}`}
                                            isDisabled={isDisabled}
                                            isSelected={hasPermission}
                                            onChange={() =>
                                              togglePermission(
                                                role.id,
                                                permission.name,
                                              )
                                            }
                                          />
                                        </div>
                                      </td>
                                    );
                                  })}
                                </tr>
                              ))
                            : null}
                        </Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyPanel
                title="Không có dữ liệu phù hợp cho ma trận"
                description="Bộ lọc hiện tại đang loại hết role hoặc permission. Hãy khôi phục ít nhất một nhóm quyền và một vai trò."
              />
            )}
          </CardContent>
        </Card>

        {dirtyRoleIds.length > 0 ? (
          <StickyActionBar className="lg:w-[28rem]">
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-fg">Thay đổi chưa lưu</p>
                  <Badge intent="warning">{dirtyRoleIds.length} role</Badge>
                </div>
                <Text className="text-xs">
                  Bạn đang có {dirtyPermissionCount} thay đổi permission trên{" "}
                  {dirtyRoleIds.length} vai trò. Bấm lưu để đồng bộ mapping mới.
                </Text>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button
                  intent="outline"
                  isDisabled={isSavingChanges}
                  onPress={resetDraftChanges}
                >
                  Hoàn tác
                </Button>
                <Button
                  intent="primary"
                  isDisabled={isSavingChanges}
                  onPress={() => {
                    void saveDraftChanges();
                  }}
                >
                  <CheckIcon className="size-4" />
                  {isSavingChanges ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </div>
            </div>
          </StickyActionBar>
        ) : null}
      </div>

      {isFormDialogOpen ? (
        <RoleFormDialog
          isOpen={isFormDialogOpen}
          onOpenChange={setIsFormDialogOpen}
          mode={dialogMode}
          initialValues={formInitialValues}
          allPermissions={permissions}
          canManagePermissions={can.managePermissions}
          protectedRoleNames={protectedRoleNames}
        />
      ) : null}

      {isActionDialogOpen && actionRole ? (
        <RoleActionDialog
          isOpen={isActionDialogOpen}
          onOpenChange={setIsActionDialogOpen}
          mode={actionDialogMode}
          role={actionRole}
        />
      ) : null}
    </>
  );
}

function CategoryFilterPopover({
  allCategories,
  filteredOptions,
  searchValue,
  selectedCategories,
  onSearchChange,
  onSelectAll,
  onClearAll,
  onToggleCategory,
}: {
  allCategories: string[];
  filteredOptions: string[];
  searchValue: string;
  selectedCategories: string[];
  onSearchChange: (value: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onToggleCategory: (categoryName: string) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger>
        <Button intent="outline">
          Nhóm quyền
          <Badge intent="secondary">
            {selectedCategories.length}/{allCategories.length}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="border-b border-border/60 px-4 py-3">
          <div className="font-semibold text-fg">Hiển thị theo nhóm quyền</div>
          <Text className="text-xs">
            Chọn domain permission muốn giữ lại trong ma trận.
          </Text>
        </div>
        <div className="space-y-3 p-4">
          <SearchField
            aria-label="Tìm nhóm quyền"
            value={searchValue}
            onChange={onSearchChange}
            onClear={() => onSearchChange("")}
          >
            <SearchInput placeholder="Tìm nhóm quyền..." />
          </SearchField>

          <div className="flex flex-wrap gap-2">
            <Button intent="outline" size="sm" onPress={onSelectAll}>
              Chọn tất cả
            </Button>
            <Button intent="outline" size="sm" onPress={onClearAll}>
              Bỏ chọn hết
            </Button>
          </div>

          <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
            {filteredOptions.map((category) => (
              <div
                key={category}
                className="rounded-xl border border-border/60 bg-muted/5 px-3 py-2"
              >
                <Checkbox
                  isSelected={selectedCategories.includes(category)}
                  onChange={() => onToggleCategory(category)}
                >
                  <span className="text-sm text-fg">{category}</span>
                </Checkbox>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function RoleFilterPopover({
  allRoleNames,
  filteredOptions,
  searchValue,
  selectedRoles,
  onSearchChange,
  onSelectAll,
  onClearAll,
  onToggleRole,
}: {
  allRoleNames: string[];
  filteredOptions: string[];
  searchValue: string;
  selectedRoles: string[];
  onSearchChange: (value: string) => void;
  onSelectAll: () => void;
  onClearAll: () => void;
  onToggleRole: (roleName: string) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger>
        <Button intent="outline">
          Vai trò
          <Badge intent="secondary">
            {selectedRoles.length}/{allRoleNames.length}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="border-b border-border/60 px-4 py-3">
          <div className="font-semibold text-fg">Hiển thị theo vai trò</div>
          <Text className="text-xs">
            Chọn những cột role bạn muốn so sánh trong ma trận.
          </Text>
        </div>
        <div className="space-y-3 p-4">
          <SearchField
            aria-label="Tìm vai trò"
            value={searchValue}
            onChange={onSearchChange}
            onClear={() => onSearchChange("")}
          >
            <SearchInput placeholder="Tìm vai trò..." />
          </SearchField>

          <div className="flex flex-wrap gap-2">
            <Button intent="outline" size="sm" onPress={onSelectAll}>
              Chọn tất cả
            </Button>
            <Button intent="outline" size="sm" onPress={onClearAll}>
              Bỏ chọn hết
            </Button>
          </div>

          <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
            {filteredOptions.map((roleName) => (
              <div
                key={roleName}
                className="rounded-xl border border-border/60 bg-muted/5 px-3 py-2"
              >
                <Checkbox
                  isSelected={selectedRoles.includes(roleName)}
                  onChange={() => onToggleRole(roleName)}
                >
                  <span className="font-mono text-sm text-fg">{roleName}</span>
                </Checkbox>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function RoleMenu({
  role,
  onRoleAction,
}: {
  role: RoleData;
  onRoleAction: (mode: "copy" | "rename" | "delete", role: RoleData) => void;
}) {
  return (
    <Menu>
      <MenuTrigger
        aria-label={`Tác vụ cho vai trò ${role.name}`}
        className="inline-flex size-8 items-center justify-center rounded-lg border border-border bg-bg text-muted-fg transition hover:bg-muted/40 hover:text-fg"
      >
        <EllipsisVerticalIcon className="size-4" />
      </MenuTrigger>
      <MenuContent placement="bottom end" popover={{ className: "min-w-40" }}>
        <MenuItem onAction={() => onRoleAction("copy", role)}>
          Sao chép vai trò
        </MenuItem>
        <MenuItem
          isDisabled={role.isProtected}
          onAction={() => onRoleAction("rename", role)}
        >
          Đổi tên
        </MenuItem>
        <MenuItem
          className="text-danger"
          isDisabled={role.isProtected}
          onAction={() => onRoleAction("delete", role)}
        >
          Xóa vai trò
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}

function EmptyPanel({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-muted/5 px-6 py-12 text-center">
      <div className="space-y-1">
        <div className="font-semibold text-fg">{title}</div>
        <Text className="max-w-md">{description}</Text>
      </div>
    </div>
  );
}

CmsRolesPermissionsPage.layout = (page: ReactNode) => (
  <CmsLayout>{page}</CmsLayout>
);
