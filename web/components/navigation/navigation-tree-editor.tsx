import {
  ArrowDownIcon,
  ArrowTopRightOnSquareIcon,
  ArrowUpIcon,
  FolderOpenIcon,
  LinkIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { router, usePage } from "@inertiajs/react";
import { Collection } from "react-aria-components/Collection";
import { type Key, type ReactNode, startTransition, useState } from "react";
import syncNavigationMenuTree from "@/actions/App/Http/Controllers/Cms/SyncNavigationMenuTreeController";
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
import { Description, FieldGroup, Fieldset, Label, Legend } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Note } from "@/components/ui/note";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch, SwitchLabel } from "@/components/ui/switch";
import { TextField } from "@/components/ui/text-field";
import { Textarea } from "@/components/ui/textarea";
import { Strong, Text } from "@/components/ui/text";
import { Tree, TreeContent, TreeItem } from "@/components/ui/tree";
import {
  collectNavigationParentOptions,
  countNavigationItems,
  createEmptyNavigationItem,
  createMockNavigationMenus,
  describeNavigationDestination,
  findNavigationItem,
  insertNavigationItem,
  moveNavigationItem,
  navigationResourceCatalog,
  normalizeNavigationTree,
  removeNavigationItem,
  updateNavigationItem,
  type NavigationResourceCatalog,
  type NavigationInternalResourceType,
  type NavigationItemDraft,
  type NavigationItemTarget,
  type NavigationItemType,
  type NavigationMenuDraft,
  type NavigationResourceOption,
} from "@/lib/navigation/tree";
import type { SharedData } from "@/types/shared";

type SerializedNavigationItem = {
  id: number;
  isActive: boolean;
  linkableId: number | null;
  linkableType: string | null;
  menuId: number;
  parentId: number | null;
  sortOrder: number;
  target: string;
  title: string;
  type: string;
  url: string | null;
  children: SerializedNavigationItem[];
};

const navigationTypeLabels: Record<NavigationItemType, string> = {
  custom_url: "Custom URL",
  page: "Trang",
  post: "Bài viết",
  post_category: "Danh mục bài viết",
};

const navigationTargetLabels: Record<NavigationItemTarget, string> = {
  _blank: "Mở tab mới",
  _self: "Cùng tab hiện tại",
};

interface NavigationTreeEditorProps {
  initialMenus?: NavigationMenuDraft[];
  resourceCatalog?: NavigationResourceCatalog;
}

const locationLabels: Record<string, string> = {
  footer: "Footer",
  header: "Header",
};

