import { UserStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

// Get All Users
const getAllUsersFromDB = async () => {
  const users = await prisma.user.findMany({
    omit: { password: true },
  });

  return users;
};

// Update User Status
const updateUserStatusFromDB = async (userId: string, status: UserStatus) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      status: status,
    },
    omit: { password: true },
  });

  return user;
};

// Get All Properties
const getAllPropertiesFromDB = async () => {
  const properties = await prisma.property.findMany();

  return properties;
};

// Get All Rental Requests
const getAllRentalFromDB = async () => {
  const rentalRequests = await prisma.rentalRequest.findMany();

  return rentalRequests;
};

export const adminService = {
  getAllUsersFromDB,
  updateUserStatusFromDB,
  getAllPropertiesFromDB,
  getAllRentalFromDB,
};
