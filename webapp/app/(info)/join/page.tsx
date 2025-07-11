import { Metadata } from "next"
import Link from "next/link"
import { auth, signIn } from "@/auth"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { NotebookPenIcon, RocketIcon, BookHeadphonesIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "MugenBeat - DJ",
  description: "Join Information page for MugenBeat",
};


export default async function DJSignupPage() {
  const session = await auth();
  const user = session?.user;
  const signedIn = !!user;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-4">Become a DJ</h1>
      <p className="text-muted-foreground text-lg">
        Want to stream your music live to the world?
      </p>
      <p className="text-muted-foreground text-lg">
        MugenBeat is a free, community-driven platform for DJs of all styles and skill levels. 
      </p>
      <p className="text-muted-foreground text-lg mb-8">
        Signing up is easy — and streaming is even easier.
      </p>

      <Separator className="my-6" />

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-row items-center gap-2 text-lg font-semibold">
            <NotebookPenIcon />
            <span>How It Works</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Create a DJ account</li>
              <li>Schedule your set through the dashboard</li>
              <li>Authenticate using your stream credentials</li>
              <li>Go live using Icecast-compatible software (like Mixxx, BUTT, or Nicecast)</li>
              <li>Your set is streamed live and automatically archived</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-row items-center gap-2 text-lg font-semibold">
            <RocketIcon />
            <span>Ready To Join?</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-muted-foreground mb-4">
              {signedIn ? (
                "Click below to start the application."
              ): (
                "Click below to login with Google and start the application."
              )}
              
            </p>
            {signedIn ? (
              <Link href="/user/apply">
                <Button variant="outline">Apply to DJ</Button>
              </Link>
            ): (
              <Button
                variant="outline"
                onClick={ async () => {
                  "use server";
                  await signIn("google", {
                    redirect: true,
                    redirectTo: "/user/apply",
                  });
                }}
              >
                Login with Google and Apply
              </Button>
            )}

          </div>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-row items-center gap-2 text-lg font-semibold">
            <BookHeadphonesIcon />
            <span>How It Works</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-muted-foreground">
              For detailed setup instructions, including recommended broadcasting tools and troubleshooting tips, check out our full streaming guide.
            </p>
            <Link href="/guides" className="inline-block mt-2 underline text-sm text-blue-600 hover:text-blue-800">
              View Full Streaming Guide →
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
