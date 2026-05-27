import { parseAsInteger, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import { useMemo, useRef, useState } from "react";
import { useAsyncList } from "react-stately";
import type { CmsTablePaginationMeta } from "@/components/cms/types";
import { fetchInertiaCollectionPage } from "@/components/cms/inertia-collection-loader";
import type { CmsTableSortDirection } from "@/components/cms/types";

interface UseCmsTableQueryStateConfig<TItem extends object> {
  defaultPerPage?: number;
  defaultSortColumn: string;
  defaultSortDirection?: CmsTableSortDirection;
  initialItems: TItem[];
  initialMeta: CmsTablePaginationMeta;
  resourceKey: string;
}

interface ReloadOptions {
  page?: number;
  resetPage?: boolean;
}

export function useCmsTableQueryState<TItem extends object>({
  defaultPerPage = 10,
  defaultSortColumn,
  defaultSortDirection = "desc",
  initialItems,
  initialMeta,
  resourceKey,
}: UseCmsTableQueryStateConfig<TItem>) {
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
  const queryRef = useRef(query);
  queryRef.current = query;
  const [meta, setMeta] = useState(initialMeta);
  const initialItemsRef = useRef(initialItems);

  const list = useAsyncList<TItem>({
    async load({ signal }) {
      const { items, meta: nextMeta } = await fetchInertiaCollectionPage(
        resourceKey,
        queryRef.current,
        signal,
      );

      setMeta((currentMeta) => {
        if (!nextMeta || typeof nextMeta !== "object") {
          return currentMeta;
        }

        return nextMeta as unknown as CmsTablePaginationMeta;
      });

      return {
        items: items as TItem[],
      };
    },
  });

  const items = useMemo<TItem[]>(
    () =>
      list.loadingState === "loading" && list.items.length === 0
        ? initialItemsRef.current
        : list.items,
    [list.items, list.loadingState],
  );

  async function syncQuery(
    nextQuery: Partial<typeof query>,
    options: ReloadOptions = {},
  ): Promise<void> {
    const resolvedQuery = {
      ...queryRef.current,
      ...nextQuery,
      page: options.page ?? (options.resetPage ? 1 : nextQuery.page ?? queryRef.current.page),
    };

    queryRef.current = resolvedQuery;
    await setQuery(resolvedQuery);
    list.reload();
  }

  return {
    data: items,
    isReloading: list.isLoading,
    list,
    meta,
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
