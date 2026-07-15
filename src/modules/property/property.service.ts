import { PropertyWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { IPropertyQuery } from "./property.interface";

// Get All Property
const getPropertiesFromDB = async (query: IPropertyQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "created_at";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";

  const andConditions: PropertyWhereInput[] = [];

  andConditions.push({
    AND: [
      {
        isDeleted: false,
      },
      {
        availability_status: "AVAILABLE",
      },
    ],
  });

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          title: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (query.location) {
    andConditions.push({
      location: {
        contains: query.location as string,
        mode: "insensitive",
      },
    });
  }

  if (query.price) {
    andConditions.push({
      price: {
        lte: Number(query.price),
      },
    });
  }

  if (query.category) {
    andConditions.push({
      category: {
        category_name: query.category as string,
      },
    });
  }

  const properties = await prisma.property.findMany({
    where: {
      AND: andConditions,
    },
    take: limit,
    skip: skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
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
  });

  const totalPropertyCount = await prisma.property.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    data: properties,
    meta: {
      page: page,
      limit: limit,
      total: totalPropertyCount,
      pages: Math.ceil(totalPropertyCount / limit),
    },
  };
};

// Get Property By ID
const getPropertyByIdfromDB = async (propertyId: string) => {
  const property = await prisma.property.findUniqueOrThrow({
    where: { id: propertyId },
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
      reviews: {
        select: {
          tenant_id: true,
          tenant: {
            select: {
              name: true,
            },
          },
          rating: true,
          comment: true,
        },
      },
    },
  });

  return property;
};

export const propertyService = {
  getPropertiesFromDB,
  getPropertyByIdfromDB,
};
