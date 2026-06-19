import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { router } from "@inertiajs/react";
import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import {
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalTitle,
} from "@/components/ui/modal";
import { useMountEffect } from "@/hooks/use-mount-effect";
import type { FitNavigationItem } from "./fit-navigation-bar";

interface FitNavigationSearchProps {
  fallbackHref: string;
  label: string;
  menuItems: FitNavigationItem[];
  triggerSize: "desktop" | "mobile";
}

interface PublicSearchResponse {
  query: string;
  results: PublicSearchResult[];
}

interface PublicSearchResult {
  description: string | null;
  title: string;
  type: string;
  url: string;
}

interface SearchDisplayResult {
  description: string | null;
  key: string;
  title: string;
  type: string;
  url: string;
}

interface SearchResultGroup {
  key: string;
  label: string;
  results: SearchDisplayResult[];
}

const searchTypeLabels: Record<string, string> = {
  category: "Danh mục",
  navigation: "Điều hướng",
  page: "Trang",
  post: "Bài viết",
};

const resultGroupOrder = ["page", "post", "category"];

export function FitNavigationSearch({
  fallbackHref,
  label,
  menuItems,
  triggerSize,
}: FitNavigationSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PublicSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const defaultGroups = useMemo(
    () => navigationGroupsFromMenuItems(menuItems),
    [menuItems],
  );

  const resultGroups = useMemo(
    () => groupsFromSearchResults(results),
    [results],
  );

  const normalizedQuery = query.trim();

  const search = useCallback((nextQuery: string): void => {
    const normalizedNextQuery = nextQuery.trim();

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    abortControllerRef.current?.abort();

    if (normalizedNextQuery.length < 2) {
      setResults([]);
      setIsSearching(false);
      setHasSearched(false);

      return;
    }

    setIsSearching(true);

    timeoutRef.current = window.setTimeout(() => {
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      fetch(searchUrl(normalizedNextQuery), {
        headers: {
          Accept: "application/json",
        },
        signal: abortController.signal,
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Search request failed.");
          }

          return response.json() as Promise<PublicSearchResponse>;
        })
        .then((payload) => {
          setResults(payload.results);
          setHasSearched(true);
        })
        .catch((error: unknown) => {
          if (error instanceof DOMException && error.name === "AbortError") {
            return;
          }

          setResults([]);
          setHasSearched(true);
        })
        .finally(() => {
          if (!abortController.signal.aborted) {
            setIsSearching(false);
          }
        });
    }, 180);
  }, []);

  useMountEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }

      abortControllerRef.current?.abort();
    };
  });

  function openSearch(): void {
    setIsOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  function closeSearch(): void {
    setIsOpen(false);
  }

  function updateQuery(nextQuery: string): void {
    setQuery(nextQuery);
    search(nextQuery);
  }

  function visitResult(url: string): void {
    setIsOpen(false);
    router.visit(url);
  }

  return (
    <>
      <SearchIconButton label={label} onPress={openSearch} size={triggerSize}>
        <MagnifyingGlassIcon />
      </SearchIconButton>

      <ModalContent
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        size="2xl"
        aria-label={label}
        className="row-start-1 mt-30 flex h-[min(24rem,calc(var(--visual-viewport-height,100vh)-6rem))] w-[90vw] flex-col overflow-hidden rounded-2xl shadow-3xl border border-border bg-bg p-0 ring-3 ring-ring/20 sm:row-start-2 sm:mt-0 sm:h-[min(36rem,calc(var(--visual-viewport-height,100vh)-2rem))] sm:w-full"
        overlay={{ className: "z-[600] backdrop-blur-none " }}
      >
        <ModalHeader className="shrink-0 border-b border-border p-0">
          <ModalTitle className="sr-only">{label}</ModalTitle>
          <div className="flex min-h-12 items-center gap-2.5 px-3 pe-11 sm:min-h-14 sm:gap-3 sm:px-4">
            <MagnifyingGlassIcon className="size-4 shrink-0 text-muted-fg sm:size-5" />
            <input
              ref={inputRef}
              aria-label={label}
              className="h-12 min-w-0 flex-1 bg-transparent text-sm text-fg outline-none placeholder:text-muted-fg sm:h-14 sm:text-base"
              onChange={(event) => updateQuery(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  closeSearch();
                }

                if (event.key === "Enter") {
                  const firstResult =
                    normalizedQuery.length < 2
                      ? defaultGroups[0]?.results[0]
                      : resultGroups[0]?.results[0];

                  if (firstResult) {
                    visitResult(firstResult.url);
                  }
                }
              }}
              placeholder="Nhập từ khóa tìm kiếm..."
              value={query}
            />
          </div>
        </ModalHeader>

        <ModalBody className="min-h-0 flex-1 gap-0 overflow-y-auto px-1.5 py-2 sm:px-2 sm:py-3">
          {normalizedQuery.length < 2 ? (
            <GroupedSearchResults
              groups={defaultGroups}
              onVisit={visitResult}
            />
          ) : null}

          {normalizedQuery.length >= 2 && isSearching ? (
            <SearchEmptyState>Đang tìm kiếm...</SearchEmptyState>
          ) : null}

          {normalizedQuery.length >= 2 &&
          !isSearching &&
          hasSearched &&
          results.length === 0 ? (
            <SearchEmptyState>Không tìm thấy kết quả phù hợp.</SearchEmptyState>
          ) : null}

          {normalizedQuery.length >= 2 && !isSearching && results.length > 0 ? (
            <GroupedSearchResults groups={resultGroups} onVisit={visitResult} />
          ) : null}

          <a className="sr-only" href={fallbackHref}>
            {label}
          </a>
        </ModalBody>
      </ModalContent>
    </>
  );
}

