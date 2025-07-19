import { findArchivesByUserId } from "@/lib/db/services/streamscheduleService";
import { StreamArchive, User } from "@prisma/client";
import UserArchiveTable from "./user-archive-table";
import { StreamArchiveRelations } from "@/types/prisma-relations";

export default async function UserProfileArchiveList({userProfileInfo}: {userProfileInfo: User}) {
  const archives = await findArchivesByUserId(userProfileInfo.id,{
    include: {
      streamInstance: true,
      streamSchedule: true,
      user: true,
    }
  }) as (StreamArchive & StreamArchiveRelations)[];

  return (
    <UserArchiveTable data={archives}/>
  );
}