import { prisma } from "@/lib/db/prismaClient";
import * as userService from "@/lib/db/services/userService";
import { $Enums } from "@prisma/client";

describe("User Service Integration", () => {
  beforeEach(async () => {
    await userService.deleteAllUsers();
  });

  it("should return 0 users after deletion", async () => {
    const count = await userService.getUserCount();
    expect(count).toBe(0);
  });

  it("should count users in the database", async () => {
    await prisma.user.create({ data: { id: "abc", email: "test@test.com", name: "Test" } });
    const count = await userService.getUserCount();
    expect(count).toBe(1);
  });

  it("should unsuccessfully find a user by Id and return null", async() =>{
    const user = await userService.findUserById("abc");
    expect(user).toBeNull();
  })

  it("should successfully find a user by Id", async() =>{
    await prisma.user.create({ data: { id: "abc", email: "test@test.com", name: "Test" } });
    const user = await userService.findUserById("abc");
    expect(user).toEqual(
      expect.objectContaining({
        id: "abc",
        email: "test@test.com",
        name: "Test",
      })
    );
  })

  it("should unsuccessfully find a user by email and return null", async() =>{
    const user = await userService.findUserByEmail("test@test.com");
    expect(user).toBeNull();
  })

  it("should successfully find a user by email", async() =>{
    await prisma.user.create({ data: { id: "abc", email: "test@test.com", name: "Test" } });
    const user = await userService.findUserByEmail("test@test.com");
    expect(user).toEqual(
      expect.objectContaining({
        id: "abc",
        email: "test@test.com",
        name: "Test",
      })
    );
  })

  it("should unsuccessfully find a user by their role and return an empty array", async() =>{
    const users = await userService.findUsersByRole([$Enums.Role.ADMIN]);
    expect(users).toStrictEqual([]);
  })

  it("should successfully find a user by their role", async() =>{
    await prisma.user.create({ data: { id: "abc", email: "test@test.com", name: "Test", status: $Enums.Role.ADMIN } });
    const admins = await userService.findUsersByRole([$Enums.Role.ADMIN]);

    expect(admins.length).toBe(1)
    admins.forEach((admin) => expect(admin).toEqual(
      expect.objectContaining({
        status: $Enums.Role.ADMIN
      })
    ))
  })

  it("should return the most recent users", async() => {
  for (const i of Array.from({ length: 10 }, (_, i) => i)) {
    await prisma.user.create({
      data: {
        id: `abcd${i}`,
        email: `test${i}@test.com`,
        name: `Test-${i}`,
        status: $Enums.Role.ADMIN,
      },
    });
    await new Promise((r) => setTimeout(r, 10));
  }
  const take = 5;
  const recentUsers = await userService.findRecentUsers(take);

  expect(recentUsers.length).toBe(take);

  for (let i = 0; i < recentUsers.length - 1; i++) {
    const curr = recentUsers[i].createdAt;
    const next = recentUsers[i + 1].createdAt;
    expect(curr.getTime()).toBeGreaterThanOrEqual(next.getTime());
  }

  const lastCreated = await prisma.user.findFirst({
    orderBy: { createdAt: "desc" },
  });
  expect(recentUsers[0].id).toBe(lastCreated?.id);
  })

  it("should update a users bio", async() => {
    await prisma.user.create({
      data: {
        id: `abcd`,
        email: `test@test.com`,
        name: `Test`,
        bio: "This is a test bio",
        status: $Enums.Role.ADMIN,
      },
    });

    const updatedBio = "This is the new bio";

    const updatedUser = await userService.updateUserBio("abcd", updatedBio);
    expect(updatedUser).not.toBeNull()
    expect(updatedUser?.bio).not.toBeNull()
    expect(updatedUser?.bio).toEqual(updatedBio);
    
  })

  it("should attempt to update a bio on a non-existent user and return null", async() => {
    const updatedUser = await userService.updateUserBio("abcd", "This will not work");
    expect(updatedUser).toBeNull()    
  })

  it("should update a users status", async() => {
    await prisma.user.create({
      data: {
        id: `abcd`,
        email: `test@test.com`,
        name: `Test`,
        bio: "This is a test bio",
        status: $Enums.Role.USER,
      },
    });

    const updatedStatus = $Enums.Role.ADMIN;

    const updatedUser = await userService.changeUserRole("abcd", updatedStatus);
    expect(updatedUser).not.toBeNull()
    expect(updatedUser?.status).not.toBeNull()
    expect(updatedUser?.status).toEqual(updatedStatus);
  })

  it("should attempt to update a status on a non-existent user and return null", async() => {
    const updatedUser = await userService.changeUserRole("abcd", $Enums.Role.ADMIN);
    expect(updatedUser).toBeNull()    
  })

});
