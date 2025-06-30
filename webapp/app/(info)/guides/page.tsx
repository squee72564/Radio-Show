import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

const links = [
  {
    url: "guides/streaming-general",
    description: "General information about streaming to MugenBeat.",
    title: "General Streaming Information"
  },
  {
    url: "guides/stream-application",
    description: "How to submit a stream application to schedule your streams on MugenBeat.",
    title: "Stream Application Information"
  },
  {
    url: "guides/stream-with-BUTT",
    description: "Information on the B.U.T.T. application, how to set it up, and how to stream on MugenBeat.",
    title: "How to Stream with B.U.T.T."
  }
];

export default async function GuidesPage() {
  return (
    <main className="flex flex-col gap-4 w-full justify-center items-center text-center">
      <div className="flex flex-col gap-4 w-full max-w-3xl">
        {links.map((link, idx) => (
          <Link key={idx} href={link.url} className="hover:-translate-y-1 duration-300">
            <Card className="flex flex-col flex-1 w-full">
              <CardHeader className="flex flex-col gap-4">
                <CardTitle>
                  {link.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {link.description}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}