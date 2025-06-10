import { getUserCount } from "@/lib/db/actions/userActions";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default async function UserCountCard() {
  const totalUsers = await getUserCount();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Registered Users</CardTitle>
      </CardHeader>
      <CardContent>
        <p><strong>{totalUsers}</strong> total users on the platform.</p>
      </CardContent>
    </Card>
  );
}