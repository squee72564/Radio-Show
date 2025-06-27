import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import NavigationHeader from "@/components/nav-header"


export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full gap-10">
      <NavigationHeader/>
      <main className="flex flex-col flex-1 items-center justify-center w-full">
        <div className="flex flex-col md:flex-row w-full max-w-5xl gap-8 items-center p-6">
          <Image
            src="/radio-show.jpeg"
            alt="MugenBeat Logo"
            width={640}
            height={640}
            className="rounded-3xl shadow-xl max-w-sm transform hover:scale-105 transition-transform duration-500 ease-in-out"
          />

          <Card className="backdrop-blur-md shadow-md">
            <CardContent className="p-8 flex flex-col items-center text-center gap-6">
              <p className="text-lg font-medium">
                {"MugenBeat is a free, global internet radio platform designed for music lovers and DJs alike. Stream live shows from DJs around the world, explore an extensive archive of past broadcasts, or easily schedule and host your own live show — all with zero barriers."}
              </p>
              <p className="text-md">
                {"\"Boundless beats for every soul.\""}
              </p>

              <Button asChild variant={"default"}>
                <Link href="/dashboard">Get Started</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}