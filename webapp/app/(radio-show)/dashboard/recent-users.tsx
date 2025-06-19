"use server";

import Link from "next/link";
import { findRecentUsers } from "@/lib/db/actions/userActions";
import { User } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default async function RecentUsers() {
  const users = await findRecentUsers(5);
  
  return (
    <section className="min-h-41 max-h-41">
      <h2 className="text-lg font-medium mb-4">Recent Users</h2>
      <div className="space-y-3 overflow-auto">
        {users && users.length > 0 ? (
          users.map((user: User, idx: number) => (
            <Link
              key={idx}
              href={`/user/${user.id}`}
              className="flex items-center gap-4 p-2 rounded-md hover:bg-muted transition-colors"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={user.image || ""} alt={user.name || ""} />
                <AvatarFallback>{user.name?.charAt(0) ?? "?"}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{user.name}</span>
            </Link>
          ))
        ) : (
          <Badge variant={"outline"} className="text-muted-foreground">No recent users.</Badge>
        )}
      </div>
    </section>
  );
}