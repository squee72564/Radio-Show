import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function DJSignupPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-4">Become a DJ</h1>
      <p className="text-muted-foreground text-lg mb-8 text-center">
        Want to stream your music live to the world? Radio Show is a free, community-driven platform for DJs of all styles and skill levels. Signing up is easy — and streaming is even easier.
      </p>

      <Separator className="my-6" />

      <Card>
        <CardContent className="pt-6 space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">📝 How It Works</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Create a DJ account</li>
              <li>Schedule your set through the dashboard</li>
              <li>Authenticate using your stream credentials</li>
              <li>Go live using Icecast-compatible software (like Mixxx, BUTT, or Nicecast)</li>
              <li>Your set is streamed live and automatically archived</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">🚀 Ready to Join?</h2>
            <p className="text-muted-foreground mb-4">
              Hit the button below to create your DJ account and start scheduling your shows.
            </p>
            <Link href="/signup">
              <Button variant="default">Sign Up to DJ</Button>
            </Link>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-2">📚 Streaming Setup Guide</h2>
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
