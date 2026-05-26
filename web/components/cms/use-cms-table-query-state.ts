import { router } from "@inertiajs/react";
import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { useState } from "react";
import type { CmsTableSortDirection } from "@/components/cms/types";

interface UseCmsTableQueryStateConfig {
  defaultPerPage?: number;
  defaultSortColumn: string;
  defaultSortDirection?: CmsTableSortDirection;
  only?: string[];
}

interface ReloadOptions {
  page?: number;
  resetPage?: boolean;
}

export function useCmsTableQueryState({
  defaultPerPage = 10,
  defaultSortColumn,
  defaultSortDirection = "desc",
  only,
}: UseCmsTableQueryStateConfig) {
  const [isReloading, setIsReloading] = useState(false);
  const [query, setQuery] = useQueryStates(
    {
      direction: parseAsStringLiteral(["asc", "desc"]).withDefault(
        defaultSortDirection,
      ),
      page: parseAsInteger.withDefault(1),
      perPage: parseAsInteger.withDefault(defaultPerPage),
      search: parseAsString.withDefault(""),
      sort: parseAsString.withDefault(defaultSortColumn),
      status: parseAsString.withDefault("all"),
    },
    {
      clearOnDefault: true,
      history: "replace",
      scroll: false,
      shallow: true,
    },
  );

  async function syncQuery(
    nextQuery: Partial<typeof query>,
    options: ReloadOptions = {},
  ): Promise<void> {
    await setQuery({
      ...nextQuery,
      page: options.page ?? (options.resetPage ? 1 : nextQuery.page),
    });

    router.reload({
      only,
      replace: true,
      onFinish: () => setIsReloading(false),
      onStart: () => setIsReloading(true),
    });
  }

  return {
    isReloading,
    query,
    async setPage(page: number): Promise<void> {
      await syncQuery({ page }, { page });
    },
    async setPerPage(perPage: number): Promise<void> {
      await syncQuery({ perPage }, { resetPage: true });
    },
    async setSearch(search: string): Promise<void> {
      await syncQuery({ search }, { resetPage: true });
    },
    async setSorting(
      column: string,
      direction: CmsTableSortDirection,
    ): Promise<void> {
      await syncQuery({
        direction,
        sort: column,
      });
    },
    async setStatus(status: string): Promise<void> {
      await syncQuery({ status }, { resetPage: true });
    },
  };
}
