"use client";

import { updateUserBio } from "@/lib/db/actions/userActions";
import { User } from "@prisma/client";

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useTransition } from "react";

export default function UpdateBioCard({user}: {user: User}) {
  const [pending, startTransition] = useTransition();
  const [bio, setBio] = useState(user.bio || "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);


  const handleSubmit = () => {
    if (!bio) return;

    setError(null);
    setSuccess(null);

    startTransition( async () => {
      const result = await updateUserBio(user.id, bio)

      if (result.type === "error") {
        setError(result.message);
      } else {
        setBio(result.data.bio || "");
        setSuccess("Bio updated")
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Your Bio</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 w-full">
        <Textarea
          name="bio"
          placeholder="Tell us a bit about yourself..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={6}
          className="min-h-30"
        />
      </CardContent>
      <div className="flex flex-col items-center justify-center text-center gap-5">
        <Button className="max-w-xl" onClick={handleSubmit}>{pending ? "Pending" : "Save Changes"}</Button>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </div>
    </Card>
  )
}
