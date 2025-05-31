import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NextShowSkeleton() {
    
  return (
    <section className="md:col-span-2 mt-4">
      <Card className="shadow-sm border border-muted">
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Next Scheduled Show
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-5 w-1/2" />
        </CardContent>
      </Card>
    </section>
  );
}
