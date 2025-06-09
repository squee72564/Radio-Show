import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12 text-center">
      <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
      <p className="text-muted-foreground text-lg mb-8 ">
        Got a question, bug report, or just want to say hello? Reach out via email or submit an issue on GitHub.
      </p>

      <Separator className="my-6" />

      <Card>
        <CardContent className="space-y-15">
          <div>
            <h2 className="text-xl font-semibold mb-1">📧 Email</h2>
            <p className="text-muted-foreground">
              You can contact us at <a href="mailto:contact@radioshow.fm" className="underline">contact@radioshow.fm</a>.
            </p>
            <p className="text-muted-foreground">
                We’ll try to respond within a day or two.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-1">🐛 Report an Issue</h2>
            <p className="text-muted-foreground">
              Found a bug or want to suggest a feature? Submit it on GitHub:
            </p>
            <a
              href="https://github.com/squee72564/Radio-Show/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" className="mt-2">
                Open GitHub Issues
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
      <Link
        href={"/dashboard"}
      >
        <Button
          className="mt-10"
          variant={"outline"}
        >
          Dashboard
        </Button>
      </Link>
    </div>
  )
}
