import { PropertyWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { isCategoryExist } from "../../utils/isCategoryExist";
import {
  ICreatePropertyPayload,
  IPropertyQuery,
  IUpdatePropertyPayload,
} from "./property.interface";

// Create Property
const createPropertyIntoDB = async (
  payload: ICreatePropertyPayload,
  userId: string,
) => {
  const { title, category, property_image, description, price, location } =
    payload;

  let category_id;

  if (category) {
    category_id = await isCategoryExist(category);
  }

  const newProperty = await prisma.property.create({
    data: {
      title,
      landlord_id: userId,
      category_id,
      property_image,
      description,
      price,
      location,
    },
  });

  return newProperty;
};

// Get All Property
const getPropertiesFromDB = async (query: IPropertyQuery) => {
  // const properties = await prisma.property.findMany({
  //   where: { isDeleted: false },
  // });

  // return properties;
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy ? query.sortBy : "created_at";
  const sortOrder = query.sortOrder ? query.sortOrder : "desc";

  const andConditions: PropertyWhereInput[] = [];

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
    },
  });

  return property;
};

// Update Property
const updatePropertyIntoDB = async (
  payload: IUpdatePropertyPayload,
  propertyId: string,
  userId: string,
) => {
  const property = await prisma.property.findUniqueOrThrow({
    where: { id: propertyId },
  });

  if (property.landlord_id !== userId) {
    throw new Error("You don't have permission to edit this property!");
  }

  const {
    title,
    category,
    property_image,
    description,
    price,
    location,
    availability_status,
  } = payload;

  let category_id;

  if (category) {
    category_id = await isCategoryExist(category);
  }

  const updatedProperty = await prisma.property.update({
    where: { id: propertyId },
    data: {
      title,
      category_id,
      property_image,
      description,
      price,
      location,
      availability_status,
    },
  });

  return updatedProperty;
};

// Delete Property
const deletePropertyFromDB = async (propertyId: string, userId: string) => {
  const property = await prisma.property.findUniqueOrThrow({
    where: { id: propertyId },
  });

  if (property.landlord_id !== userId) {
    throw new Error("You dont't have permission to delete this property!");
  }

  await prisma.property.update({
    where: { id: propertyId },
    data: {
      isDeleted: true,
    },
  });
};

export const propertyService = {
  createPropertyIntoDB,
  getPropertiesFromDB,
  getPropertyByIdfromDB,
  updatePropertyIntoDB,
  deletePropertyFromDB,
};
