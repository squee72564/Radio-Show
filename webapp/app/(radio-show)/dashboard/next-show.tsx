"use server";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function NextShow() {
  const nextScheduledShow: null = null;

  return (
    <section className="md:col-span-2 mt-4">
      <Card className="shadow-sm border border-muted">
        <CardHeader>
          <CardTitle className="text-lg font-medium">Next Scheduled Show</CardTitle>
        </CardHeader>
        <CardContent>
          {nextScheduledShow ? (
            <div className="text-sm">{nextScheduledShow}</div>
          ) : (
            <Badge variant="outline" className="text-muted-foreground">
              No show scheduled
            </Badge>
          )}
        </CardContent>
      </Card>
    </section>
  );   
}