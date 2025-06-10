import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MailQuestionIcon, BugOffIcon } from "lucide-react"
import Link from "next/link"

export default function Contact() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
      <p className="text-muted-foreground text-lg">
        Got a question, bug report, or just want to say hello?
      </p>
      <p className="text-muted-foreground text-lg mb-8 ">
        Reach out via email or submit an issue on GitHub.
      </p>

      <Separator className="my-6" />

      <Card className="text-center">
        <CardContent className="space-y-15">
          <div className="flex flex-col items-center">
            <MailQuestionIcon /> 
            <h2 className="text-xl font-semibold mb-1">Email</h2>
            <p className="text-muted-foreground">
              You can contact us at <a href="mailto:contact@radioshow.fm" className="underline">contact@radioshow.fm</a>.
            </p>
            <p className="text-muted-foreground">
                We’ll try to respond within a day or two.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <BugOffIcon />
            <h2 className="text-xl font-semibold mb-1">Report an Issue</h2>
            <p className="text-muted-foreground">
              Found a bug or want to suggest a feature? Submit it on GitHub:
            </p>

          </div>
        </CardContent>
        <CardFooter>
          <a
            href="https://github.com/squee72564/Radio-Show/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="mx-auto"
          >
            <Button variant="outline" className="mt-2">
              Open GitHub Issues
            </Button>
          </a>
        </CardFooter>
      </Card>
    </div>
  )
}
