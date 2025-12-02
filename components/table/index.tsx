'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { flexRender, Table as TableType } from '@tanstack/react-table';
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function DataTable({
  table,
  tableClassName,
  rowClassName,
  headClassName,
  cellClassName,
  headCellClassName,
}: {
  table: TableType<any>;
  tableClassName?: string;
  rowClassName?: string;
  headClassName?: string;
  cellClassName?: string;
  headCellClassName?: string;
}) {
  return (
    <>
      <Table className={cn('border-collapse', tableClassName)}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              className={cn('bg-gray-50', headClassName)}
              key={headerGroup.id}
            >
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    'border border-gray-200 text-center',
                    headCellClassName
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table?.getRowModel?.()?.rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={cn('even:bg-gray-50 h-16', rowClassName)}
                data-state={row?.getIsSelected?.() ? 'selected' : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn('border border-gray-200', cellClassName)}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center border border-gray-200"
              >
                لا توجد نتائج.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* ✅ Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
        <div className="flex items-center gap-2">
          <p>
            {table.getFilteredSelectedRowModel().rows.length} من{' '}
            {table.getPrePaginationRowModel().rows.length} محدد
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">
              صفحة {table.getState().pagination.pageIndex + 1} من{' '}
              {table.getPageCount()}
            </p>
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue
                  placeholder={table.getState().pagination.pageSize}
                />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">عناصر لكل صفحة</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              السابق
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              التالي
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default DataTable;
