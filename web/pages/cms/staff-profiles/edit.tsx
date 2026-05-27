import { Head, useForm } from "@inertiajs/react";
import type { ReactNode } from "react";
import { StaffProfileForm } from "@/components/cms/staff-profile-form";
import type { CmsStaffProfileFormPageProps } from "@/components/cms/types";
import CmsLayout from "@/layouts/cms-layout";
import { show, update } from "@/routes/cms/staff-profiles";

export default function CmsStaffProfileEditPage({
  profile,
  units = [],
  positions = [],
}: CmsStaffProfileFormPageProps) {
  const { data, setData, post, processing, errors } = useForm({
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

  if (!profile) {
    return null;
  }

  const handleUpdate = <TKey extends keyof typeof data>(
    key: TKey,
    value: typeof data[TKey],
  ) => {
    setData(key, value as never);
  };

  const handleSubmit = () => {
    post(update.url({ staffProfile: profile.id ?? 0 }), {
      preserveScroll: true,
    });
  };

  return (
    <>
      <Head title={`Chỉnh sửa: ${profile.fullName}`} />

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <StaffProfileForm
          title={`Chỉnh sửa hồ sơ: ${profile.fullName}`}
          submitLabel="Lưu thay đổi"
          cancelHref={show.url({ staffProfile: profile.id ?? 0 })}
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
