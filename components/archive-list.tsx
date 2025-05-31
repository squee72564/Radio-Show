import { Badge } from "./ui/badge";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

interface ArchiveTestInterface {
  name: string;
  description: string;
  user: string;
  date: Date;
};

export default async function ArchiveList() {
await new Promise((resolve) => setTimeout(resolve, 3000));
  const archives: ArchiveTestInterface[] = [
    {
      name: "Archive 1",
      description: "Test description",
      user: "Test user 1",
      date: new Date()
    },
    {
      name: "Archive 2",
      description: "Test description",
      user: "Test user 2",
      date: new Date()
    },
    {
      name: "Archive 2",
      description: "Test description",
      user: "Test user 2",
      date: new Date()
    },
  ];

  return (
    <div className="flex flex-col w-full gap-5 max-h-vh overflow-auto p-5">
      {archives.length > 0 ? (
        archives.map((archive, idx) => (
          <Card key={idx} className="hover:-translate-y-1 duration-300">
            <CardHeader>
              <CardTitle>{archive.name}</CardTitle>
              <CardDescription>{archive.description}</CardDescription>
              <CardAction>{archive.date.toDateString()}</CardAction>
            </CardHeader>
            <CardFooter>
              <p>{archive.user}</p>
            </CardFooter>
          </Card>
        ))
      ) : (
        <Badge variant="outline" className="text-lg text-muted-foreground">
          No previous archives
        </Badge>
      )}
    </div>
  )
}