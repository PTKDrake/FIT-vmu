"use client";

import {
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from "@heroicons/react/24/outline";
import { useForm, Link } from "@inertiajs/react";
import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { MediaSelector } from "@/components/cms/media-selector";
import { StickyActionBar } from "@/components/cms/sticky-action-bar";
import { BlockNoteEditor } from "@/components/editor/blocknote-editor";
import { Button } from "@/components/ui/button";
import { Description, FieldError, Label } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  MultipleSelect,
  MultipleSelectContent,
  MultipleSelectItem,
} from "@/components/ui/multiple-select";
import { TextField } from "@/components/ui/text-field";
import { Textarea } from "@/components/ui/textarea";
import { useMountEffect } from "@/hooks/use-mount-effect";
import { useRegisterUnsavedChanges } from "@/hooks/use-unsaved-changes";
export interface PostFormValues {
  id?: number;
  title: string;
  slug: string;
  category_ids: number[];
  thumbnail_url?: string | null;
  excerpt: string;
  content: string;
  content_format: "blocknote_json";
  thumbnail_id: number | null;
  status: "draft" | "pending" | "published";
}

interface PostFormProps {
  initialValues: PostFormValues;
  categories: Array<{
    value: string;
    label: string;
  }>;
  onSubmit: (data: PostFormValues, formHelper: any) => void;
  submitLabel: string;
  cancelHref: string;
  canPublish?: boolean;
}

export function PostForm({
  initialValues,
  categories,
  onSubmit,
  submitLabel,
  cancelHref,
  canPublish = false,
}: PostFormProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const form = useForm<PostFormValues>({
    id: initialValues.id,
    title: initialValues.title,
    slug: initialValues.slug,
    category_ids: initialValues.category_ids,
    excerpt: initialValues.excerpt,
    content: initialValues.content,
    content_format: "blocknote_json",
    thumbnail_id: initialValues.thumbnail_id,
    status: initialValues.status,
  });

  function triggerSubmitWithStatus(
    status: "draft" | "pending" | "published",
  ): void {
    form.setData("status", status);
    setTimeout(() => {
      document.getElementById("post-form-submit-btn")?.click();
    }, 50);
  }

  useRegisterUnsavedChanges(
    {
      isDirty: form.isDirty,
      onSave: () => {
        triggerSubmitWithStatus(form.data.status);
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

  const multipleSelectOptions = useMemo(
    () =>
      categories.map((category) => ({
        id: String(category.value),
        name: category.label,
      })),
    [categories],
  );
  const selectedCategoryValues = useMemo(
    () => form.data.category_ids.map((id) => String(id)),
    [form.data.category_ids],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="border border/60 rounded-2xl p-4 bg-overlay relative min-h-[85vh] flex flex-col justify-between w-full"
    >
      {/* Hidden native submit button to route form submit action */}
      <button id="post-form-submit-btn" type="submit" className="hidden" />

      {/* Main Form Content - 3 Column Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 items-start w-full">
        {/* Column 1 & 2: Title and BlockNote Content (2/3 width) inside a visually clear Canvas Card */}
        <div className="lg:col-span-2 space-y-6 flex flex-col min-h-[70vh]">
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
                className="text-3xl lg:text-4xl font-extrabold py-4 px-0 border-none shadow-none focus:ring-0 placeholder:text-muted-fg/60 focus:border-none focus:outline-hidden"
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
                );
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
            <Textarea placeholder="Nhập mô tả tóm tắt ngắn..." rows={4} />
            <FieldError>{form.errors.excerpt}</FieldError>
          </TextField>
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
              isDisabled={form.processing}
              onPress={() => triggerSubmitWithStatus("draft")}
            >
              Lưu nháp
            </Button>

            {canPublish ? (
              <Button
                intent="primary"
                isDisabled={form.processing}
                onPress={() => triggerSubmitWithStatus("published")}
              >
                {submitLabel}
              </Button>
            ) : (
              <Button
                intent="primary"
                isDisabled={form.processing}
                onPress={() => triggerSubmitWithStatus("pending")}
              >
                Yêu cầu duyệt
              </Button>
            )}
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
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
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
    </form>
  );
}
