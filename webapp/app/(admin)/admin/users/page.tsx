"use server";

import { UserRoundCogIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { isUserAdmin } from "@/lib/utils";
import { $Enums, User } from "@prisma/client";

import { Separator } from "@/components/ui/separator";
import AdminUserTabs from "./admin-user-tabs";

export default async function AdminUsersPage() {
  const session = await auth();
  const user = session?.user as User | undefined;

  if (!user || !isUserAdmin(user.status)) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col p-6 gap-6 min-w-0">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <UserRoundCogIcon className="w-6 h-6" /> Admin: User Management
      </h1>
      <Separator />

      <AdminUserTabs isOwnerViewing={user.status === $Enums.Role.OWNER}/>
    </div>
  );
}
