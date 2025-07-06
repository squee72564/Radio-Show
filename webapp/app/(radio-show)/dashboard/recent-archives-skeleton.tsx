import { Skeleton } from "@/components/ui/skeleton";

export default async function RecentArchivesSkeleton() {
  return (
    <section className="w-full ">
      <h2 className="text-lg font-medium mb-4">Recent Archives</h2>
      <div className="flex flex-col gap-3 overflow-auto min-h-41 max-h-41">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="p-6 w-full" />
        ))}
      </div>
    </section>
  );
}