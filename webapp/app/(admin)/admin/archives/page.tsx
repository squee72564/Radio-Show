import { Archive } from "lucide-react";
import { isUserAdmin } from "@/lib/utils";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { User } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import AdminArchiveList from "./admin-archive-list";
import { Suspense } from "react";
import { Badge } from "@/components/ui/badge";

export default async function AdminSchedulePage() {
  const session = await auth();
  const user = session?.user as User | undefined;

  if (!user || !isUserAdmin(user.status)) {
    redirect("/dashboard");
  }

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
