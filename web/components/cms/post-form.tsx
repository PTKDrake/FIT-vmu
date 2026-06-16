"use client";

import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { useForm, Link, router } from "@inertiajs/react";
import type { FormEvent } from "react";
import { useState } from "react";
import { MediaSelector } from "@/components/cms/media-selector";
import { StickyActionBar } from "@/components/cms/sticky-action-bar";
import { StudentGroupPicker } from "@/components/cms/student-group-picker";
import type { CmsLayoutOption } from "@/components/cms/types";
import { BlockNoteEditor } from "@/components/editor/blocknote-editor";
import { Button } from "@/components/ui/button";
import { Description, FieldError, Label } from "@/components/ui/field";
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
  MultipleSelect,
  MultipleSelectContent,
  MultipleSelectItem,
} from "@/components/ui/multiple-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { TextField } from "@/components/ui/text-field";
import { Textarea } from "@/components/ui/textarea";
import { useMountEffect } from "@/hooks/use-mount-effect";
import { useRegisterUnsavedChanges } from "@/hooks/use-unsaved-changes";
import postsRoutes from "@/routes/cms/posts";
export interface PostFormValues {
  id?: number;
  title: string;
  slug: string;
  category_ids: number[];
  visibility: "public" | "authenticated" | "students" | "student_groups";
  student_group_ids: number[];
  thumbnail_url?: string | null;
  excerpt: string;
  content: string;
  content_format: "blocknote_json" | "puck_json";
  thumbnail_id: number | null;
  status: "draft" | "pending" | "published" | "rejected";
  rejection_reason?: string | null;
  reviewed_at?: string | null;
  reviewer_name?: string | null;
  site_layout_id?: number | null;
}

interface PostFormProps {
  initialValues: PostFormValues;
  categories: Array<{
    value: string;
    label: string;
  }>;
  studentGroupOptions: Array<{
    value: string;
    label: string;
    code: string;
    scope: "global" | "private";
  }>;
  layoutOptions: CmsLayoutOption[];
  defaultPostLayoutId: number | null;
  allowGlobalGroupCreation: boolean;
  onSubmit: (data: PostFormValues, formHelper: any) => void;
  submitLabel: string;
  cancelHref: string;
  canPublish?: boolean;
}

