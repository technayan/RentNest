import { prisma } from "../../lib/prisma";

// Get All Users
const getAllUsersFromDB = async () => {
  const users = await prisma.user.findMany({
    omit: { password: true },
  });

  return users;
};

export const adminService = { getAllUsersFromDB };
