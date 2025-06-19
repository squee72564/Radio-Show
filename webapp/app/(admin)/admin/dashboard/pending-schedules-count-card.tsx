"use server";

import Link from "next/link";
import { getStreamCountByStatus } from "@/lib/db/actions/streamscheduleActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function PendingSchedulesCard() {
  const pendingCount = await getStreamCountByStatus("PENDING");

  return (
    <Card className={pendingCount > 0 ? "border-yellow-400/60" : "border-green-400/50"}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Pending Schedules
        </CardTitle>
      </CardHeader>
      <CardContent>
        {pendingCount > 0 ? (
          <div className="space-y-2">
            <p>There are <strong>{pendingCount}</strong> schedule(s) awaiting review.</p>
            <Link href="/admin/schedules">
              <Button size="sm" variant="default">Review Now</Button>
            </Link>
          </div>
        ) : (
          <p className="text-green-600/80"><strong>{pendingCount}</strong> pending schedules</p>
        )}
      </CardContent>
    </Card>
  );
}