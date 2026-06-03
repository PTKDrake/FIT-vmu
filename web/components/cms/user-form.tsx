import { Link } from "@inertiajs/react";
import { StickyActionBar } from "@/components/cms/sticky-action-bar";
import { Button } from "@/components/ui/button";
import { Checkbox, CheckboxGroup } from "@/components/ui/checkbox";
import {
  Description,
  FieldError,
  FieldGroup,
  Fieldset,
  Legend,
  Label,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch, SwitchLabel } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { TextField } from "@/components/ui/text-field";
import { t } from "@/lib/i18n";

export interface UserFormValues {
  id?: number;
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  email_verified: boolean;
  roles: string[];
}

interface UserFormProps {
  title: string;
  description?: string;
  mode: "create" | "edit";
  submitLabel: string;
  cancelHref: string;
  data: UserFormValues;
  errors: Record<string, string>;
  processing: boolean;
  roleOptions: Array<{ value: string; label: string }>;
  onSubmit: () => void;
  onUpdate: <TKey extends keyof UserFormValues>(
    key: TKey,
    value: UserFormValues[TKey],
  ) => void;
  currentUserId?: number;
  currentUserRoles?: string[];
  canManageRoles: boolean;
}

export function UserForm({
  title,
  description,
  mode,
  submitLabel,
  cancelHref,
  data,
  errors,
  processing,
  roleOptions,
  onSubmit,
  onUpdate,
  currentUserId,
  currentUserRoles = [],
  canManageRoles,
}: UserFormProps) {
  const isSelf = data.id !== undefined && data.id === currentUserId;
  const isTargetSuperAdmin = data.roles.includes("super-admin");
  const isCurrentUserSuperAdmin = currentUserRoles.includes("super-admin");

  // Determine if editing the user details should be completely disabled
  // e.g. non-super-admin trying to edit a super-admin account
  const isEditDisabled =
    mode === "edit" && isTargetSuperAdmin && !isCurrentUserSuperAdmin;

  function handleSubmit(event: React.FormEvent): void {
    event.preventDefault();

    if (!isEditDisabled) {
      onSubmit();
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-4xl space-y-6"
    >
      <div className="flex flex-col gap-1 border-b border-border pb-5">
        <h1 className="text-2xl font-bold tracking-tight text-fg">{title}</h1>
        {description && <p className="text-sm text-muted-fg">{description}</p>}
      </div>

      {isEditDisabled ? (
        <div className="rounded-2xl border border-danger-subtle bg-danger-subtle/20 px-4 py-3">
          <Text className="text-danger font-medium">
            Bạn không có quyền quản lý hoặc sửa đổi tài khoản Quản trị cấp cao
            (super-admin).
          </Text>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Left Side: Instructions */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-fg">Thông tin tài khoản</h2>
          <p className="text-sm text-muted-fg">
            {t(
              "Nhập tên hiển thị, địa chỉ email của người dùng. Địa chỉ email phải là duy nhất trên hệ thống.",
            )}
          </p>
          {mode === "edit" && (
            <p className="text-xs text-muted-fg">
              Để trống phần mật khẩu và xác nhận mật khẩu nếu bạn không có ý
              định thay đổi chúng.
            </p>
          )}
        </div>

        {/* Right Side: Inputs */}
        <div className="md:col-span-2 space-y-6 rounded-2xl border border-border bg-bg-light/40 p-6 backdrop-blur-xs">
          <Fieldset disabled={isEditDisabled}>
            <FieldGroup>
              <TextField
                isRequired
                name="name"
                value={data.name}
                onChange={(value) => onUpdate("name", value)}
              >
                <Label>Họ và tên</Label>
                <Input placeholder="Ví dụ: Nguyễn Văn A" />
                <FieldError>{errors.name}</FieldError>
              </TextField>

              <TextField
                isRequired
                name="email"
                type="email"
                value={data.email}
                onChange={(value) => onUpdate("email", value)}
              >
                <Label>Địa chỉ Email</Label>
                <Input placeholder="username@vmu.edu.vn" />
                <FieldError>{errors.email}</FieldError>
              </TextField>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TextField
                  isRequired={mode === "create"}
                  name="password"
                  type="password"
                  value={data.password ?? ""}
                  onChange={(value) => onUpdate("password", value)}
                >
                  <Label>Mật khẩu</Label>
                  <Input placeholder="••••••••" />
                  <FieldError>{errors.password}</FieldError>
                  {mode === "edit" && (
                    <Description>Để trống nếu không muốn đổi</Description>
                  )}
                </TextField>

                <TextField
                  isRequired={mode === "create"}
                  name="password_confirmation"
                  type="password"
                  value={data.password_confirmation ?? ""}
                  onChange={(value) => onUpdate("password_confirmation", value)}
                >
                  <Label>Xác nhận mật khẩu</Label>
                  <Input placeholder="••••••••" />
                  <FieldError>{errors.password_confirmation}</FieldError>
                </TextField>
              </div>

              <div className="rounded-2xl border border-border bg-muted/20 px-4 py-3">
                <Switch
                  isSelected={data.email_verified}
                  onChange={(isSelected) => {
                    onUpdate("email_verified", isSelected);
                  }}
                >
                  <SwitchLabel>Xác thực Email tài khoản</SwitchLabel>
                </Switch>
                <Description className="mt-1 ml-11 text-xs text-muted-fg">
                  Kích hoạt để người dùng có thể đăng nhập ngay mà không cần qua
                  bước xác minh email.
                </Description>
              </div>
            </FieldGroup>
          </Fieldset>
        </div>
      </div>

      {/* Spatie Roles Section */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 pt-6 border-t border-border">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-fg">
            {t("Vai trò thành viên")}
          </h2>
          <p className="text-sm text-muted-fg">
            Gán các vai trò cụ thể để phân chia quyền hạn quản lý các phân hệ
            CMS khác nhau cho người dùng này.
          </p>
        </div>

        <div className="md:col-span-2 space-y-4 rounded-2xl border border-border bg-bg-light/40 p-6 backdrop-blur-xs">
          {!canManageRoles ? (
            <div className="rounded-xl border border-muted bg-muted/30 px-3 py-2">
              <Text className="text-muted-fg text-xs">
                Bạn không có quyền quản lý vai trò. Các vai trò hiện tại của tài
                khoản:{" "}
                <span className="font-semibold text-fg">
                  {data.roles.length > 0 ? data.roles.join(", ") : "Không có"}
                </span>
              </Text>
            </div>
          ) : isSelf ? (
            <div className="space-y-3">
              <div className="rounded-xl border border-warning-subtle bg-warning-subtle/20 px-3 py-2">
                <Text className="text-warning text-xs font-medium">
                  Bạn không thể tự chỉnh sửa vai trò của chính mình để tránh vô
                  tình tước quyền admin.
                </Text>
              </div>
              <div className="flex flex-wrap gap-2">
                {data.roles.map((r) => (
                  <span
                    key={r}
                    className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-primary/20 ring-inset"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <CheckboxGroup
              aria-label="Chọn vai trò người dùng"
              value={data.roles}
              onChange={(values) => onUpdate("roles", values)}
              isDisabled={isEditDisabled}
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {roleOptions.map((option) => {
                  const isSuperAdminRole = option.value === "super-admin";
                  const isDisabled =
                    isSuperAdminRole && !isCurrentUserSuperAdmin;

                  return (
                    <Checkbox
                      key={option.value}
                      value={option.value}
                      isDisabled={isDisabled || isEditDisabled}
                    >
                      <span className="flex flex-col">
                        <span className="font-medium text-sm text-fg">
                          {option.label}
                        </span>
                        {isSuperAdminRole && (
                          <span className="text-xs text-muted-fg mt-0.5">
                            {t("Quyền tối cao, bỏ qua mọi kiểm tra Gate")}
                          </span>
                        )}
                      </span>
                    </Checkbox>
                  );
                })}
              </div>
              <FieldError>{errors.roles}</FieldError>
            </CheckboxGroup>
          )}
        </div>
      </div>

      {/* Sticky Action Footer */}
      <StickyActionBar className="lg:w-1/2">
        <div className="flex items-center justify-end gap-3">
          <Link
            href={cancelHref}
            className="inline-flex min-h-9 items-center justify-center rounded-lg border border-border bg-bg px-4 text-sm font-semibold text-muted-fg shadow-xs transition hover:text-fg hover:bg-muted/30 focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-ring active:bg-bg"
          >
            Hủy
          </Link>
          <Button
            isDisabled={processing || isEditDisabled}
            type="submit"
            className="px-5 font-semibold"
          >
            {submitLabel}
          </Button>
        </div>
      </StickyActionBar>
    </form>
  );
}
