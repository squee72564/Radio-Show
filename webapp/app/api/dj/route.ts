import { prisma } from '@/lib/db/prismaClient';
import { findStreamScheduleByIdAndPass } from '@/lib/db/actions/streamscheduleActions';
import { StreamSchedule } from '@prisma/client';
import { z } from 'zod';

const DjAuthSchema = z.object({
  password: z.string().min(1),
  user: z.string().min(1),
  address: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    const parsed = DjAuthSchema.safeParse(JSON.parse(bodyText));

    if (!parsed.success) {
      return new Response(JSON.stringify({ authenticated: false, message: 'Invalid request body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = parsed.data;

    const streamScheduleId = body.user;
    const password = body.password;

    if (!streamScheduleId || !password) {
      return new Response(JSON.stringify({ authenticated: false, message: 'No user or pass' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const streamschedule = (await findStreamScheduleByIdAndPass(
      streamScheduleId,
      password,
    )) as StreamSchedule | null;

    if (!streamschedule) {
      return new Response(
        JSON.stringify({ authenticated: false, message: 'Could not find stream schedule' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        },
      );
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
      return new Response(
        JSON.stringify({ authenticated: false, message: 'Could not find stream instance' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    const userId = streamschedule.userId;
    const streamInstanceId = streamInstance.id;
    const title = streamschedule.title;
    const timelimit = Math.max(
      0,
      Math.floor((streamInstance.scheduledEnd.getTime() - Date.now()) / 1000),
    );

    const data = {
      authenticated: true,
      meta: {
        title,
        timelimit,
        userId,
        streamScheduleId,
        streamInstanceId,
      },
    };

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('DJ auth error:', err);
    return new Response(JSON.stringify({ authenticated: false, message: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
