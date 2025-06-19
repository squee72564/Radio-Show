import { Skeleton } from "@/components/ui/skeleton";

export default async function RecentArchivesSkeleton() {
  return (
    <section>
      <h2 className="text-lg font-medium mb-4">Recent Archives</h2>
      <ul className="list-disc pl-5 space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i}>
            <Skeleton className="h-4 w-2/3" />
          </li>
        ))}
      </ul>
    </section>
  );
}