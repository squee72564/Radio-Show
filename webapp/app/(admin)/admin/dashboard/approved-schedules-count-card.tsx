"use server";

import { getStreamCountByStatus } from "@/lib/db/actions/streamscheduleActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ApprovedSchedulesCountCard() {
  const approvedCount = await getStreamCountByStatus("APPROVED");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Approved Schedules</CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>{approvedCount}</strong> approved stream schedules.</p>
      </CardContent>
    </Card>
  );
}