"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function DatePicker() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [schedule, setSchedule] = useState<{ id: number; title: string }[] | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!date) return
    setLoading(true)
    fetch(`/api/calendar?date=${format(date, "yyyy-MM-dd")}`)
      .then((res) => res.json())
      .then((data) => {
        setSchedule(data.items || [])
        setLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setLoading(false)
      })
  }, [date])

  return (
    <div className="min-h-screen px-4 py-8 w-full">
      <div className="relative mb-8 ml-5">
        <Popover>
          <PopoverTrigger asChild >
            <Button
              variant="outline"
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-4 w-full overflow-auto max-h-180 p-5">
        {loading ? (
          <Badge variant="outline">Loading...</Badge>
        ) : schedule && schedule.length > 0 ? (
          schedule.map((stream) => (
            <Card key={stream.id} className="transition-transform hover:-translate-y-1 duration-300 w-full">
              <CardHeader>
                <CardTitle>{stream.title}</CardTitle>
                <CardDescription>Scheduled for: {format(date!, "PPP")}</CardDescription>
              </CardHeader>
              <CardFooter>
                <p className="text-sm text-muted-foreground">ID: {stream.id}</p>
              </CardFooter>
            </Card>
          ))
        ) : (
          <Badge variant="outline">No scheduled items</Badge>
        )}
      </div>
    </div>
  )
}
