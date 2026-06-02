import {
  AcademicCapIcon,
  BookOpenIcon,
  DocumentIcon,
  DocumentTextIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import { Head, useForm, Link } from "@inertiajs/react";
import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import type { Selection } from "react-aria-components";
import type { CmsPageCreatePageProps } from "@/components/cms/types";
import { Button } from "@/components/ui/button";
import {
  ChoiceBox,
  ChoiceBoxItem,
  ChoiceBoxLabel,
  ChoiceBoxDescription,
} from "@/components/ui/choice-box";
import {
  FieldError,
  FieldGroup,
  Fieldset,
  Legend,
  Label,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectContent,
} from "@/components/ui/native-select";
import { Text } from "@/components/ui/text";
import { Textarea } from "@/components/ui/textarea";
import CmsLayout from "@/layouts/cms-layout";
import {
  createPuckPageDataFromTemplate,
  serializePuckPageData,
} from "@/lib/puck/page-builder-data";
import { pages } from "@/routes/cms";
import { store } from "@/routes/cms/pages";

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

export default function CreatePage({ layoutOptions }: CmsPageCreatePageProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<Selection>(
    new Set(["basic"]),
  );
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  const form = useForm({
    title: "",
    slug: "",
    excerpt: "",
    seo_title: "",
    seo_description: "",
    content: "",
    content_format: "puck_json" as const,
    site_layout_id: "",
    status: "draft" as const,
  });

  const templateValue = Array.from(selectedTemplate)[0] as any;

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    // Generate template content
    const pageData = createPuckPageDataFromTemplate(
      templateValue,
      form.data.title,
    );
    const serialized = serializePuckPageData(pageData);

    form.transform((data) => ({
      ...data,
      content: serialized,
    }));
    form.post(store.url());
  }

  return (
    <>
      <Head title="Tạo trang mới" />

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <form onSubmit={submit}>
          <Fieldset className="rounded-2xl border border-border bg-overlay px-5 py-5 space-y-6">
            <div>
              <Legend>Tạo trang mới</Legend>
              <Text className="text-muted-fg mt-1">
                Khởi tạo trang tĩnh mới, cấu hình thông tin cơ bản, SEO và lựa
                chọn template phù hợp.
              </Text>
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
                      placeholder="Ví dụ: Giới thiệu Khoa CNTT"
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
                      placeholder="gioi-thieu-khoa-cntt"
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
                      placeholder="Mô tả tóm tắt nội dung của trang..."
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
                </div>

                {/* Right Side: SEO Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-fg/80 border-b border-border pb-1">
                    Cấu hình SEO
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="page-seo-title">SEO Title</Label>
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
                    <Label htmlFor="page-seo-description">
                      SEO Description
                    </Label>
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

              {/* Layout Selection */}
              <div className="space-y-4 border-t border-border pt-4">
                <div className="space-y-2">
                  <Label htmlFor="page-site-layout">Site layout</Label>
                  <NativeSelect>
                    <NativeSelectContent
                      id="page-site-layout"
                      value={form.data.site_layout_id}
                      onChange={(event) =>
                        form.setData("site_layout_id", event.target.value)
                      }
                    >
                      <option value="">Dùng layout mặc định</option>
                      {layoutOptions.map((layout) => (
                        <option key={layout.id} value={layout.id}>
                          {layout.name}
                          {layout.isDefault ? " (mặc định)" : ""}
                          {layout.status === "draft" ? " - nháp" : ""}
                        </option>
                      ))}
                    </NativeSelectContent>
                  </NativeSelect>
                  {form.errors.site_layout_id ? (
                    <FieldError>{form.errors.site_layout_id}</FieldError>
                  ) : null}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-fg/80">
                    Lựa chọn Bố cục (Template)
                  </h3>
                  <Text className="text-xs text-muted-fg mt-1">
                    Bố cục khởi đầu sẽ tự động tạo sẵn các khối nội dung mẫu khi
                    bạn mở trình biên tập trực quan.
                  </Text>
                </div>

                <ChoiceBox
                  aria-label="Chọn template khởi tạo"
                  columns={2}
                  gap={3}
                  selectedKeys={selectedTemplate}
                  onSelectionChange={setSelectedTemplate}
                  className="w-full"
                >
                  <ChoiceBoxItem id="basic" textValue="Basic Page Layout">
                    <DocumentTextIcon className="text-primary size-5" />
                    <div className="flex flex-col">
                      <ChoiceBoxLabel>Basic Page Layout</ChoiceBoxLabel>
                      <ChoiceBoxDescription>
                        Phù hợp cho Giới thiệu, Quy định, Liên hệ. Bao gồm Hero
                        đơn giản → Nội dung chính → CTA cuối trang.
                      </ChoiceBoxDescription>
                    </div>
                  </ChoiceBoxItem>

                  <ChoiceBoxItem id="landing" textValue="Landing Page Layout">
                    <RocketLaunchIcon className="text-amber-500 size-5" />
                    <div className="flex flex-col">
                      <ChoiceBoxLabel>Landing Page Layout</ChoiceBoxLabel>
                      <ChoiceBoxDescription>
                        Phù hợp cho tuyển sinh, sự kiện, workshop. Hero lớn →
                        Điểm nổi bật → Nội dung chính → Số liệu → FAQ → CTA.
                      </ChoiceBoxDescription>
                    </div>
                  </ChoiceBoxItem>

                  <ChoiceBoxItem id="academic" textValue="Academic Unit Layout">
                    <AcademicCapIcon className="text-indigo-500 size-5" />
                    <div className="flex flex-col">
                      <ChoiceBoxLabel>Academic Unit Layout</ChoiceBoxLabel>
                      <ChoiceBoxDescription>
                        Dùng cho bộ môn, phòng ban. Hero đơn vị → Giới thiệu →
                        Chuyên môn → Cán bộ → Tin tức → Tài liệu.
                      </ChoiceBoxDescription>
                    </div>
                  </ChoiceBoxItem>

                  <ChoiceBoxItem id="article" textValue="Article-like Layout">
                    <BookOpenIcon className="text-emerald-500 size-5" />
                    <div className="flex flex-col">
                      <ChoiceBoxLabel>Article-like Layout</ChoiceBoxLabel>
                      <ChoiceBoxDescription>
                        Bố cục giống bài viết dài. Hero tiêu đề → Metadata → Nội
                        dung chi tiết → Mục lục → Tài liệu đính kèm.
                      </ChoiceBoxDescription>
                    </div>
                  </ChoiceBoxItem>

                  <ChoiceBoxItem
                    id="empty"
                    textValue="Trang trống (Build từ đầu)"
                  >
                    <DocumentIcon className="text-muted-fg size-5" />
                    <div className="flex flex-col">
                      <ChoiceBoxLabel>
                        Trang trống (Build từ đầu)
                      </ChoiceBoxLabel>
                      <ChoiceBoxDescription>
                        Khởi tạo một trang trống hoàn toàn không có nội dung mẫu
                        để bạn tự do biên tập, lắp ghép từ đầu.
                      </ChoiceBoxDescription>
                    </div>
                  </ChoiceBoxItem>
                </ChoiceBox>
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
                {form.processing ? "Đang tạo..." : "Tạo trang & mở trình dựng"}
              </Button>
            </div>
          </Fieldset>
        </form>
      </div>
    </>
  );
}

CreatePage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;
