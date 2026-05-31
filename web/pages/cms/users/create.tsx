import { Head, useForm } from "@inertiajs/react";
import type { ReactNode } from "react";
import { UserForm } from "@/components/cms/user-form";
import type { UserFormValues } from "@/components/cms/user-form";
import CmsLayout from "@/layouts/cms-layout";
import usersRoutes from "@/routes/cms/users";

interface CmsUserCreatePageProps {
  roleOptions: Array<{ value: string; label: string }>;
  can: {
    manageRoles: boolean;
  };
}

export default function CmsUserCreatePage({
  roleOptions,
  can,
}: CmsUserCreatePageProps) {
  const { data, setData, post, processing, errors } = useForm<UserFormValues>({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    email_verified: true,
    roles: [],
  });

  const handleUpdate = (key: any, value: any) => {
    setData(key, value);
  };

  const handleSubmit = () => {
    post(usersRoutes.store.url(), {
      preserveScroll: true,
    });
  };

  return (
    <>
      <Head title="Thêm người dùng mới" />

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <UserForm
          title="Thêm người dùng mới"
          description="Khai báo tài khoản quản trị nội bộ hoặc biên tập viên mới cho hệ thống VMUFit."
          mode="create"
          submitLabel="Tạo tài khoản"
          cancelHref="/cms/users"
          data={data}
          errors={errors}
          processing={processing}
          roleOptions={roleOptions}
          onSubmit={handleSubmit}
          onUpdate={handleUpdate}
          canManageRoles={can?.manageRoles ?? true}
        />
      </div>
    </>
  );
}

CmsUserCreatePage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;
