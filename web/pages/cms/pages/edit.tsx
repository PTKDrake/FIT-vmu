import { ArrowLeftIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { StudentGroupPicker } from "@/components/cms/student-group-picker";
import type { CmsPageEditorPageProps } from "@/components/cms/types";
import { Button } from "@/components/ui/button";
import {
  FieldError,
  FieldGroup,
  Fieldset,
  Legend,
  Label,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import CmsLayout from "@/layouts/cms-layout";
import { hasPermission } from "@/lib/authorization";
import { pages } from "@/routes/cms";
import pageRoutes, { builder } from "@/routes/cms/pages";
import type { SharedData } from "@/types/shared";

function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // replace spaces with -
    .replace(/[đĐ]/g, "d") // replace Vietnamese d/D
    .replace(/[^\w-]+/g, "") // remove all non-word chars
    .replace(/--+/g, "-"); // replace multiple - with single -
}

export default function EditPage({
  defaultPageLayoutId,
  layoutOptions,
  page,
  studentGroupOptions,
}: CmsPageEditorPageProps) {
  const { auth } = usePage<SharedData>().props;
  const canCreateGlobalGroup = hasPermission(
    auth.permissions,
    "manage shared student groups",
  );
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(!!page.slug);

  const form = useForm({
    title: page.title || "",
    slug: page.slug || "",
    excerpt: page.excerpt || "",
    seo_title: page.seoTitle || "",
    seo_description: page.seoDescription || "",
    visibility: page.visibility,
    student_group_ids: page.studentGroupIds,
    site_layout_id: page.siteLayoutId?.toString() ?? "",
  });

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    form.patch(pageRoutes.metadata.update.url({ page: page.id }), {
      preserveScroll: true,
    });
  }

  return (
    <>
      <Head title={`Chỉnh sửa trang - ${page.title}`} />

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <form onSubmit={submit}>
          <Fieldset className="rounded-2xl border border-border bg-overlay px-5 py-5 space-y-6">
            <div>
              <Legend>Chỉnh sửa thông tin trang</Legend>
              <Text className="text-muted-fg mt-1">
                Cập nhật tiêu đề, đường dẫn hiển thị, thông tin tóm tắt và tối
                ưu hóa SEO cho trang.
              </Text>
            </div>

            {/* Visual Builder Entry Block - Extremely Sleek and Premium */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-5 relative overflow-hidden group">
              <div className="absolute right-0 bottom-0 translate-x-1/6 translate-y-1/6 opacity-5 group-hover:scale-105 transition duration-300 pointer-events-none">
                <Squares2X2Icon className="size-36 text-primary" />
              </div>
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="inline-block size-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <h3 className="text-sm font-bold text-fg">
                      Trình dựng nội dung trực quan (trình dựng trang)
                    </h3>
                  </div>
                  <p className="text-xs text-muted-fg leading-relaxed">
                    Trang của bạn đã sẵn sàng! Nhấp vào nút bên cạnh để mở trình
                    kéo thả trực quan Puck, bắt đầu thiết kế giao diện, bố cục
                    khối, nội dung và hình ảnh.
                  </p>
                </div>
                <Button
                  className="shrink-0 flex items-center gap-2"
                  intent="primary"
                  onPress={() => router.visit(builder({ page: page.id }))}
                >
                  <Squares2X2Icon className="size-4" />
                  Mở trình dựng Puck
                </Button>
              </div>
            </div>

            <FieldGroup className="space-y-6">
              {/* Form Grid */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Left Side: Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-fg/80 border-b border-border pb-1">
                    Thông tin cơ bản
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="page-title">Tiêu đề trang</Label>
                    <Input
                      id="page-title"
                      name="title"
                      placeholder="Nhập tiêu đề trang..."
                      value={form.data.title}
                      onChange={(event) => {
                        const title = event.target.value;

                        form.setData("title", title);

                        if (!isSlugManuallyEdited) {
                          form.setData("slug", slugify(title));
                        }
                      }}
                    />
                    {form.errors.title ? (
                      <FieldError>{form.errors.title}</FieldError>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="page-slug">Đường dẫn (Slug)</Label>
                    <Input
                      id="page-slug"
                      name="slug"
                      placeholder="duong-dan-trang"
                      value={form.data.slug}
                      onChange={(event) => {
                        setIsSlugManuallyEdited(true);
                        form.setData("slug", event.target.value);
                      }}
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
                      placeholder="Mô tả tóm tắt nội dung trang..."
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

                  <Select
                    aria-label="Bố cục trang"
                    onChange={(key) =>
                      form.setData("site_layout_id", key ? String(key) : "")
                    }
                    value={form.data.site_layout_id || null}
                  >
                    <Label>Bố cục trang</Label>
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
                            {layout.id === defaultPageLayoutId
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

                  <Select
                    aria-label="Phạm vi xem"
                    onChange={(key) =>
                      form.setData(
                        "visibility",
                        String(key) as typeof form.data.visibility,
                      )
                    }
                    value={form.data.visibility}
                  >
                    <Label>Phạm vi xem</Label>
                    <SelectTrigger />
                    <SelectContent>
                      <SelectItem id="public" textValue="Công khai">
                        <SelectLabel>Công khai</SelectLabel>
                      </SelectItem>
                      <SelectItem id="authenticated" textValue="Cần đăng nhập">
                        <SelectLabel>Cần đăng nhập</SelectLabel>
                      </SelectItem>
                      <SelectItem id="students" textValue="Mọi sinh viên">
                        <SelectLabel>Mọi sinh viên</SelectLabel>
                      </SelectItem>
                      <SelectItem
                        id="student_groups"
                        textValue="Nhóm sinh viên"
                      >
                        <SelectLabel>Nhóm sinh viên</SelectLabel>
                      </SelectItem>
                      <SelectItem
                        id="hidden"
                        textValue="Ẩn (chỉ quản trị viên có thể xem)"
                      >
                        <SelectLabel>
                          Ẩn (chỉ quản trị viên có thể xem)
                        </SelectLabel>
                      </SelectItem>
                    </SelectContent>
                    {form.errors.visibility ? (
                      <FieldError>{form.errors.visibility}</FieldError>
                    ) : null}
                  </Select>

                  {form.data.visibility === "student_groups" ? (
                    <StudentGroupPicker
                      allowGlobalScope={canCreateGlobalGroup}
                      error={form.errors.student_group_ids}
                      onChange={(groupIds) =>
                        form.setData("student_group_ids", groupIds)
                      }
                      options={studentGroupOptions}
                      selectedIds={form.data.student_group_ids}
                    />
                  ) : null}
                </div>

                {/* Right Side: SEO Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-fg/80 border-b border-border pb-1">
                    Cấu hình SEO
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="page-seo-title">Tiêu đề SEO</Label>
                    <Input
                      id="page-seo-title"
                      name="seo_title"
                      placeholder="Tiêu đề hiển thị trên công cụ tìm kiếm..."
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
                    <Label htmlFor="page-seo-description">Mô tả SEO</Label>
                    <Textarea
                      autosize
                      id="page-seo-description"
                      name="seo_description"
                      maxRows={12}
                      placeholder="Mô tả hiển thị trên trang tìm kiếm Google..."
                      rows={6}
                      value={form.data.seo_description}
                      onChange={(event) =>
                        form.setData("seo_description", event.target.value)
                      }
                    />
                    {form.errors.seo_description ? (
                      <FieldError>{form.errors.seo_description}</FieldError>
                    ) : null}
                  </div>
                </div>
              </div>
            </FieldGroup>

            {/* Form Footer Actions */}
            <div className="flex items-center justify-end gap-3 border-t border-border pt-5">
              <Link
                href={pages.url()}
                className="inline-flex min-h-10 items-center justify-center rounded-lg border border-border bg-bg px-4 text-sm font-medium text-fg transition hover:bg-muted/40"
              >
                Hủy
              </Link>
              <Button isDisabled={form.processing} type="submit">
                {form.processing ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          </Fieldset>
        </form>
      </div>
    </>
  );
}

EditPage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;
