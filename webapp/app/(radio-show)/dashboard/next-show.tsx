"use server";

import { Badge } from "@/components/ui/badge";
import { findFirstStreamInstanceAfterDate } from "@/lib/db/actions/streamscheduleActions";
import StreamInstanceInfoCard from "@/components/streaminstance-info-card";
import { dateToUTC } from "@/lib/utils";

export default async function NextShow() {
  const nowUTC = dateToUTC(new Date());

  const nextScheduledShow = await findFirstStreamInstanceAfterDate(nowUTC);

  return (
    <section>
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