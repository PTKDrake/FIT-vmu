import { usePage } from "@inertiajs/react";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
import { FitNavigationBar } from "@/components/page-builder/fit-navigation-bar";
import type { FitNavigationItem } from "@/components/page-builder/fit-navigation-bar";
import { Heading } from "@/components/ui/heading";
import { Link } from "@/components/ui/link";
import {
  NavbarGroup,
  NavbarItem,
  NavbarMenu,
  NavbarSubmenu,
} from "@/components/ui/navbar";
import { useIsMobile } from "@/hooks/use-mobile";
import { getPuckImageUrl } from "@/lib/puck/media";
import type { PuckImageValue } from "@/lib/puck/media";
import type { SharedData } from "@/types/shared";
import { getPuckBlockDomId, isPuckEditorPreview } from "../shared";
import { getSurfaceClassName, puckSurfaceFields } from "../surface";
import type { PageBuilderComponentConfig } from "../types";
import {
  EmptyDynamicState,
  buildNavigationMenuFieldOptions,
  getBlockLayoutPresetClass,
  getResponsiveMaxWidthClass,
  getResponsivePositionClass,
  getResponsiveTextAlignClass,
  parseOptionalId,
  usePuckDynamicData,
} from "./shared";
import type {
  PuckDynamicNavigationItem,
  PuckDynamicNavigationMenu,
} from "./shared";

interface NavigationMenuBlockProps {
  className?: string;
  layoutPreset?: string;
  fullWidthOnMobile?: boolean;
  autoWidthFromMd?: boolean;
  noShrinkFromMd?: boolean;
  growFromMd?: boolean;
  basisFromMd?: "none" | "44rem";
  maxWidth?: "default" | "none" | "sm";
  textAlign?: "left" | "center" | "right";
  textAlignFromLg?: "inherit" | "left" | "center" | "right";
  positionFromLg?: "inherit" | "start" | "center" | "end";
  menuId?: string;
  mobileButtonLabel?: string;
  mobileLogoAlt?: string;
  mobileLogoUrl?: PuckImageValue;
  mobilePanelTitle?: string;
  orientation?: string;
  title?: string;
  surfaceBorder?: "none" | "subtle" | "default" | "strong" | "dashed";
  surfacePadding?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  surfaceRadius?: "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  surfaceShadow?: "none" | "sm" | "md";
  surfaceTone?: "transparent" | "bg" | "overlay" | "muted" | "subtle";
}

interface FitNavigationHeaderBlockProps {
  className?: string;
  id?: string;
  logoAlt?: string;
  logoUrl?: PuckImageValue;
  loginLabel?: string;
  menuAriaLabel?: string;
  menuId?: string;
  organizationName?: string;
  profileLabel?: string;
  searchHref?: string;
  searchLabel?: string;
  siteName?: string;
}

function FitNavigationHeaderBlock(props: FitNavigationHeaderBlockProps) {
  const {
    className,
    id,
    logoAlt = "Logo Khoa CNTT",
    logoUrl,
    loginLabel = "Đăng nhập",
    menuAriaLabel = "Menu điều hướng chính",
    menuId,
    organizationName = "Trường Đại học Hàng hải Việt Nam",
    profileLabel = "Tài khoản",
    searchHref = "/search",
    searchLabel = "Tìm kiếm",
    siteName = "Khoa CNTT",
  } = props;
  const domId = getPuckBlockDomId(id);
  const dynamicData = usePuckDynamicData();
  const pageUrl = usePage().url;
  const { auth } = usePage<SharedData>().props;
  const selectedMenuId = parseOptionalId(menuId);
  const menu =
    dynamicData.navigationMenus.find((navigationMenu) =>
      selectedMenuId ? navigationMenu.id === selectedMenuId : true,
    ) ?? null;

  return (
    <section
      id={domId}
      data-vmu-puck-block="fit-navigation-header"
      className={twMerge("w-full", className)}
    >
      <FitNavigationBar
        authUser={auth.user}
        canViewCms={auth.permissions.includes("view admin dashboard")}
        currentPath={pageUrl}
        loginLabel={loginLabel}
        logoAlt={logoAlt}
        logoUrl={getPuckImageUrl(logoUrl)}
        menuAriaLabel={menuAriaLabel}
        menuItems={(menu?.items ?? []) as FitNavigationItem[]}
        organizationName={organizationName}
        profileLabel={profileLabel}
        searchHref={searchHref}
        searchLabel={searchLabel}
        siteName={siteName}
      />
    </section>
  );
}

