import { getStreamCountByStatus } from "@/lib/db/actions/streamscheduleActions";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default async function ApprovedSchedulesCard() {
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