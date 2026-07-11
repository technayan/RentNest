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

// Get All Categories
const getAllCategoriesFromDB = async () => {
  const categories = await prisma.category.findMany();
  return categories;
};

// Update Category
const updateCategoryIntoDB = async (
  categoryName: string,
  categoryId: string,
) => {
  const category = await prisma.category.update({
    where: { id: categoryId },
    data: { category_name: categoryName.toLowerCase() },
  });

  return category;
};

// Delete Category
const deleteCategoryFromDB = async (categoryId: string) => {
  await prisma.category.delete({
    where: { id: categoryId },
  });
};

export const categoryService = {
  createCategoryIntoDB,
  getAllCategoriesFromDB,
  updateCategoryIntoDB,
  deleteCategoryFromDB,
};
