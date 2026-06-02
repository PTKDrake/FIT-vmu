import { useForm } from "@inertiajs/react";
import type { FormEvent } from "react";
import updatePageMetadata from "@/actions/App/Http/Controllers/Cms/UpdatePageMetadataController";
import { Button } from "@/components/ui/button";
import { FieldError, FieldGroup, Label } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import {
  createDefaultPuckPageData,
  serializePuckPageData,
} from "@/lib/puck/page-builder-data";
import { store as storePage } from "@/routes/cms/pages";

const defaultPageJson = serializePuckPageData(createDefaultPuckPageData());

export interface PageFormValues {
  excerpt: string;
  id?: number;
  seo_description: string;
  seo_title: string;
  slug: string;
  title: string;
}

interface PageFormDialogProps {
  initialValues: PageFormValues;
  isOpen: boolean;
  mode: "create" | "edit";
  onOpenChange: (isOpen: boolean) => void;
}

export function PageFormDialog({
  initialValues,
  isOpen,
  mode,
  onOpenChange,
}: PageFormDialogProps) {
  const form = useForm({
    content: defaultPageJson,
    content_format: "puck_json" as const,
    excerpt: initialValues.excerpt,
    seo_description: initialValues.seo_description,
    seo_title: initialValues.seo_title,
    slug: initialValues.slug,
    status: "draft" as const,
    title: initialValues.title,
  });

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (mode === "create") {
      form.post(storePage.url(), {
        onSuccess: () => onOpenChange(false),
      });

      return;
    }

    form.patch(updatePageMetadata.url({ page: initialValues.id ?? 0 }), {
      onSuccess: () => onOpenChange(false),
      preserveScroll: true,
    });
  }

  if (!isOpen) {
    return null;
  }

  return (
    <ModalContent
      aria-label={mode === "create" ? "Tạo trang mới" : "Chỉnh sửa trang"}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="2xl"
    >
      <form onSubmit={submit}>
        <ModalHeader>
          <ModalTitle>
            {mode === "create" ? "Tạo trang mới" : "Chỉnh sửa URL và SEO"}
          </ModalTitle>
          <ModalDescription>
            {mode === "create"
              ? "Khởi tạo thông tin trang trước, sau đó chuyển sang trình dựng nội dung Puck."
              : "Cập nhật tiêu đề, đường dẫn và metadata SEO của trang."}
          </ModalDescription>
        </ModalHeader>

        <ModalBody>
          <FieldGroup className="space-y-4 pb-2">
            <div className="space-y-2">
              <Label htmlFor="page-title">Tiêu đề trang</Label>
              <Input
                id="page-title"
                name="title"
                value={form.data.title}
                onChange={(event) => form.setData("title", event.target.value)}
              />
              {form.errors.title ? (
                <FieldError>{form.errors.title}</FieldError>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="page-slug">Đường dẫn</Label>
              <Input
                id="page-slug"
                name="slug"
                value={form.data.slug}
                onChange={(event) => form.setData("slug", event.target.value)}
              />
              {form.errors.slug ? (
                <FieldError>{form.errors.slug}</FieldError>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="page-excerpt">Mô tả ngắn</Label>
              <Textarea
                autosize
                id="page-excerpt"
                name="excerpt"
                rows={3}
                value={form.data.excerpt}
                onChange={(event) =>
                  form.setData("excerpt", event.target.value)
                }
              />
              {form.errors.excerpt ? (
                <FieldError>{form.errors.excerpt}</FieldError>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="page-seo-title">SEO title</Label>
              <Input
                id="page-seo-title"
                name="seo_title"
                value={form.data.seo_title}
                onChange={(event) =>
                  form.setData("seo_title", event.target.value)
                }
              />
              {form.errors.seo_title ? (
                <FieldError>{form.errors.seo_title}</FieldError>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="page-seo-description">SEO description</Label>
              <Textarea
                autosize
                id="page-seo-description"
                name="seo_description"
                maxRows={10}
                rows={4}
                value={form.data.seo_description}
                onChange={(event) =>
                  form.setData("seo_description", event.target.value)
                }
              />
              {form.errors.seo_description ? (
                <FieldError>{form.errors.seo_description}</FieldError>
              ) : null}
            </div>
          </FieldGroup>
        </ModalBody>

        <ModalFooter>
          <Button
            intent="outline"
            onPress={() => onOpenChange(false)}
            type="button"
          >
            Hủy
          </Button>
          <Button isDisabled={form.processing} type="submit">
            {mode === "create" ? "Tạo và mở builder" : "Lưu thay đổi"}
          </Button>
        </ModalFooter>
      </form>
    </ModalContent>
  );
}
