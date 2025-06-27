import { Separator } from "@/components/ui/separator";
import { ArchiveIcon } from "lucide-react";
import { CustomPlayer } from "@/components/audio-player";
import { getStreamArchiveById } from "@/lib/db/actions/streamscheduleActions";
import { Badge } from "@/components/ui/badge";

export default async function ArchivePlayer({
  params
} : {
    params: Promise<{id:string}>
}) {
  const { id }: { id: string } = await params;

  const streamArchive = await getStreamArchiveById(id);

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
        <CustomPlayer streamUrl={streamArchive.url} isStreamLive={true} showControls={false}/>
      )}
    </main>
  );
}