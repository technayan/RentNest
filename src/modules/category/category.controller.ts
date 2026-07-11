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

export const categoryController = {
  createCategory,
};
