"use client";

import { useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

// Define available features as a type for better type checking
export type TableFeature =
  | "sort"
  | "filter"
  | "pagination"
  | "selection"
  | "multiSelection"
  | "columnVisibility"
  | "rowExpansion";

interface UseTanstackTableProps<TData, TValue> {
  data: TData[];
  columns: ColumnDef<TData, TValue>[];
  features?: TableFeature[];
  initialPageSize?: number;
  initialPageIndex?: number;
  initialSorting?: SortingState;
  initialColumnFilters?: ColumnFiltersState;
  initialColumnVisibility?: VisibilityState;
  initialRowSelection?: Record<string, boolean>;
  manualPagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
  pageCount?: number;
}

export function useTanstackTable<TData, TValue>({
  data,
  columns,
  features = ["sort", "filter", "pagination"],
  initialPageSize = 10,
  initialPageIndex = 0,
  initialSorting = [],
  initialColumnFilters = [],
  initialColumnVisibility = {},
  initialRowSelection = {},
  manualPagination = false,
  manualSorting = false,
  manualFiltering = false,
  pageCount,
}: UseTanstackTableProps<TData, TValue>) {
  // Determine which features are enabled
  const enableSorting = features.includes("sort");
  const enableFiltering = features.includes("filter");
  const enablePagination = features.includes("pagination");
  const enableRowSelection = features.includes("selection");
  const enableMultiRowSelection = features.includes("multiSelection");
  const enableColumnVisibility = features.includes("columnVisibility");
  const enableRowExpansion = features.includes("rowExpansion");

  // States
  const [sorting, setSorting] = useState<SortingState>(initialSorting);
  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialColumnFilters);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    initialColumnVisibility
  );
  const [rowSelection, setRowSelection] =
    useState<Record<string, boolean>>(initialRowSelection);
  const [pagination, setPagination] = useState<PaginationState>({
    pageSize: initialPageSize,
    pageIndex: initialPageIndex,
  });

  // Create table instance
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: enableSorting ? sorting : undefined,
      columnFilters: enableFiltering ? columnFilters : undefined,
      columnVisibility: enableColumnVisibility ? columnVisibility : undefined,
      rowSelection: enableRowSelection ? rowSelection : undefined,
      pagination: enablePagination ? pagination : undefined,
    },
    pageCount: pageCount ?? Math.ceil(data.length / pagination.pageSize),
    enableRowSelection,
    enableMultiRowSelection,
    enableColumnFilters: enableFiltering,
    enableSorting,
    manualPagination,
    manualSorting,
    manualFiltering,
    onSortingChange: enableSorting ? setSorting : undefined,
    onColumnFiltersChange: enableFiltering ? setColumnFilters : undefined,
    onColumnVisibilityChange: enableColumnVisibility
      ? setColumnVisibility
      : undefined,
    onRowSelectionChange: enableRowSelection ? setRowSelection : undefined,
    onPaginationChange: enablePagination ? setPagination : undefined,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getPaginationRowModel:
      enablePagination && !manualPagination
        ? getPaginationRowModel()
        : undefined,
  });

  // Utility functions
  const setFilter = (columnId: string, value: any) => {
    if (!enableFiltering) return;
    setColumnFilters((prev) => {
      const existing = prev.find((filter) => filter.id === columnId);
      if (!existing) return [...prev, { id: columnId, value }];
      return prev.map((filter) =>
        filter.id === columnId ? { ...filter, value } : filter
      );
    });
  };

  const clearFilters = () => {
    if (!enableFiltering) return;
    setColumnFilters([]);
  };

  const setSortingColumn = (columnId: string, desc = false) => {
    if (!enableSorting) return;
    setSorting([{ id: columnId, desc }]);
  };

  const clearSorting = () => {
    if (!enableSorting) return;
    setSorting([]);
  };

  const resetTable = () => {
    clearFilters();
    clearSorting();
    if (enableRowSelection) setRowSelection({});
    if (enablePagination) {
      setPagination({
        pageSize: initialPageSize,
        pageIndex: initialPageIndex,
      });
    }
  };

  const setSearchVal = (colId: string, val: string) => {
    return table.getColumn(colId)?.setFilterValue(val);
  };
  const getSearchVal = (colId: string) => {
    return (table.getColumn(colId)?.getFilterValue() as string) || "";
  };

  return {
    table,
    features: {
      enableSorting,
      enableFiltering,
      enablePagination,
      enableRowSelection,
      enableMultiRowSelection,
      enableColumnVisibility,
      enableRowExpansion,
    },
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    setRowSelection,
    pagination,
    setPagination,
    // Utility functions
    setFilter,
    clearFilters,
    setSortingColumn,
    clearSorting,
    resetTable,
    getSearchVal,
    setSearchVal,
  };
}
