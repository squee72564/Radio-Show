import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const email = "rodriguez.al183@gmail.com";

const user = await prisma.user.findUnique({
  where: { email },
});

if (!user) {
  throw new Error("User not found");
}

await prisma.user.update({
  where: { id: user.id },
  data: { status: "OWNER" },
});

console.log(`✅ Made ${email} an OWNER`);

await prisma.$disconnect();
