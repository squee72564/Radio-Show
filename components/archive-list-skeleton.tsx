import { Skeleton } from "./ui/skeleton";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "./ui/card";

export default function ArchiveListSkeleton() {
  return (
    <div className="flex flex-col w-full gap-5 max-h-vh overflow-auto p-5">
      {Array.from({ length: 3 }).map((_, idx) => (
        <Card key={idx}>
          <CardHeader>
            <CardTitle>
              <Skeleton className="h-5 w-1/3" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-2/3 mt-2" />
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Skeleton className="h-4 w-1/4" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
