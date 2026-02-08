import { prisma } from '../lib/prisma';

export async function createUser(username: string) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      throw new Error(`User '${username}' already exists`);
    }

    const user = await prisma.user.create({
      data: { username },
    });

    return user;
  } catch (error) {
    throw error;
  }
}

export async function getUserByUsername(username: string) {
  return await prisma.user.findUnique({
    where: { username },
  });
}

export async function getAllUsers() {
  return await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function deleteUser(username: string) {
  return await prisma.user.delete({
    where: { username },
  });
}

export async function userExists(username: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { username },
  });
  return !!user;
}
