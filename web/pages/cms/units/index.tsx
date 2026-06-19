import {
  CheckIcon,
  EllipsisHorizontalIcon,
  EyeIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Head, Link, router } from "@inertiajs/react";
import { parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import type { ReactNode } from "react";
import { useRef, useState } from "react";
import { useDragAndDrop } from "react-aria-components/useDragAndDrop";
import { DropIndicator as DropIndicatorPrimitive } from "react-aria-components/useDragAndDrop";
import type { DropIndicatorProps } from "react-aria-components/useDragAndDrop";
import { useAsyncList } from "react-stately";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import {
  DataTableBadge,
  DataTableActions,
  DataTableFilterButton,
} from "@/components/cms/cms-data-table";
import { fetchInertiaCollectionPage } from "@/components/cms/inertia-collection-loader";
import { StickyActionBar } from "@/components/cms/sticky-action-bar";
import type { CmsUnitRow, CmsUnitsPageProps } from "@/components/cms/types";
import { Button } from "@/components/ui/button";
import { Menu, MenuContent, MenuItem } from "@/components/ui/menu";
import {
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";

import { SearchField, SearchInput } from "@/components/ui/search-field";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Text } from "@/components/ui/text";
import { useCmsContentRealtime } from "@/hooks/use-cms-content-realtime";
import { useMountEffect } from "@/hooks/use-mount-effect";
import { useRegisterUnsavedChanges } from "@/hooks/use-unsaved-changes";
import CmsLayout from "@/layouts/cms-layout";
import { t } from "@/lib/i18n";
import { create, destroy, edit, reorder, show } from "@/routes/cms/units";
import type { FlashData } from "@/types/shared";

const dateTimeFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default function CmsUnitsIndexPage({
  can,
  flash,
  units,
}: CmsUnitsPageProps) {
  const [deleteTarget, setDeleteTarget] = useState<CmsUnitRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [draftUnits, setDraftUnits] = useState<CmsUnitRow[] | null>(null);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [query, setQuery] = useQueryStates(
    {
      search: parseAsString.withDefault(""),
      status: parseAsStringLiteral(["all", "active", "inactive"]).withDefault(
        "all",
      ),
    },
    {
      clearOnDefault: true,
      history: "replace",
      scroll: false,
      shallow: true,
    },
  );

  const canReorder =
    can.manageUnits && query.search === "" && query.status === "all";
  const queryRef = useRef(query);
  const unitList = useAsyncList<CmsUnitRow>({
    async load({ signal }) {
      const { items } = await fetchInertiaCollectionPage(
        "units",
        queryRef.current,
        signal,
      );

      return {
        items: items as CmsUnitRow[],
      };
    },
  });

  useCmsContentRealtime("units", (payload) => {
    toast.info(payload.message);
    setDraftUnits(null);
    unitList.reload();
  });

  const visibleUnits =
    unitList.loadingState === "loading" && unitList.items.length === 0
      ? units
      : unitList.items;
  const displayedUnits = draftUnits ?? visibleUnits;
  const unitById = new Map(displayedUnits.map((unit) => [unit.id, unit]));

  async function syncQuery(nextQuery: Partial<typeof query>): Promise<void> {
    const resolvedQuery = {
      ...queryRef.current,
      ...nextQuery,
    };

    queryRef.current = resolvedQuery;
    await setQuery(resolvedQuery);
    setDraftUnits(null);
    unitList.reload();
  }

  function deleteUnit(): void {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);
    router.delete(destroy.url({ unit: deleteTarget.id }), {
      onFinish: () => setIsDeleting(false),
      onSuccess: () => {
        setDeleteTarget(null);
        unitList.reload();
      },
      preserveScroll: true,
    });
  }

  function handleCancelReorder(): void {
    setDraftUnits(null);
  }

  function handleSaveReorder(): void {
    if (!draftUnits) {
      return;
    }

    setIsSavingOrder(true);
    router.patch(
      reorder.url(),
      {
        nodes: draftUnits.map((unit, index) => ({
          id: unit.id,
          sort_order: index + 1,
        })),
      } as never,
      {
        onFinish: () => setIsSavingOrder(false),
        onSuccess: () => {
          setDraftUnits(null);
          unitList.reload();
          toast.success("Đã lưu thứ tự hiển thị đơn vị thành công.");
        },
        preserveScroll: true,
      },
    );
  }

  useRegisterUnsavedChanges(
    {
      isDirty: draftUnits !== null,
      onSave: handleSaveReorder,
    },
    "units-reorder",
  );

  const { dragAndDropHooks } = useDragAndDrop<CmsUnitRow>({
    getItems: (keys) =>
      Array.from(keys)
        .map((key) => unitById.get(Number(key)))
        .filter((unit): unit is CmsUnitRow => unit != null)
        .map((unit) => ({
          "text/plain": unit.name,
        })),
    onMove: (event) => {
      if (
        !canReorder ||
        !("key" in event.target) ||
        !("dropPosition" in event.target)
      ) {
        return;
      }

      const movedUnitId = Number(Array.from(event.keys)[0]);

      if (Number.isNaN(movedUnitId)) {
        return;
      }

      const targetUnitId = Number(event.target.key);
      const nextUnits = moveUnit(
        displayedUnits,
        movedUnitId,
        targetUnitId,
        event.target.dropPosition,
      );

      if (nextUnits.length === 0) {
        return;
      }

      setDraftUnits(nextUnits);
    },
    renderDropIndicator: (target) => (
      <UnitTableDropIndicator isHidden={!canReorder} target={target} />
    ),
  });

  return (
    <>
      <Head title="Đơn vị" />
      {flash?.message ? (
        <UnitsFlashToast
          key={`${flash.type}:${flash.message}`}
          message={flash.message}
          type={flash.type}
        />
      ) : null}

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="rounded-2xl border border-border bg-overlay">
          <div className="border-b border-border px-5 py-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-2">
                <p className="text-lg font-semibold text-fg">Đơn vị</p>
                <p className="max-w-3xl text-sm text-muted-fg">
                  Bảng đơn vị phẳng, kéo để đổi thứ tự hiển thị, mở từng dòng để
                  xem chi tiết hoặc chỉnh sửa.
                </p>
                <Text className="text-sm text-muted-fg">
                  {canReorder
                    ? isSavingOrder
                      ? "Đang cập nhật thứ tự đơn vị..."
                      : "Kéo thả để thay đổi thứ tự hiển thị."
                    : "Drag & drop tạm tắt khi đang lọc để tránh xáo trộn thứ tự đang xem."}
                </Text>
              </div>

              {can.manageUnits ? (
                <Link
                  href={create.url()}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-fg transition hover:opacity-90"
                >
                  <PlusIcon className="size-4" />
                  Tạo đơn vị
                </Link>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-3 px-5 py-3 border-b border-border bg-muted/5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <DataTableFilterButton
                options={[
                  { label: "Tất cả trạng thái", value: "all" },
                  { label: "Đang hoạt động", value: "active" },
                  { label: "Đang ẩn", value: "inactive" },
                ]}
                selectedValue={query.status}
                onChange={(value) => {
                  void syncQuery({ status: value as typeof query.status });
                }}
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <SearchField
                key={query.search}
                aria-label="Tìm đơn vị"
                defaultValue={query.search}
                onClear={() => {
                  void syncQuery({ search: "" });
                }}
                onSubmit={(value) => {
                  void syncQuery({ search: value });
                }}
                className="w-full sm:w-64"
              >
                <SearchInput placeholder="Tìm theo tên, đường dẫn hoặc mô tả" />
              </SearchField>
            </div>
          </div>

          <div className="overflow-hidden border-t border-border">
            <Table
              aria-label="Danh sách đơn vị"
              className="bg-bg"
              dragAndDropHooks={dragAndDropHooks}
            >
              <TableHeader>
                <TableColumn id="name" isRowHeader>
                  {t("Đơn vị")}
                </TableColumn>
                <TableColumn id="slug">{t("Đường dẫn")}</TableColumn>
                <TableColumn id="status">{t("Trạng thái")}</TableColumn>
                <TableColumn id="sortOrder">{t("Thứ tự")}</TableColumn>
                <TableColumn id="updatedAt">{t("Cập nhật")}</TableColumn>
                <TableColumn id="actions" className="text-end">
                  {t("Thao tác")}
                </TableColumn>
              </TableHeader>
              <TableBody
                items={displayedUnits}
                renderEmptyState={() => (
                  <div className="px-6 py-14 text-center">
                    <Text className="font-medium text-fg">
                      {t("Không có đơn vị phù hợp với bộ lọc hiện tại.")}
                    </Text>
                    <Text className="mt-2 text-sm text-muted-fg">
                      {t(
                        "Hãy đổi bộ lọc hoặc tạo một đơn vị mới để bắt đầu quản lý danh sách.",
                      )}
                    </Text>
                    {can.manageUnits ? (
                      <div className="mt-5">
                        <Button
                          intent="secondary"
                          onPress={() => router.visit(create.url())}
                        >
                          <PlusIcon />
                          {t("Tạo đơn vị")}
                        </Button>
                      </div>
                    ) : null}
                  </div>
                )}
              >
                {(unit) => (
                  <TableRow key={unit.id} id={unit.id} textValue={unit.name}>
                    <TableCell>
                      <div className="flex items-center gap-2 py-1">
                        <Link
                          href={show.url({ unit: unit.id })}
                          className="font-medium text-fg transition hover:text-primary"
                        >
                          {unit.name}
                        </Link>
                        <DataTableBadge
                          intent={unit.isActive ? "success" : "secondary"}
                        >
                          {unit.isActive ? "Đang hoạt động" : "Đang ẩn"}
                        </DataTableBadge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Text className="text-sm text-fg">{unit.slug}</Text>
                    </TableCell>
                    <TableCell>
                      <DataTableBadge
                        intent={unit.isActive ? "success" : "secondary"}
                      >
                        {unit.isActive ? "Đang hoạt động" : "Đang ẩn"}
                      </DataTableBadge>
                    </TableCell>
                    <TableCell>
                      <Text className="font-medium text-fg">
                        {unit.sortOrder}
                      </Text>
                    </TableCell>
                    <TableCell>{formatDateTime(unit.updatedAt)}</TableCell>
                    <TableCell className="text-end">
                      {can.manageUnits ? (
                        <DataTableActions
                          triggerAriaLabel={`Tác vụ cho ${unit.name}`}
                        >
                          <MenuItem href={show.url({ unit: unit.id })}>
                            <EyeIcon />
                            Xem chi tiết
                          </MenuItem>
                          <MenuItem href={edit.url({ unit: unit.id })}>
                            <PencilSquareIcon />
                            Chỉnh sửa
                          </MenuItem>
                          <MenuItem
                            intent="danger"
                            onAction={() => setDeleteTarget(unit)}
                          >
                            <TrashIcon />
                            Xóa đơn vị
                          </MenuItem>
                        </DataTableActions>
                      ) : null}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {draftUnits !== null ? (
        <StickyActionBar>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Text className="text-sm font-medium text-fg">
              {t("Thay đổi thứ tự hiển thị đơn vị chưa được lưu.")}
            </Text>

            <div className="flex items-center justify-end gap-2 w-full sm:w-auto shrink-0">
              <Button intent="outline" onPress={handleCancelReorder}>
                <XMarkIcon className="size-4" />
                Hủy
              </Button>
              <Button
                intent="primary"
                isDisabled={isSavingOrder}
                onPress={handleSaveReorder}
              >
                <CheckIcon className="size-4" />
                Lưu thay đổi
              </Button>
            </div>
          </div>
        </StickyActionBar>
      ) : null}

      {deleteTarget ? (
        <ModalContent
          aria-label="Xác nhận xóa đơn vị"
          isOpen={deleteTarget !== null}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setDeleteTarget(null);
            }
          }}
          size="lg"
        >
          <ModalHeader>
            <ModalTitle>Xóa đơn vị</ModalTitle>
            <ModalDescription>
              Bạn sắp xóa <strong>{deleteTarget.name}</strong>. Thao tác này sẽ
              xóa dữ liệu đơn vị khỏi hệ thống.
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <div className="rounded-2xl border border-danger-subtle bg-danger-subtle/40 px-4 py-3">
              <Text className="text-danger">
                Hãy kiểm tra lại dữ liệu liên quan trước khi xác nhận xóa.
              </Text>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button intent="outline" onPress={() => setDeleteTarget(null)}>
              Hủy
            </Button>
            <Button
              intent="danger"
              isDisabled={isDeleting}
              onPress={deleteUnit}
            >
              Xác nhận xóa
            </Button>
          </ModalFooter>
        </ModalContent>
      ) : null}
    </>
  );
}

CmsUnitsIndexPage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;

function moveUnit(
  units: CmsUnitRow[],
  movedUnitId: number,
  targetUnitId: number,
  dropPosition: "before" | "after" | "on",
): CmsUnitRow[] {
  const movedIndex = units.findIndex((unit) => unit.id === movedUnitId);
  const targetIndex = units.findIndex((unit) => unit.id === targetUnitId);

  if (movedIndex === -1 || targetIndex === -1 || movedIndex === targetIndex) {
    return units;
  }

  const nextUnits = [...units];
  const [movedUnit] = nextUnits.splice(movedIndex, 1);

  const adjustedTargetIndex =
    movedIndex < targetIndex ? targetIndex - 1 : targetIndex;
  const insertIndex =
    dropPosition === "after" ? adjustedTargetIndex + 1 : adjustedTargetIndex;

  nextUnits.splice(insertIndex, 0, movedUnit);

  return nextUnits;
}

function UnitsFlashToast({
  message,
  type,
}: {
  message: string;
  type: FlashData["type"];
}) {
  useMountEffect(() => {
    switch (type) {
      case "error":
        toast.error(message);
        break;
      case "warning":
        toast.warning(message);
        break;
      case "info":
        toast.info(message);
        break;
      default:
        toast.success(message);
        break;
    }
  });

  return null;
}

function formatDateTime(value: string): string {
  return dateTimeFormatter.format(new Date(value));
}

function UnitTableDropIndicator({
  isHidden = false,
  target,
}: DropIndicatorProps & {
  isHidden?: boolean;
}) {
  return (
    <DropIndicatorPrimitive
      className={({ isDropTarget }) =>
        twMerge(
          "relative block h-2 rounded-full",
          isHidden && "hidden",
          "before:absolute before:inset-x-2 before:top-1/2 before:h-0.5 before:-translate-y-1/2 before:rounded-full before:bg-primary/35",
          isDropTarget && "before:bg-primary",
        )
      }
      target={target}
    />
  );
}
