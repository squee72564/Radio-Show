import { findArchivesByUserId } from "@/lib/db/services/streamscheduleService";
import { StreamArchive, StreamInstance, StreamSchedule, User } from "@prisma/client";
import UserArchiveTable from "./user-archive-table";

export default async function UserProfileArchiveList({userProfileInfo}: {userProfileInfo: User}) {
  const archives = await findArchivesByUserId(userProfileInfo.id,{
    include: {
      streamInstance: true,
      streamSchedule: true,
      user: true,
    }
  }) as (StreamArchive & {streamInstance: StreamInstance, streamSchedule: StreamSchedule, user: User})[];

  return (
    <UserArchiveTable data={archives}/>
  );
}