import {
  ArrowTopRightOnSquareIcon,
  CheckIcon,
  FolderOpenIcon,
  LinkIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { startTransition, useRef, useState } from "react";
import type { Key, ReactNode } from "react";
import { Collection } from "react-aria-components/Collection";
import { useDragAndDrop } from "react-aria-components/useDragAndDrop";
import { StickyActionBar } from "@/components/cms/sticky-action-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FieldGroup, Label } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { Switch, SwitchLabel } from "@/components/ui/switch";
import { Strong, Text } from "@/components/ui/text";
import { TextField } from "@/components/ui/text-field";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import {
  Tree,
  TreeContent,
  TreeDropIndicator,
  TreeItem,
} from "@/components/ui/tree";
import { useRegisterUnsavedChanges } from "@/hooks/use-unsaved-changes";

import {
  collectNavigationParentOptions,
  createEmptyNavigationItem,
  createMockNavigationMenus,
  describeNavigationDestination,
  findNavigationItem,
  insertNavigationItem,
  moveNavigationItemsToTarget,
  navigationResourceCatalog,
  normalizeNavigationTree,
  removeNavigationItem,
  updateNavigationItem,
} from "@/lib/navigation/tree";
import type {
  NavigationInternalResourceType,
  NavigationItemDraft,
  NavigationItemTarget,
  NavigationItemType,
  NavigationMenuDraft,
  NavigationResourceOption,
} from "@/lib/navigation/tree";

const initialMenus = createMockNavigationMenus();

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
  initialMenuId?: number;
}

type PendingConfirmation =
  | { kind: "delete"; itemId: number }
  | { kind: "discard" }
  | { kind: "save" }
  | null;

