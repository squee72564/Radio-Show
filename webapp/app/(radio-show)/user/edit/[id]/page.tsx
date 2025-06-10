"use server"

import { auth } from "@/auth"
import { findUserById, updateUserBio } from "@/lib/db/actions/userActions"

import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import Link from "next/link"

export default async function UserProfileEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id }: { id: string } = await params
  const session = await auth()
  const user = session?.user
  const userProfileInfo = await findUserById(id)

  if (!userProfileInfo || !user || userProfileInfo.id !== user?.id) {
    redirect("/dashboard");
  }

  async function updateBio(formData: FormData) {
    "use server"
    const newBio = formData.get("bio")?.toString() || ""
    await updateUserBio(user?.id, newBio)
    revalidatePath(`/user/${user?.id}`)
    redirect(`/user/${user?.id}`);
  }

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Your Bio</CardTitle>
        </CardHeader>
        <form action={updateBio} className="space-y-4 w-full">
          <CardContent>
            <Textarea
              name="bio"
              placeholder="Tell us a bit about yourself..."
              defaultValue={userProfileInfo.bio ? userProfileInfo.bio : undefined}
              rows={6}
              className="min-h-30"
            />
          </CardContent>
          <div className="flex flex-row justify-center gap-20">
            <Button type="submit">Update Bio</Button>
            <Link href={`/user/${user?.id}`}>
              <Button variant={"destructive"}>Cancel</Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  )
}
