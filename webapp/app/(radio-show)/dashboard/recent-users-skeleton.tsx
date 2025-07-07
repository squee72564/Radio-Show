import { Skeleton } from "@/components/ui/skeleton";

export default async function RecentUsersSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-lg font-medium">Recent Users</h2>
      <div className="flex flex-col gap-2 min-h-41 max-h-41 overflow-auto">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-2 rounded-md bg-muted/30 animate-pulse"
          >
            <Skeleton className="h-9 w-9 rounded-full" />
            <Skeleton className="h-4 w-1/3 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}