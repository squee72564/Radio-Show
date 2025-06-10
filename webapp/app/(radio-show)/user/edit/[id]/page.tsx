"use server"

import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { User } from "@prisma/client"
import UpdateBioCard from "@/components/update-bio-card"

export default async function UserProfileEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id }: { id: string } = await params
  const session = await auth()
  const user = session?.user as User | undefined;
  const signedIn = !!user;

  if (!signedIn || id !== user.id) {
    redirect("/dashboard");
  }

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      <UpdateBioCard user={user} /> 
    </div>
  )
}
