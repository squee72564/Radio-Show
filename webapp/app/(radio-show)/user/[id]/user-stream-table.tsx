"use client";

import { StreamSchedule } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import LocalDate from "@/components/localdate";
import DataTable from "@/components/data-table";
import { useRouter } from "next/navigation";
import LocalTime from "@/components/localtime";
import { RRule } from "rrule";

type UserStreamRowData = StreamSchedule

export const columns: ColumnDef<UserStreamRowData>[] = [
  {
    accessorFn: row => row.title,
    id: "title",
    header: () => <div className="text-center">Title</div>,
    enableGlobalFilter: true,
    cell: ({ row }) => {
      const { title } = row.original;
      return (
        <div className="items-center justify-center text-center truncate">
          {title}
        </div>
      );
    }
  },
  {
    id: "time",
    header: () => <div className="text-center">Time</div>,
    cell: ({ row }) => {
      const { startTime, endDate } = row.original;
      return (
        <div className="truncate items-center justify-center text-center">
          <LocalTime date={startTime} /> - <LocalTime date={endDate} />
        </div>
      );
    }
  },
  {
    id: "date",
    header: () => <div className="text-center">Date Range</div>,
    cell: ({ row }) => {
      const { startDate, endDate } = row.original;
      return (
        <div className="truncate items-center justify-center text-center">
          <LocalDate date={startDate} /> to <LocalDate date={endDate} />
        </div>
      );
    }
  },
  {
    id: "rrule",
    header: () => <div className="text-center">Recurrence</div>,
    cell: ({ row }) => {
      const { rrule } = row.original;
      const recurrence = rrule ? RRule.fromString(rrule).toText() : "None";
      return <div className="truncate items-center justify-center text-center">{recurrence}</div>;
    }
  }
]

export default function UserStreamTable({ data }: { data: UserStreamRowData[] }) {
  const router = useRouter();

  return (
    <DataTable
      data={data}
      columns={columns}
      filterColumns={["title"]}
      rowOnClick={(row) => {
        router.push(`/user/stream/${row.id}`);
      }}
    />
  );
}
