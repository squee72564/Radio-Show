import { findArchivesByUserId } from "@/lib/db/services/streamscheduleService";
import { User } from "@prisma/client";
import { Badge } from "@/components/ui/badge";


export default async function UserProfileArchiveList({userProfileInfo}: {userProfileInfo: User}) {
  const archives = await findArchivesByUserId(userProfileInfo.id);
  
  return (
    <>
      {archives.length === 0 ? (
        <Badge variant="outline" className="text-center mx-3 p-2">No Past Archives</Badge>
      ): (
        <div className="space-y-2 p-2">
          {archives.map((archive, idx) => (
            <div key={idx}>
              Archive: {archive.id}
            </div>
          ))}
        </div>
      )}
    </>
  );
}