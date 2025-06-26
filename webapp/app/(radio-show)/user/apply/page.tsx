"use server"

import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { User } from "@prisma/client"
import CreateScheduleForm from "@/app/(radio-show)/user/apply/create-schedule-form"

export default async function UserProfileEditPage() {
  const session = await auth()
  const user = session?.user as User | undefined;
  const signedIn = !!user;

  if (!signedIn) {
    redirect("/dashboard");
  }

  return (
    <div className="w-full px-5">
      <CreateScheduleForm user={user} />
    </div>
  )
}
