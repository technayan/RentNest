import { prisma } from "../../lib/prisma";
import { isCategoryExist } from "../../utils/isCategoryExist";
import {
  ICreatePropertyPayload,
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
const getPropertiesFromDB = async () => {
  const properties = await prisma.property.findMany({
    where: { isDeleted: false },
  });

  return properties;
};

// Get Property By ID
const getPropertyByIdfromDB = async (propertyId: string) => {
  const property = await prisma.property.findUniqueOrThrow({
    where: { id: propertyId },
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