function GroupedSearchResults({
  groups,
  onVisit,
}: {
  groups: SearchResultGroup[];
  onVisit: (url: string) => void;
}) {
  if (groups.length === 0) {
    return <SearchEmptyState>Chưa có liên kết điều hướng.</SearchEmptyState>;
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {groups.map((group) => (
        <section aria-labelledby={`search-group-${group.key}`} key={group.key}>
          <h3
            className="px-2.5 pb-1 text-xs font-semibold text-muted-fg sm:px-3"
            id={`search-group-${group.key}`}
          >
            {group.label}
          </h3>
          <div className="space-y-1">
            {group.results.map((result) => (
              <button
                className="flex w-full min-w-0 items-start gap-2.5 rounded-xl px-2.5 py-2.5 text-left transition hover:bg-muted focus-visible:bg-muted focus-visible:outline-none sm:gap-3 sm:px-3 sm:py-3"
                key={result.key}
                onClick={() => onVisit(result.url)}
                type="button"
              >
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-muted text-muted-fg sm:size-6">
                  <ChevronRightIcon className="size-3.5 sm:size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-fg">
                    {result.title}
                  </span>
                  {result.description ? (
                    <span className="mt-0.5 block line-clamp-2 text-xs text-muted-fg sm:mt-1 sm:text-sm">
                      {result.description}
                    </span>
                  ) : null}
                </span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function SearchEmptyState({ children }: { children: ReactNode }) {
  return (
    <div className="px-4 py-10 text-center text-sm text-muted-fg">
      {children}
    </div>
  );
}

function SearchIconButton({
  children,
  label,
  onPress,
  size = "desktop",
}: {
  children: ReactNode;
  label: string;
  onPress: () => void;
  size?: "desktop" | "mobile";
}) {
  return (
    <button
      aria-label={label}
      className={twMerge(
        "inline-flex items-center justify-center rounded-2xl text-fg transition [--text:var(--color-fg)] hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring",
        size === "mobile" ? "size-10" : "size-12",
      )}
      onClick={onPress}
      type="button"
    >
      <span className={size === "mobile" ? "size-4" : "size-5"}>
        {children}
      </span>
    </button>
  );
}

function navigationGroupsFromMenuItems(
  menuItems: FitNavigationItem[],
): SearchResultGroup[] {
  const results = menuItems
    .filter((item) => !isPlaceholderNavigationUrl(item.url))
    .map((item) => ({
      description: null,
      key: `navigation:${item.id}`,
      title: item.title,
      type: "navigation",
      url: item.url,
    }));

  if (results.length === 0) {
    return [];
  }

  return [
    {
      key: "navigation",
      label: "Trang",
      results,
    },
  ];
}

function groupsFromSearchResults(
  results: PublicSearchResult[],
): SearchResultGroup[] {
  const groupedResults = new Map<string, SearchDisplayResult[]>();

  for (const result of results) {
    const type = result.type || "other";
    const currentResults = groupedResults.get(type) ?? [];

    currentResults.push({
      description: result.description,
      key: `${type}:${result.url}`,
      title: result.title,
      type,
      url: result.url,
    });

    groupedResults.set(type, currentResults);
  }

  return [...groupedResults.entries()]
    .sort(([leftType], [rightType]) => {
      const leftIndex = resultGroupOrder.indexOf(leftType);
      const rightIndex = resultGroupOrder.indexOf(rightType);

      if (leftIndex === -1 && rightIndex === -1) {
        return leftType.localeCompare(rightType);
      }

      if (leftIndex === -1) {
        return 1;
      }

      if (rightIndex === -1) {
        return -1;
      }

      return leftIndex - rightIndex;
    })
    .map(([type, groupResults]) => ({
      key: type,
      label: searchTypeLabels[type] ?? "Khác",
      results: groupResults,
    }));
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

function searchUrl(query: string): string {
  return `/search?${new URLSearchParams({ q: query }).toString()}`;
}
