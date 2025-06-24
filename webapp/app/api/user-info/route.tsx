import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { findUserById } from "@/lib/db/actions/userActions";
import { User, Account, Session, Authenticator } from "@prisma/client";

export async function GET() {
  const session = await auth();
  const user = session?.user as User | undefined;

  if (!user || !user.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userInfo = await findUserById(user.id, {
    include: {
      accounts: true,
      sessions: true,
      Authenticator: true,
    },
  }) as (User & {accounts: Account[], sessions: Session[], Authenticator: Authenticator[]}) | null;

  if (!userInfo) {
    return new NextResponse("User not found", { status: 404 });
  }

  const safeUserData = {
    id: userInfo.id,
    name: userInfo.name,
    email: userInfo.email,
    emailVerified: userInfo.emailVerified,
    bio: userInfo.bio,
    status: userInfo.status,
    createdAt: userInfo.createdAt,
    updatedAt: userInfo.updatedAt,
    accounts: userInfo.accounts?.map(a => ({
      provider: a.provider,
      providerAccountId: a.providerAccountId,
      type: a.type,
    })),
    sessions: userInfo.sessions?.map(s => ({
      expires: s.expires,
      createdAt: s.createdAt,
    })),
    authenticators: userInfo.Authenticator?.map(a => ({
      deviceType: a.credentialDeviceType,
      backedUp: a.credentialBackedUp,
      transports: a.transports,
    })),
  };

  return new NextResponse(JSON.stringify(safeUserData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": "attachment; filename=\"user-data.json\"",
    },
  });
}
