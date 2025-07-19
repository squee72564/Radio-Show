import { findAllStreamsByStatusAndUser } from "@/lib/db/actions/streamscheduleActions";
import { $Enums, User } from "@prisma/client";
import UserStreamTable from "./user-stream-table";


export default async function UserProfileStreamList({userProfileInfo}: {userProfileInfo: User}) {
  const shows = await findAllStreamsByStatusAndUser(userProfileInfo?.id, $Enums.ScheduleStatus.APPROVED);
  
  return (
    <UserStreamTable data={shows} />
  );
}