
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(await req.url)
  const dateStr = searchParams.get("date")

  if (!dateStr) {
    return NextResponse.json({ error: "Missing date param" }, { status: 400 })
  }

  const date = new Date(dateStr)

  if (isNaN(date.getTime())) {
    return NextResponse.json({ error: "Invalid date format" }, { status: 400 })
  }

  try {
    // Actual db call here
    const items: {title:string, id:number}[] = [];

    const sampleTitles = [
      "Meeting with team",
      "Client call",
      "Lunch break",
      "Code review",
      "Design session",
      "Sprint planning",
      "Pair programming",
      "Demo prep",
      "Database migration",
      "Bug triage",
    ]

    // Generate 3–5 random items
    const numItems = Math.floor(Math.random() * 3) + 10

    for (let i = 0; i < numItems; i++) {
      const title = sampleTitles[Math.floor(Math.random() * sampleTitles.length)]
      const id = Math.floor(Math.random() * 10000)
      items.push({ title, id })
    }

    return NextResponse.json({ items })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}