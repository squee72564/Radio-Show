"use server"

import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Suspense } from "react"
import { User } from "@prisma/client"

import UpdateBioCard from "@/app/(radio-show)/user/edit/update-bio-card"
import UserPendingStreamsCard from "@/app/(radio-show)/user/edit/user-pending-streams-card"
import UserActiveStreamsCard from "@/app/(radio-show)/user/edit/user-active-streams-card"
import UserStreamsSkeleton from "@/app/(radio-show)/user/edit/user-streams-skeleton"
import UserApplyToStreamCard from "@/app/(radio-show)/user/edit/user-apply-to-stream-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"


export default async function UserProfileEditPage() {
  const session = await auth()
  const user = session?.user as User | undefined;
  const signedIn = !!user;

  if (!signedIn) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col w-full p-6 gap-4">
      <Link href={`/user/${user.id}`}><Button>Back To Profile</Button></Link>
      <UpdateBioCard user={user} />
      <UserApplyToStreamCard/>
      <div className="flex flex-col w-full gap-6 sm:gap-2 sm:flex-row max-h-[395px]">
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