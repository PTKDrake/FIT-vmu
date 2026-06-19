import { Head, useForm } from "@inertiajs/react";
import type { ReactNode } from "react";
import { StaffProfileForm } from "@/components/cms/staff-profile-form";
import type { CmsStaffProfileFormPageProps } from "@/components/cms/types";
import { useRegisterUnsavedChanges } from "@/hooks/use-unsaved-changes";
import CmsLayout from "@/layouts/cms-layout";
import { staffProfiles } from "@/routes/cms";
import { store } from "@/routes/cms/staff-profiles";

const EMPTY_USERS: NonNullable<CmsStaffProfileFormPageProps["users"]> = [];
const EMPTY_UNITS: NonNullable<CmsStaffProfileFormPageProps["units"]> = [];
const EMPTY_POSITIONS: NonNullable<CmsStaffProfileFormPageProps["positions"]> =
  [];

export default function CmsStaffProfileCreatePage({
  users = EMPTY_USERS,
  units = EMPTY_UNITS,
  positions = EMPTY_POSITIONS,
}: CmsStaffProfileFormPageProps) {
  const { data, setData, post, processing, errors, isDirty } = useForm({
    user_id: null as number | null,
    academic_title: "",
    full_name: "",
    slug: "",
    email: "",
    phone: "",
    bio: "",
    bio_format: "blocknote_json" as const,
    is_public: false,
    avatar_id: null as number | null,
    avatar_file: null as File | null,
    appointments: [] as Array<{
      id?: number;
      unit_id: number;
      position_id: number;
      start_date: string;
      end_date?: string | null;
      note?: string | null;
    }>,
  });

  const handleUpdate = <TKey extends keyof typeof data>(
    key: TKey,
    value: (typeof data)[TKey],
  ) => {
    setData(key, value as never);
  };

  const handleSubmit = () => {
    post(store.url());
  };

  useRegisterUnsavedChanges(
    {
      isDirty,
      onSave: handleSubmit,
    },
    "staff-profile-create",
  );

  return (
    <>
      <Head title="Tạo hồ sơ cán bộ" />

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <StaffProfileForm
          title="Tạo hồ sơ cán bộ mới"
          submitLabel="Lưu hồ sơ"
          cancelHref={staffProfiles.url()}
          data={data}
          errors={errors}
          processing={processing}
          users={users}
          units={units}
          positions={positions}
          onSubmit={handleSubmit}
          onUpdate={handleUpdate}
        />
      </div>
    </>
  );
}

CmsStaffProfileCreatePage.layout = (page: ReactNode) => (
  <CmsLayout>{page}</CmsLayout>
);
