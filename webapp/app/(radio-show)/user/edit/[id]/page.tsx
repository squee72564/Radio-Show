"use server"

import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { User } from "@prisma/client"
import UpdateBioCard from "@/components/update-bio-card"
import ApplyToStream from "@/components/apply-to-stream"
import UserPendingStreamsCard from "@/components/user-pending-streams-card"
import UserActiveStreamsCard from "@/components/user-active-streams-card"
import { Suspense } from "react"
import UserStreamsSkeleton from "@/components/user-streams-skeleton"


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
      <ApplyToStream/>
      <div className="flex flex-col w-full gap-6 sm:gap-2 sm:flex-row">
        <Suspense fallback={<UserStreamsSkeleton title={"Your Streams Pending Approval"}/>}>
          <UserPendingStreamsCard userId={user.id}/>
        </Suspense>
        <Suspense fallback={<UserStreamsSkeleton title={"Your Active Streams"}/>}>
          <UserActiveStreamsCard userId={user.id}/>
        </Suspense>
      </div>
    </div>
  )
}
