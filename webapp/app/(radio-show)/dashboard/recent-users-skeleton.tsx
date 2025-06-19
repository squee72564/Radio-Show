import { Skeleton } from "@/components/ui/skeleton";

export default function RecentUsersSkeleton() {
  return (
    <section>
      <h2 className="text-lg font-medium mb-4">Recent Users</h2>
      <div className="space-y-3">
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
    </section>
  );
}