function NavigationMenuBlock(props: NavigationMenuBlockProps) {
  const {
    title,
    menuId,
    layoutPreset,
    fullWidthOnMobile,
    autoWidthFromMd,
    noShrinkFromMd,
    growFromMd,
    basisFromMd,
    maxWidth,
    textAlign,
    textAlignFromLg,
    positionFromLg,
    orientation,
    surfaceTone,
    surfaceBorder,
    surfaceRadius,
    surfacePadding,
    surfaceShadow,
    className,
  } = props;
  const id = getPuckBlockDomId((props as { id?: string }).id);
  const navigationMenus = usePuckDynamicData().navigationMenus;
  const pageUrl = usePage().url;
  const isMobile = useIsMobile();
  const isEditorPreview = isPuckEditorPreview();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const selectedMenuId = parseOptionalId(menuId);
  const previewMenu =
    selectedMenuId === null ? (navigationMenus[0] ?? null) : null;

  const menu =
    navigationMenus.find((navigationMenu) =>
      selectedMenuId ? navigationMenu.id === selectedMenuId : true,
    ) ?? (isPuckEditorPreview() ? previewMenu : null);

  if (!menuId && !menu) {
    return <EmptyDynamicState label="Chưa chọn menu điều hướng để hiển thị." />;
  }

  if (!menu || menu.items.length === 0) {
    return <EmptyDynamicState label="Không có menu điều hướng để hiển thị." />;
  }

  const layoutClassName = twMerge(
    getBlockLayoutPresetClass(layoutPreset),
    fullWidthOnMobile ? "w-full" : "",
    autoWidthFromMd ? "md:w-auto" : "",
    noShrinkFromMd ? "md:shrink-0" : "",
    growFromMd ? "md:grow" : "",
    basisFromMd === "44rem" ? "md:basis-[44rem]" : "",
    maxWidth === "none" ? "md:max-w-none" : "",
    getResponsiveMaxWidthClass(maxWidth),
    getResponsiveTextAlignClass(textAlign),
    textAlignFromLg === "inherit"
      ? ""
      : getResponsiveTextAlignClass(textAlignFromLg, "lg"),
    positionFromLg === "inherit"
      ? ""
      : getResponsivePositionClass(positionFromLg, "lg"),
  );
  const editorPreviewLayoutClassName =
    isEditorPreview && orientation !== "vertical"
      ? "w-full max-w-none min-w-fit md:basis-[44rem] md:grow"
      : "";
  const editorPreviewNavClassName =
    isEditorPreview && orientation !== "vertical"
      ? "w-full min-w-0"
      : "w-full min-w-0";
  const editorPreviewItemsClassName =
    isEditorPreview && orientation !== "vertical"
      ? "flex min-w-fit gap-1"
      : "flex min-w-0 gap-1";

  if (orientation !== "vertical" && isMobile && !isEditorPreview) {
    return (
      <MobileNavigationMenu
        buttonLabel={props.mobileButtonLabel}
        className={className}
        currentPath={pageUrl}
        isOpen={isDrawerOpen}
        layoutClassName={layoutClassName}
        logoAlt={props.mobileLogoAlt}
        logoUrl={getPuckImageUrl(props.mobileLogoUrl)}
        menu={menu}
        panelTitle={props.mobilePanelTitle}
        title={title}
        layoutPreset={layoutPreset}
        onOpenChange={setIsDrawerOpen}
        surfaceBorder={surfaceBorder}
        surfacePadding={surfacePadding}
        surfaceRadius={surfaceRadius}
        surfaceShadow={surfaceShadow}
        surfaceTone={surfaceTone}
      />
    );
  }

  return (
    <section
      id={id}
      data-vmu-puck-block="navigation-menu"
      data-vmu-navigation-orientation={
        orientation === "vertical" ? "vertical" : "horizontal"
      }
      className={twMerge(
        "@container/nav min-w-0 space-y-3",
        getSurfaceClassName(
          {
            surfaceTone,
            surfaceBorder,
            surfaceRadius,
            surfacePadding,
            surfaceShadow,
          },
          "",
        ),
        layoutClassName,
        editorPreviewLayoutClassName,
        className,
      )}
    >
      {title ? (
        <Heading level={3} className="text-sm font-bold text-fg">
          {title}
        </Heading>
      ) : null}
      <nav aria-label={menu.name} className={editorPreviewNavClassName}>
        <NavbarGroup
          className={twMerge(
            editorPreviewItemsClassName,
            orientation === "vertical"
              ? "flex-col items-stretch"
              : "flex-row flex-wrap items-center justify-center xl:justify-between",
          )}
          delayCloseMs={orientation === "vertical" ? 0 : 150}
          delayOpenMs={orientation === "vertical" ? 0 : 100}
        >
          {menu.items.map((item) => (
            <NavigationMenuEntry
              currentPath={pageUrl}
              item={item}
              key={item.id}
              orientation={orientation}
            />
          ))}
        </NavbarGroup>
      </nav>
    </section>
  );
}

