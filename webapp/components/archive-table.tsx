"use client";

import { useState } from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  getFilteredRowModel,
  FilterFn,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export const makeGlobalFilterFn = <T extends object>(searchableColumns: string[]): FilterFn<T> =>
  (row, _columnId, filterValue) => {
    return searchableColumns.some((id) => {
      const value = row.getValue(id) as string | string[] | undefined;

      if (!value) return false;

      if (Array.isArray(value)) {
        return value.join(",").toLowerCase().includes(filterValue.toLowerCase());
      }

      return String(value).toLowerCase().includes(filterValue.toLowerCase());
    });
  };

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterColumns?: string[]
  rowOnClick?: (row: TData) => void

}
 
export default function ArchiveDataTable<TData extends object, TValue>({
  columns,
  data,
  filterColumns,
  rowOnClick,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = useState("");

  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: filterColumns && filterColumns.length ? (
      makeGlobalFilterFn<TData>(filterColumns)
    ): (
      "includesString"
    ),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      globalFilter,
    },
  })
 
  return (
    <Card className="flex flex-col flex-1 w-full rounded-sm border">
      <CardHeader className="flex items-center justify-center gap-5">
        <Input
          placeholder="Filter Archives..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </CardHeader>
      <CardContent className="border flex-1 min-h-90">
        <Table className="table-fixed w-full`">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  onClick={() => rowOnClick?.(row.original)}
                  className="cursor-pointer hover:bg-secondary transition-all"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-15 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="mx-auto">
        Page {table.getPageCount()}
      </CardFooter>
    </Card>
  )
}