export function NavigationTreeEditor({
  initialMenuId,
}: NavigationTreeEditorProps) {
  const [savedMenus, setSavedMenus] = useState<NavigationMenuDraft[]>(() =>
    cloneNavigationMenus(initialMenus),
  );
  const [draftMenus, setDraftMenus] = useState<NavigationMenuDraft[]>(() =>
    cloneNavigationMenus(initialMenus),
  );
  const [activeMenuId, setActiveMenuId] = useState(
    initialMenus.find((menu) => menu.id === initialMenuId)?.id ??
      initialMenus[0]?.id ??
      0,
  );
  const [selectedItemId, setSelectedItemId] = useState<number | null>(
    initialMenus[0]?.items[0]?.id ?? null,
  );
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [pendingNewItemId, setPendingNewItemId] = useState<number | null>(null);
  const [pendingConfirmation, setPendingConfirmation] =
    useState<PendingConfirmation>(null);
  const draftIdRef = useRef(1000);
  const editingSnapshotRef = useRef<NavigationItemDraft | null>(null);

  const activeMenu =
    draftMenus.find((menu) => menu.id === activeMenuId) ??
    draftMenus[0] ??
    null;
  const activeItems = activeMenu?.items ?? [];
  const selectedItem =
    selectedItemId === null
      ? null
      : findNavigationItem(activeItems, selectedItemId);
  const hasUnsavedChanges =
    JSON.stringify(draftMenus) !== JSON.stringify(savedMenus);

  useRegisterUnsavedChanges(
    {
      isDirty: hasUnsavedChanges,
      onSave: () => {
        const nextMenus = cloneNavigationMenus(draftMenus);
        startTransition(() => {
          setSavedMenus(nextMenus);
          setDraftMenus(cloneNavigationMenus(nextMenus));
          setIsEditorOpen(false);
          setPendingConfirmation(null);
        });
      },
    },
    "navigation-tree-editor",
  );

  const { dragAndDropHooks } = useDragAndDrop<NavigationItemDraft>({
    getItems: (keys) =>
      Array.from(keys)
        .map((key) => findNavigationItem(activeItems, Number(key)))
        .filter((item): item is NavigationItemDraft => item !== null)
        .map((item) => ({
          "text/plain": item.title,
        })),
    onMove: (event) => {
      if (!activeMenu) {
        return;
      }

      if (!("key" in event.target) || !("dropPosition" in event.target)) {
        return;
      }

      const movedItemIds = Array.from(event.keys).map((key) => Number(key));

      updateDraftMenu(activeMenu.id, (menu) => ({
        ...menu,
        items: moveNavigationItemsToTarget(
          menu.items,
          movedItemIds,
          Number(event.target.key),
          event.target.dropPosition,
        ),
      }));

      setSelectedItemId(movedItemIds[0] ?? null);
    },
    renderDropIndicator: (target) => <TreeDropIndicator target={target} />,
  });

  function updateDraftMenu(
    menuId: number,
    updater: (menu: NavigationMenuDraft) => NavigationMenuDraft,
  ): void {
    startTransition(() => {
      setDraftMenus((currentMenus) =>
        currentMenus.map((menu) => {
          if (menu.id !== menuId) {
            return menu;
          }

          return updater(menu);
        }),
      );
    });
  }

  function handleAddItem(parentId: number | null): void {
    if (!activeMenu) {
      return;
    }

    const nextDraftId = draftIdRef.current + 1;
    const draftItem = createEmptyNavigationItem(
      nextDraftId,
      activeMenu.id,
      parentId,
    );

    startTransition(() => {
      draftIdRef.current = nextDraftId;
      setDraftMenus((currentMenus) =>
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
      setPendingNewItemId(nextDraftId);
      editingSnapshotRef.current = null;
      setIsEditorOpen(true);
    });
  }

  function handleDeleteItem(itemId: number): void {
    if (!activeMenu) {
      return;
    }

    setPendingConfirmation({
      kind: "delete",
      itemId,
    });
  }

  function handleItemFieldChange(
    itemId: number,
    updater: (item: NavigationItemDraft) => NavigationItemDraft,
  ): void {
    if (!activeMenu) {
      return;
    }

    updateDraftMenu(activeMenu.id, (menu) => ({
      ...menu,
      items: updateNavigationItem(menu.items, itemId, updater),
    }));
  }

  function handleSaveDraft(): void {
    setPendingConfirmation({
      kind: "save",
    });
  }

  function handleDiscardDraft(): void {
    setPendingConfirmation({
      kind: "discard",
    });
  }

  function handleDiscardPendingItem(): void {
    if (!activeMenu || pendingNewItemId === null) {
      setIsEditorOpen(false);

      return;
    }

    const result = removeNavigationItem(activeMenu.items, pendingNewItemId);

    startTransition(() => {
      setDraftMenus((currentMenus) =>
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
      setPendingNewItemId(null);
      setIsEditorOpen(false);
    });
  }

  function handleEditorOpenChange(nextOpen: boolean): void {
    if (nextOpen) {
      setIsEditorOpen(true);

      return;
    }

    if (pendingNewItemId !== null) {
      handleDiscardPendingItem();

      return;
    }

    handleCancelEdit();
  }

  function handleConfirmPendingItem(): void {
    setPendingNewItemId(null);
    setIsEditorOpen(false);
  }

  function handleStartEdit(item: NavigationItemDraft): void {
    setSelectedItemId(item.id);
    editingSnapshotRef.current = structuredClone(item);
    setIsEditorOpen(true);
  }

  function handleCancelEdit(): void {
    const editingSnapshot = editingSnapshotRef.current;

    if (!activeMenu || !editingSnapshot) {
      editingSnapshotRef.current = null;
      setIsEditorOpen(false);

      return;
    }

    updateDraftMenu(activeMenu.id, (menu) => ({
      ...menu,
      items: updateNavigationItem(menu.items, editingSnapshot.id, () =>
        structuredClone(editingSnapshot),
      ),
    }));

    editingSnapshotRef.current = null;
    setIsEditorOpen(false);
  }

  function handleConfirmEdit(): void {
    editingSnapshotRef.current = null;
    setIsEditorOpen(false);
  }

  function handleConfirmAction(): void {
    if (!activeMenu || pendingConfirmation === null) {
      setPendingConfirmation(null);

      return;
    }

    if (pendingConfirmation.kind === "delete") {
      const result = removeNavigationItem(
        activeMenu.items,
        pendingConfirmation.itemId,
      );

      startTransition(() => {
        setDraftMenus((currentMenus) =>
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

        if (pendingNewItemId === pendingConfirmation.itemId) {
          setPendingNewItemId(null);
        }

        setIsEditorOpen(false);
        setPendingConfirmation(null);
      });

      return;
    }

    if (pendingConfirmation.kind === "save") {
      const nextMenus = cloneNavigationMenus(draftMenus);

      startTransition(() => {
        setSavedMenus(nextMenus);
        setDraftMenus(cloneNavigationMenus(nextMenus));
        setIsEditorOpen(false);
        setPendingConfirmation(null);
      });

      return;
    }

    const resetMenus = cloneNavigationMenus(savedMenus);
    const nextActiveMenu =
      resetMenus.find((menu) => menu.id === activeMenuId) ??
      resetMenus[0] ??
      null;

    startTransition(() => {
      setDraftMenus(resetMenus);
      setSelectedItemId(resolveFirstSelectableItemId(nextActiveMenu));
      setPendingNewItemId(null);
      setIsEditorOpen(false);
      setPendingConfirmation(null);
    });
  }

  return (
    <div className="navigation-tree-editor flex min-h-0 flex-1 flex-col px-4 pt-0">
      <div className="min-h-0 flex-1 rounded-2xl border border-border bg-bg">
        <ScrollArea className="h-full" orientation="vertical">
          {activeItems.length > 0 ? (
            <Tree
              aria-label="Cây navigation item"
              key={activeMenu?.id ?? "empty-menu"}
              className="navigation-tree-editor__tree"
              dragAndDropHooks={dragAndDropHooks}
              defaultExpandedKeys={collectExpandableKeys(activeItems)}
            >
              <NavigationTreeItems
                items={activeItems}
                onAddChild={(item) => {
                  setSelectedItemId(item.id);
                  handleAddItem(item.id);
                }}
                onDelete={(item) => {
                  setSelectedItemId(item.id);
                  handleDeleteItem(item.id);
                }}
                onEdit={handleStartEdit}
              />
            </Tree>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
              <FolderOpenIcon className="size-10 text-muted-fg" />
              <div className="space-y-1">
                <Text className="font-medium">Menu này chưa có item.</Text>
                <Text className="text-muted-fg">
                  Tạo item đầu tiên để bắt đầu sắp xếp cây navigation.
                </Text>
              </div>
              <Button intent="secondary" onPress={() => handleAddItem(null)}>
                <PlusIcon />
                Thêm item đầu tiên
              </Button>
            </div>
          )}
        </ScrollArea>
      </div>

      <StickyActionBar>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            intent="secondary"
            onPress={() => handleAddItem(null)}
            className="w-full sm:w-auto"
          >
            <PlusIcon />
            Thêm item gốc
          </Button>

          <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
            <Button
              intent="outline"
              isDisabled={!hasUnsavedChanges}
              onPress={handleDiscardDraft}
            >
              <XMarkIcon />
              Hủy
            </Button>
            <Button
              intent="primary"
              isDisabled={!hasUnsavedChanges}
              onPress={handleSaveDraft}
            >
              <CheckIcon />
              Lưu
            </Button>
          </div>
        </div>
      </StickyActionBar>

      <NavigationItemEditorModal
        item={selectedItem}
        isOpen={isEditorOpen && selectedItem !== null}
        isCreating={pendingNewItemId === selectedItem?.id}
        isEditing={pendingNewItemId !== selectedItem?.id}
        onConfirmEdit={handleConfirmEdit}
        onConfirmCreate={handleConfirmPendingItem}
        onOpenChange={handleEditorOpenChange}
        onCancelEdit={handleCancelEdit}
        onCancelCreate={handleDiscardPendingItem}
        onItemFieldChange={handleItemFieldChange}
        parentOptions={collectNavigationParentOptions(
          activeItems,
          selectedItemId,
        )}
        onParentChange={(itemId, key) => {
          if (!activeMenu || key === null) {
            return;
          }

          const nextParentId = key === "root" ? null : Number(key);
          const removeResult = removeNavigationItem(activeMenu.items, itemId);

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

          updateDraftMenu(activeMenu.id, (menu) => ({
            ...menu,
            items: normalizeNavigationTree(nextItems),
          }));
        }}
      />

      <NavigationConfirmModal
        confirmation={pendingConfirmation}
        onConfirm={handleConfirmAction}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setPendingConfirmation(null);
          }
        }}
      />
    </div>
  );
}

