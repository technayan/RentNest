import { prisma } from "../../lib/prisma";
import { isCategoryExist } from "../../utils/isCategoryExist";
import {
  ICreatePropertyPayload,
  IUpdatePropertyPayload,
} from "./property.interface";

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

const getPropertiesFromDB = async () => {
  const properties = await prisma.property.findMany({
    where: { isDeleted: false },
  });

  return properties;
};

const getPropertyByIdfromDB = async (propertyId: string) => {
  const property = await prisma.property.findUniqueOrThrow({
    where: { id: propertyId },
  });

  return property;
};

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

  const { title, category, property_image, description, price, location } =
    payload;

  let category_id;

  if (category) {
    category_id = await isCategoryExist(category);
  }

  const updatedProperty = await prisma.property.update({
    where: { id: propertyId },
    data: { title, category_id, property_image, description, price, location },
  });

  return updatedProperty;
};

export const propertyService = {
  createPropertyIntoDB,
  getPropertiesFromDB,
  getPropertyByIdfromDB,
  updatePropertyIntoDB,
};
