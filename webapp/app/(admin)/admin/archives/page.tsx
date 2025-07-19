import { Archive } from "lucide-react";
import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import AdminArchiveList from "./admin-archive-list";

export default async function AdminSchedulePage() {
  return (
    <div className="flex flex-col gap-6 p-6 min-w-0 w-full">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Archive className="w-6 h-6" /> Admin: Archive Management
      </h1>
      <Separator />
      
      <Suspense fallback={<Badge variant={"outline"}>Loading...</Badge>}>
        <AdminArchiveList/>
      </Suspense>
    </div>
  );
}
