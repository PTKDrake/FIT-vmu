"use client";

import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { Form } from "react-aria-components";
import AppLayout from "@/layouts/app-layout";
import SettingsLayout from "@/pages/settings/settings-layout";
import { Button } from "@/components/ui/button";
import {
  Description,
  FieldError,
  FieldGroup,
  Fieldset,
  Label,
  Legend,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { TextField } from "@/components/ui/text-field";
import { Switch, SwitchLabel } from "@/components/ui/switch";
import { Avatar } from "@/components/ui/avatar";
import { BlockNoteEditor } from "@/components/editor/blocknote-editor";
import { Text } from "@/components/ui/text";
import type { SharedData } from "@/types/shared";

interface ProfilePageProps {
  mustVerifyEmail: boolean;
  status?: string;
}

export default function ProfilePage({
  mustVerifyEmail,
  status,
}: ProfilePageProps) {
  const { auth } = usePage<SharedData>().props;
  const staffProfile = auth.user?.staffProfile;
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm({
    _method: "PATCH" as const,
    name: auth.user?.name || "",
    email: auth.user?.email || "",
    academic_title: staffProfile?.academic_title || "",
    full_name: staffProfile?.full_name || "",
    slug: staffProfile?.slug || "",
    staff_email: staffProfile?.email || "",
    phone: staffProfile?.phone || "",
    bio: staffProfile?.bio || "",
    is_public: staffProfile?.is_public ?? false,
    avatar_file: null as File | null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    form.setData("avatar_file", file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  function submit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    // Inertia requires POST for multipart/form-data with method spoofing
    form.post("/settings/profile", {
      preserveScroll: true,
    });
  }

  return (
    <>
      <Head title="Hồ sơ" />
      <div className="space-y-6">
        <Form onSubmit={submit}>
          <Fieldset className="rounded-2xl border border-border bg-overlay p-6">
            <Legend>Hồ sơ tài khoản</Legend>
            <Text>Cập nhật họ tên và địa chỉ email đăng nhập của bạn.</Text>

            <FieldGroup>
              <div className="grid gap-4 lg:grid-cols-2">
                <TextField
                  isRequired
                  name="name"
                  value={form.data.name}
                  onChange={(value) => form.setData("name", value)}
                >
                  <Label>Họ và tên</Label>
                  <Input placeholder="Nguyễn Văn A" />
                  <FieldError>{form.errors.name}</FieldError>
                </TextField>

                <TextField
                  isRequired
                  name="email"
                  type="email"
                  value={form.data.email}
                  onChange={(value) => form.setData("email", value)}
                >
                  <Label>Email tài khoản</Label>
                  <Input placeholder="you@example.com" />
                  <FieldError>{form.errors.email}</FieldError>
                </TextField>
              </div>

              {mustVerifyEmail && auth.user?.email_verified_at === null ? (
                <div
                  data-slot="control"
                  className="rounded-md border border-warning-subtle bg-warning-subtle p-4 text-sm text-warning-subtle-fg"
                >
                  Địa chỉ email của bạn chưa được xác thực.
                  <Link
                    href="/email/verification-notification"
                    method="post"
                    className="ml-1 underline font-medium hover:text-warning-subtle-fg/80"
                  >
                    Bấm vào đây để gửi lại email xác thực.
                  </Link>
                  {status ? <div className="mt-2">{status}</div> : null}
                </div>
              ) : null}
            </FieldGroup>
          </Fieldset>

          {staffProfile ? (
            <Fieldset className="rounded-2xl border border-border bg-overlay p-6 mt-6">
              <Legend>Hồ sơ cán bộ</Legend>
              <Text>
                Cập nhật thông tin chi tiết cán bộ giảng viên hiển thị trên cổng
                thông tin.
              </Text>

              <FieldGroup>
                <div className="grid gap-4 lg:grid-cols-2">
                  <TextField
                    name="academic_title"
                    value={form.data.academic_title}
                    onChange={(value) => form.setData("academic_title", value)}
                  >
                    <Label>Học hàm, học vị</Label>
                    <Input placeholder="Ví dụ: TS., ThS." />
                    <FieldError>{form.errors.academic_title}</FieldError>
                  </TextField>

                  <TextField
                    isRequired
                    name="full_name"
                    value={form.data.full_name}
                    onChange={(value) => form.setData("full_name", value)}
                  >
                    <Label>Họ và tên hiển thị</Label>
                    <Input placeholder="Ví dụ: Nguyễn Văn A" />
                    <FieldError>{form.errors.full_name}</FieldError>
                  </TextField>
                </div>

                <TextField
                  isRequired
                  name="slug"
                  value={form.data.slug}
                  onChange={(value) => form.setData("slug", value)}
                >
                  <Label>Slug đường dẫn</Label>
                  <Input placeholder="nguyen-van-a" />
                  <FieldError>{form.errors.slug}</FieldError>
                  <Description>
                    Dùng cho đường dẫn URL giới thiệu cá nhân.
                  </Description>
                </TextField>

                <div className="grid gap-4 lg:grid-cols-2">
                  <TextField
                    name="staff_email"
                    type="email"
                    value={form.data.staff_email}
                    onChange={(value) => form.setData("staff_email", value)}
                  >
                    <Label>Email liên hệ</Label>
                    <Input placeholder="nguyenvana@vmu.edu.vn" />
                    <FieldError>{form.errors.staff_email}</FieldError>
                  </TextField>

                  <TextField
                    name="phone"
                    value={form.data.phone}
                    onChange={(value) => form.setData("phone", value)}
                  >
                    <Label>Số điện thoại</Label>
                    <Input placeholder="0987654321" />
                    <FieldError>{form.errors.phone}</FieldError>
                  </TextField>
                </div>

                <div className="grid gap-6 lg:grid-cols-[120px_1fr] items-start border-t border-border pt-4">
                  <div className="flex flex-col items-center gap-2">
                    <Label className="self-center">Ảnh đại diện</Label>
                    <Avatar
                      src={imagePreview || staffProfile.avatar_url || undefined}
                      initials={
                        form.data.full_name
                          ? form.data.full_name
                              .substring(0, 2)
                              .toUpperCase()
                          : "CB"
                      }
                      size="5xl"
                      className="border border-border shadow-xs"
                    />
                  </div>
                  <div data-slot="control" className="space-y-2">
                    <Label htmlFor="avatar-file-input">
                      Tải ảnh đại diện mới lên
                    </Label>
                    <input
                      id="avatar-file-input"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-muted-fg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-border file:text-sm file:font-semibold file:bg-bg file:text-fg hover:file:bg-muted/40 cursor-pointer"
                    />
                    <Description>
                      Định dạng JPG, PNG hoặc WEBP. Tối đa 2MB.
                    </Description>
                    {form.errors.avatar_file ? (
                      <FieldError>{form.errors.avatar_file}</FieldError>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-muted/20 px-4 py-3 min-h-[44px] flex items-center">
                  <Switch
                    isSelected={form.data.is_public}
                    onChange={(isSelected) =>
                      form.setData("is_public", isSelected)
                    }
                  >
                    <SwitchLabel>Công khai hồ sơ lên cổng thông tin</SwitchLabel>
                  </Switch>
                </div>

                <div data-slot="control" className="space-y-3 border-t border-border pt-4">
                  <div className="space-y-1">
                    <Label>
                      Tiểu sử, quá trình đào tạo & nghiên cứu khoa học
                    </Label>
                    <Description>
                      Nội dung mô tả chi tiết lý lịch khoa học của cán bộ giảng
                      viên.
                    </Description>
                  </div>

                  <BlockNoteEditor
                    content={form.data.bio}
                    onChange={(value) => {
                      form.setData("bio", value.isEmpty ? "" : value.json);
                    }}
                  />
                  {form.errors.bio ? (
                    <FieldError>{form.errors.bio}</FieldError>
                  ) : null}
                </div>
              </FieldGroup>
            </Fieldset>
          ) : null}

          <div
            data-slot="control"
            className="flex items-center gap-3 border-t border-border pt-6 mt-6"
          >
            <Button isDisabled={form.processing} type="submit">
              Lưu thay đổi
            </Button>
            {form.recentlySuccessful ? (
              <span className="text-sm text-muted-fg animate-fade-in">
                Đã lưu thành công.
              </span>
            ) : null}
          </div>
        </Form>
      </div>
    </>
  );
}

ProfilePage.layout = (page: ReactNode) => (
  <AppLayout>
    <SettingsLayout>{page}</SettingsLayout>
  </AppLayout>
);
