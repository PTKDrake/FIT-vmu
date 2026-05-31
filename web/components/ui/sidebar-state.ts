const SIDEBAR_COOKIE_NAME = "sidebar_state";

export function parseSidebarOpenState(cookieHeader: string): boolean | null {
  const sidebarStateCookie = cookieHeader
    .split(";")
    .map((segment) => segment.trim())
    .find((segment) => segment.startsWith(`${SIDEBAR_COOKIE_NAME}=`));

  if (!sidebarStateCookie) {
    return null;
  }

  const cookieValue = sidebarStateCookie.split("=")[1];

  if (cookieValue === "true") {
    return true;
  }

  if (cookieValue === "false") {
    return false;
  }

  return null;
}

export { SIDEBAR_COOKIE_NAME };
