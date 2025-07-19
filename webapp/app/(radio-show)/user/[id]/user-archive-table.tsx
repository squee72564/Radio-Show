"use client";

import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { StreamArchive } from "@prisma/client";
import { StreamArchiveRelations } from "@/types/prisma-relations";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import LocalDate from "@/components/localdate";
import ArchiveDataTable from "@/components/archive-table";
import { formatTime } from "@/lib/utils";
import { useRouter } from "next/navigation";

export type ArchiveRowData = StreamArchive & StreamArchiveRelations

export const columns: ColumnDef<ArchiveRowData>[] = [
  {
    accessorFn: row => row.streamSchedule.title,
    id: "title",
    header: () => <div className="text-center">Title</div>,
    enableGlobalFilter: true,
    cell: ({row}) => {
      const title = row.getValue("title") as string
      return <div className="truncate text-center">{title ?? "Untitled"}</div>
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
      return <div className="truncate flex items-center justify-center text-center">{<LocalDate date={date} />}</div>
    }
  },
  {
    accessorFn: row => row.durationInSeconds,
    id: "duration",
    header: () => <div className="text-center">Duration</div>,
    cell: ({row}) => {
      const duration = row.getValue("duration") as number | null
      return <div className="text-center">{ duration ? formatTime(duration) : "N/A"}</div>
    }
  }
]

export default function UserArchiveTable({ data }: { data: ArchiveRowData[] }) {
  const router = useRouter();

  return (
    <ArchiveDataTable
      data={data}
      columns={columns}
      filterColumns={["title"]}
      rowOnClick={(row) => {
        router.push(`/archive/${row.id}`);
      }}
    />
  );
}
