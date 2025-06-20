"use server";

import { Suspense } from "react";
import { auth } from "@/auth";
import { findUserById } from "@/lib/db/actions/userActions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
    <div className="flex flex-col w-full max-h-screen p-5 gap-2">
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

      <Tabs defaultValue="bio" className="w-full flex-1 flex flex-col min-h-[300px]">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="bio">Bio</TabsTrigger>
          <TabsTrigger value="shows">Shows</TabsTrigger>
          <TabsTrigger value="archive">Archive</TabsTrigger>
        </TabsList>

        <TabsContent value="bio" className="flex-1 flex flex-col min-h-[200px]">
          <Card className="w-full flex-1 flex flex-col">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col overflow-y-auto min-h-[200px] max-h-[calc(100vh-500px)] px-6">
              {userProfileInfo.bio ? (
                userProfileInfo.bio.trim().split('\n').map((paragraph, idx) => (
                  <p key={idx} className="text-md text-muted-foreground mb-4">
                    {paragraph}
                  </p>
                ))
              ): (
                <p>No About Set</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shows" className="flex-1 flex flex-col min-h-[200px]">
          <Card className="w-full flex-1 flex flex-col">
            <CardHeader>
              <CardTitle>Active Streams</CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto  min-h-[200px] max-h-[calc(100vh-500px)] px-2">
              <Suspense fallback={<Badge variant="outline" className="text-center mx-3 p-2">Loading...</Badge>}>
                <UserProfileStreamList userProfileInfo={userProfileInfo}/>
              </Suspense>
            </CardContent>
          </Card>
          <CardFooter className="hidden"/>
        </TabsContent>

        <TabsContent value="archive" className="flex-1 flex flex-col min-h-[200px]">
          <Card className="w-full flex-1 flex flex-col">
            <CardHeader>
              <CardTitle>Archives</CardTitle>
            </CardHeader>
            <CardContent className="overflow-y-auto  min-h-[200px] max-h-[calc(100vh-500px)] px-2">
              <Suspense fallback={<Badge variant="outline" className="text-center mx-3 p-2">Loading...</Badge>}>
                <UserProfileArchiveList userProfileInfo={userProfileInfo}/>
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}