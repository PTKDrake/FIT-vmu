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
import { getPuckBlockDomId, isPuckEditorPreview } from "./shared";
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
      layoutPreset: "default",
      fullWidthOnMobile: false,
      autoWidthFromMd: false,
      noShrinkFromMd: false,
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
      layoutPreset: {
        type: "select",
        label: "Bố cục sẵn",
        options: [
          { label: "Mặc định", value: "default" },
          { label: "Cụm hành động header", value: "headerActions" },
        ],
      },
      fullWidthOnMobile: {
        type: "radio",
        label: "Đầy chiều rộng trên mobile",
        options: [
          { label: "Có", value: true },
          { label: "Không", value: false },
        ],
      },
      autoWidthFromMd: {
        type: "radio",
        label: "Tự co chiều rộng từ tablet",
        options: [
          { label: "Có", value: true },
          { label: "Không", value: false },
        ],
      },
      noShrinkFromMd: {
        type: "radio",
        label: "Giữ kích thước từ tablet",
        options: [
          { label: "Có", value: true },
          { label: "Không", value: false },
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
  layoutPreset = "default",
  fullWidthOnMobile = false,
  autoWidthFromMd = false,
  noShrinkFromMd = false,
  className,
  id,
}: {
  alignment?: "left" | "center" | "right";
  buttonLabel?: string;
  showName?: boolean;
  showEmail?: boolean;
  showRegisterLink?: boolean;
  showCmsLink?: boolean;
  profileVariant?: "avatar" | "avatarName" | "compact";
  layoutPreset?: "default" | "headerActions";
  fullWidthOnMobile?: boolean;
  autoWidthFromMd?: boolean;
  noShrinkFromMd?: boolean;
  className?: string;
  id?: string;
}) {
  const { auth } = usePage<SharedData>().props;
  const isEditorPreview = isPuckEditorPreview();
  const domId = getPuckBlockDomId(id);
  const alignmentClass = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  }[alignment];
  const layoutPresetClass =
    layoutPreset === "headerActions" ? "w-full md:w-auto md:shrink-0" : "";
  const responsiveWidthClass = twMerge(
    fullWidthOnMobile ? "w-full" : "",
    autoWidthFromMd ? "md:w-auto" : "",
    noShrinkFromMd ? "md:shrink-0" : "",
  );

  if (!auth.user) {
    return (
      <div
        id={domId}
        className={twMerge(
          "flex flex-wrap items-center gap-2",
          alignmentClass,
          layoutPresetClass,
          responsiveWidthClass,
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

  const userInitials = isEditorPreview
    ? "TK"
    : auth.user.name
        .split(" ")
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
  const canViewCms = auth.permissions.includes("view admin dashboard");
  const displayText = isEditorPreview
    ? "Tài khoản"
    : profileVariant === "compact"
      ? auth.user.name
      : profileVariant === "avatarName" && showName
        ? auth.user.name
        : null;

  if (isEditorPreview) {
    return (
      <div
        id={domId}
        className={twMerge(
          "flex items-center",
          alignmentClass,
          layoutPresetClass,
          responsiveWidthClass,
          className,
        )}
      >
        <div className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-bg px-2.5 text-sm font-semibold text-fg">
          <Avatar
            className="size-8 *:size-8"
            initials={userInitials}
          />
          {displayText ? (
            <span className="max-w-40 truncate">{displayText}</span>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div
      id={domId}
      className={twMerge(
        "flex items-center",
        alignmentClass,
        layoutPresetClass,
        responsiveWidthClass,
        className,
      )}
    >
      <Menu>
        <MenuTrigger
          aria-label="Hồ sơ người dùng"
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-bg px-2.5 text-sm font-semibold text-fg transition hover:bg-muted/50"
        >
          <Avatar
            className="size-8 *:size-8"
            initials={userInitials}
            src={isEditorPreview ? undefined : auth.user.gravatar}
          />
          {displayText ? (
            <span className="max-w-40 truncate">{displayText}</span>
          ) : null}
        </MenuTrigger>
        <MenuContent className="min-w-64" placement="bottom right">
          <MenuSection>
            <MenuHeader separator>
              <span className="block">
                {isEditorPreview ? "Xem trước layout" : auth.user.name}
              </span>
              {showEmail ? (
                <span className="font-normal text-muted-fg">
                  {isEditorPreview ? "Tài khoản hiện tại" : auth.user.email}
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
