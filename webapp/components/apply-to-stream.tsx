import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "./ui/button";

export default function ApplyToStream() {
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
      <Button variant={"outline"}>
        Apply
      </Button>
      <Button variant={"outline"}>
        Live Streaming Information
      </Button>
    </CardFooter>
    </Card>
  );
}
