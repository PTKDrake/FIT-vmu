import { Head, useForm, usePage } from "@inertiajs/react";
import type { ReactNode } from "react";
import { UserForm } from "@/components/cms/user-form";
import type { UserFormValues } from "@/components/cms/user-form";
import CmsLayout from "@/layouts/cms-layout";
import usersRoutes from "@/routes/cms/users";
import type { SharedData } from "@/types/shared";

interface CmsUserEditPageProps {
  user: {
    id: number;
    name: string;
    email: string;
    roles: string[];
    status: string;
    isVerified: boolean;
    emailVerifiedAt: string | null;
    createdAt: string;
    updatedAt: string;
  };
  roleOptions: Array<{ value: string; label: string }>;
  can: {
    manageRoles: boolean;
  };
}

export default function CmsUserEditPage({
  user,
  roleOptions,
  can,
}: CmsUserEditPageProps) {
  const { auth } = usePage<SharedData>().props;
  const { data, setData, patch, processing, errors } = useForm<UserFormValues>({
    id: user.id,
    name: user.name,
    email: user.email,
    password: "",
    password_confirmation: "",
    email_verified: user.isVerified,
    roles: user.roles,
  });

  const handleUpdate = (key: any, value: any) => {
    setData(key, value);
  };

  const handleSubmit = () => {
    patch(usersRoutes.update.url({ user: user.id }), {
      preserveScroll: true,
    });
  };

  // Safe checks for currentUserRoles
  const currentUserRoles = auth.user
    ? user.id === auth.user.id
      ? user.roles
      : auth.permissions.length >= 35
        ? ["super-admin"]
        : []
    : [];

  return (
    <>
      <Head title={`Chỉnh sửa người dùng: ${user.name}`} />

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <UserForm
          title={`Chỉnh sửa thông tin: ${user.name}`}
          description={`Thay đổi thông tin tài khoản và phân quyền vai trò cho ${user.name}.`}
          mode="edit"
          submitLabel="Lưu thay đổi"
          cancelHref="/cms/users"
          data={data}
          errors={errors}
          processing={processing}
          roleOptions={roleOptions}
          onSubmit={handleSubmit}
          onUpdate={handleUpdate}
          currentUserId={auth.user?.id}
          currentUserRoles={currentUserRoles}
          canManageRoles={can?.manageRoles ?? true}
        />
      </div>
    </>
  );
}

CmsUserEditPage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;
