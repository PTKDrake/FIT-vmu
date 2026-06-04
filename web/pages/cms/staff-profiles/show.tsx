import {
  BriefcaseIcon,
  CalendarIcon,
  EnvelopeIcon,
  PencilSquareIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Head, Link } from "@inertiajs/react";
import type { ReactNode } from "react";
import type { CmsStaffProfileShowPageProps } from "@/components/cms/types";
import { BlockNoteReadonly } from "@/components/editor/blocknote-readonly";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Text } from "@/components/ui/text";
import CmsLayout from "@/layouts/cms-layout";
import { edit } from "@/routes/cms/staff-profiles";

export default function CmsStaffProfileShowPage({
  can,
  profile,
}: CmsStaffProfileShowPageProps) {
  return (
    <>
      <Head title={`Hồ sơ: ${profile.displayName}`} />

      <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
        <div className="flex items-center justify-end gap-4">
          {can.edit ? (
            <Link
              href={edit.url({ staffProfile: profile.id })}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-fg transition hover:opacity-90"
            >
              <PencilSquareIcon className="size-4" />
              Chỉnh sửa hồ sơ
            </Link>
          ) : null}
        </div>

        <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
          <div className="space-y-6">
            <Card className="border-border bg-overlay shadow-none">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <Avatar
                  src={profile.avatarUrl ?? undefined}
                  initials={profile.fullName.substring(0, 2).toUpperCase()}
                  className="size-28 rounded-full border-2 border-border shadow-xs"
                  aria-label={`Avatar của ${profile.displayName}`}
                />

                <h2 className="mt-4 text-lg font-bold text-fg">
                  {profile.displayName}
                </h2>
                <Text className="text-xs text-muted-fg mt-1">
                  Slug: {profile.slug}
                </Text>

                <div className="mt-4 flex items-center gap-2">
                  <Badge
                    intent={profile.isPublic ? "success" : "secondary"}
                    isCircle={false}
                  >
                    {profile.isPublic ? "Công khai" : "Ẩn / Nội bộ"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-overlay shadow-none">
              <CardHeader>
                <CardTitle className="text-sm font-semibold">
                  Thông tin liên hệ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <EnvelopeIcon className="mt-0.5 size-4 text-muted-fg shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-fg">Email liên hệ</p>
                    <p className="text-sm font-medium text-fg truncate">
                      {profile.email ?? "Chưa thiết lập"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <PhoneIcon className="mt-0.5 size-4 text-muted-fg shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-fg">Số điện thoại</p>
                    <p className="text-sm font-medium text-fg">
                      {profile.phone ?? "Chưa thiết lập"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 border-t border-border pt-4">
                  <UserIcon className="mt-0.5 size-4 text-muted-fg shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-muted-fg">Liên kết tài khoản</p>
                    <p className="text-sm font-medium text-fg truncate">
                      {profile.userName} ({profile.userEmail})
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border bg-overlay shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BriefcaseIcon className="size-5 text-muted-fg" />
                  Phân công bổ nhiệm công tác
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 border-t border-border">
                <Table aria-label="Danh sách bổ nhiệm công tác">
                  <TableHeader>
                    <TableColumn id="unit">Đơn vị</TableColumn>
                    <TableColumn id="position">Chức vụ</TableColumn>
                    <TableColumn id="dates">Nhiệm kỳ / Thời gian</TableColumn>
                    <TableColumn id="note">Ghi chú</TableColumn>
                  </TableHeader>
                  <TableBody
                    items={profile.appointments}
                    renderEmptyState={() => (
                      <div className="p-6 text-center">
                        <Text className="font-medium text-fg">
                          Chưa có quyết định bổ nhiệm nào.
                        </Text>
                        <Text className="mt-1 text-sm text-muted-fg">
                          Các bổ nhiệm sẽ hiển thị tại đây khi được thêm bởi Ban
                          giám hiệu hoặc phòng Nhân sự.
                        </Text>
                      </div>
                    )}
                  >
                    {(appt) => (
                      <TableRow
                        key={appt.id}
                        id={appt.id}
                        textValue={appt.unitName ?? "Đơn vị"}
                      >
                        <TableCell>
                          <Text className="font-medium text-fg">
                            {appt.unitName ?? "N/A"}
                          </Text>
                        </TableCell>
                        <TableCell>
                          <Badge intent="info" isCircle={false}>
                            {appt.positionName ?? "Thành viên"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm text-fg">
                            <CalendarIcon className="size-4 text-muted-fg" />
                            <span>
                              {appt.startDate
                                ? formatOnlyDate(appt.startDate)
                                : "N/A"}
                            </span>
                            <span className="text-muted-fg">đến</span>
                            <span>
                              {appt.endDate
                                ? formatOnlyDate(appt.endDate)
                                : "Hiện tại"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Text className="text-sm text-muted-fg max-w-[200px] truncate">
                            {appt.note ?? "-"}
                          </Text>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="border-border bg-overlay shadow-none">
              <CardHeader>
                <CardTitle>Tiểu sử & Bio chi tiết</CardTitle>
              </CardHeader>
              <CardContent>
                {profile.bio ? (
                  <BlockNoteReadonly
                    content={profile.bio}
                    editorKey={profile.id}
                  />
                ) : (
                  <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center">
                    <Text className="font-medium text-fg">
                      Chưa thiết lập tiểu sử cán bộ.
                    </Text>
                    <Text className="mt-1 text-sm text-muted-fg">
                      Hãy bổ sung tiểu sử để giới thiệu đầy đủ về cán bộ công
                      khai trên Cổng thông tin.
                    </Text>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

CmsStaffProfileShowPage.layout = (page: ReactNode) => (
  <CmsLayout>{page}</CmsLayout>
);

function formatOnlyDate(value: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}
