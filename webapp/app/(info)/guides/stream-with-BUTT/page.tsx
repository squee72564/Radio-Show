import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default async function StreamWithButtInfo() {
  return (
    <main className="flex flex-col gap-6 p-6 w-4xl max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">What is BUTT?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            BUTT (Broadcast Using This Tool) is is an easy to use, multi OS streaming tool.
            It supports Icecast, Shoutcast and WebRTC and runs on Windows, macOS and Linux.
          </p>
          <p>
            The main purpose of BUTT is to stream live audio from your computers microphone or line input
            to an Icecast, Shoutcast or WebRTC (WHIP) server. If you want you can also record your broadcast locally
            on your computer.
          </p>
          <p>
            More information about BUTT can be found on <a className="underline" href="https://danielnoethen.de/butt/">the website</a>.
          </p>
          <p>You can use BUTT to stream live audio data to Mugen Beat during your scheduled streaming time.</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">Prerequisites</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Before downloading and using BUTT you must have an approved stream application on the Mugen Beat platform.
            You will need the credential and password associated with this stream to use BUTT
          </p>
          <p>More information about creating a stream schedule can be found <Link className="underline" href="/guides/stream-application">here</Link></p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">How to use BUTT</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>First download BUTT from the website.</p>
          <p>
            On the BUTT website you can find a OS specific guide for installing the program on your computer (<a className="underline " href="https://danielnoethen.de/butt/release/1.45.0/butt-1.45.0_manual.html#_install">Link Here</a>).
            Follow this guide to install the software.
          </p>
          <p>Once the software is installed open it and you should see something like this:</p>
          <Image
            alt="The open BUTT application"
            src={"/butt_open.png"}
            width={1084}
            height={1084}
          />
          <p>
            Click on "Settings" to open the settings tab.
            Under the "Main" tab in the settings window you will see "Server Settings".
            Under this press the "Add" button to add a new server to connect to.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}