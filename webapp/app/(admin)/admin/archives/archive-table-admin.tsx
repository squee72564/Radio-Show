"use client";

import { ArrowUp, ArrowDown, Minus } from "lucide-react";
import { StreamArchive } from "@prisma/client";

import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import LocalDate from "@/components/localdate";
import ArchiveDataTable from "@/components/archive-table";
import { StreamArchiveRelations } from "@/types/prisma-relations";
import { useState, useTransition } from "react";
import { Result } from "@/types/generic";
import { adminDeleteArchive } from "@/lib/db/actions/streamscheduleActions";

export type ArchiveRowData = StreamArchive & StreamArchiveRelations

export const columns = (onDelete: (id: string) => void): ColumnDef<ArchiveRowData>[] => [
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
    accessorFn: row => row.id,
    id: "id",
    header: () => <div className="text-center">Delete Archive</div>,
    cell: ({row}) => {
      const archiveId = row.getValue("id") as string
      return <div className="flex flex-row justify-center"><DeleteArchiveComponent archiveId={archiveId} onDelete={onDelete} /></div>
    }
  }
]

const DeleteArchiveComponent = ({
  archiveId,
  onDelete
}: {
  archiveId: string;
  onDelete: (id: string) => void;
}) => {
  const [pending, startTransition] = useTransition();
  const [submissionstate, SetSubmissionState] = useState<Result<StreamArchive> | null>(null);

  const deleteArchive = () => {
    startTransition(async () => {
      const result = await adminDeleteArchive(archiveId);
      SetSubmissionState(result);
      if (result.type === "success") {
        onDelete(archiveId);
      }
    });
  };

  return (
    <Button 
      variant="destructive"
      disabled={pending || submissionstate?.type === "success"}
      onClick={deleteArchive}
    >
      {!submissionstate ? (
        "Delete"
      ): (
        submissionstate.type === "success" ? (
          "Deleted"
        ) : (
          "Error"
        )
      )}
    </Button>
  )
}

export default function ArchiveAdminTable({ data }: { data: ArchiveRowData[] }) {
  const [tableData, setTableData] = useState(data);

  const handleDelete = (archiveId: string) => {
    setTableData(prev => prev.filter(row => row.id !== archiveId));
  };

  return (
    <ArchiveDataTable
      data={tableData}
      columns={columns(handleDelete)}
      filterColumns={["title", "tags", "username"]}
    />
  );
}