export function PostForm({
  initialValues,
  categories,
  studentGroupOptions,
  layoutOptions,
  defaultPostLayoutId,
  allowGlobalGroupCreation,
  onSubmit,
  submitLabel,
  cancelHref,
  canPublish = false,
}: PostFormProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionError, setRejectionError] = useState("");

  const handleApprove = () => {
    if (!initialValues.id) {
      return;
    }

    setIsPublishing(true);
    router.patch(
      postsRoutes.publish.url({ post: initialValues.id }),
      {
        status: "published",
      },
      {
        onFinish: () => setIsPublishing(false),
      },
    );
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      setRejectionError("Lý do từ chối là bắt buộc.");

      return;
    }

    if (!initialValues.id) {
      return;
    }

    setIsPublishing(true);
    router.patch(
      postsRoutes.publish.url({ post: initialValues.id }),
      {
        status: "rejected",
        rejection_reason: rejectionReason,
      },
      {
        onFinish: () => {
          setIsPublishing(false);
          setShowRejectModal(false);
          setRejectionReason("");
          setRejectionError("");
        },
      },
    );
  };

  const form = useForm<PostFormValues>({
    id: initialValues.id,
    title: initialValues.title,
    slug: initialValues.slug,
    category_ids: initialValues.category_ids,
    visibility: initialValues.visibility,
    student_group_ids: initialValues.student_group_ids,
    excerpt: initialValues.excerpt,
    content: initialValues.content,
    content_format: initialValues.content_format || "blocknote_json",
    thumbnail_id: initialValues.thumbnail_id,
    status: initialValues.status,
    site_layout_id: initialValues.site_layout_id ?? null,
  });

  function triggerSubmitWithStatus(status: "draft" | "pending"): void {
    form.setData("status", status);
    setTimeout(() => {
      document.getElementById("post-form-submit-btn")?.click();
    }, 50);
  }

  useRegisterUnsavedChanges(
    {
      isDirty: form.isDirty,
      onSave: () => {
        const targetStatus = form.data.status === "draft" ? "draft" : "pending";
        triggerSubmitWithStatus(targetStatus);
      },
    },
    "post-form",
  );

  // Esc listener to exit fullscreen mode using useMountEffect
  useMountEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsFullscreen((prev) => (prev ? false : prev));
      }
    }
    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit(form.data, form);
  }

  const multipleSelectOptions = categories.map((category) => ({
    id: String(category.value),
    name: category.label,
  }));
  const selectedCategoryValues = form.data.category_ids.map((id) => String(id));

  return (
    <form
      onSubmit={handleSubmit}
      className="border border/60 rounded-2xl p-4 bg-overlay relative min-h-[85vh] flex flex-col justify-between w-full"
    >
      {/* Hidden native submit button to route form submit action */}
      <button id="post-form-submit-btn" type="submit" className="hidden" />

      {initialValues.status === "rejected" && initialValues.rejection_reason ? (
        <div className="mb-6 p-4 rounded-xl border border-danger/30 bg-danger/5 flex items-start gap-3 w-full animate-in fade-in duration-200">
          <ExclamationTriangleIcon className="size-5 text-danger shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-danger">
              Bài viết bị từ chối phê duyệt
            </h4>
            <p className="text-sm text-fg whitespace-pre-wrap mt-1">
              Lý do từ chối:{" "}
              <span className="font-medium">
                {initialValues.rejection_reason}
              </span>
            </p>
            {initialValues.reviewer_name ? (
              <p className="text-xs text-muted-fg mt-1.5">
                Người duyệt: {initialValues.reviewer_name}
                {initialValues.reviewed_at
                  ? ` vào ngày ${new Intl.DateTimeFormat("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date(initialValues.reviewed_at))}`
                  : ""}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* Main Form Content - 3 Column Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-start w-full">
        {/* Column 1 & 2: Title and BlockNote Content (2/3 width) inside a visually clear Canvas Card */}
        <div className="lg:col-span-2 flex flex-col gap-6 min-h-[70vh]">
          <div className="flex w-full">
            <TextField
              aria-label="Tiêu đề bài viết"
              isRequired
              name="title"
              value={form.data.title}
              className="flex-1"
              onChange={(value) => {
                form.setData("title", value);

                // Auto-slugify on create
                if (!initialValues.id) {
                  const slug = value
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[đĐ]/g, "d")
                    .replace(/([^0-9a-z-\s])/g, "")
                    .replace(/(\s+)/g, "-")
                    .replace(/-+/g, "-")
                    .replace(/^-+|-+$/g, "");
                  form.setData((prev) => ({
                    ...prev,
                    title: value,
                    slug,
                  }));
                }
              }}
            >
              <Textarea
                autosize
                className="text-3xl lg:text-4xl font-extrabold py-4 px-0 border-none shadow-none focus:ring-0 placeholder:text-muted-fg/60 focus:border-none focus:outline-hidden"
                maxRows={4}
                rows={2}
                placeholder="Tiêu đề bài viết..."
              />
              <FieldError>{form.errors.title}</FieldError>
            </TextField>

            {/* Action Row right above the editor with a Fullscreen Toggle Button */}
            <Button
              aria-label="Mở trình soạn thảo toàn màn hình"
              intent="plain"
              size="sm"
              onPress={() => setIsFullscreen(true)}
            >
              <ArrowsPointingOutIcon />
            </Button>
          </div>

          <div className="flex-1 min-h-[450px] flex flex-col">
            <BlockNoteEditor
              className="min-h-[450px]"
              content={form.data.content}
              onChange={(value) => {
                form.setData("content", value.isEmpty ? "" : value.json);
              }}
            />
            {form.errors.content ? (
              <FieldError className="mt-2">{form.errors.content}</FieldError>
            ) : null}
          </div>
        </div>

        {/* Column 3: Sidebar Controls (1/3 width) - styled as highly distinct card */}
        <div className="lg:col-span-1 bg-muted/20 p-8 shadow-xs space-y-4">
          {/* Slug Field */}
          <TextField
            isRequired
            name="slug"
            value={form.data.slug}
            onChange={(value) => form.setData("slug", value)}
          >
            <Label className="font-semibold text-fg text-sm">
              Đườn dẫn liên kết
            </Label>
            <Input placeholder="tieu-de-cau-chuyen" />
            <FieldError>{form.errors.slug}</FieldError>
            <Description>Đường dẫn hiển thị trên thanh địa chỉ.</Description>
          </TextField>

          <div className="space-y-2">
            <Label className="font-semibold text-fg text-sm" htmlFor="post-visibility">
              Phạm vi xem
            </Label>
            <select
              id="post-visibility"
              className="w-full rounded-xl border border-input bg-overlay px-3 py-2 text-sm text-fg shadow-xs"
              value={form.data.visibility}
              onChange={(event) =>
                form.setData("visibility", event.target.value as PostFormValues["visibility"])
              }
            >
              <option value="public">Công khai</option>
              <option value="authenticated">Cần đăng nhập</option>
              <option value="students">Mọi sinh viên</option>
              <option value="student_groups">Nhóm sinh viên</option>
            </select>
            <Description>Chọn phạm vi xem sau khi bài viết được xuất bản.</Description>
            <FieldError>{form.errors.visibility}</FieldError>
          </div>

          {form.data.visibility === "student_groups" ? (
            <StudentGroupPicker
              allowGlobalScope={allowGlobalGroupCreation}
              error={form.errors.student_group_ids}
              onChange={(groupIds) => form.setData("student_group_ids", groupIds)}
              options={studentGroupOptions}
              selectedIds={form.data.student_group_ids}
            />
          ) : null}

          <div className="space-y-2">
            <MultipleSelect
              className="space-y-2"
              placeholder="Chọn danh mục bài viết..."
              value={selectedCategoryValues}
              onChange={(keys) => {
                form.setData(
                  "category_ids",
                  keys
                    .map((key) => Number(key))
                    .filter((value) => Number.isInteger(value)),
                )
              }}
            >
              <Label className="font-semibold text-fg text-sm">
                Chuyên mục bài viết
              </Label>
              <MultipleSelectContent items={multipleSelectOptions}>
                {(item) => (
                  <MultipleSelectItem id={item.id} textValue={item.name}>
                    {item.name}
                  </MultipleSelectItem>
                )}
              </MultipleSelectContent>
              <FieldError>{form.errors.category_ids}</FieldError>
            </MultipleSelect>
          </div>

          {/* Cover Image Integrated Dropzone & Preview Block */}
          <MediaSelector
            value={form.data.thumbnail_id}
            onChange={(mediaId) => form.setData("thumbnail_id", mediaId)}
            previewUrl={initialValues.thumbnail_url}
            error={form.errors.thumbnail_id}
          />

          {/* Excerpt Field */}
          <TextField
            name="excerpt"
            value={form.data.excerpt}
            onChange={(value) => form.setData("excerpt", value)}
          >
            <Label className="font-semibold text-fg text-sm">
              Tóm tắt ngắn (Excerpt)
            </Label>
            <Textarea
              autosize
              placeholder="Nhập mô tả tóm tắt ngắn..."
              maxRows={10}
              rows={4}
            />
            <FieldError>{form.errors.excerpt}</FieldError>
          </TextField>

          {/* Layout Select */}
          <div className="space-y-2">
            <Select
              aria-label="Bố cục bài viết"
              onChange={(key) =>
                form.setData(
                  "site_layout_id",
                  key ? Number(key) : null,
                )
              }
              value={
                form.data.site_layout_id != null
                  ? String(form.data.site_layout_id)
                  : ""
              }
            >
              <Label className="font-semibold text-fg text-sm">
                Bố cục bài viết
              </Label>
              <SelectTrigger />
              <SelectContent>
                <SelectItem id="" textValue="Dùng layout mặc định">
                  <SelectLabel>Dùng layout mặc định</SelectLabel>
                </SelectItem>
                {layoutOptions.map((layout) => (
                  <SelectItem
                    key={layout.id}
                    id={String(layout.id)}
                    textValue={layout.name}
                  >
                    <SelectLabel>
                      {layout.name}
                      {layout.id === defaultPostLayoutId
                        ? " (mặc định)"
                        : ""}
                    </SelectLabel>
                  </SelectItem>
                ))}
              </SelectContent>
              {form.errors.site_layout_id ? (
                <FieldError>{form.errors.site_layout_id}</FieldError>
              ) : null}
            </Select>
            <Description>
              Chọn bố cục hiển thị cho bài viết trên trang công khai.
            </Description>
          </div>
        </div>
      </div>

      <StickyActionBar>
        <div className="flex items-center justify-between gap-3">
          <Link
            href={cancelHref}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-border bg-bg px-4 text-sm font-medium text-fg transition hover:bg-muted/40"
          >
            Hủy
          </Link>
          <div className="flex items-center gap-3">
            <Button
              intent="secondary"
              isDisabled={form.processing || isPublishing}
              onPress={() => triggerSubmitWithStatus("draft")}
            >
              Lưu nháp
            </Button>

            <Button
              intent="primary"
              isDisabled={form.processing || isPublishing}
              onPress={() => triggerSubmitWithStatus("pending")}
            >
              {initialValues.id ? "Lưu thay đổi" : "Yêu cầu duyệt"}
            </Button>

            {initialValues.id &&
            initialValues.status === "pending" &&
            canPublish ? (
              <>
                <div className="h-6 w-px bg-border mx-1" />
                <Button
                  intent="danger"
                  isDisabled={form.processing || isPublishing}
                  onPress={() => setShowRejectModal(true)}
                >
                  Từ chối duyệt
                </Button>
                <Button
                  intent="success"
                  isDisabled={form.processing || isPublishing}
                  onPress={handleApprove}
                >
                  Phê duyệt đăng
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </StickyActionBar>

      {/* Distraction-Free Fullscreen Editor Overlay */}
      {isFullscreen ? (
        <div
          id="fullscreen-editor-overlay"
          className="fixed inset-0 z-50 bg-bg/98 backdrop-blur-md overflow-y-auto flex flex-col p-8 md:p-12 animate-in fade-in zoom-in-95 duration-200"
        >
          <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col gap-6">
            {/* Distraction-Free Header Bar */}
            <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-4">
              <div className="flex items-center gap-2 text-muted-fg">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono tracking-wider uppercase">
                  Chế độ viết tập trung (Distraction-Free)
                </span>
              </div>
              <Button
                intent="outline"
                size="xs"
                className="flex items-center gap-1.5 hover:text-fg hover:border-border/80 shadow-xs"
                onPress={() => setIsFullscreen(false)}
              >
                <ArrowsPointingInIcon className="size-3.5" />
                Thoát toàn màn hình (Esc)
              </Button>
            </div>

            {/* Fullscreen Title */}
            <TextField
              isRequired
              name="title"
              value={form.data.title}
              onChange={(value) => {
                form.setData("title", value);

                if (!initialValues.id) {
                  const slug = value
                    .toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[đĐ]/g, "d")
                    .replace(/([^0-9a-z-\s])/g, "")
                    .replace(/(\s+)/g, "-")
                    .replace(/-+/g, "-")
                    .replace(/^-+|-+$/g, "");
                  form.setData((prev) => ({
                    ...prev,
                    title: value,
                    slug,
                  }));
                }
              }}
            >
              <Input
                className="text-4xl lg:text-5xl font-extrabold py-4 px-0 border-none shadow-none focus:ring-0 placeholder:text-muted-fg/30 bg-transparent focus:border-none focus:outline-hidden"
                placeholder="Tiêu đề câu chuyện của bạn..."
                autoFocus={!form.data.title}
              />
              <FieldError>{form.errors.title}</FieldError>
            </TextField>

            {/* Fullscreen BlockNote */}
            <div className="flex-1 min-h-[60vh] pt-4">
              <BlockNoteEditor
                content={form.data.content}
                onChange={(value) => {
                  form.setData("content", value.isEmpty ? "" : value.json);
                }}
              />
            </div>
          </div>
        </div>
      ) : null}

      {showRejectModal ? (
        <ModalContent
          aria-label="Xác nhận từ chối bài viết"
          isOpen={showRejectModal}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setShowRejectModal(false);
              setRejectionReason("");
              setRejectionError("");
            }
          }}
          size="lg"
        >
          <ModalHeader>
            <ModalTitle>Từ chối bài viết</ModalTitle>
            <ModalDescription>
              Bạn sắp từ chối bài viết <strong>{initialValues.title}</strong>.
              Vui lòng nhập lý do từ chối để tác giả có thể chỉnh sửa lại.
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-fg">
                  Lý do từ chối <span className="text-danger">*</span>
                </label>
                <Textarea
                  autosize
                  className="min-h-24 rounded-lg border border-border bg-transparent p-3 focus:ring-2 focus:ring-primary"
                  maxRows={12}
                  placeholder="Ví dụ: Nội dung chưa phù hợp, thiếu hình ảnh minh họa..."
                  rows={4}
                  value={rejectionReason}
                  onChange={(e) => {
                    setRejectionReason(e.target.value);

                    if (e.target.value.trim()) {
                      setRejectionError("");
                    }
                  }}
                />
                {rejectionError ? (
                  <p className="text-xs text-danger">{rejectionError}</p>
                ) : null}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              intent="outline"
              onPress={() => {
                setShowRejectModal(false);
                setRejectionReason("");
                setRejectionError("");
              }}
            >
              Hủy
            </Button>
            <Button
              intent="danger"
              isDisabled={isPublishing}
              onPress={handleReject}
            >
              Xác nhận từ chối
            </Button>
          </ModalFooter>
        </ModalContent>
      ) : null}
    </form>
  );
}
