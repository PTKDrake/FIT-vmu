import { useState } from "react";
import { Link } from "@/components/ui/link";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabList, Tab, TabPanel } from "@/components/ui/tabs";
import {
  DocumentTextIcon,
  DocumentIcon,
  UserIcon,
  Squares2X2Icon,
  ShareIcon,
  UsersIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import type { DashboardOverview } from "@/components/cms/types";

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function formatDate(value: string): string {
  return dateFormatter.format(new Date(value));
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) {
    return diffMins > 0 ? `${diffMins} phút trước` : "vừa xong";
  }
  if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  }
  if (diffDays < 30) {
    return `${diffDays} ngày trước`;
  }
  return dateFormatter.format(date);
}

export function DashboardMainPanel({
  overview,
}: {
  overview: DashboardOverview;
}) {
  function renderActivityList(activities: typeof overview.recentActivity) {
    if (activities.length === 0) {
      return (
        <div className="flex h-48 items-center justify-center text-sm text-muted-fg">
          Chưa có hoạt động nào gần đây.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {activities.slice(0, 5).map((activity) => {
          let Icon = DocumentTextIcon;
          let iconBg = "bg-primary-subtle";
          let iconColor = "text-primary";

          if (activity.kind === "Trang") {
            Icon = DocumentIcon;
            iconBg = "bg-success-subtle";
            iconColor = "text-success";
          } else if (activity.kind === "Hồ sơ cán bộ") {
            Icon = UserIcon;
            iconBg = "bg-[oklch(0.6_0.2_160)/0.1]";
            iconColor = "text-[oklch(0.6_0.2_160)]";
          }

          return (
            <div
              key={activity.id}
              className="flex items-start gap-4 border-b border-border/50 last:border-0 pb-3 last:pb-0"
            >
              <div
                className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}
              >
                <Icon className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-fg truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-muted-fg mt-0.5">
                  {activity.description}
                </p>
              </div>
              <p className="text-xs text-muted-fg shrink-0 mt-0.5">
                {formatRelativeTime(activity.updatedAt)}
              </p>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Row 1: Recent Activity & Pending Review */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-2xl border border-border bg-overlay flex flex-col justify-between min-h-[460px] shadow-xs">
          <Tabs
            defaultSelectedKey="all"
            className="w-full flex flex-col justify-between flex-1"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 pt-5 pb-3 border-b border-border">
              <h3 className="text-lg font-semibold text-fg">
                Hoạt động gần đây
              </h3>
              <TabList className="border-b-0 py-0 flex-wrap">
                <Tab id="all">Tất cả</Tab>
                <Tab id="posts">Bài viết</Tab>
                <Tab id="pages">Trang</Tab>
                <Tab id="staff">Hồ sơ cán bộ</Tab>
              </TabList>
            </div>

            <div className="flex-1 px-6 py-4">
              <TabPanel id="all">
                {renderActivityList(overview.recentActivity)}
              </TabPanel>
              <TabPanel id="posts">
                {renderActivityList(
                  overview.recentActivity.filter((a) => a.kind === "Bài viết"),
                )}
              </TabPanel>
              <TabPanel id="pages">
                {renderActivityList(
                  overview.recentActivity.filter((a) => a.kind === "Trang"),
                )}
              </TabPanel>
              <TabPanel id="staff">
                {renderActivityList(
                  overview.recentActivity.filter(
                    (a) => a.kind === "Hồ sơ cán bộ",
                  ),
                )}
              </TabPanel>
            </div>

            <div className="border-t border-border px-6 py-4 flex justify-center">
              <Link
                href="/cms/posts"
                className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
              >
                Xem tất cả hoạt động <ChevronRightIcon className="size-4" />
              </Link>
            </div>
          </Tabs>
        </div>

        {/* Pending Review */}
        <div className="rounded-2xl border border-border bg-overlay flex flex-col justify-between min-h-[460px] shadow-xs">
          <div className="flex items-center justify-between border-b border-border px-6 pt-5 pb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-fg">Mục chờ duyệt</h3>
              {overview.pendingReview.length > 0 && (
                <span className="flex size-6 items-center justify-center rounded-full bg-danger-subtle text-xs font-semibold text-danger">
                  {overview.pendingReview.length}
                </span>
              )}
            </div>
            <Link
              href="/cms/posts?status=pending"
              className="text-sm font-medium text-primary hover:underline"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="flex-1 px-6 py-4">
            {overview.pendingReview.length === 0 ? (
              <div className="flex h-48 items-center justify-center text-sm text-muted-fg">
                Chưa có hạng mục nào chờ duyệt.
              </div>
            ) : (
              <div className="space-y-4">
                {overview.pendingReview.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 border-b border-border/50 last:border-0 pb-3 last:pb-0"
                  >
                    <div className="space-y-1.5 min-w-0">
                      <p className="font-semibold text-sm text-fg truncate">
                        {item.title}
                      </p>
                      <Badge
                        intent="outline"
                        isCircle={false}
                        className="bg-muted/30 text-muted-fg border-border"
                      >
                        {item.kind}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-fg shrink-0 mt-0.5">
                      {formatDate(item.updatedAt)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: CMS Overview & Workspace */}
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1.8fr]">
        {/* CMS Overview */}
        <div className="rounded-2xl border border-border bg-overlay p-6 flex flex-col justify-between shadow-xs">
          <div>
            <h3 className="text-lg font-semibold text-fg">Tổng quan CMS</h3>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 mt-5">
            {/* Mini Card 1 */}
            <div className="rounded-xl border border-border bg-muted/20 px-4 py-4 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-fg">
                  Mục chờ duyệt
                </p>
                <p className="mt-2 text-4xl font-extrabold text-fg">
                  {overview.pendingReview.length.toLocaleString("vi-VN")}
                </p>
              </div>
              <p className="mt-4 text-xs text-muted-fg">
                Hạng mục đang chờ xử lý
              </p>
            </div>

            {/* Mini Card 2 */}
            <div className="rounded-xl border border-border bg-muted/20 px-4 py-4 flex flex-col justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-fg">
                  Cập nhật gần đây
                </p>
                <p className="mt-2 text-4xl font-extrabold text-fg">
                  {overview.recentActivity.length.toLocaleString("vi-VN")}
                </p>
              </div>
              <p className="mt-4 text-xs text-muted-fg">
                Các thay đổi mới nhất trong hệ thống
              </p>
            </div>
          </div>
        </div>

        {/* Workspace */}
        <div className="rounded-2xl border border-border bg-overlay p-6 shadow-xs">
          <h3 className="text-lg font-semibold text-fg mb-5">
            Không gian làm việc
          </h3>

          <div className="grid gap-4 sm:grid-cols-3">
            {/* Module quản trị */}
            <div className="rounded-xl border border-border bg-muted/10 p-4 flex flex-col gap-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary-subtle text-primary">
                <Squares2X2Icon className="size-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-fg">
                  Module quản trị khả dụng
                </p>
                <p className="text-2xl font-bold text-fg">
                  {overview.workspace.accessibleCollections} /{" "}
                  {overview.workspace.accessibleCollections}
                </p>
                <p className="text-[10px] text-muted-fg">
                  Tất cả module đang hoạt động
                </p>
              </div>
            </div>

            {/* Nút tổ chức */}
            <div className="rounded-xl border border-border bg-muted/10 p-4 flex flex-col gap-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary-subtle text-primary">
                <ShareIcon className="size-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-fg">Nút tổ chức</p>
                <p className="text-2xl font-bold text-fg">
                  {overview.workspace.organizationNodes.toLocaleString("vi-VN")}
                </p>
                <div className="text-[10px] text-muted-fg space-y-0.5">
                  <p>Đơn vị: {overview.workspace.unitsCount ?? 0}</p>
                  <p>Chức vụ: {overview.workspace.positionsCount ?? 0}</p>
                  <p>Phân công: {overview.workspace.appointmentsCount ?? 0}</p>
                </div>
              </div>
            </div>

            {/* Người dùng */}
            <div className="rounded-xl border border-border bg-muted/10 p-4 flex flex-col gap-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary-subtle text-primary">
                <UsersIcon className="size-5" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-fg">
                  Người dùng hệ thống
                </p>
                <p className="text-2xl font-bold text-fg">
                  {overview.workspace.usersCount ?? 0}
                </p>
                <p className="text-[10px] text-muted-fg mt-auto">
                  Hoạt động trong 30 ngày qua
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
