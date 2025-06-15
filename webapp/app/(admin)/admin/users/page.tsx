"use server";

import { Suspense } from "react";
import { auth } from "@/auth";
import { listUsersByRole } from "@/lib/db/actions/userActions";
import { isUserAdmin } from "@/lib/utils";
import { $Enums, User } from "@prisma/client";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRoundCogIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { UserManagementCard } from "@/components/user-mangement-card";

export async function UserGroupTabContent({
  loader,
}: {
  loader: () => Promise<User[]>;
}) {
  const LazyList = async () => {
    const users = await loader();
    return <UserList users={users} />;
  };

  return (
    <Suspense fallback={<UserListSkeleton />}>
      <LazyList />
    </Suspense>
  );
}

async function UserList({ users }: { users: User[] }) {
  if (users.length === 0) {
    return <p className="text-sm text-muted-foreground">No users found.</p>;
  }

  return (
    <div className="space-y-2">
      {users.map((user, idx) => (
        <UserManagementCard key={idx} user={user} />
      ))}
    </div>
  );
}

function UserListSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-full rounded-xl" />
      ))}
    </div>
  );
}

export default async function AdminUsersPage() {
  const session = await auth();
  const user = session?.user as User | undefined;

  if (!user || !isUserAdmin(user.status)) {
    redirect("/dashboard");
  }

  const roleTabs = [
    {
      value: "admins",
      label: "Admins",
      loader: async () => {
        const [owners, admins] = await Promise.all([
          listUsersByRole($Enums.Role.OWNER),
          listUsersByRole($Enums.Role.ADMIN),
        ]);
        return [...owners, ...admins];
      },
    },
    {
      value: "streamers",
      label: "Streamers",
      loader: () => listUsersByRole($Enums.Role.STREAMER),
    },
    {
      value: "users",
      label: "Users",
      loader: () => listUsersByRole($Enums.Role.USER),
    },
  ];


  return (
    <div className="p-6 space-y-6 w-full">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <UserRoundCogIcon className="w-6 h-6" /> Admin: User Management
      </h1>
      <Separator />

      <Tabs defaultValue="admins" className="space-y-6">
        <TabsList className="flex space-x-2">
          {roleTabs.map(({ value, label }) => (
            <TabsTrigger key={value} value={value} className="capitalize">
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {roleTabs.map(({ value, loader }) => (
          <TabsContent key={value} value={value} className="space-y-4">
            <UserGroupTabContent loader={loader} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
