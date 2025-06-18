import { prisma } from "@/lib/db/prismaClient";

export async function POST(req: Request) {
  const bodyText = await req.text();
  const body: {password: string, user: string, address: string}
    = JSON.parse(bodyText);

  const userId = body.user;
  const password = body.password;

  if (!userId || !password) {
    return new Response(JSON.stringify({authenticated: false, message: "No user or pass"}), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const streamschedule = await prisma.streamSchedule.findUnique({
    where: {
      userId_password: {
        userId: userId,
        password: password,
      },
    }
  })

  if (!streamschedule) {
    return new Response(JSON.stringify({authenticated: false, message: "Could not find stream schedule"}), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  
  const now = new Date();

  const streamInstances = await prisma.streamInstance.findMany({
    where: {
      streamScheduleId: streamschedule.id,
      scheduledStart: { lte: now },
      scheduledEnd: { gte: now },
    },
  });

  console.log(streamInstances);

  if (!streamInstances || streamInstances.length === 0) {
    return new Response(JSON.stringify({authenticated: false, message: "Could not find stream instance"}), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const streamInstance = streamInstances[0];

  const streamScheduleId = streamschedule.id;
  const streamInstanceId = streamInstance.id;
  const title = streamschedule.title;
  const timelimit = Math.max(
    0,
    Math.floor((streamInstance.scheduledEnd.getTime() - Date.now()) / 1000)
  );

  const data = {
    authenticated: true,
    meta: {
      title,
      timelimit,
      userId,
      streamScheduleId,
      streamInstanceId,
    }
  };

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
