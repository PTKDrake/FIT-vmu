import {
  ArrowDownTrayIcon,
  ArrowTopRightOnSquareIcon,
  DocumentDuplicateIcon,
  EllipsisHorizontalIcon,
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon,
  MusicalNoteIcon,
  PencilSquareIcon,
  PhotoIcon,
  Squares2X2Icon,
  TableCellsIcon,
  TrashIcon,
  VideoCameraIcon,
  XMarkIcon,
  PlusIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";
import { Head, router, useForm } from "@inertiajs/react";
import {
  parseAsInteger,
  parseAsString,
  parseAsStringLiteral,
  useQueryStates,
} from "nuqs";
import type { ReactNode } from "react";
import { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import type { FileRejection } from "react-dropzone";
import { useAsyncList } from "react-stately";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import {
  DataTableFilterButton,
  DataTableSortButton,
} from "@/components/cms/cms-data-table";

const mediaSortableColumns = [
  { id: "created_at", label: "Ngày tải lên" },
  { id: "display_name", label: "Tên tệp" },
  { id: "size", label: "Dung lượng" },
];
import { fetchInertiaCollectionPage } from "@/components/cms/inertia-collection-loader";
import type { CmsMediaPageProps, CmsMediaRow } from "@/components/cms/types";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { t } from "@/lib/i18n";
import { DropZone } from "@/components/ui/drop-zone";
import {
  FieldError,
  FieldGroup,
  Fieldset,
  Legend,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/menu";
import {
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import {
  Pagination,
  PaginationFirst,
  PaginationItem,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  ProgressBar,
  ProgressBarHeader,
  ProgressBarTrack,
  ProgressBarValue,
} from "@/components/ui/progress-bar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SearchField, SearchInput } from "@/components/ui/search-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { Code, Strong, Text } from "@/components/ui/text";
import { TextField } from "@/components/ui/text-field";
import { useMountEffect } from "@/hooks/use-mount-effect";
import CmsLayout from "@/layouts/cms-layout";
import mediaRoutes from "@/routes/cms/media";
import type { FlashData } from "@/types/shared";

const ACCEPTED_MEDIA_TYPES = {
  "audio/m4a": [".m4a"],
  "audio/mpeg": [".mp3"],
  "audio/ogg": [".ogg"],
  "audio/wav": [".wav"],
  "image/gif": [".gif"],
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
  "video/mp4": [".mp4"],
  "video/quicktime": [".mov"],
  "video/webm": [".webm"],
} as const;

const dateFilterOptions = [
  { label: "Mọi thời điểm", value: "all" },
  { label: "Hôm nay", value: "today" },
  { label: "7 ngày qua", value: "7d" },
  { label: "30 ngày qua", value: "30d" },
  { label: "12 tháng qua", value: "365d" },
] as const;

const typeFilterOptions = [
  { label: "Mọi loại", value: "all" },
  { label: "Ảnh", value: "image" },
  { label: "Video", value: "video" },
  { label: "Âm thanh", value: "audio" },
] as const;

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default function CmsMediaPage({ can, flash, media }: CmsMediaPageProps) {
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDeletingMedia, setIsDeletingMedia] = useState(false);
  const [deleteTargetMediaId, setDeleteTargetMediaId] = useState<number | null>(
    null,
  );
  const [renameTargetMediaId, setRenameTargetMediaId] = useState<number | null>(
    null,
  );
  const [selectedMediaId, setSelectedMediaId] = useState<number | null>(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [clientRejections, setClientRejections] = useState<FileRejection[]>([]);

  const [query, setQuery] = useQueryStates(
    {
      date: parseAsStringLiteral([
        "all",
        "today",
        "7d",
        "30d",
        "365d",
      ]).withDefault("all"),
      direction: parseAsStringLiteral(["asc", "desc"]).withDefault("desc"),
      page: parseAsInteger.withDefault(1),
      perPage: parseAsInteger.withDefault(media.meta.perPage),
      search: parseAsString.withDefault(""),
      sort: parseAsStringLiteral([
        "created_at",
        "display_name",
        "size",
      ]).withDefault("created_at"),
      type: parseAsStringLiteral([
        "all",
        "image",
        "video",
        "audio",
      ]).withDefault("all"),
      uploadedBy: parseAsInteger.withDefault(0),
      view: parseAsStringLiteral(["grid", "table"]).withDefault("grid"),
    },
    {
      clearOnDefault: true,
      history: "replace",
      scroll: false,
      shallow: true,
    },
  );
  const [mediaMeta, setMediaMeta] = useState(media.meta);
  const queryRef = useRef(query);

  const uploadForm = useForm<{
    files: File[];
  }>({
    files: [],
  });
  const renameForm = useForm<{
    name: string;
  }>({
    name: "",
  });

  const mediaList = useAsyncList<CmsMediaRow>({
    async load({ signal }) {
      const { items, meta } = await fetchInertiaCollectionPage(
        "media",
        queryRef.current,
        signal,
      );

      if (meta && typeof meta === "object") {
        setMediaMeta(meta as unknown as typeof media.meta);
      }

      return {
        items: items as CmsMediaRow[],
      };
    },
  });
  const visibleMedia =
    mediaList.loadingState === "loading" && mediaList.items.length === 0
      ? media.data
      : mediaList.items;
  const deleteTargetMedia =
    visibleMedia.find((item) => item.id === deleteTargetMediaId) ?? null;
  const selectedMedia =
    visibleMedia.find((item) => item.id === selectedMediaId) ?? null;
  const renameTargetMedia =
    visibleMedia.find((item) => item.id === renameTargetMediaId) ?? null;

  const canDeleteMedia = can.deleteMedia;
  const canDuplicateMedia = can.duplicateMedia;
  const canRenameMedia = can.renameMedia;
  const canUploadMedia = can.uploadMedia;

  const {
    getInputProps,
    getRootProps,
    isDragAccept,
    isDragActive,
    isDragReject,
    open,
  } = useDropzone({
    accept: ACCEPTED_MEDIA_TYPES,
    maxFiles: 10,
    maxSize: 20 * 1024 * 1024,
    multiple: true,
    noKeyboard: true,
    noClick: true,
    onDrop: (acceptedFiles, fileRejections) => {
      setClientRejections(fileRejections);
      uploadForm.setData("files", acceptedFiles);
    },
  });

  const dropzoneRootProps = getRootProps();
  const dropzoneInputProps = getInputProps() as any;

  const uploaderOptions = [
    {
      id: 0,
      name: "Mọi người tải lên",
    },
    ...media.filters.uploaders,
  ];

  async function syncQuery(
    nextQuery: Partial<typeof query>,
    options: {
      resetPage?: boolean;
    } = {},
  ): Promise<void> {
    const nextPage = options.resetPage ? 1 : (nextQuery.page ?? query.page);
    const resolvedQuery = {
      ...queryRef.current,
      ...nextQuery,
      page: nextPage,
    };

    queryRef.current = resolvedQuery;
    await setQuery(resolvedQuery);
    mediaList.reload();
  }

  const filterSections = [
    {
      id: "type",
      label: "Loại media",
      options: typeFilterOptions.map((opt) => ({
        label: opt.label,
        value: opt.value,
      })),
      selectedValue: query.type,
      onChange: (value: string) => {
        void syncQuery(
          { type: value as typeof query.type },
          { resetPage: true },
        );
      },
    },
    {
      id: "uploadedBy",
      label: "Người tải lên",
      options: uploaderOptions.map((opt) => ({
        label: opt.name,
        value: String(opt.id),
      })),
      selectedValue: String(query.uploadedBy),
      onChange: (value: string) => {
        void syncQuery({ uploadedBy: Number(value) }, { resetPage: true });
      },
    },
    {
      id: "date",
      label: "Thời gian tải lên",
      options: dateFilterOptions.map((opt) => ({
        label: opt.label,
        value: opt.value,
      })),
      selectedValue: query.date,
      onChange: (value: string) => {
        void syncQuery(
          { date: value as typeof query.date },
          { resetPage: true },
        );
      },
    },
  ];

  function submitUpload(): void {
    uploadForm.post(mediaRoutes.store.url(), {
      forceFormData: true,
      onSuccess: () => {
        setClientRejections([]);
        setIsUploadOpen(false);
        uploadForm.reset();
        mediaList.reload();
      },
      preserveScroll: true,
    });
  }

  function deleteSelectedMedia(): void {
    if (!deleteTargetMedia) {
      return;
    }

    const deletingMediaId = deleteTargetMedia.id;

    setIsDeletingMedia(true);
    router.delete(mediaRoutes.destroy.url({ media: deleteTargetMedia.id }), {
      onFinish: () => {
        setIsDeletingMedia(false);
      },
      onSuccess: () => {
        setIsDeleteConfirmOpen(false);
        setDeleteTargetMediaId(null);

        if (selectedMediaId === deletingMediaId) {
          setSelectedMediaId(null);
        }

        mediaList.reload();
      },
      preserveScroll: true,
    });
  }

  function downloadSelectedMedia(): void {
    if (!selectedMedia) {
      return;
    }

    const downloadLink = document.createElement("a");
    downloadLink.href = selectedMedia.previewUrl;
    downloadLink.download = selectedMedia.displayName;
    downloadLink.rel = "noopener noreferrer";
    downloadLink.click();

    toast.success("Đã bắt đầu tải tệp.");
  }

  function openSelectedMedia(): void {
    if (!selectedMedia) {
      return;
    }

    window.open(selectedMedia.previewUrl, "_blank", "noopener,noreferrer");
    toast.info("Đã mở media ở tab mới.");
  }

  function openMediaViewer(mediaId: number): void {
    setIsDeleteConfirmOpen(false);
    setDeleteTargetMediaId(null);
    setPreviewScale(1);
    setSelectedMediaId(mediaId);
  }

  function closeMediaViewer(): void {
    setIsDeleteConfirmOpen(false);
    setPreviewScale(1);
    setSelectedMediaId(null);
  }

  function changePreviewScale(delta: number): void {
    setPreviewScale((currentScale) => {
      const nextScale = Math.min(3, Math.max(0.5, currentScale + delta));

      return Number(nextScale.toFixed(2));
    });
  }

  function requestDeleteMedia(mediaId: number): void {
    setDeleteTargetMediaId(mediaId);
    setIsDeleteConfirmOpen(true);
  }

  function openRenameModal(mediaId: number): void {
    const mediaToRename = visibleMedia.find((item) => item.id === mediaId);

    if (!mediaToRename) {
      return;
    }

    renameForm.clearErrors();
    renameForm.setData("name", getMediaBaseName(mediaToRename.displayName));
    setRenameTargetMediaId(mediaId);
    setIsRenameOpen(true);
  }

  function closeRenameModal(): void {
    setIsRenameOpen(false);
    setRenameTargetMediaId(null);
    renameForm.reset();
    renameForm.clearErrors();
  }

  function submitRename(): void {
    if (!renameTargetMedia) {
      return;
    }

    renameForm.patch(mediaRoutes.rename.url({ media: renameTargetMedia.id }), {
      errorBag: "renameMedia",
      onSuccess: () => {
        closeRenameModal();
        mediaList.reload();
      },
      preserveScroll: true,
    });
  }

  function duplicateMedia(mediaId: number): void {
    router.post(
      mediaRoutes.duplicate.url({ media: mediaId }),
      {},
      {
        onSuccess: () => {
          mediaList.reload();
        },
        preserveScroll: true,
      },
    );
  }

  return (
    <>
      <Head title="Media" />
      {flash?.message ? (
        <MediaFlashToast
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
                <p className="text-lg font-semibold text-fg">
                  {t("Media Management")}
                </p>
                <p className="max-w-3xl text-sm text-muted-fg">
                  {t(
                    "Quản lý ảnh, video và âm thanh dùng trong CMS từ một thư viện chung.",
                  )}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded-xl border border-border bg-bg p-1">
                  <Button
                    aria-label="Hiển thị dạng lưới"
                    intent={query.view === "grid" ? "secondary" : "plain"}
                    size="sq-sm"
                    onPress={() => {
                      void syncQuery({ view: "grid" });
                    }}
                  >
                    <Squares2X2Icon />
                  </Button>
                  <Button
                    aria-label="Hiển thị dạng bảng"
                    intent={query.view === "table" ? "secondary" : "plain"}
                    size="sq-sm"
                    onPress={() => {
                      void syncQuery({ view: "table" });
                    }}
                  >
                    <TableCellsIcon />
                  </Button>
                </div>

                {canUploadMedia ? (
                  <Button onPress={() => setIsUploadOpen(true)}>
                    Tải media lên
                  </Button>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 px-5 py-3 border-b border-border bg-muted/5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <DataTableSortButton
                columns={mediaSortableColumns}
                activeSort={{
                  column: query.sort,
                  direction: query.direction === "desc" ? "desc" : "asc",
                }}
                onChange={(col, dir) => {
                  void syncQuery(
                    { sort: col as any, direction: dir },
                    { resetPage: true },
                  );
                }}
              />
              <DataTableFilterButton sections={filterSections} />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <SearchField
                key={query.search}
                aria-label="Tìm media"
                defaultValue={query.search}
                onClear={() => {
                  void syncQuery({ search: "" }, { resetPage: true });
                }}
                onSubmit={(value) => {
                  void syncQuery({ search: value }, { resetPage: true });
                }}
                className="w-full sm:w-64"
              >
                <SearchInput placeholder="Tìm theo tên tệp hoặc MIME type" />
              </SearchField>
            </div>
          </div>

          <div className="space-y-4 px-5 py-4">
            <div className="flex items-center justify-between gap-3">
              <Text className="text-sm text-muted-fg">
                {mediaMeta.total} media
                {mediaList.isLoading ? " · đang làm mới" : ""}
              </Text>

              <Select
                className="w-36 min-w-36"
                aria-label="Số media mỗi trang"
                selectedKey={String(mediaMeta.perPage)}
                onSelectionChange={(key) => {
                  if (key !== null) {
                    void syncQuery(
                      { perPage: Number(key) },
                      { resetPage: true },
                    );
                  }
                }}
              >
                <SelectTrigger />
                <SelectContent>
                  {[12, 24, 48].map((option) => (
                    <SelectItem
                      key={option}
                      id={String(option)}
                      textValue={`${option} mục / trang`}
                    >
                      <SelectLabel>{option} mục / trang</SelectLabel>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {query.view === "grid" ? (
              <div className="grid gap-4 md:grid-cols-4 2xl:grid-cols-6">
                {visibleMedia.map((item) => (
                  <div
                    key={item.id}
                    className="group relative rounded-2xl border border-border bg-bg transition hover:border-muted-fg/30 hover:bg-muted/20"
                  >
                    <button
                      aria-label={`Xem media ${item.displayName}`}
                      className="absolute inset-0 rounded-2xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
                      type="button"
                      onClick={() => {
                        openMediaViewer(item.id);
                      }}
                    />

                    <div className="absolute right-3 top-3 z-10">
                      <MediaActionsMenu
                        canDeleteMedia={canDeleteMedia}
                        canDuplicateMedia={canDuplicateMedia}
                        canRenameMedia={canRenameMedia}
                        mediaName={item.displayName}
                        onDelete={() => requestDeleteMedia(item.id)}
                        onDuplicate={() => duplicateMedia(item.id)}
                        onRename={() => openRenameModal(item.id)}
                      />
                    </div>

                    <div className="pointer-events-none relative z-0 flex aspect-[4/3] items-center justify-center overflow-hidden rounded-t-2xl border-b border-border bg-muted/20">
                      <MediaPreview media={item} className="size-full" />
                    </div>

                    <div className="pointer-events-none relative z-0 space-y-3 p-4 text-left">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 space-y-1">
                          <p className="truncate font-medium text-fg">
                            {item.displayName}
                          </p>
                          <Text className="truncate text-sm text-muted-fg">
                            {item.mimeType} · {formatDateTime(item.uploadedAt)}
                          </Text>
                        </div>

                        <Badge
                          intent={getKindIntent(item.kind)}
                          isCircle={false}
                        >
                          {getKindLabel(item.kind)}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                          <Avatar
                            alt={
                              item.uploader?.name ?? "Không rõ người tải lên"
                            }
                            initials={getInitials(item.uploader?.name ?? "NA")}
                            size="sm"
                          />
                          <Text className="truncate text-sm text-muted-fg">
                            {item.uploader?.name ?? "Không rõ"}
                          </Text>
                        </div>

                        <Text className="text-sm text-muted-fg">
                          {formatBytes(item.size)}
                        </Text>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border bg-bg">
                <table className="min-w-full border-collapse">
                  <thead className="bg-muted/30">
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-fg first:pl-5 last:pr-5">
                        {t("Tệp")}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-fg first:pl-5 last:pr-5">
                        {t("Loại")}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-fg first:pl-5 last:pr-5">
                        {t("Người tải lên")}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-fg first:pl-5 last:pr-5">
                        {t("Tải lên")}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-fg first:pl-5 last:pr-5">
                        {t("Dung lượng")}
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-fg first:pl-5 last:pr-5">
                        Sử dụng
                      </th>
                      <th className="w-14 px-4 py-3 text-right text-sm font-medium text-muted-fg first:pl-5 last:pr-5">
                        Tác vụ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleMedia.map((item) => (
                      <tr
                        key={item.id}
                        className="cursor-pointer border-b border-border transition hover:bg-muted/20 last:border-b-0"
                        onClick={() => {
                          openMediaViewer(item.id);
                        }}
                      >
                        <td className="px-4 py-4 align-top first:pl-5 last:pr-5">
                          <div className="flex items-start gap-3">
                            <div className="size-14 shrink-0 overflow-hidden rounded-xl border border-border bg-muted/20">
                              <MediaPreview
                                media={item}
                                className="size-full"
                                mode="compact"
                              />
                            </div>
                            <div className="min-w-0 space-y-1">
                              <p className="truncate font-medium text-fg">
                                {item.displayName}
                              </p>
                              <Text className="truncate text-sm text-muted-fg">
                                {item.mimeType}
                              </Text>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 align-top text-sm text-fg first:pl-5 last:pr-5">
                          <Badge
                            intent={getKindIntent(item.kind)}
                            isCircle={false}
                          >
                            {getKindLabel(item.kind)}
                          </Badge>
                        </td>
                        <td className="px-4 py-4 align-top text-sm text-fg first:pl-5 last:pr-5">
                          {item.uploader?.name ?? "Không rõ"}
                        </td>
                        <td className="px-4 py-4 align-top text-sm text-fg first:pl-5 last:pr-5">
                          {formatDateTime(item.uploadedAt)}
                        </td>
                        <td className="px-4 py-4 align-top text-sm text-fg first:pl-5 last:pr-5">
                          {formatBytes(item.size)}
                        </td>
                        <td className="px-4 py-4 align-top text-sm text-fg first:pl-5 last:pr-5">
                          {item.usage.total}
                        </td>
                        <td className="px-4 py-4 align-top text-right first:pl-5 last:pr-5">
                          <MediaActionsMenu
                            canDeleteMedia={canDeleteMedia}
                            canDuplicateMedia={canDuplicateMedia}
                            canRenameMedia={canRenameMedia}
                            mediaName={item.displayName}
                            onDelete={() => requestDeleteMedia(item.id)}
                            onDuplicate={() => duplicateMedia(item.id)}
                            onRename={() => openRenameModal(item.id)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {visibleMedia.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border bg-muted/10 px-6 py-12 text-center">
                <p className="font-medium text-fg">
                  {t("Chưa có media phù hợp")}
                </p>
                <Text className="mt-2 text-muted-fg">
                  {t(
                    "Thử đổi bộ lọc hoặc tải thêm ảnh, video, âm thanh vào thư viện.",
                  )}
                </Text>
              </div>
            ) : null}

            <div className="flex flex-col gap-3 border-t border-border pt-4 md:flex-row md:items-center md:justify-between">
              <Text className="text-sm text-muted-fg">
                {t("Hiển thị")} {mediaMeta.from ?? 0}-{mediaMeta.to ?? 0}{" "}
                {t("trên")} {mediaMeta.total} media
              </Text>

              <Pagination>
                <PaginationList>
                  <PaginationFirst
                    isDisabled={mediaMeta.currentPage <= 1}
                    onPress={() => {
                      void syncQuery({ page: 1 });
                    }}
                  />
                  <PaginationPrevious
                    isDisabled={mediaMeta.currentPage <= 1}
                    onPress={() => {
                      void syncQuery({
                        page: Math.max(mediaMeta.currentPage - 1, 1),
                      });
                    }}
                  />
                  <PaginationItem>
                    {`Trang ${mediaMeta.currentPage} / ${mediaMeta.lastPage}`}
                  </PaginationItem>
                  <PaginationNext
                    isDisabled={mediaMeta.currentPage >= mediaMeta.lastPage}
                    onPress={() => {
                      void syncQuery({
                        page: Math.min(
                          mediaMeta.currentPage + 1,
                          mediaMeta.lastPage,
                        ),
                      });
                    }}
                  />
                </PaginationList>
              </Pagination>
            </div>
          </div>
        </div>
      </div>

      {isUploadOpen ? (
        <ModalContent
          aria-label="Tải media lên"
          isOpen={isUploadOpen}
          onOpenChange={setIsUploadOpen}
          size="2xl"
        >
          <ModalHeader>
            <ModalTitle>{t("Tải media lên")}</ModalTitle>
            <ModalDescription>
              {t(
                "Chỉ nhận ảnh, video và âm thanh dùng trong CMS. Không dùng thư viện này cho tài liệu hoặc Excel.",
              )}
            </ModalDescription>
          </ModalHeader>

          <ModalBody>
            <Fieldset>
              <Legend>{t("Dropzone media")}</Legend>
              <Text>
                {t("Hỗ trợ")} <Code>{t("JPG")}</Code>, <Code>{t("PNG")}</Code>,{" "}
                <Code>{t("WEBP")}</Code>, <Code>{t("GIF")}</Code>, <Code>{t("MP4")}</Code>,{" "}
                <Code>{t("WEBM")}</Code>, <Code>{t("MOV")}</Code>, <Code>{t("MP3")}</Code>,{" "}
                <Code>{t("WAV")}</Code>, <Code>{t("M4A")}</Code>, <Code>{t("OGG")}</Code>.{" "}
                {t("Tối đa 20 MB mỗi tệp.")}
              </Text>

              <FieldGroup className="pb-2">
                <button
                  data-slot="control"
                  {...dropzoneRootProps}
                  type="button"
                  aria-label={t("Khu vực tải media")}
                >
                  <DropZone
                    className={twMerge(
                      "rounded-2xl border border-dashed p-6 transition-colors",
                      "bg-muted/20 hover:bg-muted/30",
                      isDragActive
                        ? "border-info-subtle-fg bg-info-subtle/35"
                        : "",
                      isDragAccept
                        ? "border-success-subtle-fg bg-success-subtle/30"
                        : "",
                      isDragReject
                        ? "border-danger-subtle-fg bg-danger-subtle/25"
                        : "",
                    )}
                  >
                    <input {...dropzoneInputProps} />

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="space-y-2">
                        <Strong className="text-fg">
                          {isDragActive
                            ? t("Thả tệp vào đây")
                            : t("Kéo thả media hoặc chọn từ máy")}
                        </Strong>
                        <Text className="text-sm text-muted-fg">
                          {t(
                            "Tải nhiều media trong một lượt để bổ sung nhanh cho thư viện.",
                          )}
                        </Text>
                      </div>

                      <Button intent="outline" onPress={open}>
                        {t("Chọn tệp")}
                      </Button>
                    </div>
                  </DropZone>
                </button>

                {uploadForm.progress ? (
                  <div data-slot="control">
                    <ProgressBar value={uploadForm.progress.percentage}>
                      <ProgressBarHeader>
                        <Text className="text-sm text-fg">Tiến độ tải lên</Text>
                        <ProgressBarValue className="text-sm text-fg" />
                      </ProgressBarHeader>
                      <ProgressBarTrack />
                    </ProgressBar>
                  </div>
                ) : null}

                <div
                  data-slot="control"
                  className="rounded-2xl border border-border bg-muted/15 px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <Strong className="text-fg">Tệp sẵn sàng tải lên</Strong>
                    <Badge intent="secondary" isCircle={false}>
                      {uploadForm.data.files.length}
                    </Badge>
                  </div>

                  <div className="mt-3 space-y-2">
                    {uploadForm.data.files.length > 0 ? (
                      uploadForm.data.files.map((file, index) => (
                        <div
                          key={`${file.name}-${file.size}-${index}`}
                          className="flex items-center justify-between gap-3 rounded-xl border border-border bg-bg px-3 py-2"
                        >
                          <div className="min-w-0 space-y-1">
                            <p className="truncate font-medium text-fg">
                              {file.name}
                            </p>
                            <Text className="text-sm text-muted-fg">
                              {formatBytes(file.size)}
                            </Text>
                          </div>

                          <Button
                            aria-label={`Bỏ ${file.name}`}
                            intent="plain"
                            size="sq-sm"
                            onPress={() => {
                              uploadForm.setData(
                                "files",
                                uploadForm.data.files.filter(
                                  (_, currentIndex) => currentIndex !== index,
                                ),
                              );
                            }}
                          >
                            <XMarkIcon />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <Text className="text-sm text-muted-fg">
                        {t("Chưa có tệp nào được chọn.")}
                      </Text>
                    )}
                  </div>
                </div>

                {clientRejections.length > 0 ? (
                  <div
                    data-slot="control"
                    className="rounded-2xl border border-danger-subtle-fg/30 bg-danger-subtle/20 px-4 py-4"
                  >
                    <Strong className="text-fg">
                      Tệp bị từ chối ở frontend
                    </Strong>
                    <div className="mt-3 space-y-2">
                      {clientRejections.map(({ errors, file }) => (
                        <div
                          key={`${file.name}-${file.lastModified}`}
                          className="space-y-1"
                        >
                          <p className="font-medium text-fg">{file.name}</p>
                          {errors.map((error) => (
                            <Text
                              key={error.code}
                              className="text-sm text-danger-subtle-fg"
                            >
                              {mapDropzoneError(error.message)}
                            </Text>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {uploadForm.errors.files ? (
                  <FieldError>{uploadForm.errors.files}</FieldError>
                ) : null}
              </FieldGroup>
            </Fieldset>
          </ModalBody>

          <ModalFooter>
            <Button intent="outline" onPress={() => setIsUploadOpen(false)}>
              Hủy
            </Button>
            <Button
              isDisabled={
                uploadForm.data.files.length === 0 || uploadForm.processing
              }
              onPress={submitUpload}
            >
              Tải lên
            </Button>
          </ModalFooter>
        </ModalContent>
      ) : null}

      {renameTargetMedia ? (
        <ModalContent
          aria-label={`Đổi tên media ${renameTargetMedia.displayName}`}
          isOpen={isRenameOpen}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              closeRenameModal();
            }
          }}
          size="lg"
        >
          <ModalHeader>
            <ModalTitle>{t("Đổi tên media")}</ModalTitle>
            <ModalDescription>
              {t("Chỉ thay đổi tên hiển thị. Đuôi tệp")}{" "}
              <Code>.{renameTargetMedia.extension}</Code>{" "}
              {t("sẽ được giữ nguyên.")}
            </ModalDescription>
          </ModalHeader>

          <ModalBody>
            <Fieldset>
              <Legend>Tên media</Legend>
              <FieldGroup>
                <TextField aria-label="Tên media">
                  <Input
                    autoFocus
                    value={renameForm.data.name}
                    onChange={(event) => {
                      renameForm.setData("name", event.target.value);
                    }}
                  />
                </TextField>
                {renameForm.errors.name ? (
                  <FieldError>{renameForm.errors.name}</FieldError>
                ) : null}
              </FieldGroup>
            </Fieldset>
          </ModalBody>

          <ModalFooter>
            <Button intent="outline" onPress={closeRenameModal}>
              Hủy
            </Button>
            <Button
              isDisabled={
                renameForm.processing || renameForm.data.name.trim() === ""
              }
              onPress={submitRename}
            >
              Lưu tên mới
            </Button>
          </ModalFooter>
        </ModalContent>
      ) : null}

      {selectedMedia ? (
        <ModalContent
          aria-label={`Xem media ${selectedMedia.displayName}`}
          className="w-screen max-w-none bg-transparent shadow-none ring-0 inset-shadow-none"
          closeButton={false}
          isOpen={selectedMedia !== null}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              closeMediaViewer();
            }
          }}
          overlay={{ className: "bg-bg/75" }}
          size="fullscreen"
        >
          <ModalBody className="h-full overflow-hidden p-0">
            <div className="grid h-full min-h-0 grid-cols-1 gap-4 p-3 lg:grid-cols-[minmax(0,1fr)_22rem] lg:p-4">
              <div className="flex min-h-0 overflow-hidden flex-col gap-4">
                <div className="flex items-center gap-4">
                  <Button
                    aria-label="Đóng trình xem media"
                    intent="plain"
                    size="sq-sm"
                    onPress={closeMediaViewer}
                  >
                    <XMarkIcon />
                  </Button>
                  <div className="flex min-w-0 items-center gap-3">
                    <MediaKindIcon
                      kind={selectedMedia.kind}
                      className="size-7"
                    />

                    <div className="min-w-0">
                      {canRenameMedia ? (
                        <button
                          type="button"
                          className="truncate text-left text-lg font-semibold text-fg transition hover:text-primary"
                          onClick={() => openRenameModal(selectedMedia.id)}
                        >
                          {selectedMedia.displayName}
                        </button>
                      ) : (
                        <p className="truncate text-lg font-semibold text-fg">
                          {selectedMedia.displayName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-border/70 bg-overlay/95 px-5 py-2 shadow-xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      aria-label="Thu nhỏ preview"
                      intent="outline"
                      size="sq-sm"
                      isDisabled={previewScale <= 0.5}
                      onPress={() => changePreviewScale(-0.25)}
                    >
                      <MinusIcon />
                    </Button>
                    <Button
                      intent="outline"
                      size="sm"
                      onPress={() => setPreviewScale(1)}
                    >
                      <MagnifyingGlassMinusIcon />
                    </Button>
                    <Button
                      aria-label="Phóng to preview"
                      intent="outline"
                      size="sq-sm"
                      isDisabled={previewScale >= 3}
                      onPress={() => changePreviewScale(0.25)}
                    >
                      <PlusIcon />
                    </Button>
                    <Button
                      intent="outline"
                      size="sm"
                      onPress={downloadSelectedMedia}
                    >
                      <ArrowDownTrayIcon />
                    </Button>
                    <Button
                      intent="outline"
                      size="sm"
                      onPress={openSelectedMedia}
                    >
                      <ArrowTopRightOnSquareIcon />
                    </Button>
                    <MediaActionsMenu
                      canDeleteMedia={canDeleteMedia}
                      canDuplicateMedia={canDuplicateMedia}
                      canRenameMedia={canRenameMedia}
                      mediaName={selectedMedia.displayName}
                      onDelete={() => requestDeleteMedia(selectedMedia.id)}
                      onDuplicate={() => duplicateMedia(selectedMedia.id)}
                      onRename={() => openRenameModal(selectedMedia.id)}
                    />
                    <div className="hidden min-w-4 flex-1 lg:block" />
                  </div>
                </div>

                <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden">
                  <div className="flex h-full min-h-0 w-full items-center justify-center overflow-hidden">
                    <MediaPreview
                      media={selectedMedia}
                      className="max-h-full max-w-full"
                      mode="viewer"
                      scale={previewScale}
                    />
                  </div>
                </div>
              </div>

              <aside className="flex min-h-0 flex-col overflow-hidden rounded-xl border border-border/70 bg-overlay/95 shadow-xl">
                <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
                  <p className="font-medium text-fg">Thông tin chi tiết</p>
                  <Badge
                    intent={getKindIntent(selectedMedia.kind)}
                    isCircle={false}
                  >
                    {getKindLabel(selectedMedia.kind)}
                  </Badge>
                </div>

                <ScrollArea orientation="vertical" className="min-h-0 flex-1">
                  <div className="space-y-6 p-5">
                    <section className="space-y-3">
                      <div className="space-y-2 rounded-2xl border border-border bg-bg px-4 py-4">
                        <MetadataRow
                          label="Tên media"
                          value={selectedMedia.displayName}
                        />
                        <MetadataRow
                          label="Loại"
                          value={getKindLabel(selectedMedia.kind)}
                        />
                        <MetadataRow
                          label="MIME type"
                          value={selectedMedia.mimeType}
                        />
                        <MetadataRow
                          label="Đuôi tệp"
                          value={selectedMedia.extension.toUpperCase()}
                        />
                        <MetadataRow
                          label="Kích thước"
                          value={formatBytes(selectedMedia.size)}
                        />
                        <MetadataRow
                          label="Bộ nhớ đã dùng"
                          value={formatBytes(selectedMedia.size)}
                        />
                        <MetadataRow
                          label="Kích thước xem"
                          value={formatPercent(previewScale)}
                        />
                        <MetadataRow
                          label="Người tải lên"
                          value={selectedMedia.uploader?.name ?? "Không rõ"}
                        />
                        <MetadataRow
                          label="Ngày tải lên"
                          value={formatDateTime(selectedMedia.uploadedAt)}
                        />
                      </div>
                    </section>

                    <section className="space-y-3">
                      <p className="font-medium text-fg">Mức độ sử dụng</p>
                      <div className="grid gap-3 rounded-2xl border border-border bg-bg p-4">
                        <UsageStat
                          label="Bài viết"
                          value={selectedMedia.usage.posts}
                        />
                        <UsageStat
                          label="Trang"
                          value={selectedMedia.usage.pages}
                        />
                        <UsageStat
                          label="Tài liệu"
                          value={selectedMedia.usage.documents}
                        />
                        <UsageStat
                          label="Hồ sơ cán bộ"
                          value={selectedMedia.usage.staffProfiles}
                        />
                      </div>
                      <Text className="text-sm text-muted-fg">
                        Tổng số nơi đang dùng media này:{" "}
                        {selectedMedia.usage.total}.
                      </Text>
                    </section>
                  </div>
                </ScrollArea>
              </aside>
            </div>
          </ModalBody>
        </ModalContent>
      ) : null}

      {deleteTargetMedia && isDeleteConfirmOpen ? (
        <ModalContent
          aria-label="Xác nhận xóa media"
          isOpen={isDeleteConfirmOpen}
          onOpenChange={(isOpen) => {
            setIsDeleteConfirmOpen(isOpen);

            if (!isOpen) {
              setDeleteTargetMediaId(null);
            }
          }}
          role="alertdialog"
          size="md"
        >
          <ModalHeader>
            <ModalTitle>Xóa media này?</ModalTitle>
            <ModalDescription>
              Hành động này sẽ xóa tệp đã lưu khỏi thư viện media. Bạn chỉ nên
              tiếp tục khi chắc chắn media này không còn cần dùng.
            </ModalDescription>
          </ModalHeader>

          <ModalBody>
            <div className="rounded-2xl border border-border bg-muted/15 px-4 py-4">
              <Text className="font-medium text-fg">
                {deleteTargetMedia.displayName}
              </Text>
              <Text className="mt-1 text-sm text-muted-fg">
                {getKindLabel(deleteTargetMedia.kind)} ·{" "}
                {formatBytes(deleteTargetMedia.size)}
              </Text>
              {deleteTargetMedia.usage.total > 0 ? (
                <Text className="mt-3 text-sm text-warning-subtle-fg">
                  {t("Media này đang được dùng ở")}{" "}
                  {deleteTargetMedia.usage.total}{" "}
                  {t("nơi nên hiện chưa thể xóa.")}
                </Text>
              ) : null}
            </div>
          </ModalBody>

          <ModalFooter>
            <Button
              intent="outline"
              onPress={() => setIsDeleteConfirmOpen(false)}
            >
              Hủy
            </Button>
            <Button
              intent="danger"
              isDisabled={deleteTargetMedia.usage.total > 0 || isDeletingMedia}
              onPress={deleteSelectedMedia}
            >
              Xác nhận xóa
            </Button>
          </ModalFooter>
        </ModalContent>
      ) : null}
    </>
  );
}

CmsMediaPage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;

function MediaFlashToast({
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

function MediaActionsMenu({
  canDeleteMedia,
  canDuplicateMedia,
  canRenameMedia,
  mediaName,
  onDelete,
  onDuplicate,
  onRename,
}: {
  canDeleteMedia: boolean;
  canDuplicateMedia: boolean;
  canRenameMedia: boolean;
  mediaName: string;
  onDelete: () => void;
  onDuplicate: () => void;
  onRename: () => void;
}) {
  if (!canDeleteMedia && !canDuplicateMedia && !canRenameMedia) {
    return null;
  }

  return (
    <Menu>
      <MenuTrigger
        aria-label={`Tác vụ cho media ${mediaName}`}
        className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-bg/95 text-muted-fg transition hover:text-fg"
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <EllipsisHorizontalIcon className="size-5" />
      </MenuTrigger>
      <MenuContent placement="bottom right">
        {canRenameMedia ? (
          <MenuItem onAction={onRename}>
            <PencilSquareIcon />
            Đổi tên
          </MenuItem>
        ) : null}
        {canDuplicateMedia ? (
          <MenuItem onAction={onDuplicate}>
            <DocumentDuplicateIcon />
            Tạo bản sao
          </MenuItem>
        ) : null}
        {canDeleteMedia ? (
          <MenuItem intent="danger" onAction={onDelete}>
            <TrashIcon />
            Xóa
          </MenuItem>
        ) : null}
      </MenuContent>
    </Menu>
  );
}

function MediaPreview({
  mode = "default",
  media,
  className,
  scale = 1,
}: {
  className?: string;
  media: CmsMediaRow;
  mode?: "compact" | "default" | "viewer";
  scale?: number;
}) {
  const isViewer = mode === "viewer";

  if (media.kind === "image") {
    return (
      <img
        alt={media.displayName}
        className={twMerge(
          isViewer
            ? "max-h-full max-w-full object-contain object-center"
            : "size-full object-cover object-center",
          className,
        )}
        src={media.previewUrl}
        style={
          isViewer
            ? { transform: `scale(${scale})`, transformOrigin: "center center" }
            : undefined
        }
      />
    );
  }

  if (media.kind === "video") {
    if (mode === "compact") {
      return (
        <div
          className={twMerge(
            "flex size-full items-center justify-center bg-muted/20",
            className,
          )}
        >
          <div className="rounded-full border border-border bg-bg p-2 text-fg">
            <VideoCameraIcon className="size-5" />
          </div>
        </div>
      );
    }

    return (
      <video
        className={twMerge(
          isViewer
            ? "max-h-full max-w-full object-contain object-center"
            : "size-full object-cover object-center",
          className,
        )}
        controls={isViewer}
        preload="metadata"
        src={media.previewUrl}
        style={
          isViewer
            ? { transform: `scale(${scale})`, transformOrigin: "center center" }
            : undefined
        }
      >
        <track kind="captions" label="Không có phụ đề" src="" srcLang="vi" />
      </video>
    );
  }

  if (mode === "compact") {
    return (
      <div
        className={twMerge(
          "flex size-full items-center justify-center bg-muted/20",
          className,
        )}
      >
        <div className="rounded-full border border-border bg-bg p-2 text-fg">
          <MusicalNoteIcon className="size-5" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={twMerge(
        "flex size-full flex-col items-center justify-center gap-3",
        className,
      )}
    >
      <div className="rounded-full border border-border bg-bg p-3 text-fg">
        <MusicalNoteIcon className="size-6" />
      </div>
      <audio
        className="w-[85%] max-w-xl"
        controls
        preload="metadata"
        src={media.previewUrl}
      >
        <track kind="captions" label="Không có phụ đề" src="" srcLang="vi" />
      </audio>
    </div>
  );
}

function MediaKindIcon({
  kind,
  className,
}: {
  className?: string;
  kind: CmsMediaRow["kind"];
}) {
  if (kind === "image") {
    return <PhotoIcon className={className} />;
  }

  if (kind === "video") {
    return <VideoCameraIcon className={className} />;
  }

  return <MusicalNoteIcon className={className} />;
}

function MetadataRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-3">
      <Text className="text-sm text-muted-fg">{label}</Text>
      <Text className="break-all text-sm text-fg">{value}</Text>
    </div>
  );
}

function UsageStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-muted/15 px-3 py-3">
      <Text className="text-sm text-muted-fg">{label}</Text>
      <p className="mt-1 text-lg font-semibold text-fg">{value}</p>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatPercent(value: number): string {
  return `${Math.round(value * 100)}%`;
}

function formatDateTime(value: string): string {
  return dateFormatter.format(new Date(value));
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getMediaBaseName(displayName: string): string {
  const extension = pathExtension(displayName);

  if (extension === "") {
    return displayName;
  }

  return displayName.slice(0, -(extension.length + 1));
}

function pathExtension(displayName: string): string {
  const segments = displayName.split(".");

  if (segments.length <= 1) {
    return "";
  }

  return segments.at(-1) ?? "";
}

function mapDropzoneError(message: string): string {
  if (message.includes("too many files")) {
    return "Chỉ cho phép tối đa 10 tệp mỗi lượt tải lên.";
  }

  if (message.includes("File is larger")) {
    return "Mỗi tệp phải nhỏ hơn hoặc bằng 20 MB.";
  }

  if (message.includes("File type must")) {
    return "Chỉ nhận ảnh, video và âm thanh đúng định dạng được hỗ trợ.";
  }

  return message;
}

const kindIntentMap = {
  audio: "secondary",
  image: "success",
  video: "info",
} as const;

const kindLabelMap = {
  audio: "Âm thanh",
  image: "Ảnh",
  video: "Video",
} as const;

function getKindIntent(kind: string): "secondary" | "success" | "info" {
  switch (kind) {
    case "audio":
      return "secondary";
    case "image":
      return "success";
    case "video":
      return "info";
    default:
      return "secondary";
  }
}

function getKindLabel(kind: string): string {
  switch (kind) {
    case "audio":
      return "Âm thanh";
    case "image":
      return "Ảnh";
    case "video":
      return "Video";
    default:
      return "Không rõ";
  }
}
