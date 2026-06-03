import {
  
  shouldInterceptInternalAnchorNavigation
} from "../lib/navigation/anchor-navigation";
import type {AnchorNavigationCandidate} from "../lib/navigation/anchor-navigation";

export type UnsavedAnchorNavigationCandidate = AnchorNavigationCandidate;

export function shouldInterceptUnsavedAnchorNavigation(
  candidate: UnsavedAnchorNavigationCandidate,
): boolean {
  return shouldInterceptInternalAnchorNavigation(candidate);
}
