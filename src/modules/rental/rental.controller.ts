import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { rentalService } from "./rental.service";

// Create Request
const createRentalRequest = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { message } = req.body;
    const tenantId = req.user?.id;
    const propertyId = req.params.propertyId;

    const result = await rentalService.createRentalRequestIntoDB(
      tenantId as string,
      propertyId as string,
      message,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Rental Request has created successfully.",
      data: result,
    });
  },
);

export const rentalController = {
  createRentalRequest,
};
