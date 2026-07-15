import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { landlordService } from "./landlord.service";

// Create Property
const createProperty = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const userId = req.user?.id;

    const result = await landlordService.createPropertyIntoDB(
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

// Get My Properties
const getMyProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const result = await landlordService.getMyProperties(userId as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Properties retrived successfully.",
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

    const result = await landlordService.updatePropertyIntoDB(
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

    await landlordService.deletePropertyFromDB(
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

// Get Requests for LandLord
const getRequestsForLandLord = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landLordId = req.user?.id;

    const result = await landlordService.getRequestsForLandLordFromDB(
      landLordId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental Requests retrived successfully.",
      data: result,
    });
  },
);

// Change Request Status
const changeRequestStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const requestId = req.params.requestId;
    const landLordId = req.user?.id;
    const { status } = req.body;

    const result = await landlordService.changeRequestStatusIntoDB(
      requestId as string,
      landLordId as string,
      status,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental Requests updated successfully.",
      data: result,
    });
  },
);

// Get Rental History
const getRentalHistory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id;

    const result = await landlordService.getRentalHistoryFromDB(
      landlordId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Rental History retrived successfully.",
      data: result,
    });
  },
);

// Get All Reviews
const getAllReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id;

    const result = await landlordService.getAllReviewsFromDB(
      landlordId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Reviews retrived successfully.",
      data: result,
    });
  },
);

export const landlordController = {
  createProperty,
  getMyProperties,
  updateProperty,
  deleteProperty,
  getRequestsForLandLord,
  changeRequestStatus,
  getRentalHistory,
  getAllReviews,
};
