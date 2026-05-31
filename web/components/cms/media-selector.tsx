"use client";

import {
  PhotoIcon,
  ArrowUpTrayIcon,
  TrashIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label, Description, FieldError } from "@/components/ui/field";
import { t } from "@/lib/i18n";
import {
  ModalContent,
  ModalBody,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "@/components/ui/modal";
import {
  Pagination,
  PaginationList,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationGap,
} from "@/components/ui/pagination";
import { SearchField, SearchInput } from "@/components/ui/search-field";
import cmsRoutes from "@/routes/cms";

interface MediaSelectorProps {
  value: number | null;
  onChange: (mediaId: number | null) => void;
  previewUrl?: string | null;
  displayName?: string | null;
  label?: string;
  description?: string;
  error?: string;
}

interface MediaItem {
  id: number;
  displayName: string;
  previewUrl: string;
  mimeType: string;
}

export function MediaSelector({
  value,
  onChange,
  previewUrl: initialPreviewUrl,
  displayName: initialDisplayName,
  label = "Ảnh đại diện bài viết",
  description = "Nhấp để chọn từ thư viện hoặc kéo thả ảnh vào để tải lên ảnh mới.",
  error,
}: MediaSelectorProps) {
  const [uploading, setUploading] = useState(false);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(
    initialPreviewUrl ?? null,
  );
  const [localDisplayName, setLocalDisplayName] = useState<string | null>(
    initialDisplayName ?? null,
  );

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"library" | "upload">("library");

  // Media Library State
  const [libraryItems, setLibraryItems] = useState<MediaItem[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);

  // Synchronize local preview if value is cleared
  if (value === null && localPreviewUrl !== null) {
    setLocalPreviewUrl(null);
    setLocalDisplayName(null);
  }

  // Load existing media items from library
  async function loadLibrary(
    search: string = "",
    pageNumber: number = 1,
  ): Promise<void> {
    setLoadingLibrary(true);
    setCurrentPage(pageNumber);

    try {
      const url = new URL(cmsRoutes.media.url(), window.location.origin);
      url.searchParams.set("type", "image");
      url.searchParams.set("perPage", "24");
      url.searchParams.set("page", String(pageNumber));

      if (search) {
        url.searchParams.set("search", search);
      }

      const response = await fetch(url.toString(), {
        credentials: "same-origin",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        toast.error("Không thể tải danh sách ảnh từ thư viện.");
        setLoadingLibrary(false);

        return;
      }

      const data = await response.json();
      // Extract paginated items from Inertia response props.media.data
      const rawItems = data.props?.media?.data ?? data.media?.data ?? [];
      const meta = data.props?.media?.meta ?? data.media?.meta ?? null;

      const formattedItems = rawItems.map((item: any) => ({
        id: item.id,
        displayName: item.displayName || item.display_name || "Chưa đặt tên",
        previewUrl:
          item.previewUrl || item.preview_url || `/storage/media/${item.id}`,
        mimeType: item.mimeType || item.mime_type || "image/jpeg",
      }));

      setLibraryItems(formattedItems);

      if (meta) {
        setLastPage(meta.lastPage || 1);
      }

      setLoadingLibrary(false);
    } catch (err: any) {
      console.error(err);
      toast.error("Không thể tải danh sách ảnh từ thư viện.");
      setLoadingLibrary(false);
    }
  }

  async function handleUpload(files: File[]): Promise<void> {
    if (files.length === 0) {
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("files[]", files[0]);

    try {
      const response = await fetch(cmsRoutes.media.store.url(), {
        method: "POST",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Accept: "application/json",
        },
        body: formData,
      });

      if (!response.ok) {
        toast.error("Không thể tải tập tin lên máy chủ.");
        setUploading(false);

        return;
      }

      const data = await response.json();

      if (data.success && data.media && data.media.length > 0) {
        const uploadedMedia = data.media[0];
        onChange(uploadedMedia.id);
        setLocalPreviewUrl(uploadedMedia.preview_url);
        setLocalDisplayName(uploadedMedia.display_name);
        toast.success("Đã tải lên và áp dụng ảnh thành công.");
        setIsModalOpen(false);
        setUploading(false);

        return;
      }

      toast.error("Định dạng phản hồi không hợp lệ.");
      setUploading(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Tải lên thất bại. Vui lòng thử lại.");
      setUploading(false);
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/gif": [".gif"],
    },
    maxFiles: 1,
    onDrop: handleUpload,
  });

  const dropzoneRootProps = getRootProps();
  const dropzoneInputProps = getInputProps() as any;

  const handleRemove = () => {
    onChange(null);
    setLocalPreviewUrl(null);
    setLocalDisplayName(null);
    setIsModalOpen(false);
    toast.info("Đã gỡ bỏ ảnh đại diện.");
  };

  const handleSelectFromLibrary = (item: MediaItem) => {
    onChange(item.id);
    setLocalPreviewUrl(item.previewUrl);
    setLocalDisplayName(item.displayName);
    setIsModalOpen(false);
    toast.success("Đã chọn ảnh đại diện từ thư viện.");
  };

  const handleCardClick = () => {
    setActiveTab("library");
    void loadLibrary(searchQuery, 1);
    setIsModalOpen(true);
  };

  const currentPreview =
    localPreviewUrl || (value ? `/storage/media/${value}` : null);

  const getCleanDisplayName = (
    url: string | null,
    name: string | null,
  ): string => {
    if (name) {
      return name;
    }

    if (!url) {
      return "Chưa chọn ảnh";
    }

    const filename = url.split("/").pop() || "";

    // If the filename is just a number (which is the ID), do not display it as a number
    if (/^\d+$/.test(filename)) {
      return "Ảnh đại diện";
    }

    return decodeURIComponent(filename);
  };

  const buildPaginationPages = (
    currentPageNum: number,
    lastPageNum: number,
  ) => {
    const pages: { type: "page" | "gap"; page: number }[] = [];
    const range = 1;

    pages.push({ type: "page", page: 1 });

    if (currentPageNum - range > 2) {
      pages.push({ type: "gap", page: 0 });
    }

    for (
      let i = Math.max(2, currentPageNum - range);
      i <= Math.min(lastPageNum - 1, currentPageNum + range);
      i++
    ) {
      pages.push({ type: "page", page: i });
    }

    if (currentPageNum + range < lastPageNum - 1) {
      pages.push({ type: "gap", page: 0 });
    }

    if (lastPageNum > 1) {
      pages.push({ type: "page", page: lastPageNum });
    }

    return pages;
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <Label className="font-semibold text-fg text-sm">{label}</Label>
      </div>

      {currentPreview ? (
        <div className="group relative w-full overflow-hidden rounded-xl border border-border bg-muted/10 p-3 shadow-xs transition duration-200 hover:border-muted-fg/35 hover:shadow-sm">
          {/* Clickable Image Preview Container */}
          <button
            type="button"
            onClick={handleCardClick}
            className="relative p-0 block w-full aspect-video overflow-hidden rounded-lg bg-black/5 cursor-pointer border-0"
            aria-label="Chọn ảnh khác"
          >
            <img
              src={currentPreview}
              alt="Uploaded preview"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-102"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80";
              }}
            />
            {/* Hover Actions Hint Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <span className="rounded-lg bg-bg/95 px-3 py-1.5 text-xs font-semibold text-fg shadow-md backdrop-blur-xs">
                {t("Chọn ảnh khác")}
              </span>
            </div>
          </button>

          {/* Underneath: display-name & trash icon */}
          <div className="flex items-center justify-between gap-4 pt-2">
            <div className="flex-1 min-w-0">
              <p
                className="text-xs font-medium text-muted-fg truncate"
                title={getCleanDisplayName(currentPreview, localDisplayName)}
              >
                {getCleanDisplayName(currentPreview, localDisplayName)}
              </p>
            </div>
            <Button
              intent="danger"
              size="xs"
              className="shrink-0 flex items-center justify-center size-8 p-0! rounded-lg cursor-pointer transition duration-150 active:scale-95"
              onPress={() => setIsConfirmOpen(true)}
              aria-label="Xóa ảnh"
            >
              <TrashIcon className="size-4" />
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleCardClick}
          className="w-full text-left p-0 block relative overflow-hidden rounded-xl border border-dashed border-border bg-muted/5 transition duration-200 hover:border-muted-fg/40 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-primary/20"
        >
          <div className="flex flex-col items-center justify-center p-8 text-center hover:bg-muted/10 transition">
            <div className="mx-auto flex size-10 items-center justify-center rounded-lg bg-muted/40 border border-border/80 transition">
              <PhotoIcon className="size-5 text-muted-fg" />
            </div>
            <div className="space-y-1 mt-3">
              <p className="text-sm font-medium text-fg">
                {t("Chọn ảnh đại diện bài viết")}
              </p>
              <p className="text-xs text-muted-fg">
                {t("Nhấp để mở thư viện ảnh hoặc tải lên tệp mới")}
              </p>
            </div>
          </div>
        </button>
      )}

      {error && <FieldError className="text-xs">{error}</FieldError>}

      {/* Main Interactive Media Picker Modal */}
      <ModalContent
        aria-label="Quản lý và chọn ảnh đại diện"
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        size="4xl"
      >
        {({ close }) => (
          <>
            <ModalHeader>
              <ModalTitle>Quản lý & Chọn ảnh đại diện</ModalTitle>
            </ModalHeader>
            <ModalBody className="space-y-6">
              {/* Tab Navigation */}
              <div className="flex border-b border-border/60">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("library");
                    void loadLibrary(searchQuery, 1);
                  }}
                  className={`px-4 py-2 text-sm font-semibold border-b-2 transition cursor-pointer ${
                    activeTab === "library"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-fg hover:text-fg"
                  }`}
                >
                  {t("Thư viện ảnh")}
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("upload")}
                  className={`px-4 py-2 text-sm font-semibold border-b-2 transition cursor-pointer ${
                    activeTab === "upload"
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-fg hover:text-fg"
                  }`}
                >
                  Tải ảnh mới lên
                </button>
              </div>

              {/* TAB CONTENT 1: Media Library Grid */}
              {activeTab === "library" && (
                <div className="space-y-4">
                  {/* Search Bar */}
                  <div className="flex gap-2 items-center">
                    <SearchField
                      value={searchQuery}
                      onChange={setSearchQuery}
                      className="flex-1"
                      aria-label="Tìm kiếm ảnh theo tên..."
                    >
                      <SearchInput
                        placeholder="Tìm kiếm ảnh theo tên..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            void loadLibrary(searchQuery, 1);
                          }
                        }}
                      />
                    </SearchField>
                    <Button
                      intent="outline"
                      size="sm"
                      className="h-9 shrink-0"
                      onPress={() => void loadLibrary(searchQuery, 1)}
                    >
                      Tìm kiếm
                    </Button>
                  </div>

                  {/* Grid Area */}
                  {loadingLibrary ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="aspect-square rounded-lg bg-muted/30 animate-pulse border border-border/40"
                        />
                      ))}
                    </div>
                  ) : libraryItems.length === 0 ? (
                    <div className="text-center py-12 space-y-3">
                      <PhotoIcon className="size-12 text-muted-fg/40 mx-auto" />
                      <p className="text-sm font-semibold text-fg">
                        {t("Không tìm thấy hình ảnh nào")}
                      </p>
                      <p className="text-xs text-muted-fg">
                        {t("Thư viện trống hoặc từ khóa tìm kiếm không khớp.")}
                      </p>
                      <Button
                        intent="outline"
                        size="xs"
                        onPress={() => setActiveTab("upload")}
                      >
                        Tải ảnh mới lên ngay
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-h-[350px] overflow-y-auto pr-1">
                        {libraryItems.map((item) => {
                          const isCurrent = value === item.id;

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handleSelectFromLibrary(item)}
                              className={`group aspect-square rounded-lg border overflow-hidden bg-muted/10 transition cursor-pointer relative text-left p-0 ${
                                isCurrent
                                  ? "border-primary ring-2 ring-primary/20"
                                  : "border-border hover:border-muted-fg/40"
                              }`}
                            >
                              <img
                                src={item.previewUrl}
                                alt={item.displayName}
                                className="w-full h-full object-cover group-hover:scale-103 transition duration-200"
                                loading="lazy"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=600&q=80";
                                }}
                              />
                              <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-xs p-1.5 text-[10px] text-white truncate text-center transition-opacity duration-200">
                                {item.displayName}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Pagination Area */}
                      {lastPage > 1 && (
                        <div className="flex justify-center border-t border-border/60 pt-4">
                          <Pagination>
                            <PaginationList aria-label="Điều hướng phân trang">
                              <PaginationPrevious
                                onPress={() => {
                                  if (currentPage > 1) {
                                    void loadLibrary(
                                      searchQuery,
                                      currentPage - 1,
                                    );
                                  }
                                }}
                                className={
                                  currentPage === 1
                                    ? "pointer-events-none opacity-50"
                                    : "cursor-pointer"
                                }
                              />
                              {buildPaginationPages(currentPage, lastPage).map(
                                (item, index) =>
                                  item.type === "page" ? (
                                    <PaginationItem
                                      key={index}
                                      isCurrent={item.page === currentPage}
                                      onPress={() =>
                                        void loadLibrary(searchQuery, item.page)
                                      }
                                      className="cursor-pointer"
                                    >
                                      {item.page}
                                    </PaginationItem>
                                  ) : (
                                    <PaginationGap key={index} />
                                  ),
                              )}
                              <PaginationNext
                                onPress={() => {
                                  if (currentPage < lastPage) {
                                    void loadLibrary(
                                      searchQuery,
                                      currentPage + 1,
                                    );
                                  }
                                }}
                                className={
                                  currentPage === lastPage
                                    ? "pointer-events-none opacity-50"
                                    : "cursor-pointer"
                                }
                              />
                            </PaginationList>
                          </Pagination>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* TAB CONTENT 2: Upload Files Dropzone */}
              {activeTab === "upload" && (
                <div
                  ref={dropzoneRootProps.ref}
                  role={dropzoneRootProps.role}
                  tabIndex={dropzoneRootProps.tabIndex}
                  onClick={dropzoneRootProps.onClick}
                  onKeyDown={dropzoneRootProps.onKeyDown}
                  onFocus={dropzoneRootProps.onFocus}
                  onBlur={dropzoneRootProps.onBlur}
                  onDragEnter={dropzoneRootProps.onDragEnter}
                  onDragLeave={dropzoneRootProps.onDragLeave}
                  onDragOver={dropzoneRootProps.onDragOver}
                  onDrop={dropzoneRootProps.onDrop}
                  className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl cursor-pointer transition ${
                    isDragActive
                      ? "bg-primary/5 border-primary"
                      : "border-border hover:bg-muted/5 hover:border-muted-fg/40"
                  }`}
                >
                  <input
                    ref={dropzoneInputProps.ref}
                    type={dropzoneInputProps.type}
                    multiple={dropzoneInputProps.multiple}
                    accept={dropzoneInputProps.accept}
                    autoComplete={dropzoneInputProps.autoComplete}
                    style={dropzoneInputProps.style}
                    onChange={dropzoneInputProps.onChange}
                    onClick={dropzoneInputProps.onClick}
                  />
                  {uploading ? (
                    <div className="space-y-3 py-4 flex flex-col items-center text-center">
                      <ArrowPathIcon className="size-10 text-primary animate-spin" />
                      <p className="text-sm font-semibold text-fg">
                        Đang tải tệp tin lên máy chủ...
                      </p>
                      <span className="text-xs text-muted-fg">
                        Hình ảnh sẽ tự động được chọn sau khi tải lên thành công
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-4 text-center">
                      <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-muted/40 border border-border/80 transition">
                        <ArrowUpTrayIcon className="size-6 text-muted-fg" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-fg">
                          {isDragActive
                            ? "Thả ảnh vào đây..."
                            : "Tải ảnh từ máy tính của bạn"}
                        </p>
                        <p className="text-xs text-muted-fg">
                          Kéo thả ảnh vào đây, hoặc click để duyệt tìm tệp tin
                          (JPG, PNG, WEBP, GIF dưới 20MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ModalBody>
            <ModalFooter className="flex justify-end items-center">
              <Button intent="outline" size="sm" onPress={close}>
                Đóng
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>

      {/* Confirmation Dialog */}
      <ModalContent
        aria-label="Xác nhận xóa ảnh đại diện"
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        role="alertdialog"
        size="sm"
      >
        {({ close }) => (
          <>
            <ModalHeader>
              <ModalTitle>Xác nhận xóa ảnh đại diện</ModalTitle>
              <ModalDescription>
                Bạn có chắc chắn muốn gỡ bỏ ảnh đại diện hiện tại không? Hành
                động này không thể hoàn tác.
              </ModalDescription>
            </ModalHeader>
            <ModalFooter className="flex gap-2 justify-end">
              <Button intent="outline" size="sm" onPress={close}>
                Hủy bỏ
              </Button>
              <Button
                intent="danger"
                size="sm"
                onPress={() => {
                  handleRemove();
                  close();
                }}
              >
                Xác nhận xóa
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </div>
  );
}
