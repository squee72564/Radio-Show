"use client";

import { useActionState } from "react";
import { CircleHelpIcon } from "lucide-react";

import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "./ui/card";
import { Input } from "./ui/input";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

import { redirect } from "next/navigation";

import { streamScheduleFormSubmit } from "@/lib/db/actions/streamscheduleActions";

import { StreamScheduleFormState, weekdays, Weekday } from "@/app/types/stream-schedule";
import { User } from "@prisma/client";


function HoverCardData() {
  return (
    <>
      <div>
        <strong>Title:</strong> Title of the broadcast.
      </div>
      <div>
        <strong>Description:</strong> Description of the broadcast.
      </div>
      <div>
        <strong>Tags:</strong> Identifiers like genres or short labels for the stream.
      </div>
      <div>
        <strong>Start/End Time:</strong> Time range when your stream will air.
      </div>
      <div>
        <strong>Start/End Date:</strong> Date range when the stream schedule is active.
      </div>
      <div>
        <strong>Repeat Weekly On:</strong> Selected days of the week the stream recurs.
      </div>
      <div>
        <strong>Credential:</strong> This is a credential that will be used to authenticate when streaming.
      </div>
      <div>
        <strong>Password:</strong> This is a password that will be used as a credential to stream.
      </div>
    </>
  );
}

function ErrorMessage({ message }: { message?: string[] }) {
  if (!message || message.length === 0) return null;
  return (
    <p className="text-sm text-red-500 mt-1">{message.join(", ")}</p>
  );
}

export default function CreateScheduleForm({ user }: { user: User }) {
  const formActionWithUser = async (
    prevState: StreamScheduleFormState,
    formData: FormData
  ) => {
    return streamScheduleFormSubmit(user.id, prevState, formData);
  };

  const [state, formAction] = useActionState(formActionWithUser, {
    success: false,
    message: "",
    errors: {},
    values: {}
  });

  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const formattedTomorrow = tomorrowDate.toISOString().slice(0, 10);

  console.log(formattedTomorrow)

  if (state.success) {
    redirect(`/user/edit/${user.id}`)
  }

  return (
    <form 
      action={formAction}
    >
      <Card>
        <CardHeader className="w-full flex flex-row">
          <CardTitle>Stream Schedule Application</CardTitle>
          <HoverCard>
            <HoverCardTrigger className="ml-auto text-muted-foreground hover:text-primary transition-colors">
              <CircleHelpIcon className="w-5 h-5" />
            </HoverCardTrigger>
            <HoverCardContent className="min-w-100 text-sm space-y-2">
              <HoverCardData />
            </HoverCardContent>
          </HoverCard>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div>
            <label htmlFor="title">Title</label>
            <Input id="title" name="title" defaultValue={state.values?.title}/>
            <ErrorMessage message={state.errors?.title} />
          </div>

          <div>
            <label htmlFor="description">Description</label>
            <Input id="description" name="description" defaultValue={state.values?.description}/>
            <ErrorMessage message={state.errors?.description} />
          </div>

          <div>
            <label htmlFor="tags">Tags (comma-separated)</label>
            <Input id="tags" name="tags" defaultValue={state.values?.tags}/>
            <ErrorMessage message={state.errors?.tags}/>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="start-time">Start Time</label>
              <Input type="time" name="start-time" id="start-time" defaultValue={state.values?.["start-time"]}/>
              <ErrorMessage message={state.errors?.["start-time"]} />
            </div>
            <div className="flex-1">
              <label htmlFor="end-time">End Time</label>
              <Input type="time" name="end-time" id="end-time" defaultValue={state.values?.["end-time"]}/>
              <ErrorMessage message={state.errors?.["end-time"]} />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="start-date">Start Date</label>
              <Input
                id="start-date"
                name="start-date"
                type="date"
                min={formattedTomorrow} 
                defaultValue={
                  state.values?.["start-date"]
                }
              />
              <ErrorMessage message={state.errors?.["start-date"]} />
            </div>
            <div className="flex-1">
              <label htmlFor="end-date">End Date</label>
              <Input
                id="end-date"
                name="end-date"
                type="date" 
                min={formattedTomorrow}
                defaultValue={
                  state.values?.["end-date"]
                }
              />
              <ErrorMessage message={state.errors?.["end-date"]} />
            </div>
          </div>
          <div>
            <label className="block mb-2">Repeat Weekly On:</label>
            <div className="flex flex-wrap justify-center gap-10">
              {weekdays.map((day) => (
                <div key={day} className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    name="days"
                    value={day}
                    id={`day-${day}`}
                    className="accent-blue-500"
                    defaultChecked={(state.values?.days as Weekday[])?.includes(day)}
                  />
                  <label htmlFor={`day-${day}`}>{day}</label>
                </div>
              ))}
              <ErrorMessage message={state.errors?.days} />
            </div>
            <ErrorMessage message={state.errors?.conflicts && ["This time slot conflicts with other schedules"]} />
          </div>

          <div className="flex flex-col gap-4">
            <label htmlFor="password">Stream Password</label>
            <Input type="password" name="password" id="password" defaultValue={state.values?.password}/>
            <ErrorMessage message={state.errors?.password} />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" variant="outline">Submit Applicaiton</Button>
        </CardFooter>
      </Card>
    </form>
  );
}