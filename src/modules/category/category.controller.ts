import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { categoryService } from "./category.service";

// Create Category
const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryName = req.body.category_name;

    const result = await categoryService.createCategoryIntoDB(categoryName);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Category created successfully.",
      data: result,
    });
  },
);

// Get All Categories
const getAllCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await categoryService.getAllCategoriesFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All categories retrived successfully.",
      data: result,
    });
  },
);

// Update Category
const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryName = req.body.category_name;
    const categoryId = req.params.categoryId;

    const result = await categoryService.updateCategoryIntoDB(
      categoryName,
      categoryId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Category updated successfully.",
      data: result,
    });
  },
);

// Delete Category
const deleteCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const categoryId = req.params.categoryId;
    await categoryService.deleteCategoryFromDB(categoryId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Category deleted successfully.",
      data: null,
    });
  },
);

export const categoryController = {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
