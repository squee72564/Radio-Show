import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "./ui/skeleton";

export default function UserStreamsSkeleton({title}: {title:string}) {

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-6"/>
      </CardContent>
    </Card>
  )
}