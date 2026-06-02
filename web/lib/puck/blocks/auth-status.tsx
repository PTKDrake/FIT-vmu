import {
  ArrowRightStartOnRectangleIcon,
  Cog6ToothIcon,
  HomeIcon,
  ShieldCheckIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { router, usePage } from "@inertiajs/react";
import { twMerge } from "tailwind-merge";
import {
  destroy,
  create as loginCreate,
} from "@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController";
import { create as registerCreate } from "@/actions/App/Http/Controllers/Auth/RegisteredUserController";
import { Avatar } from "@/components/ui/avatar";
import { Link } from "@/components/ui/link";
import {
  Menu,
  MenuContent,
  MenuHeader,
  MenuItem,
  MenuSection,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import { edit } from "@/routes/profile";
import type { SharedData } from "@/types/shared";
import type { PageBuilderComponentConfig } from "./types";

export const AuthStatusComponentConfig: PageBuilderComponentConfig<"AuthStatus"> =
  {
    label: "Đăng nhập / Hồ sơ",
    defaultProps: {
      alignment: "right",
      buttonLabel: "Đăng nhập",
      showName: true,
      showEmail: true,
      showRegisterLink: false,
      showCmsLink: true,
      profileVariant: "avatarName",
      className: "",
    },
    fields: {
      alignment: {
        type: "select",
        label: "Căn lề",
        options: [
          { label: "Trái", value: "left" },
          { label: "Giữa", value: "center" },
          { label: "Phải", value: "right" },
        ],
      },
      buttonLabel: { type: "text", label: "Nhãn nút đăng nhập" },
      showName: {
        type: "radio",
        label: "Hiện tên",
        options: [
          { label: "Có", value: true },
          { label: "Không", value: false },
        ],
      },
      showEmail: {
        type: "radio",
        label: "Hiện email",
        options: [
          { label: "Có", value: true },
          { label: "Không", value: false },
        ],
      },
      showRegisterLink: {
        type: "radio",
        label: "Hiện đăng ký",
        options: [
          { label: "Có", value: true },
          { label: "Không", value: false },
        ],
      },
      showCmsLink: {
        type: "radio",
        label: "Hiện link CMS",
        options: [
          { label: "Có", value: true },
          { label: "Không", value: false },
        ],
      },
      profileVariant: {
        type: "select",
        label: "Kiểu hồ sơ",
        options: [
          { label: "Avatar + tên", value: "avatarName" },
          { label: "Avatar", value: "avatar" },
          { label: "Gọn", value: "compact" },
        ],
      },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    render: (props) => <AuthStatusBlock {...props} />,
  };

function AuthStatusBlock({
  alignment = "right",
  buttonLabel = "Đăng nhập",
  showName = true,
  showEmail = true,
  showRegisterLink = false,
  showCmsLink = true,
  profileVariant = "avatarName",
  className,
}: {
  alignment?: "left" | "center" | "right";
  buttonLabel?: string;
  showName?: boolean;
  showEmail?: boolean;
  showRegisterLink?: boolean;
  showCmsLink?: boolean;
  profileVariant?: "avatar" | "avatarName" | "compact";
  className?: string;
}) {
  const { auth } = usePage<SharedData>().props;
  const alignmentClass = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  }[alignment];

  if (!auth.user) {
    return (
      <div
        className={twMerge(
          "flex flex-wrap items-center gap-2",
          alignmentClass,
          className,
        )}
      >
        <Link
          href={loginCreate.url()}
          className="inline-flex min-h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-fg transition hover:bg-primary/90"
        >
          {buttonLabel || "Đăng nhập"}
        </Link>
        {showRegisterLink ? (
          <Link
            href={registerCreate.url()}
            className="inline-flex min-h-10 items-center justify-center rounded-lg border border-border bg-bg px-4 text-sm font-semibold text-fg transition hover:bg-muted/50"
          >
            Đăng ký
          </Link>
        ) : null}
      </div>
    );
  }

  const userInitials = auth.user.name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const canViewCms = auth.permissions.includes("view admin dashboard");
  const displayText =
    profileVariant === "compact"
      ? auth.user.name
      : profileVariant === "avatarName" && showName
        ? auth.user.name
        : null;

  return (
    <div className={twMerge("flex items-center", alignmentClass, className)}>
      <Menu>
        <MenuTrigger
          aria-label="Hồ sơ người dùng"
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-bg px-2.5 text-sm font-semibold text-fg transition hover:bg-muted/50"
        >
          <Avatar
            className="size-8 *:size-8"
            initials={userInitials}
            src={auth.user.gravatar}
          />
          {displayText ? (
            <span className="max-w-40 truncate">{displayText}</span>
          ) : null}
        </MenuTrigger>
        <MenuContent className="min-w-64" placement="bottom right">
          <MenuSection>
            <MenuHeader separator>
              <span className="block">{auth.user.name}</span>
              {showEmail ? (
                <span className="font-normal text-muted-fg">
                  {auth.user.email}
                </span>
              ) : null}
            </MenuHeader>
          </MenuSection>
          <MenuItem href={edit.url()}>
            <UserCircleIcon />
            Hồ sơ cá nhân
          </MenuItem>
          <MenuItem href="/settings/password">
            <ShieldCheckIcon />
            Đổi mật khẩu
          </MenuItem>
          {showCmsLink && canViewCms ? (
            <MenuItem href="/cms">
              <HomeIcon />
              CMS
            </MenuItem>
          ) : null}
          <MenuSeparator />
          <MenuItem href={edit.url()}>
            <Cog6ToothIcon />
            Cài đặt tài khoản
          </MenuItem>
          <MenuItem onAction={() => router.post(destroy.url())}>
            <ArrowRightStartOnRectangleIcon />
            Đăng xuất
          </MenuItem>
        </MenuContent>
      </Menu>
    </div>
  );
}
