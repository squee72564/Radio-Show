"use server";

import { auth } from "@/auth";
import { findAllUsers } from "@/lib/db/services/userService";

import { deleteUsers } from "@/lib/db/actions/userActions";

export default async function Dashboard() {
  const users = await findAllUsers();

  const session = await auth();
  const user = session?.user;
  const signedIn = !!user;

  console.log(user);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {users && users.map((user, idx) => (
        <div key={idx}>
          {user.name} - {user.email} - {user.name} - {user.id}
        </div>
      ))}
    </div>
  );
}
