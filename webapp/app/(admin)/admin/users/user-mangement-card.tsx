'use client'

import { useState, useTransition } from "react";
import { changeUserRole } from "@/lib/db/actions/userActions";
import { isUserAdmin } from "@/lib/utils";
import { $Enums, User } from "@prisma/client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LocalDate } from "@/components/localdate";

export default function UserManagementCard({ user, isOwnerViewing }: { user: User, isOwnerViewing: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [disabled, setDisabled] = useState(false);

  const handleMakeAdmin = () => {
    startTransition(() => {
      changeUserRole(user.id, $Enums.Role.ADMIN);
      setDisabled(true);
    });
  };

  const handleDemotion = () => {
    startTransition(() => {
      changeUserRole(user.id, $Enums.Role.USER);
      setDisabled(true);
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardAction className="flex flex-col items-center gap-2">
          <Avatar>
            <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
            <AvatarFallback>{user.name?.charAt(0) ?? "U"}</AvatarFallback>
          </Avatar>
          <Badge variant="outline">{user.status}</Badge>
        </CardAction>
        <CardDescription className="flex flex-col gap-2">
          <p className="font-medium truncate">{user.name}</p>
          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          <p>Created at: <LocalDate date={user.createdAt} /></p>
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
      </CardFooter>
    </Card>
  );
}
