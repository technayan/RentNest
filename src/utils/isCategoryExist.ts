import { prisma } from "../lib/prisma";

export const isCategoryExist = async (category: string) => {
  const lowerCasedCategory = category.toLowerCase();
  const categoryData = await prisma.category.upsert({
    where: { category_name: lowerCasedCategory },
    update: {},
    create: {
      category_name: lowerCasedCategory,
    },
  });

  return categoryData.id;
};
