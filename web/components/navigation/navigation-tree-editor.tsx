import {
  ArrowDownIcon,
  ArrowTopRightOnSquareIcon,
  ArrowUpIcon,
  FolderOpenIcon,
  LinkIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Collection } from "react-aria-components/Collection";
import { useDragAndDrop } from "react-aria-components/useDragAndDrop";
import { type Key, type ReactNode, startTransition, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Description, FieldGroup, Label } from "@/components/ui/field";
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
import { Tab, TabList, TabPanel, TabPanels, Tabs } from "@/components/ui/tabs";
import { TextField } from "@/components/ui/text-field";
import { Textarea } from "@/components/ui/textarea";
import { Strong, Text } from "@/components/ui/text";
import {
  Tree,
  TreeContent,
  TreeDropIndicator,
  TreeItem,
} from "@/components/ui/tree";
import {
  collectNavigationParentOptions,
  countNavigationItems,
  createEmptyNavigationItem,
  createMockNavigationMenus,
  describeNavigationDestination,
  findNavigationItem,
  insertNavigationItem,
  moveNavigationItem,
  moveNavigationItemsToTarget,
  navigationResourceCatalog,
  normalizeNavigationTree,
  removeNavigationItem,
  updateNavigationItem,
  type NavigationInternalResourceType,
  type NavigationItemDraft,
  type NavigationItemTarget,
  type NavigationItemType,
  type NavigationMenuDraft,
  type NavigationResourceOption,
} from "@/lib/navigation/tree";

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

const locationLabels: Record<string, string> = {
  footer: "Footer",
  header: "Header",
};

