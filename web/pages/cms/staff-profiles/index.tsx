import {
  EllipsisHorizontalIcon,
  EyeIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Head, Link, router } from "@inertiajs/react";
import { parseAsString, parseAsStringLiteral, useQueryStates, parseAsInteger } from "nuqs";
import type { ReactNode } from "react";
import { useMemo, useRef, useState } from "react";
import { useAsyncList } from "react-stately";
import { toast } from "sonner";
import { fetchInertiaCollectionPage } from "@/components/cms/inertia-collection-loader";
import type { CmsStaffProfileRow, CmsStaffProfilesPageProps } from "@/components/cms/types";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Menu,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "@/components/ui/menu";
import {
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { SearchField, SearchInput } from "@/components/ui/search-field";
import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@/components/ui/table";
import { Text } from "@/components/ui/text";
import { useMountEffect } from "@/hooks/use-mount-effect";
import CmsLayout from "@/layouts/cms-layout";
import { create, destroy, edit, show } from "@/routes/cms/staff-profiles";
import type { FlashData } from "@/types/shared";

export default function CmsStaffProfilesPage({
  can,
  flash,
  profiles,
}: CmsStaffProfilesPageProps) {
  const [deleteTarget, setDeleteTarget] = useState<CmsStaffProfileRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [profilesMeta, setProfilesMeta] = useState(profiles.meta);

  const [query, setQuery] = useQueryStates(
    {
      search: parseAsString.withDefault(""),
      status: parseAsStringLiteral(["all", "public", "private"]).withDefault("all"),
      sort: parseAsString.withDefault("created_at"),
      direction: parseAsStringLiteral(["asc", "desc"]).withDefault("desc"),
      page: parseAsInteger.withDefault(1),
      perPage: parseAsInteger.withDefault(profiles.meta.perPage),
    },
    {
      clearOnDefault: true,
      history: "replace",
      scroll: false,
      shallow: true,
    },
  );

  const queryRef = useRef(query);
  const profilesList = useAsyncList<CmsStaffProfileRow>({
    async load({ signal }) {
      const { items, meta } = await fetchInertiaCollectionPage("profiles", queryRef.current, signal);

      if (meta) {
        setProfilesMeta(meta as unknown as typeof profiles.meta);
      }

      return {
        items: items as CmsStaffProfileRow[],
      };
    },
  });

  const visibleProfiles = useMemo(
    () =>
      profilesList.loadingState === "loading" && profilesList.items.length === 0
        ? profiles.data
        : profilesList.items,
    [profilesList.items, profilesList.loadingState, profiles.data],
  );

  async function syncQuery(nextQuery: Partial<typeof query>): Promise<void> {
    const resolvedQuery = {
      ...queryRef.current,
      ...nextQuery,
    };

    queryRef.current = resolvedQuery;
    await setQuery(resolvedQuery);
    profilesList.reload();
  }

  function deleteProfile(): void {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);
    router.delete(destroy.url({ staffProfile: deleteTarget.id }), {
      onFinish: () => setIsDeleting(false),
      onSuccess: () => {
        setDeleteTarget(null);
        profilesList.reload();
      },
      preserveScroll: true,
    });
  }

  return (
    <>
      <Head title="Hồ sơ cán bộ" />
      {flash?.message ? (
        <ProfilesFlashToast key={`${flash.type}:${flash.message}`} message={flash.message} type={flash.type} />
      ) : null}

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="rounded-2xl border border-border bg-overlay">
          <div className="border-b border-border px-5 py-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div className="space-y-2">
                <p className="text-lg font-semibold text-fg">Hồ sơ cán bộ</p>
                <p className="max-w-3xl text-sm text-muted-fg">
                  Quản lý thông tin cán bộ, giảng viên khoa CNTT, hiển thị avatar, thông tin liên hệ và trạng thái công khai.
                </p>
              </div>

              {can.createStaffProfile ? (
                <Link
                  href={create.url()}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-fg transition hover:opacity-90"
                >
                  <PlusIcon className="size-4" />
                  Tạo hồ sơ
                </Link>
              ) : null}
            </div>
          </div>

          <div className="grid gap-3 border-b border-border px-5 py-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.5fr)]">
            <SearchField
              key={query.search}
              aria-label="Tìm kiếm cán bộ"
              defaultValue={query.search}
              onClear={() => {
                void syncQuery({ search: "", page: 1 });
              }}
              onSubmit={(value) => {
                void syncQuery({ search: value, page: 1 });
              }}
            >
              <SearchInput placeholder="Tìm theo tên, email, điện thoại hoặc mô tả" />
            </SearchField>

            <Select
              aria-label="Lọc theo hiển thị"
              selectedKey={query.status}
              onSelectionChange={(key) => {
                if (key !== null) {
                  void syncQuery({ status: key as typeof query.status, page: 1 });
                }
              }}
            >
              <SelectTrigger />
              <SelectContent>
                <SelectItem id="all" textValue="Tất cả trạng thái">
                  <SelectLabel>Tất cả trạng thái</SelectLabel>
                </SelectItem>
                <SelectItem id="public" textValue="Công khai">
                  <SelectLabel>Công khai</SelectLabel>
                </SelectItem>
                <SelectItem id="private" textValue="Nội bộ / Ẩn">
                  <SelectLabel>Nội bộ / Ẩn</SelectLabel>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-hidden border-t border-border">
            <Table
              aria-label="Danh sách hồ sơ cán bộ"
              className="bg-bg"
            >
              <TableHeader>
                <TableColumn id="fullName" isRowHeader>
                  Cán bộ
                </TableColumn>
                <TableColumn id="email">Email</TableColumn>
                <TableColumn id="phone">Điện thoại</TableColumn>
                <TableColumn id="status">Trạng thái</TableColumn>
                <TableColumn id="updatedAt">Cập nhật</TableColumn>
                <TableColumn id="actions" className="text-end">
                  Thao tác
                </TableColumn>
              </TableHeader>
              <TableBody
                items={visibleProfiles}
                renderEmptyState={() => (
                  <div className="px-6 py-14 text-center">
                    <Text className="font-medium text-fg">
                      Không tìm thấy hồ sơ cán bộ phù hợp.
                    </Text>
                    <Text className="mt-2 text-sm text-muted-fg">
                      Hãy đổi bộ lọc hoặc tạo hồ sơ mới để bắt đầu.
                    </Text>
                  </div>
                )}
              >
                {(profile) => (
                  <TableRow key={profile.id} id={profile.id} textValue={profile.fullName}>
                    <TableCell>
                      <div className="flex items-center gap-3 py-1">
                        <Avatar
                          src={profile.avatarUrl ?? undefined}
                          initials={profile.fullName.substring(0, 2).toUpperCase()}
                          className="size-9 rounded-full border border-border"
                          aria-label={`Ảnh đại diện của ${profile.fullName}`}
                        />
                        <div className="min-w-0">
                          <Link
                            href={show.url({ staffProfile: profile.id })}
                            className="font-medium text-fg transition hover:text-primary"
                          >
                            {profile.fullName}
                          </Link>
                          <p className="truncate text-xs text-muted-fg">
                            Tài khoản: {profile.userEmail}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Text className="text-sm text-fg">{profile.email ?? "Chưa thiết lập"}</Text>
                    </TableCell>
                    <TableCell>
                      <Text className="text-sm text-fg">{profile.phone ?? "Chưa thiết lập"}</Text>
                    </TableCell>
                    <TableCell>
                      <Badge intent={profile.isPublic ? "success" : "secondary"} isCircle={false}>
                        {profile.isPublic ? "Công khai" : "Ẩn / Nội bộ"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDateTime(profile.updatedAt)}</TableCell>
                    <TableCell className="text-end">
                      <Menu>
                        <MenuTrigger
                          aria-label={`Tác vụ cho ${profile.fullName}`}
                          className="inline-flex size-9 items-center justify-center rounded-lg border border-border bg-bg text-muted-fg transition hover:text-fg"
                        >
                          <EllipsisHorizontalIcon className="size-5" />
                        </MenuTrigger>
                        <MenuContent placement="bottom right">
                          <MenuItem href={show.url({ staffProfile: profile.id })}>
                            <EyeIcon />
                            Xem chi tiết
                          </MenuItem>
                          <MenuItem href={edit.url({ staffProfile: profile.id })}>
                            <PencilSquareIcon />
                            Chỉnh sửa
                          </MenuItem>
                          {can.deleteStaffProfile ? (
                            <MenuItem intent="danger" onAction={() => setDeleteTarget(profile)}>
                              <TrashIcon />
                              Xóa hồ sơ
                            </MenuItem>
                          ) : null}
                        </MenuContent>
                      </Menu>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between border-t border-border px-5 py-4">
            <Text className="text-sm text-muted-fg">
              Hiển thị {profilesMeta.from ?? 0}-{profilesMeta.to ?? 0} trên {profilesMeta.total} hồ sơ
            </Text>

            <div className="flex items-center gap-2">
              <Button
                intent="secondary"
                isDisabled={profilesMeta.currentPage <= 1}
                onPress={() => void syncQuery({ page: profilesMeta.currentPage - 1 })}
              >
                Trước
              </Button>
              <Button
                intent="secondary"
                isDisabled={profilesMeta.currentPage >= profilesMeta.lastPage}
                onPress={() => void syncQuery({ page: profilesMeta.currentPage + 1 })}
              >
                Sau
              </Button>
            </div>
          </div>
        </div>
      </div>

      {deleteTarget ? (
        <ModalContent
          aria-label="Xác nhận xóa hồ sơ"
          isOpen={deleteTarget !== null}
          onOpenChange={(isOpen) => {
            if (!isOpen) {
              setDeleteTarget(null);
            }
          }}
          size="lg"
        >
          <ModalHeader>
            <ModalTitle>Xóa hồ sơ cán bộ</ModalTitle>
            <ModalDescription>
              Bạn sắp xóa hồ sơ của <strong>{deleteTarget.fullName}</strong>. Thao tác này sẽ gỡ thông tin cán bộ khỏi hệ thống, nhưng KHÔNG xóa tài khoản người dùng tương ứng.
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <div className="rounded-2xl border border-danger-subtle bg-danger-subtle/40 px-4 py-3">
              <Text className="text-danger">
                Hãy kiểm tra lại dữ liệu phân công công tác hoặc lịch sử trước khi xóa.
              </Text>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button intent="outline" onPress={() => setDeleteTarget(null)}>
              Hủy
            </Button>
            <Button intent="danger" isDisabled={isDeleting} onPress={deleteProfile}>
              Xác nhận xóa
            </Button>
          </ModalFooter>
        </ModalContent>
      ) : null}
    </>
  );
}

CmsStaffProfilesPage.layout = (page: ReactNode) => <CmsLayout>{page}</CmsLayout>;

function ProfilesFlashToast({ message, type }: { message: string; type: FlashData["type"] }) {
  useMountEffect(() => {
    switch (type) {
      case "error":
        toast.error(message);
        break;
      case "warning":
        toast.warning(message);
        break;
      case "info":
        toast.info(message);
        break;
      default:
        toast.success(message);
        break;
    }
  });

  return null;
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
