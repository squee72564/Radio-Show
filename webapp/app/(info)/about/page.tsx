import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { HeadphonesIcon, Disc3Icon, RocketIcon, EarthIcon} from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About",
  description: "About page for Radio Show",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-4">About Radio Show</h1>
      <p className="text-muted-foreground text-lg">
        Radio Show is a free, open internet radio platform built for DJs, listeners, and music lovers.
      </p>
      <p className="text-muted-foreground text-lg mb-8">
        Broadcast live, discover fresh sets, and access archives — all in one modern space.
      </p>

      <Separator className="my-6" />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex flex-row items-center gap-2 text-lg font-semibold">
              <Disc3Icon />
              <span>For Djs</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Sign up, authenticate, and stream live directly through <strong>Icecast</strong> and <strong>Liquidsoap</strong>. Each show is archived automatically for later playback.
            </p>
            <Badge variant="outline" className="mt-4">Live Streaming</Badge>
            <Badge variant="outline" className="ml-2 mt-4">Automatic Archiving</Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex flex-row items-center gap-2 text-lg font-semibold">
              <HeadphonesIcon />
              <span>For Listeners</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Tune into ongoing live DJ sets or explore past broadcasts via the archive. Enjoy a non-corporate, community-powered radio experience.
            </p>
            <Badge variant="outline" className="mt-4">Live Shows</Badge>
            <Badge variant="outline" className="ml-2 mt-4">Archived Sets</Badge>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-row items-center gap-2 text-lg font-semibold">
            <RocketIcon />
            <span>Tech Stack</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            This platform is built using modern, open-source tools to ensure flexibility, reliability, and developer-friendliness.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Next.js</Badge>
            <Badge variant="secondary">Docker</Badge>
            <Badge variant="secondary">Icecast</Badge>
            <Badge variant="secondary">Liquidsoap</Badge>
            <Badge variant="secondary">PostgreSQL</Badge>
            <Badge variant="secondary">ShadCN UI</Badge>
            <Badge variant="secondary">+ More!</Badge>
          </div>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      <Card>
        <CardHeader>
          <CardTitle className="flex flex-row items-center gap-2 text-lg font-semibold">
            <EarthIcon />
            <span>Open And Free</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-muted-foreground">
            {"Radio Show is built for the people — by the people. It's open-source and community-driven. No ads, no corporate agendas, just pure music."}
          </p>
          <a href="https://github.com/squee72564/Radio-Show" target="_blank" rel="noopener noreferrer">
            <Button className="mt-4" variant="outline">
              View on GitHub
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
