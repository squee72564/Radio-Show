"use server";

import { Badge } from "@/components/ui/badge";
import { findFirstStreamInstanceAfterDate } from "@/lib/db/actions/streamscheduleActions";
import StreamInstanceInfoCard from "@/components/streaminstance-info-card";

export default async function NextShow() {
  const nowUTC = new Date(new Date().getUTCDate());
  const nextScheduledShow = await findFirstStreamInstanceAfterDate(nowUTC);

  return (
    <section className="md:col-span-2">
      {nextScheduledShow ? (
        <StreamInstanceInfoCard streamInstance={nextScheduledShow} />
      ) : (
        <Badge variant="outline" className="text-muted-foreground p-5 my-20">
          No show scheduled
        </Badge>
      )}
    </section>
  );   
}