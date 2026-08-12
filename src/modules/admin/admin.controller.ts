import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { adminService } from "./admin.service";

// Get All Users
const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const result = await adminService.getAllUsersFromDB(query);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All users retrived successfully.",
      data: result,
    });
  },
);

// Update User Status
const updateUserStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const status = req.body.status;

    const result = await adminService.updateUserStatusFromDB(
      userId as string,
      status,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "User's status updated successfully.",
      data: result,
    });
  },
);

// Get All Properties
const getAllProperties = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllPropertiesFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All properties retrived successfully.",
      data: result,
    });
  },
);

// Get All Pending Rental Requests
const getPendingRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getPendingRequestsFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Pending requests retrived successfully.",
      data: result,
    });
  },
);

// Get All Rental Requests
const getAllRequests = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllRequestsFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "All rental requests retrived successfully.",
      data: result,
    });
  },
);

// Get Stats
const getStats = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getStatsFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Stats retrived successfully.",
      data: result,
    });
  },
);

export const adminController = {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  getPendingRequests,
  getAllRequests,
  getStats,
};
