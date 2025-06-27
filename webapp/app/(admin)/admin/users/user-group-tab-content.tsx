"use client";

import { useEffect, useState } from "react";
import { User, $Enums } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import UserManagementCard from "./user-mangement-card"
import { findUsersByRole } from "@/lib/db/actions/userActions";

export default function UserGroupTabContent({
  status,
  isOwnerViewing
}: {
  status: $Enums.Role;
  isOwnerViewing: boolean
}) {
  const [users, setUsers] = useState<User[] | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (status === $Enums.Role.ADMIN) {
        const superUsers = await findUsersByRole([$Enums.Role.OWNER, $Enums.Role.ADMIN]) as User[];
        setUsers(superUsers);
      } else {
        const users = await findUsersByRole(status) as User[];
        setUsers(users);
      }
    };

    fetchUsers();
  }, [status]);

  return (
    <div className="space-y-2">
      {!users ? (
        <Badge variant={"outline"}>Loading...</Badge>
      ) : users.length === 0 ? (
        <Badge
          variant={"outline"}
          className="text-sm text-muted-foreground"
        >
          No {status.toLowerCase()}s found
        </Badge>
      ) : (
        users.map((user) => <UserManagementCard key={user.id} user={user} isOwnerViewing={isOwnerViewing}/>)
      )}
    </div>
  );
}
