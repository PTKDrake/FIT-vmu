import {
  ArrowRightStartOnRectangleIcon,
  Cog6ToothIcon,
  HomeIcon,
  LifebuoyIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import { router } from "@inertiajs/react";
import { destroy } from "@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController";
import { cmsDashboardHref } from "@/components/cms/navigation";
import { Avatar } from "@/components/ui/avatar";
import {
  Menu,
  MenuContent,
  MenuHeader,
  MenuItem,
  MenuSection,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu";
import { SidebarFooter, SidebarLabel } from "@/components/ui/sidebar";
import { home } from "@/routes";
import { edit } from "@/routes/profile";
import type { SharedData } from "@/types/shared";

export function CmsSidebarFooter({
  user,
}: {
  user: SharedData["auth"]["user"];
}) {
  const userInitials = user?.name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <SidebarFooter className="flex flex-row justify-between gap-4 group-data-[state=collapsed]:flex-col">
      <Menu>
        <MenuTrigger
          className="flex w-full items-center justify-between"
          aria-label="Hồ sơ người dùng"
        >
          <div className="flex items-center gap-x-2">
            <Avatar
              className="size-8 *:size-8 group-data-[state=collapsed]:size-6 group-data-[state=collapsed]:*:size-6"
              isSquare
              initials={userInitials}
              src={user?.gravatar}
            />
            <div className="in-data-[collapsible=dock]:hidden text-sm">
              <SidebarLabel>{user?.name}</SidebarLabel>
              <span className="-mt-0.5 block text-muted-fg">{user?.email}</span>
            </div>
          </div>
        </MenuTrigger>
        <MenuContent
          className="in-data-[sidebar-collapsible=collapsed]:min-w-56 min-w-(--trigger-width)"
          placement="bottom right"
        >
          <MenuSection>
            <MenuHeader separator>
              <span className="block">{user?.name}</span>
              <span className="font-normal text-muted-fg">{user?.email}</span>
            </MenuHeader>
          </MenuSection>

          <MenuItem href={cmsDashboardHref}>
            <HomeIcon />
            Dashboard
          </MenuItem>
          <MenuItem href={edit.url()}>
            <Cog6ToothIcon />
            Hồ sơ cá nhân
          </MenuItem>
          <MenuItem href="/settings/password">
            <ShieldCheckIcon />
            Bảo mật
          </MenuItem>
          <MenuSeparator />
          <MenuItem href={home.url()}>
            <LifebuoyIcon />
            Website công khai
          </MenuItem>
          <MenuSeparator />
          <MenuItem onAction={() => router.post(destroy.url())}>
            <ArrowRightStartOnRectangleIcon />
            Đăng xuất
          </MenuItem>
        </MenuContent>
      </Menu>
    </SidebarFooter>
  );
}
