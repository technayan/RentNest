/*
  Warnings:

  - The `property_image` column on the `properties` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "property_image",
ADD COLUMN     "property_image" TEXT[];
