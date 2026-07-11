import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { propertyService } from "./property.service";

// Create Property
const createProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const userId = req.user?.id;

    const result = await propertyService.createPropertyIntoDB(
      payload,
      userId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Property created successfully.",
      data: result,
    });
  },
);

// Get All Property
const getAllProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await propertyService.getPropertiesFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All properties retrived successfully.",
      data: result,
    });
  },
);

// Get Property By ID
const getPropertyById = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.propertyId;

    const result = await propertyService.getPropertyByIdfromDB(
      propertyId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property retrived successfully.",
      data: result,
    });
  },
);

// Update Property
const updateProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const propertyId = req.params.propertyId;
    const userId = req.user?.id;

    const result = await propertyService.updatePropertyIntoDB(
      payload,
      propertyId as string,
      userId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property updated successfully.",
      data: result,
    });
  },
);

// Delete Property
const deleteProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const propertyId = req.params.propertyId;
    const userId = req.user?.id;

    await propertyService.deletePropertyFromDB(
      propertyId as string,
      userId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Property deleted successfully.",
      data: null,
    });
  },
);

export const propertyController = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};
