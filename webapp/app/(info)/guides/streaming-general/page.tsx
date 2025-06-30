import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArchiveIcon, BookCheckIcon, CalendarIcon, CheckIcon, HeadphonesIcon, PlusCircleIcon, RocketIcon, RulerIcon } from "lucide-react";
import Link from "next/link";

export default async function StreamingGeneralInfo() {
  return (
    <main className="flex flex-col gap-6 p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center"><HeadphonesIcon/>MugenBeat Streaming Guide</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            Welcome to <strong>MugenBeat</strong>, a global internet radio platform where you
            can share your sound with the world. This guide will walk you through everything
            you need to know about streaming on the platform.
          </p>
        </CardContent>
      </Card>

      {/* Account Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center"><RocketIcon/>Getting Started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>
            {"To stream on MugenBeat, you must first "}<strong>create an account</strong>.
            {"The platform uses Google OAuth, so you will need a google account to stream."}
            {"Once you're logged in, you'll gain access to the stream scheduling system."}
          </p>
        </CardContent>
      </Card>

      {/* Schedule Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center"><CalendarIcon/>Streaming Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            MugenBeat uses a <strong>global calendar</strong> for scheduling.
            The platform uses UTC for all internal dates and times,
            but it will render your local time for scheduled events on the browser.
          </p>
          <p>
            When scheduling a stream, select dates and times. from the viewpoint of your own local
            time zone. Behind the scenes MugenBeat will transform it all to UTC and display it to
            other users in their own local timezone.
          </p>
          <p className="flex flex-row gap-2 justify-center items-center text-center"> 
            <Badge className="max-h-8 text-black font-bold" variant="destructive">
              WARNING!
            </Badge>
            Keep in mind daylight savings time shifts when applying for a slot in the calendar.
            Since MugenBeat internally operates on UTC, your schedule may shift forward or backwards
            if daylight savings applies to your timezone. Always check the schedule to see when your
            stream is starting in your own local time zone.
          </p>

          <p>Additional Notes:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>There are <strong>No overlapping streams</strong> — only one show can be live at any time.</li>
            <li>Each stream runs for a fixed <strong>4-hour time window</strong>.</li>
          </ul>
        </CardContent>
      </Card>

      {/* Slot Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center"><BookCheckIcon/>Stream Application Form</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc list-inside space-y-1">
            <li>
              Apply for available time by navigating to your user page,
              clicking the edit button, and pressing apply.
            </li>

            <li>All requests are <strong>pending until approved</strong> by an admin.</li>
            <li>{"Once approved, your stream appears on the calendar and you're authorized to broadcast."}</li>
            <li>Admins may revoke scheduled streams at any time.</li>
          </ul>
        </CardContent>
        <CardFooter>
          <p>
            <Link className="font-bold hover:underline hover:text-blue-600" href={"/guides/stream-application"}>Click Here </Link>
            to see more information about the stream application form itself.
          </p>
        </CardFooter>
      </Card>

      {/* Streaming Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center"><RulerIcon/>Streaming Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="list-disc list-inside space-y-1">
            <li>You can only stream during your approved slot.</li>
            <li>Unauthorized connection attempts will be rejected.</li>
            <li>Use your assigned credentials with compatible software (e.g., BUTT, OBS).</li>
            <li>Streams are <strong>automatically cut off</strong> when your allotted time ends.</li>
          </ul>
        </CardContent>
      </Card>

      {/* Archives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center"><ArchiveIcon/>Automatic Archives</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            All live streams are <strong>automatically archived</strong> after completion. These
            are made available for replay for all users. You can individually delete archives that
            you no longer want associated with your profile, but <strong>this action is permenant</strong>.
          </p>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center"><CheckIcon/>Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1">
            <li>Test your setup before your scheduled time.</li>
            <li>Start and end on time.</li>
            <li>Maintain a consistent and professional audio quality.</li>
            <li>Respect platform rules and community guidelines.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center"><PlusCircleIcon/>Additional Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <Link
                href={"/guides/stream-with-BUTT"}
                className="hover:text-blue-600 hover:underline"
              >
                Streaming with B.U.T.T.
              </Link>
            </li>
            <li>
              <Link
                href={"/guides/stream-application"}
                className="hover:text-blue-600 hover:underline"
              >
                Stream Application Additional Information
              </Link>
            </li>
          </ul>
        </CardContent>
      </Card>

      <Separator />

      <p className="text-sm text-muted-foreground text-center">
        Have questions? <Link className="underline" href="/contact">Contact the admin team here.</Link>
      </p>
    </main>
  );
}
