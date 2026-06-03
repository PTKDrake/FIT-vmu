import {
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Head, router } from "@inertiajs/react";
import type { ReactNode } from "react";
import { useState } from "react";
import { StudentGroupFormDialog } from "@/components/cms/student-group-form-dialog";
import type { StudentGroupFormValues } from "@/components/cms/student-group-form-dialog";
import type {
  CmsStudentGroupRow,
  CmsStudentGroupsPageProps,
} from "@/components/cms/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import CmsLayout from "@/layouts/cms-layout";
import studentGroupRoutes from "@/routes/cms/student-groups";

const emptyStudentGroupFormValues: StudentGroupFormValues = {
  code: "",
  name: "",
  scope: "private",
  student_codes: [],
};

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default function CmsStudentGroupsPage({
  can,
  groups,
}: CmsStudentGroupsPageProps) {
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<StudentGroupFormValues>(
    emptyStudentGroupFormValues,
  );
  const [deleteTarget, setDeleteTarget] = useState<CmsStudentGroupRow | null>(
    null,
  );

  function openCreateDialog(): void {
    setDialogMode("create");
    setActiveGroup(emptyStudentGroupFormValues);
    setDialogOpen(true);
  }

  function openEditDialog(group: CmsStudentGroupRow): void {
    setDialogMode("edit");
    setActiveGroup({
      id: group.id,
      code: group.code,
      name: group.name,
      scope: group.scope,
      student_codes: group.studentCodes,
    });
    setDialogOpen(true);
  }

  return (
    <>
      <Head title="Nhóm sinh viên" />

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-overlay p-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-fg">Nhóm sinh viên</h1>
            <Text className="max-w-3xl text-muted-fg">
              Quản lý danh sách `student_code` để tái sử dụng khi giới hạn quyền
              xem cho `page` và `post`. Có thể tạo nhóm private hoặc global và
              dán trực tiếp danh sách mã sinh viên nhiều dòng.
            </Text>
          </div>

          {can.createGroup ? (
            <Button onPress={openCreateDialog}>
              <PlusIcon />
              Tạo nhóm
            </Button>
          ) : null}
        </div>

        {groups.length === 0 ? (
          <Card className="rounded-2xl border-dashed">
            <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
              <UsersIcon className="size-10 text-muted-fg" />
              <div className="space-y-1">
                <CardTitle>Chưa có nhóm sinh viên nào</CardTitle>
                <Text className="text-muted-fg">
                  Tạo nhóm đầu tiên để gắn vào các nội dung cần kiểm soát truy cập.
                </Text>
              </div>
              {can.createGroup ? (
                <Button onPress={openCreateDialog}>
                  <PlusIcon />
                  Tạo nhóm sinh viên
                </Button>
              ) : null}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {groups.map((group) => (
              <Card key={group.id} className="rounded-2xl">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div className="space-y-2">
                    <CardTitle className="flex items-center gap-2">
                      {group.name}
                      <span className="rounded-full border border-border px-2 py-0.5 text-xs font-medium text-muted-fg">
                        {group.code}
                      </span>
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-fg">
                      <span className="rounded-full bg-muted px-2 py-1">
                        {group.scope === "global" ? "Global" : "Private"}
                      </span>
                      <span className="rounded-full bg-muted px-2 py-1">
                        {group.memberCount} mã sinh viên
                      </span>
                      <span className="rounded-full bg-muted px-2 py-1">
                        Cập nhật {dateFormatter.format(new Date(group.updatedAt))}
                      </span>
                    </div>
                    {group.ownerName ? (
                      <Text className="text-sm text-muted-fg">
                        Chủ sở hữu: {group.ownerName}
                      </Text>
                    ) : (
                      <Text className="text-sm text-muted-fg">
                        Nhóm dùng chung toàn hệ thống
                      </Text>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {group.canUpdate ? (
                      <Button
                        intent="secondary"
                        size="sm"
                        onPress={() => openEditDialog(group)}
                      >
                        <PencilSquareIcon />
                        Sửa
                      </Button>
                    ) : null}
                    {group.canDelete ? (
                      <Button
                        intent="danger"
                        size="sm"
                        onPress={() => setDeleteTarget(group)}
                      >
                        <TrashIcon />
                        Xóa
                      </Button>
                    ) : null}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Text className="text-sm text-muted-fg">
                    Danh sách mã sinh viên hiện tại:
                  </Text>
                  <div className="max-h-10 overflow-y-auto flex flex-wrap gap-2">
                    {group.studentCodes.map((code, index) => {
                      return (
                        <Badge intent="primary" key={`${group.id}-${code}-${index}`}>
                          {code}
                        </Badge>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <StudentGroupFormDialog
        key={`${dialogMode}-${activeGroup.id ?? "new"}`}
        allowGlobalScope={can.createGlobalGroup}
        initialValues={activeGroup}
        isOpen={dialogOpen}
        mode={dialogMode}
        onOpenChange={setDialogOpen}
      />

      {deleteTarget ? (
        <ModalContent
          aria-label="Xác nhận xóa nhóm sinh viên"
          isOpen={deleteTarget !== null}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setDeleteTarget(null);
            }
          }}
          size="lg"
        >
          <ModalHeader>
            <ModalTitle>Xóa nhóm sinh viên</ModalTitle>
            <ModalDescription>
              Bạn sắp xóa nhóm <strong>{deleteTarget.name}</strong>. Các page và
              post đang dùng nhóm này sẽ mất liên kết truy cập tương ứng.
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <Text className="text-muted-fg">
              Hành động này không kiểm tra tài khoản sinh viên, chỉ xóa danh
              sách mã đã lưu và các liên kết tới nội dung.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              intent="outline"
              onPress={() => setDeleteTarget(null)}
              type="button"
            >
              Hủy
            </Button>
            <Button
              intent="danger"
              onPress={() => {
                router.delete(
                  studentGroupRoutes.destroy.url({
                    student_group: deleteTarget.id,
                  }),
                  {
                    onSuccess: () => setDeleteTarget(null),
                    preserveScroll: true,
                  },
                );
              }}
            >
              Xóa nhóm
            </Button>
          </ModalFooter>
        </ModalContent>
      ) : null}
    </>
  );
}

CmsStudentGroupsPage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;
