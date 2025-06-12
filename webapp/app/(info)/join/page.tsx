import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { NotebookPenIcon, RocketIcon, BookHeadphonesIcon } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up To Stream",
  description: "Join Information page for Radio Show",
};


export default function DJSignupPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-4">Become a DJ</h1>
      <p className="text-muted-foreground text-lg">
        Want to stream your music live to the world?
      </p>
      <p className="text-muted-foreground text-lg">
        Radio Show is a free, community-driven platform for DJs of all styles and skill levels. 
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
              Hit the button below to create your DJ account and start scheduling your shows.
            </p>
            <Link href="/signup">
              <Button variant="outline">Sign Up to DJ</Button>
            </Link>
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
            <Link href="/guides/streaming-setup" className="inline-block mt-2 underline text-sm text-blue-600 hover:text-blue-800">
              View Full Streaming Guide →
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
