import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Link } from "@inertiajs/react";
import { useState } from "react";
import { BlockNoteEditor } from "@/components/editor/blocknote-editor";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ComboBox,
  ComboBoxInput,
  ComboBoxContent,
  ComboBoxItem,
} from "@/components/ui/combo-box";
import {
  Description,
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
import { Switch, SwitchLabel } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { TextField } from "@/components/ui/text-field";

export interface StaffProfileFormData {
  user_id: number;
  academic_title: string;
  full_name: string;
  slug: string;
  email: string;
  phone: string;
  bio: string;
  bio_format: "blocknote_json";
  is_public: boolean;
  avatar_id: number | null;
  avatar_file: File | null;
  appointments: Array<{
    id?: number;
    unit_id: number;
    position_id: number;
    start_date: string;
    end_date?: string | null;
    note?: string | null;
  }>;
}

interface StaffProfileFormProps {
  cancelHref: string;
  data: any;
  errors: any;
  processing: boolean;
  submitLabel: string;
  title: string;
  users?: Array<{ id: number; name: string; email: string }>;
  units?: Array<{ id: number; name: string }>;
  positions?: Array<{ id: number; name: string }>;
  avatarUrl?: string | null;
  onSubmit: () => void;
  onUpdate: (key: any, value: any) => void;
}

export function StaffProfileForm({
  cancelHref,
  data,
  errors,
  processing,
  submitLabel,
  title,
  users = [],
  units = [],
  positions = [],
  avatarUrl,
  onSubmit,
  onUpdate,
}: StaffProfileFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onUpdate("avatar_file", file);

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

  const isCreate = !data.user_id || users.length > 0;
  const appointments = data.appointments || [];

  const handleAddAppointment = () => {
    const newAppt = {
      unit_id: units[0]?.id || 0,
      position_id: positions[0]?.id || 0,
      start_date: new Date().toISOString().split("T")[0],
      end_date: null,
      note: "",
    };
    onUpdate("appointments", [...appointments, newAppt]);
  };

  const handleRemoveAppointment = (index: number) => {
    const nextAppts = appointments.filter((_: any, i: number) => i !== index);
    onUpdate("appointments", nextAppts);
  };

  const handleUpdateAppointment = (
    index: number,
    field: string,
    value: any,
  ) => {
    const nextAppts = appointments.map((appt: any, i: number) => {
      if (i === index) {
        return { ...appt, [field]: value };
      }

      return appt;
    });
    onUpdate("appointments", nextAppts);
  };

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <Fieldset className="rounded-2xl border border-border bg-overlay px-5 py-5">
        <Legend>{title}</Legend>
        <Text>
          Thông tin chi tiết cán bộ giảng viên sẽ được hiển thị công khai hoặc
          nội bộ theo phân quyền.
        </Text>

        <FieldGroup>
          {isCreate ? (
            <div data-slot="control">
              <ComboBox
                isRequired
                name="user_id"
                value={data.user_id || undefined}
                onChange={(value) => onUpdate("user_id", Number(value))}
              >
                <Label>Liên kết tài khoản người dùng</Label>
                <ComboBoxInput placeholder="Tìm theo tên hoặc email của tài khoản..." />
                <ComboBoxContent>
                  {users.map((u) => (
                    <ComboBoxItem key={u.id} id={u.id}>
                      {u.name} ({u.email})
                    </ComboBoxItem>
                  ))}
                </ComboBoxContent>
              </ComboBox>
              <FieldError>{errors.user_id}</FieldError>
              <Description>
                Mỗi người dùng chỉ được có tối đa một hồ sơ cán bộ.
              </Description>
            </div>
          ) : (
            <div
              data-slot="control"
              className="rounded-xl border border-border bg-muted/20 px-4 py-3"
            >
              <Text className="text-sm text-muted-fg font-medium">
                Tài khoản liên kết:
              </Text>
              <Text className="text-sm font-semibold text-fg mt-1">
                {data.email || "Đã liên kết"}
              </Text>
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <TextField
              name="academic_title"
              value={data.academic_title}
              onChange={(value) => onUpdate("academic_title", value)}
            >
              <Label>Học hàm, học vị</Label>
              <Input placeholder="Ví dụ: TS., ThS." />
              <FieldError>{errors.academic_title}</FieldError>
            </TextField>

            <TextField
              isRequired
              name="full_name"
              value={data.full_name}
              onChange={(value) => onUpdate("full_name", value)}
            >
              <Label>Họ và tên</Label>
              <Input placeholder="Ví dụ: Nguyễn Văn A" />
              <FieldError>{errors.full_name}</FieldError>
            </TextField>
          </div>

          <TextField
            isRequired
            name="slug"
            value={data.slug}
            onChange={(value) => onUpdate("slug", value)}
          >
            <Label>Slug</Label>
            <Input placeholder="nguyen-van-a" />
            <FieldError>{errors.slug}</FieldError>
            <Description>
              Dùng cho đường dẫn URL giới thiệu cá nhân.
            </Description>
          </TextField>

          <div className="grid gap-4 lg:grid-cols-2">
            <TextField
              name="email"
              value={data.email}
              onChange={(value) => onUpdate("email", value)}
            >
              <Label>Email liên hệ</Label>
              <Input type="email" placeholder="nguyenvana@vmu.edu.vn" />
              <FieldError>{errors.email}</FieldError>
            </TextField>

            <TextField
              name="phone"
              value={data.phone}
              onChange={(value) => onUpdate("phone", value)}
            >
              <Label>Số điện thoại</Label>
              <Input placeholder="0987654321" />
              <FieldError>{errors.phone}</FieldError>
            </TextField>
          </div>

          <div className="grid gap-6 lg:grid-cols-[120px_1fr] items-start border-t border-border pt-4">
            <div className="flex flex-col items-center gap-2">
              <Label className="self-center">Ảnh đại diện</Label>
              <Avatar
                src={imagePreview || avatarUrl || undefined}
                initials={
                  data.full_name
                    ? data.full_name.substring(0, 2).toUpperCase()
                    : "SP"
                }
                className="size-24 rounded-full border border-border shadow-xs"
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
              {errors.avatar_file ? (
                <FieldError>{errors.avatar_file}</FieldError>
              ) : null}
              {errors.avatar_id ? (
                <FieldError>{errors.avatar_id}</FieldError>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 border-t border-border pt-4">
            <div className="rounded-2xl border border-border bg-muted/20 px-4 py-3 min-h-[44px] flex items-center">
              <Switch
                isSelected={data.is_public}
                onChange={(isSelected) => onUpdate("is_public", isSelected)}
              >
                <SwitchLabel>Công khai hồ sơ lên cổng thông tin</SwitchLabel>
              </Switch>
            </div>
          </div>

          {/* Appointments / Positions assignment section */}
          <div
            data-slot="control"
            className="space-y-4 border-t border-border pt-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <Label className="text-base font-semibold">
                  Quyết định bổ nhiệm & Chức vụ
                </Label>
                <Description>
                  Thiết lập các chức vụ của cán bộ tại các đơn vị (Ví dụ: Trưởng
                  bộ môn HTTT, Phó trưởng khoa CNTT). Một cán bộ có thể đảm
                  nhiệm nhiều chức vụ trong các khoảng thời gian khác nhau.
                </Description>
              </div>
              <Button
                type="button"
                intent="secondary"
                className="shrink-0 inline-flex items-center gap-1.5 self-start sm:self-center"
                onPress={handleAddAppointment}
              >
                <PlusIcon className="size-4" />
                Thêm bổ nhiệm
              </Button>
            </div>

            {errors.appointments ? (
              <div className="text-danger text-sm font-medium">
                {errors.appointments}
              </div>
            ) : null}

            {appointments.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border bg-muted/10 p-6 text-center">
                <Text className="text-muted-fg font-medium">
                  Chưa phân công chức vụ nào cho cán bộ này.
                </Text>
                <Text className="text-xs text-muted-fg mt-1">
                  Các thông tin bổ nhiệm sẽ hiển thị trên lý lịch cán bộ công
                  khai.
                </Text>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appt: any, index: number) => (
                  <div
                    key={index}
                    className="relative rounded-xl border border-border bg-muted/20 p-4 shadow-xs hover:border-muted-fg/30 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => handleRemoveAppointment(index)}
                      className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-lg border border-border bg-bg text-muted-fg hover:text-danger hover:border-danger/30 transition"
                      aria-label="Xóa bổ nhiệm"
                    >
                      <TrashIcon className="size-4" />
                    </button>

                    <div className="grid gap-4 pr-10 lg:grid-cols-[1.2fr_1fr_180px_180px]">
                      <div className="space-y-1">
                        <Label className="text-xs font-semibold">
                          Đơn vị / Phòng ban
                        </Label>
                        <Select
                          isRequired
                          selectedKey={
                            appt.unit_id ? String(appt.unit_id) : undefined
                          }
                          onSelectionChange={(key) =>
                            handleUpdateAppointment(
                              index,
                              "unit_id",
                              Number(key),
                            )
                          }
                        >
                          <SelectTrigger />
                          <SelectContent>
                            {units.map((u: any) => (
                              <SelectItem
                                key={u.id}
                                id={String(u.id)}
                                textValue={u.name}
                              >
                                <SelectLabel>{u.name}</SelectLabel>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors[`appointments.${index}.unit_id`] ? (
                          <div className="text-danger text-xs mt-1">
                            {errors[`appointments.${index}.unit_id`]}
                          </div>
                        ) : null}
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-semibold">Chức vụ</Label>
                        <Select
                          isRequired
                          selectedKey={
                            appt.position_id
                              ? String(appt.position_id)
                              : undefined
                          }
                          onSelectionChange={(key) =>
                            handleUpdateAppointment(
                              index,
                              "position_id",
                              Number(key),
                            )
                          }
                        >
                          <SelectTrigger />
                          <SelectContent>
                            {positions.map((p: any) => (
                              <SelectItem
                                key={p.id}
                                id={String(p.id)}
                                textValue={p.name}
                              >
                                <SelectLabel>{p.name}</SelectLabel>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors[`appointments.${index}.position_id`] ? (
                          <div className="text-danger text-xs mt-1">
                            {errors[`appointments.${index}.position_id`]}
                          </div>
                        ) : null}
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-semibold">
                          Từ ngày (Bắt đầu)
                        </Label>
                        <Input
                          type="date"
                          required
                          value={
                            appt.start_date
                              ? appt.start_date.substring(0, 10)
                              : ""
                          }
                          onChange={(e) =>
                            handleUpdateAppointment(
                              index,
                              "start_date",
                              e.target.value,
                            )
                          }
                        />
                        {errors[`appointments.${index}.start_date`] ? (
                          <div className="text-danger text-xs mt-1">
                            {errors[`appointments.${index}.start_date`]}
                          </div>
                        ) : null}
                      </div>

                      <div className="space-y-1">
                        <Label className="text-xs font-semibold">
                          Đến ngày (Kết thúc)
                        </Label>
                        <Input
                          type="date"
                          value={
                            appt.end_date ? appt.end_date.substring(0, 10) : ""
                          }
                          onChange={(e) =>
                            handleUpdateAppointment(
                              index,
                              "end_date",
                              e.target.value || null,
                            )
                          }
                        />
                        {errors[`appointments.${index}.end_date`] ? (
                          <div className="text-danger text-xs mt-1">
                            {errors[`appointments.${index}.end_date`]}
                          </div>
                        ) : null}
                      </div>
                    </div>

                    <div className="mt-3 pr-10">
                      <TextField
                        name={`appointments.${index}.note`}
                        value={appt.note || ""}
                        onChange={(value) =>
                          handleUpdateAppointment(index, "note", value)
                        }
                      >
                        <Label className="text-xs font-semibold">
                          Ghi chú / Quyết định số
                        </Label>
                        <Input placeholder="Ví dụ: Quyết định bổ nhiệm số 123/QĐ-ĐHHP ngày 01/01/2024" />
                        {errors[`appointments.${index}.note`] ? (
                          <FieldError>
                            {errors[`appointments.${index}.note`]}
                          </FieldError>
                        ) : null}
                      </TextField>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            data-slot="control"
            className="space-y-3 border-t border-border pt-4"
          >
            <div className="space-y-1">
              <Label>Tiểu sử, quá trình đào tạo & nghiên cứu khoa học</Label>
              <Description>
                Nội dung BlockNote mô tả chi tiết lý lịch khoa học của cán bộ
                giảng viên.
              </Description>
            </div>

            <BlockNoteEditor
              content={data.bio}
              onChange={(value) => {
                onUpdate("bio", value.isEmpty ? "" : value.json);
              }}
            />

            {errors.bio ? <FieldError>{errors.bio}</FieldError> : null}
            {errors.bio_format ? (
              <FieldError>{errors.bio_format}</FieldError>
            ) : null}
          </div>
        </FieldGroup>

        <div
          data-slot="control"
          className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-4"
        >
          <Link
            href={cancelHref}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-border bg-bg px-4 text-sm font-medium text-fg transition hover:bg-muted/40"
          >
            Hủy
          </Link>
          <Button isDisabled={processing} type="submit">
            {submitLabel}
          </Button>
        </div>
      </Fieldset>
    </form>
  );
}
