'use client'

import { useTransition } from "react";
import { changeUserRole } from "@/lib/db/actions/userActions";
import { isUserAdmin } from "@/lib/utils";
import { $Enums, User } from "@prisma/client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function UserManagementCard({ user }: { user: User }) {
  const [isPending, startTransition] = useTransition();

  const handleMakeAdmin = () => {
    startTransition(() => {
      changeUserRole(user.id, $Enums.Role.ADMIN);
    });
  };

  return (
    <Card className="w-full">
      <CardContent className="flex items-center gap-4 p-4">
        <Avatar>
          <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
          <AvatarFallback>{user.name?.charAt(0) ?? "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{user.name}</p>
          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
        </div>
        <Badge variant="outline">{user.status}</Badge>
        {!isUserAdmin(user.status) && (
          <Button
            variant="secondary"
            disabled={isPending}
            onClick={handleMakeAdmin}
          >
            {isPending ? "Promoting..." : "Make Admin"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
