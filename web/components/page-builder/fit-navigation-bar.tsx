import {
  ArrowRightStartOnRectangleIcon,
  Cog6ToothIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { measureNaturalWidth, prepareWithSegments } from "@chenglou/pretext";
import { router } from "@inertiajs/react";
import {
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { twMerge } from "tailwind-merge";
import {
  destroy,
  create as loginCreate,
} from "@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Disclosure,
  DisclosureGroup,
  DisclosurePanel,
  DisclosureTrigger,
} from "@/components/ui/disclosure-group";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
import {
  NavbarGroup,
  NavbarItem,
  NavbarMenu,
  NavbarSubmenu,
} from "@/components/ui/navbar";
import { dashboard as cmsDashboard } from "@/routes/cms";
import { edit } from "@/routes/profile";
import type { AuthUser } from "@/types/shared";
import { useMountEffect } from "@/hooks/use-mount-effect";

const desktopNavigationFont =
  '600 14px "Inter", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
const desktopBrandPrimaryFont =
  '800 20px "Inter", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
const desktopBrandSecondaryFont =
  '500 16px "Inter", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
const desktopActionFont =
  '700 14px "Inter", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
const desktopHeaderHorizontalPadding = 48;
const desktopHeaderColumnGap = 32;
const desktopBrandLogoWidth = 64;
const desktopBrandGap = 16;
const desktopSearchButtonWidth = 48;
const desktopActionGap = 12;
const desktopLoginIconWidth = 20;
const desktopLoginGap = 8;
const desktopActionHorizontalPadding = 24;
const desktopProfileAvatarWidth = 32;
const desktopProfileNameMaxWidth = 144;
const desktopNavigationItemHorizontalPadding = 32;
const desktopNavigationItemGap = 4;
const desktopNavigationFitSafetyMargin = 24;
const measuredNavigationItemWidths = new Map<string, number>();

export interface FitNavigationItem {
  children: FitNavigationItem[];
  id: number;
  target: string;
  title: string;
  url: string;
}

export interface FitNavigationBarProps {
  authUser: AuthUser | null;
  canViewCms?: boolean;
  className?: string;
  currentPath: string;
  loginLabel?: string;
  logoAlt?: string;
  logoUrl?: string;
  menuAriaLabel?: string;
  menuItems: FitNavigationItem[];
  organizationName?: string;
  profileLabel?: string;
  searchHref?: string;
  searchLabel?: string;
  siteName?: string;
}

export function FitNavigationBar({
  authUser,
  canViewCms = false,
  className,
  currentPath,
  loginLabel = "Đăng nhập",
  logoAlt,
  logoUrl,
  menuAriaLabel = "Menu điều hướng chính",
  menuItems,
  organizationName = "Trường Đại học Hàng hải Việt Nam",
  profileLabel = "Tài khoản",
  searchHref = "/search",
  searchLabel = "Tìm kiếm",
  siteName = "Khoa CNTT",
}: FitNavigationBarProps) {
  const headerElementRef = useRef<HTMLElement | null>(null);
  const headerInlineSize = useElementInlineSize(headerElementRef);
  const shouldUseCompactNavigation = useMemo(
    () =>
      shouldUseMobileNavigationLayout({
        authUser,
        headerWidth: headerInlineSize,
        items: menuItems,
        loginLabel,
        organizationName,
        siteName,
      }),
    [
      authUser,
      headerInlineSize,
      loginLabel,
      menuItems,
      organizationName,
      siteName,
    ],
  );

  return (
    <header
      ref={headerElementRef}
      className={twMerge(
        "relative z-200 w-full overflow-visible rounded-3xl border border-border bg-bg/95 px-3 py-2.5 text-fg shadow-xl shadow-fg/5 backdrop-blur md:px-6 md:py-3",
        className,
      )}
    >
      <div
        className={twMerge(
          "hidden w-full items-center gap-8 lg:flex",
          shouldUseCompactNavigation ? "lg:hidden" : "",
        )}
      >
        <BrandLockup
          logoAlt={logoAlt}
          logoUrl={logoUrl}
          organizationName={organizationName}
          siteName={siteName}
        />

        <DesktopNavigation
          currentPath={currentPath}
          items={menuItems}
          label={menuAriaLabel}
        />

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <IconLinkButton href={searchHref} label={searchLabel}>
            <MagnifyingGlassIcon />
          </IconLinkButton>
          <DesktopAuthAction
            authUser={authUser}
            canViewCms={canViewCms}
            loginLabel={loginLabel}
            profileLabel={profileLabel}
          />
        </div>
      </div>

      <div
        className={twMerge(
          "flex w-full items-center gap-3 lg:hidden",
          shouldUseCompactNavigation ? "lg:flex" : "",
        )}
      >
        <BrandLockup
          className="min-w-0 flex-1"
          compact
          logoAlt={logoAlt}
          logoUrl={logoUrl}
          organizationName={organizationName}
          siteName={siteName}
        />

        <div className="flex shrink-0 items-center gap-2">
          <IconLinkButton href={searchHref} label={searchLabel} size="mobile">
            <MagnifyingGlassIcon />
          </IconLinkButton>
          <MobileNavigationDrawer
            authUser={authUser}
            canViewCms={canViewCms}
            currentPath={currentPath}
            loginLabel={loginLabel}
            logoAlt={logoAlt}
            logoUrl={logoUrl}
            menuAriaLabel={menuAriaLabel}
            menuItems={menuItems}
            organizationName={organizationName}
            profileLabel={profileLabel}
            siteName={siteName}
          />
        </div>
      </div>
    </header>
  );
}

function BrandLockup({
  className,
  compact = false,
  logoAlt,
  logoUrl,
  organizationName,
  siteName,
}: {
  className?: string;
  compact?: boolean;
  logoAlt?: string;
  logoUrl?: string;
  organizationName: string;
  siteName: string;
}) {
  return (
    <Link
      className={twMerge(
        "flex min-w-0 shrink-0 items-center gap-4 text-fg [--text:var(--color-fg)]",
        className,
      )}
      href="/"
    >
      {logoUrl ? (
        <img
          alt={logoAlt || siteName}
          className={twMerge(
            "shrink-0 object-contain",
            compact ? "size-11 md:size-16" : "size-14 md:size-16",
          )}
          src={logoUrl}
        />
      ) : (
        <span
          className={twMerge(
            "flex shrink-0 items-center justify-center rounded-2xl border border-border bg-muted text-sm font-bold text-primary",
            compact ? "size-11 md:size-16" : "size-14 md:size-16",
          )}
        >
          FIT
        </span>
      )}

      <span className="min-w-0">
        <span
          className={twMerge(
            "block truncate font-extrabold tracking-tight text-fg md:text-xl",
            compact ? "text-base" : "text-lg",
          )}
        >
          {siteName}
        </span>
        <span
          className={twMerge(
            "block truncate font-medium text-muted-fg md:text-base",
            compact ? "text-xs" : "text-sm",
          )}
        >
          {organizationName}
        </span>
      </span>
    </Link>
  );
}

function DesktopNavigation({
  currentPath,
  items,
  label,
}: {
  currentPath: string;
  items: FitNavigationItem[];
  label: string;
}) {
  return (
    <nav aria-label={label} className="min-w-0 flex-1">
      <NavbarGroup
        className="flex min-w-0 items-center justify-center gap-1 overflow-visible"
        delayCloseMs={250}
        delayOpenMs={100}
      >
        {items.map((item) => (
          <DesktopNavigationEntry
            currentPath={currentPath}
            item={item}
            key={item.id}
          />
        ))}
      </NavbarGroup>
    </nav>
  );
}

function DesktopNavigationEntry({
  currentPath,
  item,
}: {
  currentPath: string;
  item: FitNavigationItem;
}) {
  const isCurrent = isNavigationBranchCurrent(item, currentPath);
  const hasChildren = item.children.length > 0;

  return (
    <NavbarMenu
      className="group/navigation-item flex w-auto max-w-full flex-col"
      menuId={`fit-navigation-item-${item.id}`}
    >
      <NavbarItem
        className={twMerge(
          "relative min-h-12 whitespace-nowrap px-4 text-sm font-semibold text-muted-fg hover:bg-transparent hover:text-primary",
          "after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:origin-center after:scale-x-0 after:rounded-full after:bg-primary after:transition-transform",
          "hover:after:scale-x-100 aria-[current=page]:bg-transparent aria-[current=page]:text-primary aria-[current=page]:after:scale-x-100",
        )}
        href={item.url}
        isCurrent={isCurrent}
        target={item.target === "_blank" ? "_blank" : undefined}
      >
        {item.title}
      </NavbarItem>
      {hasChildren ? (
        <NavbarSubmenu className="border border-border bg-overlay shadow-xl ring-1 ring-border/60">
          {item.children.map((child) => (
            <Link
              className={twMerge(
                "rounded-lg px-3 py-2 text-sm font-medium transition [--text:var(--color-muted-fg)] hover:bg-muted/60 hover:[--text:var(--color-fg)]",
                isNavigationItemCurrent(child.url, currentPath)
                  ? "bg-muted [--text:var(--color-fg)]"
                  : "",
              )}
              href={child.url}
              key={child.id}
              target={child.target === "_blank" ? "_blank" : undefined}
            >
              {child.title}
            </Link>
          ))}
        </NavbarSubmenu>
      ) : null}
    </NavbarMenu>
  );
}

function IconLinkButton({
  children,
  href,
  label,
  size = "desktop",
}: {
  children: ReactNode;
  href: string;
  label: string;
  size?: "desktop" | "mobile";
}) {
  return (
    <Link
      aria-label={label}
      className={twMerge(
        "inline-flex items-center justify-center rounded-2xl text-fg transition [--text:var(--color-fg)] hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring",
        size === "mobile" ? "size-10" : "size-12",
      )}
      href={href}
    >
      <span className={size === "mobile" ? "size-4" : "size-5"}>
        {children}
      </span>
    </Link>
  );
}

function DesktopAuthAction({
  authUser,
  canViewCms,
  loginLabel,
  profileLabel,
}: {
  authUser: AuthUser | null;
  canViewCms: boolean;
  loginLabel: string;
  profileLabel: string;
}) {
  if (!authUser) {
    return (
      <Link
        className="inline-flex min-h-12 items-center gap-2 rounded-2xl bg-primary px-3 text-sm font-bold text-primary-fg transition [--text:var(--color-primary-fg)] hover:bg-primary/90"
        href={loginCreate.url()}
      >
        <UserIcon className="size-5" />
        {loginLabel}
      </Link>
    );
  }

  return (
    <Menu>
      <MenuTrigger
        aria-label={profileLabel}
        className="inline-flex min-h-12 items-center gap-2 rounded-2xl border border-border bg-bg px-3 text-sm font-bold text-fg shadow-sm transition hover:bg-muted"
      >
        <Avatar
          className="size-8 *:size-8"
          initials={getUserInitials(authUser)}
          src={authUser.gravatar}
        />
        <span className="max-w-36 truncate">{authUser.name}</span>
      </MenuTrigger>
      <MenuContent className="min-w-64" placement="bottom right">
        <MenuSection>
          <MenuHeader separator>
            <span className="block">{authUser.name}</span>
            <span className="font-normal text-muted-fg">{authUser.email}</span>
          </MenuHeader>
        </MenuSection>
        <ProfileMenuItems canViewCms={canViewCms} />
      </MenuContent>
    </Menu>
  );
}

function MobileNavigationDrawer({
  authUser,
  canViewCms,
  currentPath,
  loginLabel,
  logoAlt,
  logoUrl,
  menuAriaLabel,
  menuItems,
  organizationName,
  profileLabel,
  siteName,
}: {
  authUser: AuthUser | null;
  canViewCms: boolean;
  currentPath: string;
  loginLabel: string;
  logoAlt?: string;
  logoUrl?: string;
  menuAriaLabel: string;
  menuItems: FitNavigationItem[];
  organizationName: string;
  profileLabel: string;
  siteName: string;
}) {
  return (
    <Drawer>
      <DrawerTrigger
        aria-label={menuAriaLabel}
        className="inline-flex size-10 items-center justify-center rounded-2xl border border-border bg-bg text-fg shadow-sm transition hover:border-primary/30 hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Bars3Icon className="size-5" />
      </DrawerTrigger>
      <DrawerContent
        aria-label={menuAriaLabel}
        backdropBlur={false}
        className="max-w-sm"
        notch={false}
        overlay={{ className: "z-[300]" }}
        side="right"
      >
        <DrawerHeader className="border-b border-border">
          <BrandLockup
            logoAlt={logoAlt}
            logoUrl={logoUrl}
            organizationName={organizationName}
            siteName={siteName}
          />
          <DrawerTitle className="sr-only">{menuAriaLabel}</DrawerTitle>
        </DrawerHeader>
        <DrawerBody className="gap-6 px-4 py-5">
          <nav aria-label={menuAriaLabel}>
            <div className="space-y-1">
              {menuItems.map((item) => (
                <MobileNavigationEntry
                  currentPath={currentPath}
                  item={item}
                  key={item.id}
                />
              ))}
            </div>
          </nav>

          <div className="border-t border-border pt-5">
            <MobileAuthSection
              authUser={authUser}
              canViewCms={canViewCms}
              loginLabel={loginLabel}
              profileLabel={profileLabel}
            />
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}

function MobileNavigationEntry({
  currentPath,
  item,
}: {
  currentPath: string;
  item: FitNavigationItem;
}) {
  const hasChildren = item.children.length > 0;
  const isCurrent = isNavigationBranchCurrent(item, currentPath);

  if (!hasChildren) {
    return (
      <Link
        className={twMerge(
          "flex min-h-12 items-center rounded-2xl px-4 text-base font-bold transition [--text:var(--color-fg)] hover:bg-muted",
          isCurrent ? "bg-primary-subtle [--text:var(--color-primary)]" : "",
        )}
        href={item.url}
        target={item.target === "_blank" ? "_blank" : undefined}
      >
        {item.title}
      </Link>
    );
  }

  return (
    <DisclosureGroup className="gap-y-0 [--disclosure-collapsed-border:transparent] [--disclosure-collapsed-bg:transparent] [--disclosure-expanded-border:transparent] [--disclosure-expanded-bg:transparent] [--disclosure-gutter-x:--spacing(0)]">
      <Disclosure className="inset-ring-transparent bg-transparent">
        <div className="flex min-w-0 items-center gap-1">
          <Link
            className={twMerge(
              "flex min-h-12 min-w-0 flex-1 items-center rounded-2xl px-4 text-base font-bold transition [--text:var(--color-fg)] hover:bg-muted",
              isCurrent
                ? "bg-primary-subtle [--text:var(--color-primary)]"
                : "",
            )}
            href={item.url}
            target={item.target === "_blank" ? "_blank" : undefined}
          >
            {item.title}
          </Link>
          <DisclosureTrigger
            aria-label={`Mở hoặc đóng menu ${item.title}`}
            className="size-8 text-base font-bold text-fg hover:bg-muted"
          />
        </div>
        <DisclosurePanel>
          <div className="space-y-1 pl-4">
            {item.children.map((child) => (
              <Link
                className={twMerge(
                  "flex min-h-10 items-center rounded-xl px-3 text-sm font-semibold transition [--text:var(--color-muted-fg)] hover:bg-muted hover:[--text:var(--color-fg)]",
                  isNavigationItemCurrent(child.url, currentPath)
                    ? "bg-muted [--text:var(--color-fg)]"
                    : "",
                )}
                href={child.url}
                key={child.id}
                target={child.target === "_blank" ? "_blank" : undefined}
              >
                {child.title}
              </Link>
            ))}
          </div>
        </DisclosurePanel>
      </Disclosure>
    </DisclosureGroup>
  );
}

function MobileAuthSection({
  authUser,
  canViewCms,
  loginLabel,
  profileLabel,
}: {
  authUser: AuthUser | null;
  canViewCms: boolean;
  loginLabel: string;
  profileLabel: string;
}) {
  if (!authUser) {
    return (
      <Link
        className="flex min-h-12 items-center gap-3 rounded-2xl bg-primary text-base font-bold text-primary-fg [--text:var(--color-primary-fg)]"
        href={loginCreate.url()}
      >
        <UserIcon className="size-5" />
        {loginLabel}
      </Link>
    );
  }

  return (
    <DisclosureGroup>
      <Disclosure defaultExpanded>
        <DisclosureTrigger className="min-h-12 rounded-2xl px-4 text-base font-bold text-fg">
          <span className="flex min-w-0 items-center gap-3">
            <Avatar
              className="size-8 *:size-8"
              initials={getUserInitials(authUser)}
              src={authUser.gravatar}
            />
            <span className="min-w-0 truncate">{profileLabel}</span>
          </span>
        </DisclosureTrigger>
        <DisclosurePanel>
          <div className="mb-3 rounded-xl bg-muted/40 px-3 py-2">
            <div className="truncate text-sm font-bold text-fg">
              {authUser.name}
            </div>
            <div className="truncate text-xs text-muted-fg">
              {authUser.email}
            </div>
          </div>
          <div className="space-y-1">
            <MobileProfileLink href={edit.url()} icon={<UserCircleIcon />}>
              Hồ sơ cá nhân
            </MobileProfileLink>
            <MobileProfileLink
              href="/settings/password"
              icon={<ShieldCheckIcon />}
            >
              Đổi mật khẩu
            </MobileProfileLink>
            {canViewCms ? (
              <MobileProfileLink href={cmsDashboard.url()} icon={<HomeIcon />}>
                Mở CMS
              </MobileProfileLink>
            ) : null}
            <MobileProfileLink href={edit.url()} icon={<Cog6ToothIcon />}>
              Cài đặt tài khoản
            </MobileProfileLink>
            <Button
              className="flex min-h-10 w-full items-center justify-start gap-3 rounded-xl px-3 text-sm font-semibold text-danger transition hover:bg-danger-subtle"
              intent="plain"
              onPress={() => router.post(destroy.url())}
            >
              <ArrowRightStartOnRectangleIcon />
              Đăng xuất
            </Button>
          </div>
        </DisclosurePanel>
      </Disclosure>
    </DisclosureGroup>
  );
}

function MobileProfileLink({
  children,
  href,
  icon,
}: {
  children: ReactNode;
  href: string;
  icon: ReactNode;
}) {
  return (
    <Link
      className="flex min-h-10 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition [--text:var(--color-muted-fg)] hover:bg-muted hover:[--text:var(--color-fg)]"
      href={href}
    >
      <span className="size-5">{icon}</span>
      {children}
    </Link>
  );
}

function ProfileMenuItems({ canViewCms }: { canViewCms: boolean }) {
  return (
    <>
      <MenuItem href={edit.url()}>
        <UserCircleIcon />
        Hồ sơ cá nhân
      </MenuItem>
      <MenuItem href="/settings/password">
        <ShieldCheckIcon />
        Đổi mật khẩu
      </MenuItem>
      {canViewCms ? (
        <MenuItem href={cmsDashboard.url()}>
          <HomeIcon />
          Mở CMS
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
    </>
  );
}

function getUserInitials(user: AuthUser): string {
  return user.name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function isNavigationBranchCurrent(
  item: FitNavigationItem,
  currentPath: string,
): boolean {
  return (
    isNavigationItemCurrent(item.url, currentPath) ||
    item.children.some((child) =>
      isNavigationItemCurrent(child.url, currentPath),
    )
  );
}

function isNavigationItemCurrent(
  itemUrl: string,
  currentPath: string,
): boolean {
  if (isPlaceholderNavigationUrl(itemUrl)) {
    return false;
  }

  const normalizedCurrentPath = normalizeNavigationPath(currentPath);
  const normalizedItemPath = normalizeNavigationPath(itemUrl);

  if (!normalizedCurrentPath || !normalizedItemPath) {
    return false;
  }

  if (normalizedItemPath === "/") {
    return normalizedCurrentPath === "/";
  }

  return (
    normalizedCurrentPath === normalizedItemPath ||
    normalizedCurrentPath.startsWith(`${normalizedItemPath}/`)
  );
}

function isPlaceholderNavigationUrl(value: string): boolean {
  const trimmedValue = value.trim();

  return (
    trimmedValue === "" ||
    trimmedValue === "#" ||
    trimmedValue.startsWith("#") ||
    trimmedValue.toLowerCase().startsWith("javascript:")
  );
}

function normalizeNavigationPath(value: string): string {
  try {
    const url = value.startsWith("http")
      ? new URL(value)
      : new URL(value, "https://fit-vmu.local");
    const pathname = url.pathname.replace(/\/+$/, "");

    return pathname === "" ? "/" : pathname;
  } catch {
    return value.replace(/\/+$/, "") || "/";
  }
}

function shouldUseMobileNavigationLayout({
  authUser,
  headerWidth,
  items,
  loginLabel,
  organizationName,
  siteName,
}: {
  authUser: AuthUser | null;
  headerWidth: number;
  items: FitNavigationItem[];
  loginLabel: string;
  organizationName: string;
  siteName: string;
}): boolean {
  if (headerWidth <= 0 || !canMeasureTextWithoutDom()) {
    return false;
  }

  return (
    getDesktopNavigationRequiredWidth({
      authUser,
      items,
      loginLabel,
      organizationName,
      siteName,
    }) > headerWidth
  );
}

function getDesktopNavigationRequiredWidth({
  authUser,
  items,
  loginLabel,
  organizationName,
  siteName,
}: {
  authUser: AuthUser | null;
  items: FitNavigationItem[];
  loginLabel: string;
  organizationName: string;
  siteName: string;
}): number {
  return (
    desktopHeaderHorizontalPadding +
    getDesktopBrandWidth(siteName, organizationName) +
    desktopHeaderColumnGap +
    getDesktopNavigationWidth(items) +
    desktopHeaderColumnGap +
    getDesktopActionsWidth(authUser, loginLabel) +
    desktopNavigationFitSafetyMargin
  );
}

function getDesktopBrandWidth(
  siteName: string,
  organizationName: string,
): number {
  return (
    desktopBrandLogoWidth +
    desktopBrandGap +
    Math.max(
      measureTextWidth(siteName, desktopBrandPrimaryFont),
      measureTextWidth(organizationName, desktopBrandSecondaryFont),
    )
  );
}

function getDesktopNavigationWidth(items: FitNavigationItem[]): number {
  const itemWidths = items.map((item) => getDesktopNavigationItemWidth(item));
  const gapWidth =
    Math.max(itemWidths.length - 1, 0) * desktopNavigationItemGap;

  return itemWidths.reduce((total, width) => total + width, gapWidth);
}

function getDesktopNavigationItemWidth(item: FitNavigationItem): number {
  const cacheKey = `${desktopNavigationFont}:${item.title}`;
  const cachedWidth = measuredNavigationItemWidths.get(cacheKey);

  if (cachedWidth !== undefined) {
    return cachedWidth;
  }

  const measuredWidth =
    measureTextWidth(item.title, desktopNavigationFont) +
    desktopNavigationItemHorizontalPadding;

  measuredNavigationItemWidths.set(cacheKey, measuredWidth);

  return measuredWidth;
}

function getDesktopActionsWidth(
  authUser: AuthUser | null,
  loginLabel: string,
): number {
  return (
    desktopSearchButtonWidth +
    desktopActionGap +
    (authUser
      ? desktopActionHorizontalPadding +
        desktopProfileAvatarWidth +
        desktopLoginGap +
        Math.min(
          measureTextWidth(authUser.name, desktopActionFont),
          desktopProfileNameMaxWidth,
        )
      : desktopActionHorizontalPadding +
        desktopLoginIconWidth +
        desktopLoginGap +
        measureTextWidth(loginLabel, desktopActionFont))
  );
}

function measureTextWidth(text: string, font: string): number {
  return measureNaturalWidth(prepareWithSegments(text, font));
}

function canMeasureTextWithoutDom(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function useElementInlineSize<TElement extends HTMLElement>(
  elementRef: RefObject<TElement | null>,
): number {
  const [inlineSize, setInlineSize] = useState(0);

  useMountEffect(() => {
    const element = elementRef.current;

    if (!element || typeof ResizeObserver === "undefined") {
      return;
    }

    const updateInlineSize = (nextInlineSize: number): void => {
      setInlineSize((currentInlineSize) =>
        currentInlineSize === nextInlineSize
          ? currentInlineSize
          : nextInlineSize,
      );
    };

    updateInlineSize(Math.round(element.getBoundingClientRect().width));

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) {
        return;
      }

      const borderBoxSize = Array.isArray(entry.borderBoxSize)
        ? entry.borderBoxSize[0]
        : entry.borderBoxSize;

      updateInlineSize(
        Math.round(borderBoxSize?.inlineSize ?? entry.contentRect.width),
      );
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  });

  return inlineSize;
}
