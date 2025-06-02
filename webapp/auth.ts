import { type Adapter } from "@auth/core/adapters"
import NextAuth from "next-auth"
import Google from "next-auth/providers/google";

import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db/prismaClient";

const adapter = PrismaAdapter(prisma) as Adapter;

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  adapter: adapter,
  providers: [Google],
})