interface MobileNavigationMenuProps {
  buttonLabel?: string;
  className?: string;
  currentPath: string;
  isOpen: boolean;
  layoutClassName?: string;
  logoAlt?: string;
  logoUrl?: string;
  menu: PuckDynamicNavigationMenu;
  panelTitle?: string;
  layoutPreset?: string;
  title?: string;
  onOpenChange: (nextOpen: boolean) => void;
  surfaceBorder?: NavigationMenuBlockProps["surfaceBorder"];
  surfacePadding?: NavigationMenuBlockProps["surfacePadding"];
  surfaceRadius?: NavigationMenuBlockProps["surfaceRadius"];
  surfaceShadow?: NavigationMenuBlockProps["surfaceShadow"];
  surfaceTone?: NavigationMenuBlockProps["surfaceTone"];
}

function MobileNavigationMenu({
  buttonLabel,
  className,
  currentPath,
  isOpen,
  layoutClassName,
  logoAlt,
  logoUrl,
  menu,
  layoutPreset,
  panelTitle,
  title,
  onOpenChange,
  surfaceBorder,
  surfacePadding,
  surfaceRadius,
  surfaceShadow,
  surfaceTone,
}: MobileNavigationMenuProps) {
  return (
    <section
      className={twMerge(
        "@container/nav min-w-0 w-full max-w-none space-y-3 md:w-auto",
        getSurfaceClassName(
          {
            surfaceTone,
            surfaceBorder,
            surfaceRadius,
            surfacePadding,
            surfaceShadow,
          },
          "",
        ),
        layoutClassName || getBlockLayoutPresetClass(layoutPreset),
        className,
      )}
    >
      {title ? (
        <Heading level={3} className="text-sm font-bold text-fg">
          {title}
        </Heading>
      ) : null}

      <div className="md:hidden">
        <button
          aria-controls={`mobile-navigation-${menu.id}`}
          aria-expanded={isOpen}
          aria-label={buttonLabel || "Mở menu điều hướng"}
          className="flex min-h-12 w-full items-center gap-3 rounded-lg border border-border bg-overlay px-4 py-2 text-fg shadow-sm transition hover:bg-muted"
          type="button"
          onClick={() => onOpenChange(!isOpen)}
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={logoAlt || menu.name}
              className="size-9 shrink-0 rounded-full border border-border bg-bg object-contain p-1 shadow-sm"
            />
          ) : null}
          {isOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          <div className="min-w-0 flex-1 text-left">
            <div className="truncate text-sm font-semibold">
              {panelTitle || menu.name}
            </div>
            <div className="truncate text-[11px] text-muted-fg">
              {buttonLabel || "Mở menu điều hướng"}
            </div>
          </div>
        </button>
      </div>

      {isOpen
        ? createPortal(
            <div className="fixed inset-0 z-[120] md:hidden">
              <button
                aria-label="Đóng menu điều hướng"
                className="absolute inset-0 bg-fg/70"
                type="button"
                onClick={() => onOpenChange(false)}
              />

              <div
                id={`mobile-navigation-${menu.id}`}
                className="relative isolate h-dvh w-full overflow-y-auto bg-bg pb-8 text-fg shadow-2xl"
              >
                <div className="sticky top-0 z-10 border-b border-border bg-bg/95 px-4 pt-3 pb-4 backdrop-blur">
                  <button
                    aria-label="Đóng menu điều hướng"
                    className="flex h-11 w-full items-center justify-start rounded-lg border border-border bg-overlay px-4 text-fg transition hover:bg-muted"
                    type="button"
                    onClick={() => onOpenChange(false)}
                  >
                    <X className="size-5" />
                  </button>
                  {logoUrl ? (
                    <div className="flex justify-center pt-5">
                      <img
                        src={logoUrl}
                        alt={logoAlt || menu.name}
                        className="size-16 rounded-full border border-border bg-bg object-contain p-1 shadow-lg"
                      />
                    </div>
                  ) : null}
                  {panelTitle ? (
                    <p className="pt-3 text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-fg">
                      {panelTitle}
                    </p>
                  ) : null}
                </div>

                <nav aria-label={menu.name} className="px-4 pt-4">
                  <div className="space-y-0.5">
                    {menu.items.map((item) => (
                      <MobileNavigationMenuEntry
                        currentPath={currentPath}
                        item={item}
                        key={item.id}
                        onNavigate={() => onOpenChange(false)}
                      />
                    ))}
                  </div>
                </nav>
              </div>
            </div>,
            document.body,
          )
        : null}
    </section>
  );
}

