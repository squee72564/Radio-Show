import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default async function StreamApplicationInfo() {
  return (
    <main className="flex flex-col gap-6 p-6 w-4xl max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">What is a Stream Application?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
              Mugen Beat allows for users to submit an application to request to live stream on the platform.
              A stream application contains all of the information that describes a livestream from the title, description, tags, stream time, and stream date.
          </p>
          <p>
            A stream application is filled out by an existing user and submitted to be reviewed by an Admin.
            Once initially submitted, the livestream defined by the stream application has a pending status and will not be added to Mugen Beat's schedule.
          </p>
          <p>
            Once an Admin approves of the stream it is added to the schedule and future instances of the stream will appear on the calendar.
            Admins reserve the right to revoke an approved stream at any time and reject any pending streams for any reason.
            If an active stream is revoked, all instances of the stream scheduled in the future will be removed from the schedule completely.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">What information do I submit with a stream application?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            There are required and optional information fields associated with every stream application:
          </p>
          <ul className="list-disc list-inside">
            <li><strong>*Title:</strong> Title of the broadcast.</li>
            <li><strong>Description:</strong> Description of the broadcast.</li>
            <li><strong>*Start/End Time:</strong> Time range when your stream will air.</li>
            <li><strong>*Start/End Date:</strong> Date range when the stream schedule is active.</li>
            <li><strong>*Repeat Weekly On:</strong> Selected days of the week the stream recurs.</li>
            <li><strong>*Interval:</strong> Interval between recurrences.</li>
            <li><strong>*Credential:</strong> This is a credential that will be used to authenticate when streaming.</li>
            <li><strong>*Password:</strong> This is a password that will be used as a credential to stream.</li>
          </ul>
          <p className="text-muted-foreground text-sm">
            <strong>*</strong> means the field is required
          </p>
          <p>
            For a single livestream, you submit a start and end time range, which will be consistent for every instance of the stream.
            The maximum time for a single stream instance is 4 hours, and there is no minimum time.
          </p>
          <p>
            There is also a start and end date range. This range represents the range of dates that your stream will be scheduled for.
            Keep in mind this does not mean that your stream will be scheduled every day in this range, it just represents the time frame over which the stream can be scheduled based on the days and interval selected.
          </p>
          <p>
            <strong>Repeat weekly on</strong> represents the days of the week that the stream will be scheduled at the time range you input.
            For example, if you have a start and end time of 7:00-8:30 and select the days "MO", "WE", "FR", the stream will take place from 7:00-8:30 on Monday, Wednesday, and Friday.
          </p>
          <p>
            <strong>Interval</strong> represents the weekly interval that the stream is scheduled on.
            For example if we have a stream from 7:00-8:30 on Monday, Wednesday, and Friday and set the interval to "1", this means that it will be scheduled on those days at the designated time every week.
            Setting the interval to "2" would mean the stream would be scheduled on those days every other week.
            Setting the interval to "3" means that the stream would be scheduled on those days every three weeks, and so on.
          </p>
          <p>
            <strong>Credential</strong> is the username that will be used for authentication when connecting to the livestream.
          </p>
          <p>
            <strong>Password</strong> is the password that will be used for authentication when connecting to the livestream.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">Where do I find the stream application form?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
          To sumbit a stream application you can click the "Sign Up To DJ" button in the top navigation bar above.
          Alternatively, you can navigate to the dashboard, and when signed in click the profile card in the bottom of the sidebar and select "Apply To Stream".
          </p>
        </CardContent>
      </Card>
    </main>
  );
}