export function NavigationTreeEditor({
  initialMenus,
  resourceCatalog = navigationResourceCatalog,
}: NavigationTreeEditorProps) {
  const { errors } = usePage<SharedData & { errors?: Record<string, string> }>().props;
  const [menus, setMenus] = useState<NavigationMenuDraft[]>(
    () => cloneNavigationMenus(initialMenus ?? createMockNavigationMenus()),
  );
  const [savedMenus, setSavedMenus] = useState<NavigationMenuDraft[]>(
    () => cloneNavigationMenus(initialMenus ?? createMockNavigationMenus()),
  );
  const [activeMenuId, setActiveMenuId] = useState(menus[0]?.id ?? 0);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(
    menus[0]?.items[0]?.id ?? null,
  );
  const [draftId, setDraftId] = useState(1000);
  const [isSaving, setIsSaving] = useState(false);

  const activeMenu = menus.find((menu) => menu.id === activeMenuId) ?? menus[0] ?? null;
  const activeItems = activeMenu?.items ?? [];
  const selectedItem = selectedItemId === null ? null : findNavigationItem(activeItems, selectedItemId);
  const parentOptions = collectNavigationParentOptions(activeItems, selectedItemId);
  const activeResourceOptions = resolveResourceOptions(
    selectedItem?.type ?? "custom_url",
    resourceCatalog,
  );

  const activeCount = countNavigationItems(activeItems);
  const activeDepth = getTreeDepth(activeItems);
  const hasUnsavedChanges = JSON.stringify(menus) !== JSON.stringify(savedMenus);
  const clientValidationErrors = collectNavigationValidationErrors(activeItems, resourceCatalog);
  const validationMessages = [...clientValidationErrors, ...Object.values(errors ?? {})];
  const canSave = hasUnsavedChanges && !isSaving && validationMessages.length === 0;

  function updateActiveMenu(
    menuId: number,
    updater: (menu: NavigationMenuDraft) => NavigationMenuDraft,
  ): void {
    startTransition(() => {
      setMenus((currentMenus) =>
        currentMenus.map((menu) => {
          if (menu.id !== menuId) {
            return menu;
          }

          return updater(menu);
        }),
      );
    });
  }

  function handleMenuChange(key: Key | null): void {
    if (key === null) {
      return;
    }

    const nextMenuId = Number(key);
    const nextMenu = menus.find((menu) => menu.id === nextMenuId);

    if (!nextMenu) {
      return;
    }

    startTransition(() => {
      setActiveMenuId(nextMenuId);
      setSelectedItemId(nextMenu.items[0]?.id ?? null);
    });
  }

  function handleAddItem(parentId: number | null): void {
    if (!activeMenu) {
      return;
    }

    const nextDraftId = draftId + 1;
    const draftItem = createEmptyNavigationItem(nextDraftId, activeMenu.id, parentId);

    startTransition(() => {
      setDraftId(nextDraftId);
      setMenus((currentMenus) =>
        currentMenus.map((menu) => {
          if (menu.id !== activeMenu.id) {
            return menu;
          }

          return {
            ...menu,
            items: insertNavigationItem(menu.items, draftItem, parentId),
          };
        }),
      );
      setSelectedItemId(nextDraftId);
    });
  }

  function handleDeleteItem(itemId: number): void {
    if (!activeMenu) {
      return;
    }

    const result = removeNavigationItem(activeMenu.items, itemId);

    startTransition(() => {
      setMenus((currentMenus) =>
        currentMenus.map((menu) => {
          if (menu.id !== activeMenu.id) {
            return menu;
          }

          return {
            ...menu,
            items: result.items,
          };
        }),
      );
      setSelectedItemId(result.items[0]?.id ?? null);
    });
  }

  function handleMoveItem(itemId: number, direction: "up" | "down"): void {
    if (!activeMenu) {
      return;
    }

    updateActiveMenu(activeMenu.id, (menu) => ({
      ...menu,
      items: moveNavigationItem(menu.items, itemId, direction),
    }));
  }

  function handleItemFieldChange(
    itemId: number,
    updater: (item: NavigationItemDraft) => NavigationItemDraft,
  ): void {
    if (!activeMenu) {
      return;
    }

    updateActiveMenu(activeMenu.id, (menu) => ({
      ...menu,
      items: updateNavigationItem(menu.items, itemId, updater),
    }));
  }

  function handleParentChange(itemId: number, key: Key | null): void {
    if (key === null) {
      return;
    }

    if (!activeMenu) {
      return;
    }

    const nextParentId = key === "root" ? null : Number(key);
    const currentItems = activeMenu.items;
    const removeResult = removeNavigationItem(currentItems, itemId);

    if (!removeResult.removedItem) {
      return;
    }

    const nextItems = insertNavigationItem(
      removeResult.items,
      {
        ...removeResult.removedItem,
        parentId: nextParentId,
      },
      nextParentId,
    );

    updateActiveMenu(activeMenu.id, (menu) => ({
      ...menu,
      items: normalizeNavigationTree(nextItems),
    }));
  }

  function handleSave(): void {
    if (!activeMenu || !hasUnsavedChanges || clientValidationErrors.length > 0) {
      return;
    }

    setIsSaving(true);

    router.patch(
      syncNavigationMenuTree.url({ navigation_menu: activeMenu.id }),
      {
        items: serializeNavigationItems(activeMenu.items),
      },
      {
        onError: () => {
          setIsSaving(false);
        },
        onSuccess: () => {
          setSavedMenus(cloneNavigationMenus(menus));
          setIsSaving(false);
        },
        preserveScroll: true,
      },
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card className="rounded-xl border-border bg-overlay shadow-none">
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3">
              <Badge intent="outline" isCircle={false}>
                Frontend foundation
              </Badge>
              <div className="space-y-2">
                <CardTitle className="text-2xl/8 sm:text-3xl/9">
                  Navigation tree UI cho menu parent-child
                </CardTitle>
                <CardDescription className="max-w-3xl">
                  Foundation này mô phỏng editor cho `navigation_menus` và
                  `navigation_items`, cho phép chọn item type, thay parent và
                  reorder theo `sort_order` trong cùng cấp trước khi nối vào
                  CRUD thật ở phase 5.
                </CardDescription>
              </div>
            </div>

            <CardAction className="flex flex-wrap gap-2">
              <Button
                intent="primary"
                isDisabled={!canSave}
                onPress={handleSave}
              >
                {isSaving ? "Đang lưu..." : "Lưu navigation"}
              </Button>
              <Button intent="secondary" onPress={() => handleAddItem(null)}>
                <PlusIcon />
                Thêm item cấp gốc
              </Button>
            </CardAction>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {validationMessages.length > 0 ? (
            <Note intent="warning">
              <div className="space-y-2">
                <Text className="text-current font-medium">
                  Navigation chưa thể lưu vì còn dữ liệu chưa hợp lệ.
                </Text>
                <div className="space-y-1">
                  {validationMessages.slice(0, 4).map((message) => (
                    <Text key={message} className="text-current">
                      - {message}
                    </Text>
                  ))}
                </div>
              </div>
            </Note>
          ) : (
            <Note intent="info">
              <Text className="text-current">
                Sửa item rồi lưu để đồng bộ toàn bộ cây navigation vào database.
              </Text>
            </Note>
          )}

          <div className="grid gap-4 xl:grid-cols-3">
            <SummaryCard
              title="Menu theo location"
              value={String(menus.length)}
              description="Header và footer đang dùng draft tách riêng, không hardcode menu public cố định trong component."
            />
            <SummaryCard
              title="Navigation item"
              value={String(activeCount)}
              description="Mỗi item giữ `sort_order` theo cùng cấp và có thể đổi parent trực tiếp từ inspector."
            />
            <SummaryCard
              title="Độ sâu hiện tại"
              value={`${activeDepth} cấp`}
              description="Tree hiển thị đúng quan hệ parent-child để chuẩn bị cho navigation module thật."
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 2xl:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.85fr)]">
        <Card className="min-h-[32rem] rounded-xl border-border bg-overlay shadow-none">
          <CardHeader className="gap-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <CardTitle>Cây navigation</CardTitle>
                <CardDescription>
                  Chọn một menu, sau đó chọn item trong tree để chỉnh title,
                  type, target, parent và đích điều hướng.
                </CardDescription>
              </div>

              <div className="w-full max-w-72">
                <Select
                  aria-label="Chọn menu cần chỉnh"
                  selectedKey={String(activeMenu?.id ?? "")}
                  onSelectionChange={handleMenuChange}
                >
                  <Label>Menu đang chỉnh</Label>
                  <SelectTrigger />
                  <SelectContent>
                    {menus.map((menu) => (
                      <SelectItem key={menu.id} id={String(menu.id)} textValue={menu.name}>
                        <SelectLabel>
                          {menu.name} · {locationLabels[menu.location] ?? menu.location}
                        </SelectLabel>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="min-h-0 pb-6">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
              <div className="min-h-0 rounded-3xl border border-border bg-bg p-3">
                <ScrollArea className="h-[28rem]" orientation="vertical">
                  {activeItems.length > 0 ? (
                    <Tree
                      aria-label="Cây navigation item"
                      key={activeMenu?.id ?? "empty-menu"}
                      className="gap-1"
                      defaultExpandedKeys={collectExpandableKeys(activeItems)}
                      selectedKeys={
                        selectedItemId === null ? [] : [String(selectedItemId)]
                      }
                      selectionMode="single"
                      onSelectionChange={(keys) => {
                        if (keys === "all") {
                          return;
                        }

                        const [firstKey] = Array.from(keys);
                        setSelectedItemId(
                          typeof firstKey === "undefined" ? null : Number(firstKey),
                        );
                      }}
                    >
                      {renderTreeItems(activeItems, resourceCatalog)}
                    </Tree>
                  ) : (
                    <div className="flex h-full min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-center">
                      <FolderOpenIcon className="size-10 text-muted-fg" />
                      <div className="space-y-1">
                        <Text className="font-medium">Menu này chưa có item.</Text>
                        <Text className="text-muted-fg">
                          Tạo item cấp gốc để bắt đầu sắp xếp cây navigation.
                        </Text>
                      </div>
                      <Button intent="secondary" onPress={() => handleAddItem(null)}>
                        <PlusIcon />
                        Tạo item đầu tiên
                      </Button>
                    </div>
                  )}
                </ScrollArea>
              </div>

              <div className="space-y-3">
                <StatusCard
                  label="Location"
                  value={activeMenu ? locationLabels[activeMenu.location] ?? activeMenu.location : "—"}
                />
                <StatusCard
                  label="Slug menu"
                  value={activeMenu?.slug ?? "—"}
                />
                <StatusCard
                  label="Item đang chọn"
                  value={selectedItem?.title ?? "Chưa chọn"}
                />
                    <StatusCard
                      label="Preview đích"
                      value={
                        selectedItem
                          ? describeNavigationDestination(selectedItem, resourceCatalog)
                          : "—"
                      }
                    />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="min-h-[32rem] rounded-xl border-border bg-overlay shadow-none">
          <CardHeader className="gap-2">
            <CardTitle>Inspector item</CardTitle>
            <CardDescription>
              Form này mô phỏng dữ liệu cần gửi cho backend. Khi nối module thật,
              dữ liệu nên map sang DTO/navigation request đã có ở backend.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pb-6">
            {selectedItem ? (
              <>
                <Fieldset>
                  <Legend>Thuộc tính cơ bản</Legend>
                  <Text className="text-muted-fg">
                    Sửa item đang chọn và theo dõi thay đổi trực tiếp trên cây
                    bên trái.
                  </Text>

                  <FieldGroup>
                    <TextField
                      aria-label="Tiêu đề item"
                      value={selectedItem.title}
                      onChange={(value) => {
                        handleItemFieldChange(selectedItem.id, (item) => ({
                          ...item,
                          title: value,
                        }));
                      }}
                    >
                      <Label>Tiêu đề hiển thị</Label>
                      <Input placeholder="Ví dụ: Giới thiệu khoa" />
                    </TextField>

                    <Select
                      aria-label="Loại navigation item"
                      selectedKey={selectedItem.type}
                      onSelectionChange={(key) => {
                        const nextType = String(key) as NavigationItemType;

                        handleItemFieldChange(selectedItem.id, (item) => ({
                          ...item,
                          type: nextType,
                          linkableId: nextType === "custom_url" ? null : resolveDefaultResourceId(nextType),
                          linkableType: nextType === "custom_url" ? null : nextType,
                          url: nextType === "custom_url" ? item.url ?? "" : null,
                        }));
                      }}
                    >
                      <Label>Loại item</Label>
                      <SelectTrigger />
                      <SelectContent>
                        {Object.entries(navigationTypeLabels).map(([type, label]) => (
                          <SelectItem key={type} id={type} textValue={label}>
                            <SelectLabel>{label}</SelectLabel>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {selectedItem.type === "custom_url" ? (
                      <TextField
                        aria-label="Custom URL"
                        value={selectedItem.url ?? ""}
                        onChange={(value) => {
                          handleItemFieldChange(selectedItem.id, (item) => ({
                            ...item,
                            url: value,
                          }));
                        }}
                      >
                        <Label>URL đích</Label>
                        <Input placeholder="https://fit.vimaru.edu.vn/..." />
                        <Description>
                          UI cho phép nhập nhanh để biên tập; backend vẫn phải
                          kiểm tra format URL và policy đích đến.
                        </Description>
                      </TextField>
                    ) : (
                      <Select
                        aria-label="Tài nguyên nội bộ"
                        selectedKey={String(selectedItem.linkableId ?? "")}
                        onSelectionChange={(key) => {
                          handleItemFieldChange(selectedItem.id, (item) => ({
                            ...item,
                            linkableId: Number(key),
                            linkableType: item.type as NavigationInternalResourceType,
                            url: null,
                          }));
                        }}
                      >
                        <Label>Tài nguyên nội bộ</Label>
                        <SelectTrigger />
                        <SelectContent>
                          {activeResourceOptions.map((resource) => (
                            <SelectItem
                              key={resource.id}
                              id={String(resource.id)}
                              textValue={resource.label}
                            >
                              <SelectLabel>
                                {resource.label} · {resource.meta}
                              </SelectLabel>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}

                    <Select
                      aria-label="Parent item"
                      selectedKey={selectedItem.parentId === null ? "root" : String(selectedItem.parentId)}
                      onSelectionChange={(key) => {
                        handleParentChange(selectedItem.id, key);
                      }}
                    >
                      <Label>Parent item</Label>
                      <SelectTrigger />
                      <SelectContent>
                        <SelectItem id="root" textValue="Không có parent">
                          <SelectLabel>Không có parent</SelectLabel>
                        </SelectItem>
                        {parentOptions.map((option) => (
                          <SelectItem
                            key={option.id}
                            id={String(option.id)}
                            textValue={option.label}
                          >
                            <SelectLabel>{option.label}</SelectLabel>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      aria-label="Target mở link"
                      selectedKey={selectedItem.target}
                      onSelectionChange={(key) => {
                        handleItemFieldChange(selectedItem.id, (item) => ({
                          ...item,
                          target: String(key) as NavigationItemTarget,
                        }));
                      }}
                    >
                      <Label>Target</Label>
                      <SelectTrigger />
                      <SelectContent>
                        {Object.entries(navigationTargetLabels).map(([target, label]) => (
                          <SelectItem key={target} id={target} textValue={label}>
                            <SelectLabel>{label}</SelectLabel>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldGroup>
                </Fieldset>

                <Separator />

                <Fieldset>
                  <Legend>Điều khiển cây</Legend>
                  <Text className="text-muted-fg">
                    Reorder chỉ đổi `sort_order` trong cùng cấp hiện tại.
                  </Text>

                  <div data-slot="control" className="grid gap-3 sm:grid-cols-2">
                    <Button
                      intent="secondary"
                      onPress={() => handleAddItem(selectedItem.id)}
                    >
                      <PlusIcon />
                      Thêm mục con
                    </Button>
                    <Button
                      intent="outline"
                      onPress={() => handleAddItem(selectedItem.parentId)}
                    >
                      <PlusIcon />
                      Thêm cùng cấp
                    </Button>
                    <Button
                      intent="outline"
                      onPress={() => handleMoveItem(selectedItem.id, "up")}
                    >
                      <ArrowUpIcon />
                      Đẩy lên
                    </Button>
                    <Button
                      intent="outline"
                      onPress={() => handleMoveItem(selectedItem.id, "down")}
                    >
                      <ArrowDownIcon />
                      Đẩy xuống
                    </Button>
                    <Button
                      intent="danger"
                      className="sm:col-span-2"
                      onPress={() => handleDeleteItem(selectedItem.id)}
                    >
                      <TrashIcon />
                      Xóa item khỏi draft tree
                    </Button>
                  </div>
                </Fieldset>

                <Separator />

                <Fieldset>
                  <Legend>Snapshot hiện tại</Legend>
                  <Text className="text-muted-fg">
                    Mục này hữu ích khi chuẩn bị map sang payload submit thật.
                  </Text>

                  <div data-slot="control" className="space-y-3">
                    <StatusCard
                      label="sort_order"
                      value={String(selectedItem.sortOrder)}
                    />
                    <StatusCard
                      label="parent_id"
                      value={selectedItem.parentId === null ? "null" : String(selectedItem.parentId)}
                    />
                    <StatusCard
                      label="Đích hiện tại"
                      value={describeNavigationDestination(selectedItem, resourceCatalog)}
                    />
                  </div>

                  <div data-slot="control">
                    <Switch
                      isSelected={selectedItem.isActive}
                      onChange={(isSelected) => {
                        handleItemFieldChange(selectedItem.id, (item) => ({
                          ...item,
                          isActive: isSelected,
                        }));
                      }}
                    >
                      <SwitchLabel>Đang bật trên menu</SwitchLabel>
                    </Switch>
                  </div>

                  <div data-slot="control">
                    <Label>Mô tả output dự kiến</Label>
                      <Textarea
                        readOnly
                        value={JSON.stringify(
                        {
                          id: selectedItem.id,
                          parent_id: selectedItem.parentId,
                          title: selectedItem.title,
                          type: selectedItem.type,
                          linkable_type: selectedItem.linkableType,
                          linkable_id: selectedItem.linkableId,
                          url: selectedItem.url,
                          target: selectedItem.target,
                          sort_order: selectedItem.sortOrder,
                          is_active: selectedItem.isActive,
                        },
                        null,
                        2,
                      )}
                    />
                  </div>
                </Fieldset>
              </>
            ) : (
              <div className="flex min-h-80 flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-border bg-muted/30 p-6 text-center">
                <FolderOpenIcon className="size-10 text-muted-fg" />
                <div className="space-y-1">
                  <Text className="font-medium">Chưa có item được chọn.</Text>
                  <Text className="text-muted-fg">
                    Chọn một node trong tree hoặc tạo item mới để bắt đầu chỉnh
                    sửa.
                  </Text>
                </div>
                <Button intent="secondary" onPress={() => handleAddItem(null)}>
                  <PlusIcon />
                  Tạo item cấp gốc
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function renderTreeItems(
  items: NavigationItemDraft[],
  resourceCatalog: NavigationResourceCatalog,
): ReactNode {
  return (
    <Collection items={items}>
      {(item) => (
        <TreeItem id={String(item.id)} textValue={item.title}>
          <TreeContent>
            <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl">
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex min-w-0 items-center gap-2">
                  <Text className="truncate font-medium">{item.title}</Text>
                  <Badge intent="outline" isCircle={false}>
                    {navigationTypeLabels[item.type]}
                  </Badge>
                  {!item.isActive ? (
                    <Badge intent="warning" isCircle={false}>
                      Tạm ẩn
                    </Badge>
                  ) : null}
                </div>
                <Text className="truncate text-muted-fg">
                  #{item.sortOrder} ·{" "}
                  {describeNavigationDestination(item, resourceCatalog)}
                </Text>
              </div>

              {item.target === "_blank" ? (
                <ArrowTopRightOnSquareIcon className="size-4 text-muted-fg" />
              ) : item.type === "custom_url" ? (
                <LinkIcon className="size-4 text-muted-fg" />
              ) : null}
            </div>
          </TreeContent>
          {item.children.length > 0
            ? renderTreeItems(item.children, resourceCatalog)
            : null}
        </TreeItem>
      )}
    </Collection>
  );
}

function collectExpandableKeys(items: NavigationItemDraft[]): string[] {
  return items.flatMap((item) => [
    ...(item.children.length > 0 ? [String(item.id)] : []),
    ...collectExpandableKeys(item.children),
  ]);
}

function getTreeDepth(items: NavigationItemDraft[], depth = 0): number {
  if (items.length === 0) {
    return depth;
  }

  return Math.max(
    ...items.map((item) => getTreeDepth(item.children, depth + 1)),
  );
}

function resolveResourceOptions(
  type: NavigationItemType,
  resourceCatalog: NavigationResourceCatalog,
): NavigationResourceOption[] {
  if (type === "custom_url") {
    return [];
  }

  return resourceCatalog[type];
}

function resolveDefaultResourceId(type: NavigationItemType): number | null {
  if (type === "custom_url") {
    return null;
  }

  const firstResource = navigationResourceCatalog[type][0];

  return firstResource?.id ?? null;
}

function SummaryCard({
  description,
  title,
  value,
}: {
  description: string;
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl border border-border bg-bg p-5">
      <Text className="text-muted-fg">{title}</Text>
      <Text className="mt-2 text-3xl font-semibold">{value}</Text>
      <Text className="mt-2 text-muted-fg">{description}</Text>
    </div>
  );
}

function StatusCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-bg px-4 py-3">
      <Text className="text-muted-fg">{label}</Text>
      <Text className="mt-1 break-words">
        <Strong>{value}</Strong>
      </Text>
    </div>
  );
}

function cloneNavigationMenus(menus: NavigationMenuDraft[]): NavigationMenuDraft[] {
  return structuredClone(menus);
}

function serializeNavigationItems(
  items: NavigationItemDraft[],
): SerializedNavigationItem[] {
  return items.map((item) => ({
    id: item.id,
    isActive: item.isActive,
    linkableId: item.linkableId,
    linkableType: item.linkableType,
    menuId: item.menuId,
    parentId: item.parentId,
    sortOrder: item.sortOrder,
    target: item.target,
    title: item.title,
    type: item.type,
    url: item.url,
    children: serializeNavigationItems(item.children),
  }));
}

function collectNavigationValidationErrors(
  items: NavigationItemDraft[],
  resourceCatalog: NavigationResourceCatalog,
): string[] {
  return items.flatMap((item) => {
    const itemLabel = item.title.trim() === "" ? "Item chưa có tiêu đề" : `Item "${item.title}"`;
    const currentErrors: string[] = [];

    if (item.title.trim() === "") {
      currentErrors.push(`${itemLabel} cần có tiêu đề hiển thị.`);
    }

    if (item.type === "custom_url") {
      if ((item.url ?? "").trim() === "") {
        currentErrors.push(`${itemLabel} cần nhập URL đích trước khi lưu.`);
      }
    } else {
      if (item.linkableType === null || item.linkableId === null) {
        currentErrors.push(`${itemLabel} cần chọn tài nguyên nội bộ trước khi lưu.`);
      } else {
        const resourceExists = resourceCatalog[item.linkableType].some(
          (resource) => resource.id === item.linkableId,
        );

        if (!resourceExists) {
          currentErrors.push(`${itemLabel} đang trỏ tới tài nguyên nội bộ không hợp lệ.`);
        }
      }
    }

    return [...currentErrors, ...collectNavigationValidationErrors(item.children, resourceCatalog)];
  });
}
