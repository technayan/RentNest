import { prisma } from "../../lib/prisma";

// Create Category
const createCategoryIntoDB = async (categoryName: string) => {
  const isCategoryExist = await prisma.category.findUnique({
    where: { category_name: categoryName.toLowerCase() },
  });

  if (isCategoryExist) {
    throw new Error("This category is already exist.");
  }

  const category = await prisma.category.create({
    data: { category_name: categoryName.toLowerCase() },
  });

  return category;
};

export const categoryService = {
  createCategoryIntoDB,
};
