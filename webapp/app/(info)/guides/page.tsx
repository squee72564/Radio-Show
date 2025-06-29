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
    description: "Information on the B.U.T.T. application, how to set it up, and stream to MugenBeat.",
    title: "How to Stream with B.U.T.T."
  }
];

export default async function GuidesPage() {
  return (
    <main className="flex flex-col flex-1 w-full justify-center items-center text-center">
      <ul className="flex flex-col gap-4 w-3xl">
        {links.map((link, idx) => (
          <li key={idx} className="hover:-translate-y-1 duration-300">
            <Link href={link.url}>
              <Card>
                <CardHeader className="flex flex-col gap-4">
                  <CardTitle>
                    {link.title}
                  </CardTitle>
                  <CardContent>
                    {link.description}
                  </CardContent>
                </CardHeader>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}