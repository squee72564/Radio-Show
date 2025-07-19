"use client";

import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { StreamArchive } from "@prisma/client";

import { ColumnDef } from "@tanstack/react-table";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import LocalDate from "@/components/localdate";
import { Badge } from "@/components/ui/badge";
import DataTable from "@/components/data-table";
import { StreamArchiveRelations } from "@/types/prisma-relations";

export type ArchiveRowData = StreamArchive & Omit<StreamArchiveRelations, "streamInstance">

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
    accessorFn: row => row.user.name,
    id: "username",
    header: () => <div className="text-center">User</div>,
    enableGlobalFilter: true,
    cell: ({row}) => {
      const userName = row.getValue("username") as string
      return <div className="truncate text-center">{userName ?? "No Name Set"}</div>
    }
  },
  {
    accessorFn: row => row.streamSchedule.tags,
    id: "tags",
    header: () => <div className="text-center">Tags</div>,
    enableGlobalFilter: true,
    cell: ({row}) => {
      const tags = row.getValue("tags") as string[]
      return (
      <div 
        className="flex flex-row gap-1 items-center overflow-auto no-scrollbar text-center"
      >
        {(tags.map((tag, idx)=><Badge key={idx} variant={"outline"}>{tag}</Badge>))}
      </div>
      )
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
  }
]

export default function ArchiveUserTable({ data }: { data: ArchiveRowData[] }) {
  const router = useRouter();

  return (
    <DataTable
      data={data}
      columns={columns}
      filterColumns={["title", "tags", "username"]}
      rowOnClick={(row) => {
        router.push(`/archive/${row.id}`);
      }}
    />
  );
}
