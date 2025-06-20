"use client";

import { useState } from "react";
import { ArrowUp, ArrowDown, Minus } from "lucide-react";

import { StreamArchive, StreamSchedule, User } from "@prisma/client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
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

export const columns: ColumnDef<(StreamArchive & {
    user: Partial<User>,
    streamSchedule: Partial<StreamSchedule>
})>[] = [
  {
    accessorFn: row => row.streamSchedule?.title,
    accessorKey: "title",
    header: () => <div className="text-center">Title</div>,
    cell: ({row}) => {
      const title = row.getValue("title") as string
      return <div className="truncate text-center">{title ?? "Untitled"}</div>
    }
  },
  {
    accessorFn: row => row.user?.name,
    accessorKey: "username",
    header: () => <div className="text-center">User</div>,
    cell: ({row}) => {
      const userName = row.getValue("username") as string
      return <div className="truncate text-center">{userName ?? "Unknown"}</div>
    }
  },
  {
    accessorKey: "createdAt",
    header: ({column}) => {
      const sortState = column.getIsSorted();

      return (
        <Button
          variant={"ghost"}
          onClick={() => column.toggleSorting(sortState === "asc")}
          className="text-center w-full"
        >
        Date
          {sortState === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : sortState === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <Minus className="ml-2 h-4 w-4 opacity-50" />
          )}
        </Button>
      )
    },
    cell: ({row}) => {
      const date = row.getValue("createdAt") as Date
      return <div className="truncate text-center">{date.toLocaleDateString()}</div>
    }
  }
]

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}
 
export default function ArchiveDataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })
 
  return (
    <Card className="flex flex-col flex-1 w-full rounded-sm border">
      <CardHeader className="flex items-center justify-center gap-5">
        <Input
          placeholder="Filter titles..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("title")?.setFilterValue(event.target.value)
          }
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