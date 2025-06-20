import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "./ui/skeleton";

export function StreamInstanceInfoCardSkeleton() {
  return (
    <Card className="w-full py-8">
      <CardHeader>
        <CardTitle className="mb-2">
          <Skeleton className="h-6 w-3/4 rounded-md" />
        </CardTitle>
        <CardDescription className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="h-4 w-28 rounded" />
          </div>
        </CardDescription>
        <CardAction>
          <div className="flex flex-col items-center justify-center gap-1">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <Skeleton className="h-4 w-20 rounded" />
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full rounded" />
      </CardContent>
      <CardFooter className="flex space-x-2">
        <Skeleton className="h-4 w-12 rounded" />
        <Skeleton className="h-4 w-10 rounded" />
        <Skeleton className="h-4 w-10 rounded" />
      </CardFooter>
    </Card>
  );
}
