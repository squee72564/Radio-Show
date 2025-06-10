import { updateUserBio } from "@/lib/db/actions/userActions";
import { User } from "@prisma/client";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function UpdateBioCard({user}: {user: User}) {
  async function updateBio(formData: FormData) {
    "use server"
    const newBio = formData.get("bio")?.toString() || ""
    await updateUserBio(user?.id, newBio)
    revalidatePath(`/user/${user?.id}`)
    redirect(`/user/${user?.id}`);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Your Bio</CardTitle>
      </CardHeader>
      <form action={updateBio} className="space-y-4 w-full">
        <CardContent>
          <Textarea
            name="bio"
            placeholder="Tell us a bit about yourself..."
            defaultValue={user.bio || undefined}
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
  )
}
