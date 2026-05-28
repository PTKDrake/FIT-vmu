import { Head, useForm } from "@inertiajs/react";
import type { ReactNode } from "react";
import { StaffProfileForm } from "@/components/cms/staff-profile-form";
import type { CmsStaffProfileFormPageProps } from "@/components/cms/types";
import { useRegisterUnsavedChanges } from "@/hooks/use-unsaved-changes";
import CmsLayout from "@/layouts/cms-layout";
import { show, update } from "@/routes/cms/staff-profiles";

const EMPTY_UNITS: NonNullable<CmsStaffProfileFormPageProps["units"]> = [];
const EMPTY_POSITIONS: NonNullable<CmsStaffProfileFormPageProps["positions"]> = [];

export default function CmsStaffProfileEditPage({
  profile,
  units = EMPTY_UNITS,
  positions = EMPTY_POSITIONS,
}: CmsStaffProfileFormPageProps) {
  const profileId = profile?.id ?? 0;
  const { data, setData, post, processing, errors, isDirty } = useForm({
    _method: "patch" as const,
    user_id: profile?.userId ?? 0,
    full_name: profile?.fullName ?? "",
    slug: profile?.slug ?? "",
    email: profile?.email ?? "",
    phone: profile?.phone ?? "",
    bio: profile?.bio ?? "",
    bio_format: "blocknote_json" as const,
    is_public: profile?.isPublic ?? false,
    avatar_id: profile?.avatarId ?? null,
    avatar_file: null as File | null,
    appointments: profile?.appointments ?? [] as Array<{
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
    value: typeof data[TKey],
  ) => {
    setData(key, value as never);
  };

  const handleSubmit = () => {
    post(update.url({ staffProfile: profileId }), {
      preserveScroll: true,
    });
  };

  useRegisterUnsavedChanges({
    isDirty,
    onSave: handleSubmit,
  }, "staff-profile-edit");

  if (!profile) {
    return null;
  }

  return (
    <>
      <Head title={`Chỉnh sửa: ${profile.fullName}`} />

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <StaffProfileForm
          title={`Chỉnh sửa hồ sơ: ${profile.fullName}`}
          submitLabel="Lưu thay đổi"
          cancelHref={show.url({ staffProfile: profileId })}
          data={data}
          errors={errors}
          processing={processing}
          avatarUrl={profile.avatarUrl}
          units={units}
          positions={positions}
          onSubmit={handleSubmit}
          onUpdate={handleUpdate}
        />
      </div>
    </>
  );
}

CmsStaffProfileEditPage.layout = (page: ReactNode) => (
  <CmsLayout>{page}</CmsLayout>
);
