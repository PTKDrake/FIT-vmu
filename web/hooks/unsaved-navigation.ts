import {
  type AnchorNavigationCandidate,
  shouldInterceptInternalAnchorNavigation,
} from "../lib/navigation/anchor-navigation";

export type UnsavedAnchorNavigationCandidate = AnchorNavigationCandidate;

export function shouldInterceptUnsavedAnchorNavigation(
  candidate: UnsavedAnchorNavigationCandidate,
): boolean {
  return shouldInterceptInternalAnchorNavigation(candidate);
}
