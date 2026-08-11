import { UserStatus } from "../../../generated/prisma/enums";
import { UserWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { IUserQuery } from "./admin.interface";

// Get All Users
const getAllUsersFromDB = async (query: IUserQuery) => {
  const limit = query.limit ? Number(query.limit) : 12;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "created_at";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";

  const andConditions: UserWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          name: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  const users = await prisma.user.findMany({
    where: { AND: andConditions, role: { not: "ADMIN" } },
    take: limit,
    skip: skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
    omit: { password: true },
  });

  const totalUserCount = await prisma.user.count({
    where: {
      AND: andConditions,
      role: { not: "ADMIN" },
    },
  });

  return {
    data: users,
    meta: {
      page: page,
      limit: limit,
      total: totalUserCount,
      pages: Math.ceil(totalUserCount / limit),
    },
  };
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
  const properties = await prisma.property.findMany({
    where: { isDeleted: false },
    include: {
      landLord: {
        omit: {
          id: true,
          password: true,
          status: true,
          role: true,
          created_at: true,
          updated_at: true,
        },
      },
      category: {
        omit: {
          id: true,
          created_at: true,
          updated_at: true,
        },
      },
      _count: {
        select: {
          reviews: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return properties;
};

// Get All Rental Requests
const getPendingRequestsFromDB = async () => {
  const rentalRequests = await prisma.rentalRequest.findMany({
    where: { status: "PENDING" },
    include: {
      property: true,
      tenant: {
        select: {
          name: true,
          email: true,
          phone: true,
          profile_photo: true,
        },
      },
      payment: {
        select: {
          status: true,
        },
      },
      review: {
        select: {
          rating: true,
          comment: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return rentalRequests;
};

// Get Stats
const getStatsFromDB = async () => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const usersCount = await tx.user.count({
      where: { role: { not: "ADMIN" } },
    });

    const propertyCount = await tx.property.count({
      where: { isDeleted: false },
    });

    const rentalCount = await tx.rentalRequest.count({
      where: { is_paid: true },
    });

    const transactionCount = await tx.payment.aggregate({
      _sum: {
        amount: true,
      },
    });

    return { usersCount, propertyCount, rentalCount, transactionCount };
  });

  return transactionResult;
};

export const adminService = {
  getAllUsersFromDB,
  updateUserStatusFromDB,
  getAllPropertiesFromDB,
  getPendingRequestsFromDB,
  getStatsFromDB,
};
