export interface UnsavedAnchorNavigationCandidate {
  altKey: boolean;
  button: number;
  ctrlKey: boolean;
  currentUrl: string;
  defaultPrevented: boolean;
  download: boolean;
  href: string | null;
  metaKey: boolean;
  shiftKey: boolean;
  target: string | null;
}

export function shouldInterceptUnsavedAnchorNavigation(
  candidate: UnsavedAnchorNavigationCandidate,
): boolean {
  if (
    candidate.defaultPrevented ||
    candidate.button !== 0 ||
    candidate.metaKey ||
    candidate.ctrlKey ||
    candidate.shiftKey ||
    candidate.altKey ||
    candidate.download ||
    candidate.href === null
  ) {
    return false;
  }

  if (
    candidate.target !== null &&
    candidate.target !== "" &&
    candidate.target !== "_self"
  ) {
    return false;
  }

  const nextUrl = new URL(candidate.href, candidate.currentUrl);
  const currentUrl = new URL(candidate.currentUrl);

  if (!["http:", "https:"].includes(nextUrl.protocol)) {
    return false;
  }

  if (nextUrl.origin !== currentUrl.origin) {
    return false;
  }

  if (
    nextUrl.pathname === currentUrl.pathname &&
    nextUrl.search === currentUrl.search &&
    nextUrl.hash !== currentUrl.hash
  ) {
    return false;
  }

  return true;
}