function MobileNavigationMenuEntry({
  currentPath,
  item,
  onNavigate,
}: {
  currentPath: string;
  item: PuckDynamicNavigationItem;
  onNavigate: () => void;
}) {
  const hasChildren = item.children.length > 0;
  const isCurrent = isNavigationItemCurrent(item.url, currentPath);
  const hasCurrentChild = item.children.some((child) =>
    isNavigationItemCurrent(child.url, currentPath),
  );
  const [isExpanded, setIsExpanded] = useState(
    normalizeNavigationPath(currentPath) !== "/" && hasCurrentChild,
  );

  if (!hasChildren) {
    return (
      <Link
        className={twMerge(
          "flex min-h-12 items-center border-b border-border/80 py-1 text-base font-semibold text-fg transition hover:text-primary",
          isCurrent ? "text-primary" : "",
        )}
        href={item.url}
        target={item.target === "_blank" ? "_blank" : undefined}
        onClick={onNavigate}
      >
        {item.title}
      </Link>
    );
  }

  return (
    <div className="border-b border-border/80 py-1">
      <div className="flex items-center gap-2">
        <Link
          className={twMerge(
            "flex min-h-12 flex-1 items-center text-base font-semibold text-fg transition hover:text-primary",
            isCurrent ? "text-primary" : "",
          )}
          href={item.url}
          target={item.target === "_blank" ? "_blank" : undefined}
          onClick={onNavigate}
        >
          {item.title}
        </Link>
        <button
          aria-expanded={isExpanded}
          aria-label={`Mở nhóm ${item.title}`}
          className="grid size-10 shrink-0 place-items-center rounded-full text-muted-fg transition hover:bg-muted hover:text-fg"
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <ChevronDown
            className={twMerge(
              "size-4 transition-transform",
              isExpanded ? "rotate-180" : "",
            )}
          />
        </button>
      </div>

      {isExpanded ? (
        <div className="space-y-1 pb-2 ps-3 pt-1">
          {item.children.map((child) => (
            <Link
              className={twMerge(
                "flex min-h-10 items-center rounded-lg bg-overlay px-3 text-sm font-medium text-muted-fg transition hover:bg-muted hover:text-fg",
                isNavigationItemCurrent(child.url, currentPath)
                  ? "bg-muted text-fg"
                  : "",
              )}
              href={child.url}
              key={child.id}
              target={child.target === "_blank" ? "_blank" : undefined}
              onClick={onNavigate}
            >
              {child.title}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function NavigationMenuEntry({
  currentPath,
  item,
  orientation,
}: {
  currentPath: string;
  item: PuckDynamicNavigationItem;
  orientation?: string;
}) {
  const isEditorPreview = isPuckEditorPreview();
  const isVertical = orientation === "vertical";
  const isCurrent = isNavigationBranchCurrent(item, currentPath);
  const hasChildren = item.children.length > 0;

  if (isEditorPreview) {
    return (
      <div
        className={twMerge(
          "flex flex-col gap-2",
          isVertical ? "w-full" : "w-auto min-w-0",
        )}
      >
        <div
          className={twMerge(
            "inline-flex min-h-10 items-center rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap",
            isCurrent ? "bg-secondary/50 text-fg" : "text-fg",
            isVertical ? "w-full justify-start" : "w-auto justify-center",
          )}
        >
          {item.title}
        </div>
        {hasChildren ? (
          <div className="flex flex-col gap-1 ps-3">
            {item.children.map((child) => (
              <Link
                className={twMerge(
                  "rounded-lg px-3 py-2 text-xs font-medium",
                  isNavigationItemCurrent(child.url, currentPath)
                    ? "bg-muted text-fg"
                    : "text-muted-fg",
                )}
                href={child.url}
                key={child.id}
                target={child.target === "_blank" ? "_blank" : undefined}
              >
                {child.title}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <NavbarMenu
      className={twMerge(
        "group/menu-item",
        isVertical ? "w-full" : "flex w-auto max-w-full flex-col",
      )}
      menuId={`puck-navigation-item-${item.id}`}
    >
      <NavbarItem
        className={twMerge(
          "min-h-10 whitespace-nowrap",
          isVertical ? "w-full justify-start" : "w-auto justify-center",
        )}
        href={item.url}
        isCurrent={isCurrent}
        target={item.target === "_blank" ? "_blank" : undefined}
      >
        {item.title}
      </NavbarItem>
      {hasChildren ? (
        <NavbarSubmenu
          className={twMerge(
            isVertical
              ? "md:static md:min-w-0 md:border-0 md:bg-transparent md:p-0 md:shadow-none md:ring-0"
              : "",
          )}
        >
          {item.children.map((child) => (
            <Link
              className={twMerge(
                "rounded-lg px-3 py-2 text-xs font-medium transition",
                isNavigationItemCurrent(child.url, currentPath)
                  ? "bg-muted text-fg"
                  : "text-muted-fg hover:bg-muted/60 hover:text-fg",
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

function isNavigationBranchCurrent(
  item: PuckDynamicNavigationItem,
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

export const FitNavigationHeaderComponentConfig: PageBuilderComponentConfig<"SiteHeader"> =
  {
    label: "Header điều hướng FIT",
    defaultProps: {
      logoUrl: "/logo.png",
      logoAlt: "Logo Khoa CNTT",
      siteName: "Khoa CNTT",
      organizationName: "Trường Đại học Hàng hải Việt Nam",
      menuId: "",
      menuAriaLabel: "Menu điều hướng chính",
      searchHref: "/search",
      searchLabel: "Tìm kiếm",
      loginLabel: "Đăng nhập",
      profileLabel: "Tài khoản",
      className: "",
    },
    fields: {
      logoUrl: { type: "text", label: "Logo" },
      logoAlt: { type: "text", label: "Mô tả logo" },
      siteName: { type: "text", label: "Tên hiển thị" },
      organizationName: { type: "text", label: "Tên đơn vị / trường" },
      menuId: {
        type: "select",
        label: "Menu điều hướng",
        options: [{ label: "Tự động dùng menu đầu tiên", value: "" }],
      },
      menuAriaLabel: { type: "text", label: "Nhãn trợ năng menu" },
      searchHref: { type: "text", label: "Đường dẫn tìm kiếm" },
      searchLabel: { type: "text", label: "Nhãn nút tìm kiếm" },
      loginLabel: { type: "text", label: "Nhãn đăng nhập" },
      profileLabel: { type: "text", label: "Nhãn nhóm hồ sơ mobile" },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    resolveFields: async (_data, { fields, lastFields }) => {
      const lastMenuField = lastFields.menuId;

      if (
        lastMenuField &&
        "options" in lastMenuField &&
        Array.isArray(lastMenuField.options) &&
        lastMenuField.options.length > 1
      ) {
        return lastFields;
      }

      const options = await buildNavigationMenuFieldOptions(
        "Tự động dùng menu đầu tiên",
      );

      if (options === null) {
        return fields;
      }

      return {
        ...fields,
        menuId: {
          type: "select",
          label: "Menu điều hướng",
          options,
        },
      };
    },
    render: (props) => <FitNavigationHeaderBlock {...props} />,
  };

export const NavigationMenuComponentConfig: PageBuilderComponentConfig<"NavigationMenu"> =
  {
    label: "Menu điều hướng",
    defaultProps: {
      title: "",
      menuId: "",
      mobileButtonLabel: "Mở menu",
      mobileLogoAlt: "FIT VMU",
      mobileLogoUrl: "/logo.png",
      mobilePanelTitle: "",
      layoutPreset: "default",
      fullWidthOnMobile: false,
      autoWidthFromMd: false,
      noShrinkFromMd: false,
      growFromMd: false,
      basisFromMd: "none",
      maxWidth: "default",
      textAlign: "left",
      textAlignFromLg: "inherit",
      positionFromLg: "inherit",
      orientation: "horizontal",
      surfaceTone: "transparent",
      surfaceBorder: "none",
      surfaceRadius: "none",
      surfacePadding: "none",
      surfaceShadow: "none",
      className: "",
    },
    fields: {
      ...puckSurfaceFields,
      title: { type: "text", label: "Tiêu đề phụ" },
      menuId: {
        type: "select",
        label: "Menu điều hướng",
        options: [{ label: "Chưa chọn menu điều hướng", value: "" }],
      },
      orientation: {
        type: "select",
        label: "Hướng hiển thị",
        options: [
          { label: "Ngang", value: "horizontal" },
          { label: "Dọc", value: "vertical" },
        ],
      },
      layoutPreset: {
        type: "select",
        label: "Bố cục sẵn",
        options: [
          { label: "Mặc định", value: "default" },
          { label: "Menu chính ở header", value: "headerPrimary" },
          { label: "Menu footer canh phải", value: "footerMenu" },
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
      growFromMd: {
        type: "radio",
        label: "Giãn ra từ tablet",
        options: [
          { label: "Có", value: true },
          { label: "Không", value: false },
        ],
      },
      basisFromMd: {
        type: "select",
        label: "Chiều rộng nền từ tablet",
        options: [
          { label: "Không đặt", value: "none" },
          { label: "Rộng (44rem)", value: "44rem" },
        ],
      },
      maxWidth: {
        type: "select",
        label: "Chiều rộng tối đa",
        options: [
          { label: "Mặc định", value: "default" },
          { label: "Không giới hạn", value: "none" },
          { label: "Nhỏ (sm)", value: "sm" },
        ],
      },
      textAlign: {
        type: "select",
        label: "Canh chữ trên mobile",
        options: [
          { label: "Trái", value: "left" },
          { label: "Giữa", value: "center" },
          { label: "Phải", value: "right" },
        ],
      },
      textAlignFromLg: {
        type: "select",
        label: "Canh chữ từ desktop",
        options: [
          { label: "Giữ như mobile", value: "inherit" },
          { label: "Trái", value: "left" },
          { label: "Giữa", value: "center" },
          { label: "Phải", value: "right" },
        ],
      },
      positionFromLg: {
        type: "select",
        label: "Vị trí khối từ desktop",
        options: [
          { label: "Giữ mặc định", value: "inherit" },
          { label: "Bám trái", value: "start" },
          { label: "Giữa", value: "center" },
          { label: "Bám phải", value: "end" },
        ],
      },
      mobileButtonLabel: { type: "text", label: "Nhãn trợ năng nút mobile" },
      mobileLogoUrl: { type: "text", label: "Logo trong menu mobile" },
      mobileLogoAlt: { type: "text", label: "Mô tả logo mobile" },
      mobilePanelTitle: {
        type: "text",
        label: "Tiêu đề nhỏ trong menu mobile",
      },
      className: { type: "text", label: "Lớp CSS bổ sung" },
    },
    resolveFields: async (_data, { fields, lastFields }) => {
      const lastMenuField = lastFields.menuId;

      if (
        lastMenuField &&
        "options" in lastMenuField &&
        Array.isArray(lastMenuField.options) &&
        lastMenuField.options.length > 1
      ) {
        return lastFields;
      }

      const options = await buildNavigationMenuFieldOptions(
        "Chưa chọn menu điều hướng",
      );

      if (options === null) {
        return fields;
      }

      return {
        ...fields,
        menuId: {
          type: "select",
          label: "Menu điều hướng",
          options,
        },
      };
    },
    render: (props) => <NavigationMenuBlock {...props} />,
  };
