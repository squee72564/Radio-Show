import { prisma } from "@/lib/db/prismaClient";
import { findStreamScheduleByIdAndPass } from "@/lib/db/actions/streamscheduleActions"
import { StreamSchedule } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const body: {
      password: string,
      user: string,
      address: string
    } = JSON.parse(bodyText);

    const streamScheduleId = body.user;
    const password = body.password;

    if (!streamScheduleId || !password) {
      return new Response(JSON.stringify({authenticated: false, message: "No user or pass"}), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const streamschedule = await findStreamScheduleByIdAndPass(streamScheduleId, password) as StreamSchedule | null;

    if (!streamschedule) {
      return new Response(JSON.stringify({authenticated: false, message: "Could not find stream schedule"}), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    const now = new Date();

    const streamInstance = await prisma.streamInstance.findFirst({
      where: {
        streamScheduleId: streamschedule.id,
        scheduledStart: { lte: now },
        scheduledEnd: { gte: now },
      },
    });

    if (!streamInstance) {
      return new Response(JSON.stringify({authenticated: false, message: "Could not find stream instance"}), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const userId = streamschedule.userId;
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

  } catch (err) {
    return new Response(JSON.stringify({authenticated: false, message: err}), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}
