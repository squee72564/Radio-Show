'use client'

import { useState, useTransition } from "react";
import { changeUserRole } from "@/lib/db/actions/userActions";
import { isUserAdmin } from "@/lib/utils";
import { $Enums, User } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LocalDate from "@/components/localdate";
import UserAvatar from "@/components/user-avatar";

export default function UserManagementCard({
  user,
  isOwnerViewing,
  userAction
}: {
  user: User;
  isOwnerViewing: boolean;
  userAction: (userId: string) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMakeAdmin = () => {
    startTransition(async () => {
      const result = await changeUserRole(user.id, $Enums.Role.ADMIN);
      if (result.type === "success") {
        userAction(user.id);
        setDisabled(true);
      } else {
        setError(result.message)
      }
    });
  };

  const handleDemotion = () => {
    startTransition(async () => {
      const result = await changeUserRole(user.id, $Enums.Role.USER);
      if (result.type === "success") {
        userAction(user.id);
        setDisabled(true);
      } else {
        setError(result.message)
      }
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardAction className="flex flex-col items-center gap-2">
          <UserAvatar user={user}/>
          <Badge variant="outline">{user.status}</Badge>
        </CardAction>
        <CardDescription className="flex flex-col gap-2">
          <p className="font-medium truncate">{user.name}</p>
          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          <div className="flex flex-row gap-2"><p>Created at:</p> <LocalDate date={user.createdAt} /></div>
          {user.emailVerified ? (
            <Badge variant={"outline"}>Email Verified: <LocalDate date={user.emailVerified} /></Badge>
          ): (
            <Badge variant={"outline"}>Email Not Verified</Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="truncate">
          {user.bio || <Badge variant={"outline"}>No User Bio Set</Badge>}
      </CardContent>
      <CardFooter className="flex flex-row justify-center items-center gap-5">
        {!isUserAdmin(user.status) && (
          <Button
            variant="secondary"
            disabled={isPending || disabled}
            onClick={handleMakeAdmin}
          >
            {isPending ? "Promoting..." : "Make Admin"}
          </Button>
        )}
        {user.status === $Enums.Role.ADMIN && isOwnerViewing && (
          <Button
            variant="secondary"
            disabled={isPending || disabled}
            onClick={handleDemotion}
          >
            {isPending ? "Demoting..." : "Demote"}
          </Button>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </CardFooter>
    </Card>
  );
}