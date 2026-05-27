import {
  ArrowLongDownIcon,
  ArrowLongUpIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/20/solid";
import {
  flexRender,
  functionalUpdate,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";
import type { ColumnDef, SortingState, Updater } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { useMemo } from "react";
import type {
  CmsTablePaginationMeta,
  CmsTableSortDirection,
} from "@/components/cms/types";
import { Button } from "@/components/ui/button";
import { NativeSelect, NativeSelectContent } from "@/components/ui/native-select";
import {
  Pagination,
  PaginationFirst,
  PaginationItem,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SearchField, SearchInput } from "@/components/ui/search-field";
import { Text } from "@/components/ui/text";

interface FilterOption {
  label: string;
  value: string;
}

interface CmsDataTableProps<TData extends object> {
  columns: Array<ColumnDef<TData, any>>;
  data: TData[];
  defaultSort: {
    column: string;
    direction: CmsTableSortDirection;
  };
  description: string;
  emptyDescription: string;
  emptyTitle: string;
  filterOptions?: FilterOption[];
  filterValue?: string;
  isReloading?: boolean;
  meta: CmsTablePaginationMeta;
  onFilterChange?: (value: string) => void | Promise<void>;
  onPageChange: (page: number) => void | Promise<void>;
  onPerPageChange: (value: number) => void | Promise<void>;
  onSearchChange: (value: string) => void | Promise<void>;
  onSortingChange: (
    column: string,
    direction: CmsTableSortDirection,
  ) => void | Promise<void>;
  primaryAction?: ReactNode;
  searchPlaceholder?: string;
  searchValue: string;
  sort: {
    column: string;
    direction: CmsTableSortDirection;
  };
  title: string;
}

const PER_PAGE_OPTIONS = [10, 25, 50];

export function CmsDataTable<TData extends object>({
  columns,
  data,
  defaultSort,
  description,
  emptyDescription,
  emptyTitle,
  filterOptions,
  filterValue = "all",
  isReloading = false,
  meta,
  onFilterChange,
  onPageChange,
  onPerPageChange,
  onSearchChange,
  onSortingChange,
  primaryAction,
  searchPlaceholder = "Tìm kiếm theo từ khóa",
  searchValue,
  sort,
  title,
}: CmsDataTableProps<TData>) {
  const sorting = useMemo<SortingState>(
    () => [
      {
        desc: sort.direction === "desc",
        id: sort.column,
      },
    ],
    [sort.column, sort.direction],
  );

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: meta.lastPage,
    state: {
      sorting,
    },
    onSortingChange: (updater: Updater<SortingState>) => {
      const nextSorting = functionalUpdate(updater, sorting);
      const nextColumn = nextSorting[0];

      if (!nextColumn) {
        void onSortingChange(defaultSort.column, defaultSort.direction);

        return;
      }

      void onSortingChange(
        nextColumn.id,
        nextColumn.desc ? "desc" : "asc",
      );
    },
  });

  return (
    <div className="min-h-[100vh] flex-1 rounded-2xl border border-border bg-overlay md:min-h-min">
      <div className="border-b border-border px-5 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-lg font-semibold text-fg">{title}</p>
            <p className="max-w-3xl text-sm text-muted-fg">{description}</p>
          </div>

          {primaryAction ? <div>{primaryAction}</div> : null}
        </div>
      </div>

      <div className="space-y-4 py-4">
        <div className="grid gap-3 px-5 xl:grid-cols-[minmax(0,1fr)_auto_auto]">
          <SearchField
            key={searchValue}
            aria-label="Tìm kiếm bảng dữ liệu"
            defaultValue={searchValue}
            onClear={() => {
              void onSearchChange("");
            }}
            onSubmit={(value) => {
              void onSearchChange(value);
            }}
          >
            <SearchInput placeholder={searchPlaceholder} />
          </SearchField>

          {filterOptions ? (
            <NativeSelect className="min-w-48">
              <NativeSelectContent
                aria-label="Bộ lọc trạng thái"
                value={filterValue}
                onChange={(event) => {
                  void onFilterChange?.(event.target.value);
                }}
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </NativeSelectContent>
            </NativeSelect>
          ) : null}

          <NativeSelect className="min-w-36">
            <NativeSelectContent
              aria-label="Số dòng mỗi trang"
              value={String(meta.perPage)}
              onChange={(event) => {
                void onPerPageChange(Number(event.target.value));
              }}
            >
              {PER_PAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option} dòng / trang
                </option>
              ))}
            </NativeSelectContent>
          </NativeSelect>
        </div>

        <div className="overflow-x-auto border-y border-border">
          <table className="min-w-full border-collapse">
            <thead className="bg-muted/40">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-border">
                  {headerGroup.headers.map((header) => {
                    const isSorted = header.column.getIsSorted();
                    const canSort = header.column.getCanSort();

                    return (
                      <th
                        key={header.id}
                        scope="col"
                        className="px-4 py-3 text-left text-sm font-medium text-muted-fg first:pl-5 last:pr-5"
                      >
                        {header.isPlaceholder ? null : canSort ? (
                          <Button
                            intent="plain"
                            className="inline-flex min-h-0 items-center gap-2 px-0 py-0 text-sm font-medium text-muted-fg hover:text-fg"
                            onPress={header.column.getToggleSortingHandler()}
                          >
                            <span>
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                            </span>
                            <SortIndicator direction={isSorted} />
                          </Button>
                        ) : (
                          <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-fg">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                          </span>
                        )}
                      </th>
                    );
                  })}
                </tr>
              ))}
            </thead>

            <tbody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border last:border-b-0 hover:bg-muted/30"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-4 py-4 align-top text-sm text-fg first:pl-5 last:pr-5"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-5 py-12 text-center"
                  >
                    <div className="mx-auto max-w-md space-y-2">
                      <p className="text-lg font-semibold text-fg">
                        {emptyTitle}
                      </p>
                      <Text className="text-muted-fg">
                        {emptyDescription}
                      </Text>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 px-5 pb-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <Text>
              {meta.total > 0
                ? `Hiển thị ${meta.from} - ${meta.to} trên ${meta.total} kết quả`
                : "Chưa có dữ liệu phù hợp với bộ lọc hiện tại"}
            </Text>
            {isReloading ? (
              <Text className="text-xs uppercase tracking-[0.18em] text-muted-fg">
                Đang cập nhật dữ liệu
              </Text>
            ) : null}
          </div>

          <Pagination className="mx-0 justify-start lg:justify-end">
            <PaginationList aria-label="Điều hướng phân trang">
              <PaginationFirst
                onPress={() => {
                  void onPageChange(1);
                }}
              />
              <PaginationPrevious
                onPress={() => {
                  void onPageChange(Math.max(meta.currentPage - 1, 1));
                }}
              />
              {buildPaginationItems(meta.currentPage, meta.lastPage).map((item, index) =>
                item === "ellipsis" ? (
                  <li
                    key={`${meta.currentPage}-${item}-${index}`}
                    className="px-2 py-2 text-sm text-muted-fg"
                  >
                    ...
                  </li>
                ) : (
                  <PaginationItem
                    key={item}
                    isCurrent={item === meta.currentPage}
                    onPress={() => {
                      void onPageChange(item);
                    }}
                  >
                    {item}
                  </PaginationItem>
                ),
              )}
              <PaginationNext
                onPress={() => {
                  void onPageChange(Math.min(meta.currentPage + 1, meta.lastPage));
                }}
              />
            </PaginationList>
          </Pagination>
        </div>
      </div>
    </div>
  );
}

function SortIndicator({
  direction,
}: {
  direction: false | "asc" | "desc";
}) {
  if (direction === "asc") {
    return <ArrowLongUpIcon className="size-4 text-fg" />;
  }

  if (direction === "desc") {
    return <ArrowLongDownIcon className="size-4 text-fg" />;
  }

  return <ArrowsUpDownIcon className="size-4 text-muted-fg" />;
}

function buildPaginationItems(
  currentPage: number,
  lastPage: number,
): Array<number | "ellipsis"> {
  if (lastPage <= 5) {
    return Array.from({ length: lastPage }, (_, index) => index + 1);
  }

  if (currentPage <= 3) {
    return [1, 2, 3, 4, "ellipsis", lastPage];
  }

  if (currentPage >= lastPage - 2) {
    return [1, "ellipsis", lastPage - 3, lastPage - 2, lastPage - 1, lastPage];
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    lastPage,
  ];
}
