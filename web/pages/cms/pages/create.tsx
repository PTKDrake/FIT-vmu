import {
  AcademicCapIcon,
  BookOpenIcon,
  DocumentIcon,
  DocumentTextIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import type { FormEvent, ReactNode } from "react";
import { useRef, useState } from "react";
import type { Selection } from "react-aria-components";
import { StudentGroupPicker } from "@/components/cms/student-group-picker";
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
import {
  createPuckPageDataFromTemplate,
  serializePuckPageData,
} from "@/lib/puck/page-builder-data";
import { pages } from "@/routes/cms";
import { store } from "@/routes/cms/pages";
import type { SharedData } from "@/types/shared";

interface CreatePageFormData {
  content: string;
  content_format: "puck_json";
  excerpt: string;
  seo_description: string;
  seo_title: string;
  site_layout_id: string;
  slug: string;
  student_group_ids: number[];
  title: string;
  visibility:
    | "public"
    | "authenticated"
    | "students"
    | "student_groups"
    | "hidden";
}

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

export default function CreatePage({
  defaultPageLayoutId,
  layoutOptions,
  studentGroupOptions,
}: CmsPageCreatePageProps) {
  const { auth } = usePage<SharedData>().props;
  const canCreateGlobalGroup = hasPermission(
    auth.permissions,
    "manage shared student groups",
  );
  const [selectedTemplate, setSelectedTemplate] = useState<Selection>(
    new Set(["basic"]),
  );
  const isSlugManuallyEdited = useRef(false);

  const form = useForm<CreatePageFormData>({
    title: "",
    slug: "",
    excerpt: "",
    seo_title: "",
    seo_description: "",
    content: "",
    content_format: "puck_json" as const,
    visibility: "public" as const,
    student_group_ids: [] as number[],
    site_layout_id: "",
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
          <Fieldset className="rounded-2xl border border-border bg-overlay p-5 space-y-6">
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

                        if (!isSlugManuallyEdited.current) {
                          form.setData("slug", slugify(title));
                        }
                      }}
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
                      placeholder="gioi-thieu-khoa-cntt"
                      value={form.data.slug}
                      onChange={(event) => {
                        isSlugManuallyEdited.current = true;
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

              {/* Layout Selection */}
              <div className="space-y-4 border-t border-border pt-4">
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
                    <SelectItem id="" textValue="Dùng bố cục mặc định">
                      <SelectLabel>Dùng bố cục mặc định</SelectLabel>
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

                <div>
                  <h3 className="text-sm font-semibold text-fg/80">
                    Lựa chọn mẫu bố cục
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
                  <ChoiceBoxItem id="basic" textValue="Bố cục trang cơ bản">
                    <DocumentTextIcon className="text-primary size-5" />
                    <div className="flex flex-col">
                      <ChoiceBoxLabel>Bố cục trang cơ bản</ChoiceBoxLabel>
                      <ChoiceBoxDescription>
                        Phù hợp cho Giới thiệu, Quy định, Liên hệ. Bao gồm khối
                        đầu trang đơn giản → nội dung chính → nút kêu gọi hành
                        động cuối trang.
                      </ChoiceBoxDescription>
                    </div>
                  </ChoiceBoxItem>

                  <ChoiceBoxItem id="landing" textValue="Bố cục trang đích">
                    <RocketLaunchIcon className="text-amber-500 size-5" />
                    <div className="flex flex-col">
                      <ChoiceBoxLabel>Bố cục trang đích</ChoiceBoxLabel>
                      <ChoiceBoxDescription>
                        Phù hợp cho tuyển sinh, sự kiện, workshop. Khối đầu
                        trang lớn → điểm nổi bật → nội dung chính → số liệu →
                        câu hỏi thường gặp → nút kêu gọi hành động.
                      </ChoiceBoxDescription>
                    </div>
                  </ChoiceBoxItem>

                  <ChoiceBoxItem
                    id="academic"
                    textValue="Bố cục đơn vị học thuật"
                  >
                    <AcademicCapIcon className="text-indigo-500 size-5" />
                    <div className="flex flex-col">
                      <ChoiceBoxLabel>Bố cục đơn vị học thuật</ChoiceBoxLabel>
                      <ChoiceBoxDescription>
                        Dùng cho bộ môn, phòng ban. Khối đầu trang của đơn vị →
                        giới thiệu → Chuyên môn → Cán bộ → Tin tức → Tài liệu.
                      </ChoiceBoxDescription>
                    </div>
                  </ChoiceBoxItem>

                  <ChoiceBoxItem id="article" textValue="Bố cục dạng bài viết">
                    <BookOpenIcon className="text-emerald-500 size-5" />
                    <div className="flex flex-col">
                      <ChoiceBoxLabel>Bố cục dạng bài viết</ChoiceBoxLabel>
                      <ChoiceBoxDescription>
                        Bố cục giống bài viết dài. Khối tiêu đề → siêu dữ liệu →
                        nội dung chi tiết → mục lục → tài liệu đính kèm.
                      </ChoiceBoxDescription>
                    </div>
                  </ChoiceBoxItem>

                  <ChoiceBoxItem
                    id="empty"
                    textValue="Trang trống (tạo từ đầu)"
                  >
                    <DocumentIcon className="text-muted-fg size-5" />
                    <div className="flex flex-col">
                      <ChoiceBoxLabel>Trang trống (tạo từ đầu)</ChoiceBoxLabel>
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
                {form.processing ? "Đang tạo..." : "Tạo trang và mở trình dựng"}
              </Button>
            </div>
          </Fieldset>
        </form>
      </div>
    </>
  );
}

CreatePage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;
