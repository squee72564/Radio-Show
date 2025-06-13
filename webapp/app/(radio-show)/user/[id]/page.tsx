"use server";

import { auth } from "@/auth";
import { findUserById } from "@/lib/db/actions/userActions";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { findAllStreamsByTypeAndUser } from "@/lib/db/actions/streamscheduleActions";
import { $Enums } from "@prisma/client";
import { redirect } from "next/navigation";
import StreamInfoCard from "@/components/stream-info-card";

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

  const shows = await findAllStreamsByTypeAndUser(userProfileInfo?.id, $Enums.ScheduleStatus.APPROVED);
  
  return (
    <div className="w-full p-6 space-y-6">
      <Card className="flex gap-6 p-6">
        { 
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
        }
        <div className="w-full">
        <Avatar className="h-30 w-30 mx-auto">
          <AvatarImage src={userProfileInfo.image || ""} />
          <AvatarFallback className="font-bold text-2xl">{userProfileInfo.name?.charAt(0) ?? "?"}</AvatarFallback>
        </Avatar>
        </div>


        <div className="flex flex-col justify-center items-center flex-1">
          <h2 className="text-2xl font-bold">{userProfileInfo.name || userProfileInfo.email}</h2>
        </div>
      </Card>

      <Tabs defaultValue="shows" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="shows">Shows</TabsTrigger>
          <TabsTrigger value="bio">Bio</TabsTrigger>
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

        <TabsContent value="shows" className="flex md:flex-row flex-col w-full">
          <Card className="w-full md:w-1/2">
            <CardHeader>
              <CardTitle>Past Archives</CardTitle>
            </CardHeader>
            <CardContent>
              {shows.length === 0 ? (
                <Badge variant="outline" className="text-center">No Past Archives</Badge>
              ): (
                <div className="space-y-2 overflow-auto max-h-50 p-2">
                  {shows.map((stream, idx) => (
                    // TODO: Replace with archive
                    <StreamInfoCard key={idx} stream={stream} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          <Card className="w-full md:w-1/2">
            <CardHeader>
              <CardTitle>Streams</CardTitle>
            </CardHeader>
            <CardContent>
              {shows.length === 0 ? (
                <Badge variant="outline" className="text-center">No Active Streams</Badge>
              ): (
                <div className="space-y-2 overflow-auto max-h-50 p-2">
                  {shows.map((stream, idx) => (
                    <StreamInfoCard key={idx} stream={stream} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>

  );
}