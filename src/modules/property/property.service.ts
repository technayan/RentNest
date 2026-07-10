import { prisma } from "../../lib/prisma";
import { ICreatePropertyPayload } from "./property.interface";

const createPropertyIntoDB = async (
  payload: ICreatePropertyPayload,
  userId: string,
) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const { title, category, property_image, description, price, location } =
      payload;

    let lowerCasedCategory = null;
    let existCategory = null;
    let categoryId = null;

    if (category) {
      lowerCasedCategory = category.toLowerCase();

      existCategory = await tx.category.findUnique({
        where: {
          category_name: lowerCasedCategory,
        },
      });

      if (existCategory) {
        categoryId = existCategory.id;
      }
    }

    if (lowerCasedCategory && !existCategory) {
      const newCategory = await tx.category.create({
        data: {
          category_name: lowerCasedCategory,
        },
      });

      categoryId = newCategory.id;
    }

    const newProperty = await tx.property.create({
      data: {
        title,
        landlord_id: userId,
        category_id: categoryId,
        property_image,
        description,
        price,
        location,
      },
    });

    return newProperty;
  });
  return transactionResult;
};

const getPropertiesFromDB = async () => {
  const properties = await prisma.property.findMany({
    where: { isDeleted: false },
    omit: { isDeleted: true },
  });

  return properties;
};

export const propertyService = {
  createPropertyIntoDB,
  getPropertiesFromDB,
};
