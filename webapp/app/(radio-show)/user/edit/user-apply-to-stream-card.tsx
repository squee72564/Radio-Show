"use server";

import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button";

export default async function UserApplyToStreamCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Apply To Live Stream</CardTitle>
      </CardHeader>
      <CardContent>
        <p>
          Want to stream a live set on the platform? Press the button below to start the application process.
        </p>
      </CardContent>
      <CardFooter className="space-x-10">
        <Link href={"/user/apply"}>
          <Button variant={"outline"}>
            Apply
          </Button>
        </Link>
        <Link href={"/user/apply"}>
          <Button variant={"outline"}>
            Live Streaming Information 
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
