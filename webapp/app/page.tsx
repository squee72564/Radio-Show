import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Title */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-center tracking-tight drop-shadow-sm">
        Welcome to Radio Show
      </h1>

      {/* Main Content */}
      <div className="mt-12 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <Image
          src="/radio-show.jpg"
          alt="Radio Show"
          width={640}
          height={640}
          className="rounded-3xl shadow-xl max-w-100 transform hover:scale-105 transition-transform duration-500 ease-in-out"
        />

        <Card className="backdrop-blur-md shadow-md">
          <CardContent className="p-8 flex flex-col items-center text-center gap-6">
            <p className="text-lg font-medium">
              Radio Show is a free internet radio platform for everyone.
            </p>
            <p className="text-md">
              Listen to live music, browse archives, or host your own show.
            </p>

            <Button asChild variant={"default"} className="">
              <Link href="/dashboard">Click here to enter</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
