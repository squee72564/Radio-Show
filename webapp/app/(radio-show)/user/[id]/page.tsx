"use server";

import { Suspense } from "react";
import { auth } from "@/auth";
import { findUserById } from "@/lib/db/actions/userActions";
import { findAllStreamsByStatusAndUser } from "@/lib/db/actions/streamscheduleActions";
import { $Enums } from "@prisma/client";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import UserProfileStreamList from "./user-profile-stream-list";
import UserProfileArchiveList from "./user-profile-archive-list";

export default async function UserProfilePage({
  params
} : {
    params: Promise<{id:string}>
}) {
  const { id }: { id: string } = await params;

  const userProfileInfo = await findUserById(id);
  const session = await auth();
  const user = session?.user;

  if (!userProfileInfo) {
    redirect("/dashboard");
  }
    
  return (
    <div className="w-full p-5 space-y-2">
      <Card className="flex gap-6 p-5">
        <CardHeader className="flex flex-row w-full items-center justify-between">
          <Badge className="px-5 py-3 rounded-2xl font-bold" variant={"outline"}>
            {userProfileInfo.status}
          </Badge>
          {user && user.id === userProfileInfo?.id &&
            <Link
              href={`/user/edit`}
            >
              <Button variant="outline">
                Edit Profile
              </Button>
            </Link>
          }
        </CardHeader>
        <CardContent className="flex flex-col justify-center items-center">
          <Avatar className="h-30 w-30 mx-auto mb-5">
            <AvatarImage src={userProfileInfo.image || ""} />
            <AvatarFallback className="font-bold text-2xl">{userProfileInfo.name?.charAt(0) ?? "?"}</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold">{userProfileInfo.name || userProfileInfo.email}</h2>

        </CardContent>
      </Card>

      <Tabs defaultValue="bio" className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="bio">Bio</TabsTrigger>
          <TabsTrigger value="shows">Shows</TabsTrigger>
          <TabsTrigger value="archive">Archive</TabsTrigger>
        </TabsList>

        <TabsContent value="bio">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-md text-muted-foreground">
                {userProfileInfo.bio}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shows">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Active Streams</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Badge variant="outline" className="text-center">Loading...</Badge>}>
                <UserProfileStreamList userProfileInfo={userProfileInfo}/>
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="archive" className="flex md:flex-row flex-col w-full">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Archives</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Badge variant="outline" className="text-center">Loading...</Badge>}>
                <UserProfileArchiveList userProfileInfo={userProfileInfo}/>
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}