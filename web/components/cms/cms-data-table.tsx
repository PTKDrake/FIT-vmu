"use no memo";
"use client";

import {
  ArrowLongDownIcon,
  ArrowLongUpIcon,
  ArrowsUpDownIcon,
  FunnelIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";
import {
  ClipboardDocumentIcon,
  ViewColumnsIcon,
} from "@heroicons/react/24/outline";
import {
  flexRender,
  functionalUpdate,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  SortingState,
  Updater,
  VisibilityState,
  Table as TableType,
  ColumnSizingState,
} from "@tanstack/react-table";
import type { ReactNode } from "react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import type {
  CmsTablePaginationMeta,
  CmsTableSortDirection,
} from "@/components/cms/types";
import { Badge } from "@/components/ui/badge";
import type { BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/menu";
import {
  Pagination,
  PaginationFirst,
  PaginationItem,
  PaginationList,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SearchField, SearchInput } from "@/components/ui/search-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { t } from "@/lib/i18n";

// ==========================================
// 1. DataTableBadge (Composing existing UI Badge)
// ==========================================
export interface DataTableBadgeProps extends BadgeProps {
  hasDot?: boolean;
}

export function DataTableBadge({
  intent = "primary",
  children,
  hasDot = true,
  className,
  id,
  style,
  title,
}: DataTableBadgeProps) {
  let dotColorClass = "bg-primary";

  switch (intent) {
    case "primary":
      dotColorClass = "bg-primary";
      break;
    case "secondary":
      dotColorClass = "bg-muted-fg";
      break;
    case "success":
      dotColorClass = "bg-success";
      break;
    case "info":
      dotColorClass = "bg-info";
      break;
    case "warning":
      dotColorClass = "bg-warning";
      break;
    case "danger":
      dotColorClass = "bg-danger";
      break;
    case "outline":
      dotColorClass = "bg-border";
      break;
    default:
      dotColorClass = "bg-primary";
  }

  return (
    <Badge
      intent={intent}
      isCircle={true}
      className={twMerge(
        "text-[11px] py-0.5 px-2.5 font-medium inline-flex items-center gap-1.5 border border-border/30 shadow-2xs transition-colors",
        className,
      )}
      id={id}
      style={style}
      title={title}
    >
      {hasDot && (
        <span
          className={twMerge("size-1.5 rounded-full shrink-0", dotColorClass)}
        />
      )}
      <span>{children}</span>
    </Badge>
  );
}

// ==========================================
// 2. DataTableSearch
// ==========================================
export interface DataTableSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function DataTableSearch({
  value,
  onChange,
  placeholder = "Tìm kiếm...",
  className,
}: DataTableSearchProps) {
  return (
    <SearchField
      key={value}
      aria-label="Tìm kiếm bảng dữ liệu"
      defaultValue={value}
      onClear={() => onChange("")}
      onSubmit={(val) => onChange(val)}
      className={twMerge("w-full sm:max-w-xs", className)}
    >
      <SearchInput placeholder={placeholder} className="w-full text-sm" />
    </SearchField>
  );
}

// ==========================================
// 3. DataTableFilterButton (Accordion Popover Style)
// ==========================================
export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterSection {
  id: string;
  label: string;
  options: FilterOption[];
  selectedValue: string;
  onChange: (value: string) => void | Promise<void>;
}

export interface DataTableFilterButtonProps {
  options?: FilterOption[]; // Single section fallback
  selectedValue?: string;
  onChange?: (value: string) => void | Promise<void>;
  label?: string;
  sections?: FilterSection[]; // Multi-section filters
  className?: string;
}

export function DataTableFilterButton({
  options,
  selectedValue,
  onChange,
  label = "Bộ lọc",
  sections,
  className,
}: DataTableFilterButtonProps) {
  // Auto-wrap single status filter options if sections aren't provided
  const resolvedSections: FilterSection[] =
    sections ||
    (options && selectedValue && onChange
      ? [
          {
            id: "status",
            label: label,
            options,
            selectedValue,
            onChange,
          },
        ]
      : []);

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    section_status: true, // Expand status by default
  });
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>(
    {},
  );

  const toggleSection = (id: string) => {
    if (id === "__proto__" || id === "constructor" || id === "prototype") {
      return;
    }

    const safeId = `section_${id}`;
    setExpandedSections((prev) => {
      const currentVal = prev[safeId] ?? false;

      return {
        ...prev,
        [safeId]: !currentVal,
      };
    });
  };

  // Compute active filters display count
  const activeFiltersCount = resolvedSections.reduce((count, sec) => {
    return (
      count +
      (sec.selectedValue &&
      sec.selectedValue !== "all" &&
      sec.selectedValue !== ""
        ? 1
        : 0)
    );
  }, 0);

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          intent="outline"
          className={twMerge(
            "inline-flex items-center gap-1.5 px-3 py-1.5 tracking-wider border border-border bg-bg hover:bg-muted/40 text-fg rounded-lg transition shadow-2xs",
            className,
          )}
        >
          <FunnelIcon className="size-3.5 text-muted-fg shrink-0" />
          <span>Lọc dữ liệu</span>
          {activeFiltersCount > 0 && (
            <span className="size-4.5 rounded-full bg-primary text-primary-fg flex items-center justify-center text-[10px] font-bold">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0 overflow-hidden rounded-xl border border-border/80 bg-overlay shadow-xl ring ring-muted-fg/10">
        {/* Header */}
        <div className="px-4 py-3 border-b border-border/60 bg-muted/10">
          <span className="font-bold text-sm text-fg">Bộ lọc</span>
        </div>

        {/* Dynamic Filter Sections (Accordions) */}
        <div className="divide-y divide-border/50 max-h-96 overflow-y-auto">
          {resolvedSections.map((section, index) => {
            const sectionId =
              section.id === "__proto__" ||
              section.id === "constructor" ||
              section.id === "prototype"
                ? "default"
                : section.id;
            const safeSectionId = `section_${sectionId}`;
            const isExpanded = expandedSections[safeSectionId] ?? index === 0;
            const searchQuery = searchQueries[sectionId] || "";
            const filteredOptions = section.options.filter((opt) =>
              opt.label.toLowerCase().includes(searchQuery.toLowerCase()),
            );

            return (
              <div key={section.id} className="flex flex-col">
                {/* Accordion header button */}
                <button
                  type="button"
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-xs font-bold text-fg hover:bg-muted/10 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    {isExpanded ? (
                      <ChevronDownIcon className="size-3.5 text-muted-fg shrink-0" />
                    ) : (
                      <ChevronRightIcon className="size-3.5 text-muted-fg shrink-0" />
                    )}
                    <span>{section.label}</span>
                  </div>
                  {section.selectedValue &&
                    section.selectedValue !== "all" &&
                    section.selectedValue !== "" && (
                      <span className="size-2 rounded-full bg-primary shrink-0" />
                    )}
                </button>

                {/* Collapsible panel */}
                {isExpanded && (
                  <div className="flex flex-col bg-muted/5">
                    {/* Option search box (shown if there are multiple options) */}
                    {section.options.length > 4 && (
                      <div className="px-4 py-2 border-b border-border/40 bg-bg/50">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder={`Tìm kiếm ${section.label.toLowerCase()}`}
                            className="w-full text-2xs bg-bg border border-border/80 rounded-md pl-2.5 pr-8 py-1.5 focus:border-ring focus:ring-1 focus:ring-ring outline-hidden"
                            value={searchQuery}
                            onChange={(e) =>
                              setSearchQueries((prev) => ({
                                ...prev,
                                [section.id]: e.target.value,
                              }))
                            }
                          />
                          <MagnifyingGlassIcon className="absolute right-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-fg" />
                        </div>
                      </div>
                    )}

                    {/* Options checkboxes */}
                    <div className="py-1 max-h-40 overflow-y-auto divide-y divide-border/20">
                      {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => {
                          const isChecked =
                            section.selectedValue === option.value;

                          return (
                            <button
                              type="button"
                              key={option.value}
                              onClick={() => {
                                // Single-select check logic: click active resets to "all", click inactive sets value
                                if (isChecked) {
                                  void section.onChange("all");
                                } else {
                                  void section.onChange(option.value);
                                }
                              }}
                              className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-muted/15 cursor-pointer text-xs text-fg select-none transition-colors text-start"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                readOnly
                                className="rounded-sm border-border text-primary focus:ring-primary size-3.5 cursor-pointer shrink-0"
                              />
                              <span
                                className={twMerge(
                                  isChecked && "font-semibold text-primary",
                                )}
                              >
                                {option.label}
                              </span>
                            </button>
                          );
                        })
                      ) : (
                        <div className="px-4 py-3 text-center text-2xs text-muted-fg">
                          {t("Không tìm thấy kết quả")}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ==========================================
// 4. DataTableSortButton (Popover Style)
// ==========================================
export interface SortableColumn {
  id: string;
  label: string;
}

export interface DataTableSortButtonProps {
  columns: SortableColumn[];
  activeSort: {
    column: string;
    direction: "asc" | "desc";
  };
  onChange: (column: string, direction: "asc" | "desc") => void;
  className?: string;
}

export function DataTableSortButton({
  columns,
  activeSort,
  onChange,
  className,
}: DataTableSortButtonProps) {
  const activeCol = columns.find((c) => c.id === activeSort.column);

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          intent="outline"
          className={twMerge(
            "inline-flex items-center gap-1.5 px-3 py-1.5 tracking-wider border border-border bg-bg hover:bg-muted/40 text-fg rounded-lg transition shadow-2xs",
            className,
          )}
        >
          <ArrowsUpDownIcon className="size-3.5 text-muted-fg shrink-0" />
          {activeCol ? (
            <span className="inline-flex items-center gap-1">
              <span>Sắp xếp:</span>
              <Badge>{activeCol.label}</Badge>
            </span>
          ) : (
            <span>Sắp xếp</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 overflow-hidden rounded-xl border border-border/80 bg-overlay shadow-xl ring ring-muted-fg/10">
        <div className="px-4 py-3 border-b border-border/60 bg-muted/10">
          <span className="font-bold text-sm text-fg">Sắp xếp dữ liệu</span>
        </div>

        <div className="divide-y divide-border/50 max-h-80 overflow-y-auto">
          {columns.map((column) => {
            const isSortedAsc =
              activeSort.column === column.id && activeSort.direction === "asc";
            const isSortedDesc =
              activeSort.column === column.id &&
              activeSort.direction === "desc";

            return (
              <div
                key={column.id}
                className="flex items-center justify-between px-4 py-2.5 hover:bg-muted/5 transition-colors"
              >
                <span
                  className={twMerge(
                    "text-xs font-medium text-fg",
                    (isSortedAsc || isSortedDesc) && "font-bold text-primary",
                  )}
                >
                  {column.label}
                </span>
                <div className="flex items-center gap-1 bg-bg border border-border/80 rounded-lg p-0.5 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => onChange(column.id, "asc")}
                    className={twMerge(
                      "p-1 rounded-md transition-all text-muted-fg hover:text-fg hover:bg-muted/40 size-6 flex items-center justify-center cursor-pointer",
                      isSortedAsc &&
                        "bg-primary text-primary-fg hover:bg-primary hover:text-primary-fg shadow-2xs",
                    )}
                    title="Sắp xếp tăng dần"
                  >
                    <ArrowLongUpIcon className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange(column.id, "desc")}
                    className={twMerge(
                      "p-1 rounded-md transition-all text-muted-fg hover:text-fg hover:bg-muted/40 size-6 flex items-center justify-center cursor-pointer",
                      isSortedDesc &&
                        "bg-primary text-primary-fg hover:bg-primary hover:text-primary-fg shadow-2xs",
                    )}
                    title="Sắp xếp giảm dần"
                  >
                    <ArrowLongDownIcon className="size-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ==========================================
// 4b. DataTableColumnsButton (Popover Style)
// ==========================================
export interface DataTableColumnsButtonProps {
  table: TableType<any>;
  className?: string;
}

export function DataTableColumnsButton({
  table,
  className,
}: DataTableColumnsButtonProps) {
  const columns = table
    .getAllLeafColumns()
    .filter(
      (col) =>
        col.id !== "actions" &&
        col.columnDef.header &&
        typeof col.columnDef.header === "string",
    );

  return (
    <Popover>
      <PopoverTrigger>
        <Button
          intent="outline"
          className={twMerge(
            "inline-flex items-center gap-1.5 px-3 py-1.5 tracking-wider border border-border bg-bg hover:bg-muted/40 text-fg rounded-lg transition shadow-2xs",
            className,
          )}
        >
          <ViewColumnsIcon className="size-3.5 text-muted-fg shrink-0" />
          <span>Hiển thị</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0 overflow-hidden rounded-xl border border-border/80 bg-overlay shadow-xl ring ring-muted-fg/10">
        <div className="px-4 py-3 border-b border-border/60 bg-muted/10">
          <span className="font-bold text-sm text-fg">Hiển thị cột</span>
        </div>
        <div className="py-1 max-h-64 overflow-y-auto divide-y divide-border/20">
          {columns.map((column) => {
            const isVisible = column.getIsVisible();

            return (
              <button
                type="button"
                key={column.id}
                onClick={() => column.toggleVisibility(!isVisible)}
                className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-muted/15 cursor-pointer text-xs text-fg select-none transition-colors text-start"
              >
                <input
                  type="checkbox"
                  checked={isVisible}
                  readOnly
                  className="rounded-sm border-border text-primary focus:ring-primary size-3.5 cursor-pointer shrink-0"
                />
                <span
                  className={twMerge(isVisible && "font-semibold text-primary")}
                >
                  {column.columnDef.header as string}
                </span>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ==========================================
// 5. DataTableSkeleton
// ==========================================
export interface DataTableSkeletonProps {
  columnsCount: number;
  rowsCount?: number;
}

export function DataTableSkeleton({
  columnsCount,
  rowsCount = 5,
}: DataTableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rowsCount }).map((_, rIndex) => (
        <tr
          key={`skeleton-row-${rIndex}`}
          className="border-b border-border/50 last:border-b-0"
        >
          {Array.from({ length: columnsCount }).map((_, cIndex) => (
            <td
              key={`skeleton-cell-${cIndex}`}
              className="px-4 py-3.5 first:pl-5 last:pr-5"
            >
              <Skeleton isLoading={true}>
                <div
                  className={twMerge(
                    "h-5 bg-secondary rounded-sm",
                    cIndex === 0 ? "w-36" : cIndex === 1 ? "w-28" : "w-16",
                  )}
                />
              </Skeleton>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// ==========================================
// 6. DataTableEmptyState
// ==========================================
export interface DataTableEmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function DataTableEmptyState({
  title,
  description,
  action,
}: DataTableEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6 max-w-sm mx-auto">
      <div className="size-10 rounded-xl bg-muted flex items-center justify-center text-muted-fg mb-3.5 shadow-2xs border border-border/20">
        <ClipboardDocumentIcon className="size-5" />
      </div>
      <h3 className="text-sm font-semibold text-fg mb-1">{title}</h3>
      <p className="text-xs text-muted-fg mb-4 leading-normal">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
}

// ==========================================
// 7. DataTableActions (Generic ellipsis menu trigger)
// ==========================================
export interface DataTableActionsProps {
  triggerAriaLabel?: string;
  children: ReactNode;
  className?: string;
}

export function DataTableActions({
  triggerAriaLabel = "Tác vụ",
  children,
  className,
}: DataTableActionsProps) {
  return (
    <Menu>
      <MenuTrigger
        aria-label={triggerAriaLabel}
        className={twMerge(
          "inline-flex size-8 items-center justify-center rounded-lg border border-border bg-bg text-muted-fg transition hover:text-fg hover:bg-muted/40 shadow-2xs",
          className,
        )}
      >
        <span className="text-lg leading-none font-bold select-none -mt-1.5">
          ...
        </span>
      </MenuTrigger>
      <MenuContent placement="bottom right">{children}</MenuContent>
    </Menu>
  );
}

// ==========================================
// 8. Main CmsDataTable component (Refactored)
// ==========================================
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
  filterSections?: FilterSection[]; // Support multiple filter sections
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
  filterSections,
  isReloading = false,
  meta,
  onFilterChange,
  onPageChange,
  onPerPageChange,
  onSearchChange,
  onSortingChange,
  primaryAction,
  searchPlaceholder = "Tìm kiếm theo từ khóa...",
  searchValue,
  sort,
  title,
}: CmsDataTableProps<TData>) {
  "use no memo";

  const isFirstPage = meta.currentPage <= 1;
  const isLastPage = meta.currentPage >= meta.lastPage;
  const storageKey = `cms-table-sizing-${title}`;
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey);

      return stored ? JSON.parse(stored) : {};
    }

    return {};
  });

  const handleColumnSizingChange = (updater: any) => {
    setColumnSizing((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      localStorage.setItem(storageKey, JSON.stringify(next));

      return next;
    });
  };

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const sorting: SortingState = [
    {
      desc: sort.direction === "desc",
      id: sort.column,
    },
  ];

  // eslint-disable-next-line
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    columnResizeMode: "onChange",
    state: {
      sorting,
      columnVisibility,
      columnSizing,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnSizingChange: handleColumnSizingChange,
    pageCount: meta.lastPage,
    onSortingChange: (updater: Updater<SortingState>) => {
      const nextSorting = functionalUpdate(updater, sorting);
      const nextColumn = nextSorting[0];

      if (!nextColumn) {
        void onSortingChange(defaultSort.column, defaultSort.direction);

        return;
      }

      void onSortingChange(nextColumn.id, nextColumn.desc ? "desc" : "asc");
    },
  });

  // Extract sortable columns from column definitions automatically using TanStack resolved columns
  const sortableColumns: SortableColumn[] = table
    .getAllLeafColumns()
    .filter(
      (col) =>
        col.id !== "actions" &&
        col.columnDef.header &&
        typeof col.columnDef.header === "string",
    )
    .map((col) => ({
      id: col.id,
      label: col.columnDef.header as string,
    }));

  const visibleColumnsCount = table.getVisibleLeafColumns().length;

  return (
    <div className="flex flex-col rounded-2xl border border-border/80 bg-overlay shadow-xs md:min-h-min overflow-hidden transition-all">
      {/* Title & Actions bar */}
      <div className="border-b border-border/60 px-5 py-4.5 bg-bg/50">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-fg tracking-tight">
              {title}
            </h2>
            <p className="text-xs text-muted-fg leading-normal max-w-2xl">
              {description}
            </p>
          </div>
          {primaryAction ? (
            <div className="flex items-center gap-2 shrink-0">
              {primaryAction}
            </div>
          ) : null}
        </div>
      </div>

      {/* Main Table Toolbar (Sort, Filter, Search) */}
      <div className="flex flex-col gap-3 px-5 py-3 border-b border-border/60 bg-muted/5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {(filterSections || (filterOptions && onFilterChange)) && (
            <DataTableFilterButton
              sections={filterSections}
              options={filterOptions}
              selectedValue={filterValue}
              onChange={onFilterChange}
            />
          )}

          <DataTableColumnsButton table={table} />

          {sortableColumns.length > 0 && (
            <DataTableSortButton
              columns={sortableColumns}
              activeSort={{
                column: sort.column,
                direction: sort.direction === "desc" ? "desc" : "asc",
              }}
              onChange={(col, dir) => {
                void onSortingChange(col, dir);
              }}
            />
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <DataTableSearch
            value={searchValue}
            onChange={(val) => {
              void onSearchChange(val);
            }}
            placeholder={searchPlaceholder}
            className="w-full sm:w-64"
          />

          <div className="min-w-[100px] max-w-[160px] sm:min-w-[120px]">
            <Select
              aria-label="Số dòng mỗi trang"
              onChange={(key) => {
                void onPerPageChange(Number(key));
              }}
              value={String(meta.perPage)}
            >
              <SelectTrigger className="text-xs py-1" />
              <SelectContent>
                {PER_PAGE_OPTIONS.map((option) => (
                  <SelectItem
                    key={option}
                    id={String(option)}
                    textValue={`${option} dòng / trang`}
                  >
                    <SelectLabel>{option} dòng / trang</SelectLabel>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table grid area */}
      <div className="overflow-x-auto select-none">
        <table
          className="min-w-full border-collapse table-fixed"
          style={{ width: table.getCenterTotalSize() }}
        >
          <thead className="bg-muted/15 border-b border-border/60">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      scope="col"
                      className="px-4 py-2.5 text-left text-xs font-semibold text-muted-fg uppercase tracking-wider first:pl-5 last:pr-5 relative group"
                      style={{ width: header.column.getSize() }}
                    >
                      {header.isPlaceholder ? null : (
                        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-fg">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </span>
                      )}

                      {header.column.getCanResize() && (
                        <button
                          type="button"
                          tabIndex={-1}
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={twMerge(
                            "absolute right-0 top-0 h-full w-1.5 cursor-col-resize select-none touch-none hover:bg-primary/50 transition-colors z-10 border-0 bg-transparent p-0 outline-none",
                            header.column.getIsResizing()
                              ? "bg-primary w-2"
                              : "bg-transparent group-hover:bg-border/40",
                          )}
                          aria-label="Thay đổi kích thước cột"
                        />
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody className="divide-y divide-border/40 select-text">
            {isReloading ? (
              <DataTableSkeleton
                columnsCount={visibleColumnsCount}
                rowsCount={meta.perPage || 5}
              />
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-muted/20 transition-colors duration-100 group"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-3 align-middle text-sm text-fg first:pl-5 last:pr-5 whitespace-normal break-words"
                      style={{
                        width: cell.column.getSize(),
                        maxWidth: cell.column.getSize(),
                      }}
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
                  colSpan={visibleColumnsCount}
                  className="px-5 py-12 text-center"
                >
                  <DataTableEmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col gap-3 px-5 py-3.5 border-t border-border/60 bg-muted/5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <Text className="text-xs text-muted-fg font-medium">
            {meta.total > 0
              ? `Hiển thị ${meta.from} - ${meta.to} trên ${meta.total} kết quả`
              : "Chưa có dữ liệu phù hợp với bộ lọc hiện tại"}
          </Text>
          {isReloading ? (
            <Text className="text-[10px] uppercase tracking-[0.18em] text-primary/80 font-bold animate-pulse">
              Đang cập nhật dữ liệu&hellip;
            </Text>
          ) : null}
        </div>

        <Pagination className="mx-0 justify-start lg:justify-end">
          <PaginationList aria-label="Điều hướng phân trang">
            <PaginationFirst
              isDisabled={isFirstPage}
              onPress={() => {
                if (!isFirstPage) {
                  void onPageChange(1);
                }
              }}
              className="size-8"
            />
            <PaginationPrevious
              isDisabled={isFirstPage}
              onPress={() => {
                if (!isFirstPage) {
                  void onPageChange(Math.max(meta.currentPage - 1, 1));
                }
              }}
              className="size-8"
            />
            {buildPaginationItems(meta.currentPage, meta.lastPage).map(
              (item, index) =>
                item === "ellipsis" ? (
                  <li
                    key={`${meta.currentPage}-${item}-${index}`}
                    className="px-2 py-1.5 text-xs text-muted-fg font-medium select-none"
                  >
                    ...
                  </li>
                ) : (
                  <PaginationItem
                    key={item}
                    isCurrent={item === meta.currentPage}
                    isDisabled={item === meta.currentPage}
                    onPress={() => {
                      if (item !== meta.currentPage) {
                        void onPageChange(item);
                      }
                    }}
                    className="size-8 text-xs"
                  >
                    {item}
                  </PaginationItem>
                ),
            )}
            <PaginationNext
              isDisabled={isLastPage}
              onPress={() => {
                if (!isLastPage) {
                  void onPageChange(
                    Math.min(meta.currentPage + 1, meta.lastPage),
                  );
                }
              }}
              className="size-8"
            />
          </PaginationList>
        </Pagination>
      </div>
    </div>
  );
}

function SortIndicator({ direction }: { direction: false | "asc" | "desc" }) {
  if (direction === "asc") {
    return <ArrowLongUpIcon className="size-3.5 text-primary shrink-0" />;
  }

  if (direction === "desc") {
    return <ArrowLongDownIcon className="size-3.5 text-primary shrink-0" />;
  }

  return <ArrowsUpDownIcon className="size-3.5 text-muted-fg shrink-0" />;
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
