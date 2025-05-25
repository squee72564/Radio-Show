import prisma from "@/lib/db/prismaClient";

export async function deleteAllUsers() {
  return prisma.user.deleteMany();
}

export async function findUserById(id: number) {
  return prisma.user.findUnique({ where: { id } });
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findAllUsers() {
  return prisma.user.findMany();
}

export async function createUser(data: { email: string; name?: string }) {
  return prisma.user.create({ data });
}

function generateRandomString(length: number): string {
  let result: string = '';
  const characters: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength: number = characters.length;
  for ( let i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function createdUserIncrement() {
  const randName = generateRandomString(12);
  const randEmail = generateRandomString(8) + "@" + generateRandomString(3) + ".com";
  const data: { email: string; name: string } = { email: randEmail, name: randName,};
  return prisma.user.create({ data });
}