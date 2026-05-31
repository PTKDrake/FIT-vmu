export const CMS_SIDEBAR_EXPANDED_GROUPS_STORAGE_KEY =
  "cms-sidebar-expanded-groups";

export function parseCmsSidebarExpandedGroups(
  storageValue: string | null,
): string[] {
  if (!storageValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(storageValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter(
      (value): value is string => typeof value === "string" && value.length > 0,
    );
  } catch {
    return [];
  }
}

export function stringifyCmsSidebarExpandedGroups(
  groupTitles: Iterable<string>,
): string {
  return JSON.stringify(Array.from(new Set(groupTitles)));
}

export function resolveCmsSidebarExpandedGroups(
  activeGroupTitle: string | null,
  storedGroups: Iterable<string>,
): string[] {
  const expandedGroups = new Set(storedGroups);

  if (activeGroupTitle) {
    expandedGroups.add(activeGroupTitle);
  }

  return Array.from(expandedGroups);
}

export function getCmsNavigationCompactLabel(title: string): string {
  const words = title
    .replace(/&/g, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);

  if (words.length === 0) {
    return "";
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return words
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}
