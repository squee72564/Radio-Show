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
    description: "Information on the BUTT application, how to set it up, and how to stream on MugenBeat.",
    title: "How to Stream with BUTT"
  }
];

export default async function GuidesPage() {
  return (
    <main className="flex flex-col w-full justify-center items-center">
      <div className="flex flex-col gap-4 max-w-5xl text-center">
        {links.map((link, idx) => (
          <Link key={idx} href={link.url} className="hover:-translate-y-1 duration-300">
            <Card>
              <CardHeader>
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