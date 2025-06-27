import { ArchiveIcon } from "lucide-react";
import { StreamArchive, StreamSchedule } from "@prisma/client";
import { getStreamArchiveByIdWithSchedule } from "@/lib/db/actions/streamscheduleActions";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { CustomPlayer } from "@/components/audio-player";

export default async function ArchivePlayer({
  params
} : {
    params: Promise<{id:string}>
}) {
  const { id }: { id: string } = await params;

  const streamArchive = await getStreamArchiveByIdWithSchedule(id) as StreamArchive & {streamSchedule: StreamSchedule};

  return (
    <main className="flex flex-col min-h-screen w-full p-6 gap-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <ArchiveIcon className="w-6 h-6" /> Archive
      </h1>
      <Separator />
      {!streamArchive ? (
        <Badge variant={"outline"} className="text-lg font-bold">
          No stream archive found.
        </Badge>
      ): (
        <div className="flex flex-col flex-1 gap-4 w-full">
          <CustomPlayer streamUrl={streamArchive.url.replace(/^public\//, "/")} isStreamLive={true} showControls={true}/>
          <Alert variant="default" className="w-full">
            <AlertTitle>{streamArchive.streamSchedule.title}</AlertTitle>
            <AlertDescription className="text-base">
              <p className="">
                {streamArchive.streamSchedule.description}
              </p>
            </AlertDescription>
          </Alert>
        </div>
      )}
    </main>
  );
}