function NavigationConfirmModal({
  confirmation,
  onConfirm,
  onOpenChange,
}: {
  confirmation: PendingConfirmation;
  onConfirm: () => void;
  onOpenChange: (isOpen: boolean) => void;
}) {
  if (confirmation === null) {
    return null;
  }

  const config =
    confirmation.kind === "delete"
      ? {
          confirmIntent: "danger" as const,
          confirmLabel: "Xóa",
          description: "Item navigation này sẽ bị xóa khỏi cây hiện tại.",
          title: "Xác nhận xóa item",
        }
      : confirmation.kind === "discard"
        ? {
            confirmIntent: "outline" as const,
            confirmLabel: "Hủy thay đổi",
            description:
              "Toàn bộ thay đổi chưa lưu của navigation này sẽ bị bỏ.",
            title: "Xác nhận hủy thay đổi",
          }
        : {
            confirmIntent: "primary" as const,
            confirmLabel: "Lưu",
            description:
              "Các thay đổi hiện tại sẽ được lưu vào bản nháp navigation.",
            title: "Xác nhận lưu thay đổi",
          };

  return (
    <ModalContent
      aria-label={config.title}
      isDismissable
      isOpen
      role="alertdialog"
      size="sm"
      onOpenChange={onOpenChange}
    >
      <ModalHeader>
        <ModalTitle>{config.title}</ModalTitle>
        <ModalDescription>{config.description}</ModalDescription>
      </ModalHeader>

      <ModalFooter>
        <Button intent="outline" onPress={() => onOpenChange(false)}>
          <XMarkIcon />
          Đóng
        </Button>
        <Button intent={config.confirmIntent} onPress={onConfirm}>
          {confirmation.kind === "delete" ? <TrashIcon /> : <CheckIcon />}
          {config.confirmLabel}
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}

interface NavigationItemEditorModalProps {
  isCreating: boolean;
  isEditing: boolean;
  isOpen: boolean;
  item: NavigationItemDraft | null;
  onCancelEdit: () => void;
  onCancelCreate: () => void;
  onConfirmEdit: () => void;
  onConfirmCreate: () => void;
  onItemFieldChange: (
    itemId: number,
    updater: (item: NavigationItemDraft) => NavigationItemDraft,
  ) => void;
  onOpenChange: (isOpen: boolean) => void;
  onParentChange: (itemId: number, key: Key | null) => void;
  parentOptions: Array<{ id: number; label: string }>;
}

function NavigationItemEditorModal({
  isCreating,
  isEditing,
  isOpen,
  item,
  onCancelEdit,
  onCancelCreate,
  onConfirmEdit,
  onConfirmCreate,
  onItemFieldChange,
  onOpenChange,
  onParentChange,
  parentOptions,
}: NavigationItemEditorModalProps) {
  if (!item || !isOpen) {
    return null;
  }

  const activeResourceOptions = resolveResourceOptions(item.type);

  return (
    <ModalContent
      aria-label="Chỉnh sửa navigation item"
      closeButton={false}
      isDismissable
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
    >
      <ModalHeader>
        <ModalTitle>Chỉnh sửa item</ModalTitle>
      </ModalHeader>

      <ModalBody>
        <FieldGroup className="space-y-4 pb-2">
          <TextField
            aria-label="Tiêu đề item"
            value={item.title}
            onChange={(value) => {
              onItemFieldChange(item.id, (currentItem) => ({
                ...currentItem,
                title: value,
              }));
            }}
          >
            <Label>Tiêu đề hiển thị</Label>
            <Input placeholder="Ví dụ: Giới thiệu khoa" />
          </TextField>

          <Select
            aria-label="Loại navigation item"
            selectedKey={item.type}
            onSelectionChange={(key) => {
              const nextType = String(key) as NavigationItemType;

              onItemFieldChange(item.id, (currentItem) => ({
                ...currentItem,
                type: nextType,
                linkableId:
                  nextType === "custom_url"
                    ? null
                    : resolveDefaultResourceId(nextType),
                linkableType: nextType === "custom_url" ? null : nextType,
                url: nextType === "custom_url" ? (currentItem.url ?? "") : null,
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

          {item.type === "custom_url" ? (
            <TextField
              aria-label="Custom URL"
              value={item.url ?? ""}
              onChange={(value) => {
                onItemFieldChange(item.id, (currentItem) => ({
                  ...currentItem,
                  url: value,
                }));
              }}
            >
              <Label>URL đích</Label>
              <Input placeholder="https://fit.vimaru.edu.vn/..." />
            </TextField>
          ) : (
            <Select
              aria-label="Tài nguyên nội bộ"
              selectedKey={String(item.linkableId ?? "")}
              onSelectionChange={(key) => {
                onItemFieldChange(item.id, (currentItem) => ({
                  ...currentItem,
                  linkableId: Number(key),
                  linkableType:
                    currentItem.type as NavigationInternalResourceType,
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
            selectedKey={
              item.parentId === null ? "root" : String(item.parentId)
            }
            onSelectionChange={(key) => {
              onParentChange(item.id, key);
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
            aria-label="Target liên kết"
            selectedKey={item.target}
            onSelectionChange={(key) => {
              onItemFieldChange(item.id, (currentItem) => ({
                ...currentItem,
                target: String(key) as NavigationItemTarget,
              }));
            }}
          >
            <Label>Hành vi mở liên kết</Label>
            <SelectTrigger />
            <SelectContent>
              {Object.entries(navigationTargetLabels).map(([target, label]) => (
                <SelectItem key={target} id={target} textValue={label}>
                  <SelectLabel>{label}</SelectLabel>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="rounded-2xl border border-border bg-muted/20 px-4 py-3">
            <Switch
              isSelected={item.isActive}
              onChange={(isSelected) => {
                onItemFieldChange(item.id, (currentItem) => ({
                  ...currentItem,
                  isActive: isSelected,
                }));
              }}
            >
              <SwitchLabel>Kích hoạt item</SwitchLabel>
            </Switch>
          </div>

          <div className="rounded-2xl border border-border bg-muted/20 px-4 py-3">
            <Text className="text-muted-fg">Đích hiện tại</Text>
            <Text className="mt-1 text-fg">
              <Strong>{describeNavigationDestination(item)}</Strong>
            </Text>
          </div>
        </FieldGroup>
      </ModalBody>

      <ModalFooter>
        {isCreating ? (
          <>
            <Button intent="outline" onPress={onCancelCreate}>
              <XMarkIcon />
              Hủy
            </Button>
            <Button intent="primary" onPress={onConfirmCreate}>
              <PlusIcon />
              Thêm
            </Button>
          </>
        ) : isEditing ? (
          <>
            <Button intent="outline" onPress={onCancelEdit}>
              <XMarkIcon />
              Hủy
            </Button>
            <Button intent="primary" onPress={onConfirmEdit}>
              <CheckIcon />
              Lưu
            </Button>
          </>
        ) : null}
      </ModalFooter>
    </ModalContent>
  );
}

interface NavigationTreeItemsProps {
  items: NavigationItemDraft[];
  onAddChild: (item: NavigationItemDraft) => void;
  onDelete: (item: NavigationItemDraft) => void;
  onEdit: (item: NavigationItemDraft) => void;
}

function NavigationTreeItems({
  items,
  onAddChild,
  onDelete,
  onEdit,
}: NavigationTreeItemsProps) {
  return (
    <Collection items={items}>
      {(item) => (
        <TreeItem
          id={String(item.id)}
          textValue={item.title}
          className="navigation-tree-editor__item rounded-none border-x-0 border-t-0 first:rounded-t-2xl last:border-b-0 last:rounded-b-2xl"
        >
          <TreeContent>
            <div className="navigation-tree-editor__row group/navigation-row flex min-w-0 flex-1 items-center gap-2 p-2">
              <IconActionButton
                label="Thêm mục con"
                icon={<PlusIcon />}
                size="sq-xs"
                onPress={() => onAddChild(item)}
              />
              <IconActionButton
                label="Chỉnh sửa item"
                icon={<PencilSquareIcon />}
                size="sq-xs"
                onPress={() => onEdit(item)}
              />
              <IconActionButton
                label="Xóa item"
                icon={<TrashIcon />}
                intent="danger"
                size="sq-xs"
                onPress={() => onDelete(item)}
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex min-w-0 items-center gap-2">
                  <Text className="truncate font-medium text-fg">
                    {item.title}
                  </Text>
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
                  {describeNavigationDestination(item)}
                </Text>
              </div>

              {item.target === "_blank" ? (
                <ArrowTopRightOnSquareIcon className="size-4 text-muted-fg" />
              ) : item.type === "custom_url" ? (
                <LinkIcon className="size-4 text-muted-fg" />
              ) : null}
            </div>
          </TreeContent>
          {item.children.length > 0 ? (
            <NavigationTreeItems
              items={item.children}
              onAddChild={onAddChild}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ) : null}
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

function resolveResourceOptions(
  type: NavigationItemType,
): NavigationResourceOption[] {
  if (type === "custom_url") {
    return [];
  }

  return navigationResourceCatalog[type];
}

function resolveDefaultResourceId(type: NavigationItemType): number | null {
  const firstResource = resolveResourceOptions(type)[0];

  return firstResource?.id ?? null;
}

function resolveFirstSelectableItemId(
  menu: NavigationMenuDraft | null,
): number | null {
  return menu?.items[0]?.id ?? null;
}

function cloneNavigationMenus(
  menus: NavigationMenuDraft[],
): NavigationMenuDraft[] {
  return JSON.parse(JSON.stringify(menus)) as NavigationMenuDraft[];
}

interface IconActionButtonProps {
  icon: ReactNode;
  intent?: "danger" | "outline" | "plain" | "primary" | "secondary";
  isDisabled?: boolean;
  label: string;
  onPress: () => void;
  size?: "sq-xs" | "sq-sm";
}

function IconActionButton({
  icon,
  intent = "outline",
  isDisabled = false,
  label,
  onPress,
  size = "sq-sm",
}: IconActionButtonProps) {
  return (
    <Tooltip delay={0}>
      <Button
        aria-label={label}
        intent={intent}
        isCircle
        isDisabled={isDisabled}
        size={size}
        onPress={onPress}
      >
        {icon}
      </Button>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}
