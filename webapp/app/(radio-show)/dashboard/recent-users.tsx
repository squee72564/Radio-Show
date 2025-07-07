"use server";

import Link from "next/link";
import { findRecentUsers } from "@/lib/db/actions/userActions";
import { User } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import UserAvatar from "@/components/user-avatar";

export default async function RecentUsers() {
  const users = await findRecentUsers(5);
  
  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-lg font-medium">Recent Users</h2>
      {users.length > 0 ? (
        <div className="flex flex-col gap-2 min-h-41 max-h-41 overflow-auto">
          {users.map((user: User, idx: number) => (
            <Link
              key={idx}
              href={`/user/${user.id}`}
              className="flex items-center gap-4 p-2 rounded-md hover:bg-muted transition-colors h-12"
            >
              <UserAvatar user={user} className="h-9 w-9 hidden md:flex"/>
              <span className="text-sm font-medium truncate">{user.name}</span>
            </Link>
          ))}
        </div>
      ) : (
        <Badge variant={"outline"} className="text-muted-foreground">
          No recent users.
        </Badge>
      )}
    </div>
  );
}