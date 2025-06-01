import Link from "next/link";
import { Badge } from "./ui/badge";

export default async function RecentArchives() {
  const archives: Array<any> = [];

  return (
    <section className="min-h-41 max-h-41">
      <h2 className="text-lg font-medium mb-4">Recent Archives</h2>
      {archives.length > 0 ? (
        <ul className="list-disc pl-5 space-y-1 overflow-auto">
          {archives.map((archive, idx) => (
            <li key={idx}>
              <Link href="/" className="hover:underline text-primary">
                {archive}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <Badge variant="outline" className="text-muted-foreground">
          No previous archives
        </Badge>
      )}
    </section>  
  );
}