export function NavigationTreeEditor() {
  const [menus, setMenus] = useState<NavigationMenuDraft[]>(
    createMockNavigationMenus,
  );
  const [activeMenuId, setActiveMenuId] = useState(menus[0]?.id ?? 0);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(
    menus[0]?.items[0]?.id ?? null,
  );
  const [draftId, setDraftId] = useState(1000);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "tree">("tree");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<NavigationItemType | "all">(
    "all",
  );

  const activeMenu =
    menus.find((menu) => menu.id === activeMenuId) ?? menus[0] ?? null;
  const activeItems = activeMenu?.items ?? [];
  const selectedItem =
    selectedItemId === null
      ? null
      : findNavigationItem(activeItems, selectedItemId);

  const activeCount = countNavigationItems(activeItems);
  const activeDepth = getTreeDepth(activeItems);
  const flatItems = flattenNavigationItems(activeItems);
  const visibleListItems = flatItems.filter((item) => {
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    const haystack = [
      item.title,
      navigationTypeLabels[item.type],
      describeNavigationDestination(item),
    ]
      .join(" ")
      .toLowerCase();
    const matchesSearch =
      searchTerm.trim() === "" ||
      haystack.includes(searchTerm.trim().toLowerCase());

    return matchesType && matchesSearch;
  });
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

      updateActiveMenu(activeMenu.id, (menu) => ({
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
      setIsEditorOpen(false);
    });
  }

  function handleAddItem(parentId: number | null): void {
    if (!activeMenu) {
      return;
    }

    const nextDraftId = draftId + 1;
    const draftItem = createEmptyNavigationItem(
      nextDraftId,
      activeMenu.id,
      parentId,
    );

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
      setIsEditorOpen(true);
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
      setIsEditorOpen(false);
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

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <Card className="rounded-xl border-border bg-overlay shadow-none">
        <CardHeader className="gap-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge intent="outline" isCircle={false}>
                  Navigation
                </Badge>
                {activeMenu ? (
                  <Badge intent="outline" isCircle={false}>
                    {locationLabels[activeMenu.location] ?? activeMenu.location}
                  </Badge>
                ) : null}
              </div>
              <div className="space-y-1">
                <CardTitle className="text-2xl/8 sm:text-3xl/9">
                  Quản lý cây navigation
                </CardTitle>
                <CardDescription className="max-w-3xl">
                  Dùng `web/components/ui/tree.tsx` để biên tập parent-child,
                  reorder bằng drag-and-drop hoặc nút điều khiển, và sửa item
                  bằng modal thay vì inspector cố định.
                </CardDescription>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-[minmax(0,18rem)_auto]">
              <Select
                aria-label="Chọn menu cần chỉnh"
                selectedKey={String(activeMenu?.id ?? "")}
                onSelectionChange={handleMenuChange}
              >
                <Label>Menu đang chỉnh</Label>
                <SelectTrigger />
                <SelectContent>
                  {menus.map((menu) => (
                    <SelectItem
                      key={menu.id}
                      id={String(menu.id)}
                      textValue={menu.name}
                    >
                      <SelectLabel>
                        {menu.name} ·{" "}
                        {locationLabels[menu.location] ?? menu.location}
                      </SelectLabel>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                className="self-end"
                intent="secondary"
                onPress={() => handleAddItem(null)}
              >
                <PlusIcon />
                Thêm item cấp gốc
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Card className="min-h-[34rem] rounded-xl border-border bg-overlay shadow-none">
        <CardHeader className="gap-4 border-b border-border/70">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-3 text-sm text-muted-fg">
              <ToolbarStat label="Slug menu" value={activeMenu?.slug ?? "—"} />
              <ToolbarStat label="Số item" value={String(activeCount)} />
              <ToolbarStat label="Độ sâu" value={`${activeDepth} cấp`} />
              <ToolbarStat label="Kéo thả" value="Đã bật" />
              <ToolbarStat
                label="List scan"
                value={`${visibleListItems.length} mục`}
              />
              <ToolbarStat
                label="Đang chọn"
                value={selectedItem?.title ?? "Chưa chọn item"}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                intent="outline"
                size="sm"
                isDisabled={!selectedItem}
                onPress={() => {
                  if (!selectedItem) {
                    return;
                  }

                  handleAddItem(selectedItem.id);
                }}
              >
                <PlusIcon />
                Thêm mục con
              </Button>
              <Button
                intent="outline"
                size="sm"
                isDisabled={!selectedItem}
                onPress={() => {
                  if (!selectedItem) {
                    return;
                  }

                  setIsEditorOpen(true);
                }}
              >
                <PencilSquareIcon />
                Chỉnh sửa
              </Button>
              <Button
                intent="plain"
                size="sq-xs"
                isCircle
                isDisabled={!selectedItem}
                onPress={() => {
                  if (selectedItem) {
                    handleMoveItem(selectedItem.id, "up");
                  }
                }}
              >
                <ArrowUpIcon />
              </Button>
              <Button
                intent="plain"
                size="sq-xs"
                isCircle
                isDisabled={!selectedItem}
                onPress={() => {
                  if (selectedItem) {
                    handleMoveItem(selectedItem.id, "down");
                  }
                }}
              >
                <ArrowDownIcon />
              </Button>
              <Button
                intent="danger"
                size="sm"
                isDisabled={!selectedItem}
                onPress={() => {
                  if (selectedItem) {
                    handleDeleteItem(selectedItem.id);
                  }
                }}
              >
                <TrashIcon />
                Xóa
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="min-h-0 p-0">
          <div className="border-b border-border/70 px-6 py-4">
            <Text className="text-muted-fg">
              {selectedItem ? (
                <>
                  Đích hiện tại:{" "}
                  <Strong>{describeNavigationDestination(selectedItem)}</Strong>
                </>
              ) : (
                "Chọn một node trong tree, hoặc kéo thả trực tiếp để đổi vị trí và parent."
              )}
            </Text>
          </div>

          <Tabs
            selectedKey={viewMode}
            onSelectionChange={(key) => {
              if (key === "tree" || key === "list") {
                setViewMode(key);
              }
            }}
            className="p-4"
          >
            <TabList aria-label="Chọn chế độ biên tập">
              <Tab id="tree">Tree view</Tab>
              <Tab id="list">List view</Tab>
            </TabList>

            <TabPanels>
              <TabPanel id="tree">
                <div className="pt-4">
                  <div className="min-h-0 rounded-3xl border border-border bg-bg p-3">
                    <ScrollArea className="h-[30rem]" orientation="vertical">
                      {activeItems.length > 0 ? (
                        <Tree
                          aria-label="Cây navigation item"
                          key={activeMenu?.id ?? "empty-menu"}
                          className="gap-1"
                          defaultExpandedKeys={collectExpandableKeys(
                            activeItems,
                          )}
                          dragAndDropHooks={dragAndDropHooks}
                          selectedKeys={
                            selectedItemId === null
                              ? []
                              : [String(selectedItemId)]
                          }
                          selectionMode="single"
                          onSelectionChange={(keys) => {
                            if (keys === "all") {
                              return;
                            }

                            const [firstKey] = Array.from(keys);
                            setSelectedItemId(
                              typeof firstKey === "undefined"
                                ? null
                                : Number(firstKey),
                            );
                          }}
                        >
                          {renderTreeItems(activeItems)}
                        </Tree>
                      ) : (
                        <div className="flex h-full min-h-64 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-center">
                          <FolderOpenIcon className="size-10 text-muted-fg" />
                          <div className="space-y-1">
                            <Text className="font-medium">
                              Menu này chưa có item.
                            </Text>
                            <Text className="text-muted-fg">
                              Tạo item cấp gốc để bắt đầu sắp xếp cây
                              navigation.
                            </Text>
                          </div>
                          <Button
                            intent="secondary"
                            onPress={() => handleAddItem(null)}
                          >
                            <PlusIcon />
                            Tạo item đầu tiên
                          </Button>
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                </div>
              </TabPanel>

              <TabPanel id="list">
                <div className="space-y-4 pt-4">
                  <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_14rem]">
                    <TextField
                      aria-label="Tìm navigation item"
                      value={searchTerm}
                      onChange={setSearchTerm}
                    >
                      <Label>Tìm nhanh theo title hoặc destination</Label>
                      <Input placeholder="Ví dụ: tuyển sinh, /dao-tao, thông báo..." />
                    </TextField>

                    <Select
                      aria-label="Lọc theo loại item"
                      selectedKey={typeFilter}
                      onSelectionChange={(key) => {
                        const nextFilter = String(key) as
                          | NavigationItemType
                          | "all";
                        setTypeFilter(nextFilter);
                      }}
                    >
                      <Label>Lọc theo loại</Label>
                      <SelectTrigger />
                      <SelectContent>
                        <SelectItem id="all" textValue="Tất cả loại">
                          <SelectLabel>Tất cả loại</SelectLabel>
                        </SelectItem>
                        {Object.entries(navigationTypeLabels).map(
                          ([type, label]) => (
                            <SelectItem key={type} id={type} textValue={label}>
                              <SelectLabel>{label}</SelectLabel>
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="rounded-3xl border border-border bg-bg">
                    <div className="grid grid-cols-[minmax(0,1.5fr)_10rem_minmax(0,1.6fr)_8rem_9rem] gap-3 border-b border-border/70 px-4 py-3 text-muted-fg text-sm">
                      <Text>Tiêu đề</Text>
                      <Text>Loại</Text>
                      <Text>Đích</Text>
                      <Text>Trạng thái</Text>
                      <Text className="text-right">Hành động</Text>
                    </div>

                    <ScrollArea className="h-[30rem]" orientation="vertical">
                      {visibleListItems.length > 0 ? (
                        <div className="divide-y divide-border/70">
                          {visibleListItems.map((item) => (
                            <div
                              key={item.id}
                              className="grid grid-cols-[minmax(0,1.5fr)_10rem_minmax(0,1.6fr)_8rem_9rem] gap-3 px-4 py-3 transition hover:bg-secondary/60"
                            >
                              <div className="min-w-0">
                                <Text className="truncate font-medium">
                                  {item.depth > 0
                                    ? `${"— ".repeat(item.depth)}${item.title}`
                                    : item.title}
                                </Text>
                                <Text className="truncate text-muted-fg">
                                  #{item.sortOrder}
                                  {item.parentId === null
                                    ? " · Root"
                                    : ` · Parent #${item.parentId}`}
                                </Text>
                              </div>
                              <div>
                                <Badge intent="outline" isCircle={false}>
                                  {navigationTypeLabels[item.type]}
                                </Badge>
                              </div>
                              <Text className="truncate text-muted-fg">
                                {describeNavigationDestination(item)}
                              </Text>
                              <div>
                                {item.isActive ? (
                                  <Badge intent="outline" isCircle={false}>
                                    Active
                                  </Badge>
                                ) : (
                                  <Badge intent="warning" isCircle={false}>
                                    Hidden
                                  </Badge>
                                )}
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button
                                  intent="plain"
                                  size="sq-xs"
                                  isCircle
                                  onPress={() => {
                                    setSelectedItemId(item.id);
                                    handleMoveItem(item.id, "up");
                                  }}
                                >
                                  <ArrowUpIcon />
                                </Button>
                                <Button
                                  intent="plain"
                                  size="sq-xs"
                                  isCircle
                                  onPress={() => {
                                    setSelectedItemId(item.id);
                                    setIsEditorOpen(true);
                                  }}
                                >
                                  <PencilSquareIcon />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex h-full min-h-64 items-center justify-center px-6 py-10 text-center">
                          <Text className="text-muted-fg">
                            Không có item nào khớp với bộ lọc hiện tại.
                          </Text>
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </CardContent>
      </Card>

      <NavigationItemEditorModal
        item={selectedItem}
        isOpen={isEditorOpen && selectedItem !== null}
        onOpenChange={setIsEditorOpen}
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

          updateActiveMenu(activeMenu.id, (menu) => ({
            ...menu,
            items: normalizeNavigationTree(nextItems),
          }));
        }}
      />
    </div>
  );
}

interface NavigationItemEditorModalProps {
  isOpen: boolean;
  item: NavigationItemDraft | null;
  onItemFieldChange: (
    itemId: number,
    updater: (item: NavigationItemDraft) => NavigationItemDraft,
  ) => void;
  onOpenChange: (isOpen: boolean) => void;
  onParentChange: (itemId: number, key: Key | null) => void;
  parentOptions: Array<{ id: number; label: string }>;
}

function NavigationItemEditorModal({
  isOpen,
  item,
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
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
    >
      <ModalHeader>
        <ModalTitle>Chỉnh sửa navigation item</ModalTitle>
        <ModalDescription>
          Sửa dữ liệu node đang chọn trong modal để tree bên dưới giữ vai trò
          điều hướng và tổ chức cấu trúc.
        </ModalDescription>
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
              <Description>
                Backend vẫn phải kiểm tra format URL khi lưu thật.
              </Description>
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

          <div className="space-y-2">
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
            <Text className="text-muted-fg">
              Item tắt sẽ vẫn tồn tại trong draft tree nhưng được gắn trạng thái
              ẩn để chuẩn bị cho workflow publish thật.
            </Text>
          </div>

          <div className="rounded-2xl border border-border bg-muted/20 p-4">
            <Text className="text-muted-fg">Preview đích</Text>
            <Text className="mt-1">
              <Strong>{describeNavigationDestination(item)}</Strong>
            </Text>
          </div>

          <div className="space-y-2">
            <Label htmlFor="navigation-item-notes">Ghi chú biên tập</Label>
            <Textarea
              id="navigation-item-notes"
              readOnly
              value={`sort_order: ${item.sortOrder}\nmenu_id: ${item.menuId}\nitem_id: ${item.id}`}
            />
            <Description>
              Giữ lại metadata gọn để dễ kiểm tra thứ tự và quan hệ menu-item,
              thay vì block JSON placeholder dài.
            </Description>
          </div>
        </FieldGroup>
      </ModalBody>

      <ModalFooter>
        <Button intent="outline" onPress={() => onOpenChange(false)}>
          Đóng
        </Button>
      </ModalFooter>
    </ModalContent>
  );
}

function renderTreeItems(items: NavigationItemDraft[]): ReactNode {
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
                  #{item.sortOrder} · {describeNavigationDestination(item)}
                </Text>
              </div>

              {item.target === "_blank" ? (
                <ArrowTopRightOnSquareIcon className="size-4 text-muted-fg" />
              ) : item.type === "custom_url" ? (
                <LinkIcon className="size-4 text-muted-fg" />
              ) : null}
            </div>
          </TreeContent>
          {item.children.length > 0 ? renderTreeItems(item.children) : null}
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

function ToolbarStat({ label, value }: { label: string; value: string }) {
  return (
    <Text className="flex items-center gap-2">
      <span>{label}:</span>
      <Strong>{value}</Strong>
    </Text>
  );
}

interface FlatNavigationItem extends NavigationItemDraft {
  depth: number;
}

function flattenNavigationItems(
  items: NavigationItemDraft[],
  depth = 0,
): FlatNavigationItem[] {
  return items.flatMap((item) => [
    {
      ...item,
      depth,
    },
    ...flattenNavigationItems(item.children, depth + 1),
  ]);
}
