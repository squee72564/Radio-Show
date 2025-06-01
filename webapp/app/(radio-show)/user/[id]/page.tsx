"use server";

import { auth } from "@/auth";
import { findUserById } from "@/lib/db/actions/userActions";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function UserProfilePage({
  params
} : {
    params: {id:string}
}) {
  const { id }: { id: string } = await params;

  const userProfileInfo = await findUserById(id);
  const session = await auth();
  const user = session?.user;

  const shows: Array<{title:string}> = [];
  
  return (
    <div className="w-full p-6 space-y-6">
      <Card className="flex items-center gap-6 p-6">
        <Avatar className="h-20 w-20">
          {userProfileInfo?.image && <AvatarImage src={userProfileInfo?.image} />}
          <AvatarFallback>{userProfileInfo?.name?.charAt(0) ?? "?"}</AvatarFallback>
        </Avatar>
        {user && user.id === userProfileInfo?.id &&
          <Button className="absolute top-6 right-6 mr-5 mt-5" variant="secondary">
            Edit
          </Button>
        }
        <div className="flex flex-col justify-center items-center flex-1">
          <h2 className="text-2xl font-bold">{userProfileInfo?.name}</h2>
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
              <p className="text-sm text-muted-foreground">
                This section contains a short bio, interests, or other personal details.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shows">
          <Card>
            <CardHeader className="flex">
              <CardTitle>Past Shows</CardTitle>
            </CardHeader>
            <CardContent>
              {
                shows.length === 0 ?
                  <p className="text-center">No Shows for {userProfileInfo?.name}</p>
                :
                  <ul className="space-y-2 overflow-auto max-h-50 p-2">
                  {shows.map((show, idx) => (
                    <li
                      key={idx}
                      className="border p-4 rounded-md hover:-translate-y-1 duration-300 hover:border-white/30"
                    >
                      {show.title}
                    </li>
                  ))}
                  </ul>
              }
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>

  );
}