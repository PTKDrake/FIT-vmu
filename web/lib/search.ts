export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .toLowerCase()
    .trim();
}

export function includesNormalizedSearch(value: string, search: string): boolean {
  const normalizedSearch = normalizeSearchText(search);

  if (normalizedSearch === "") {
    return true;
  }

  return normalizeSearchText(value).includes(normalizedSearch);
}
