import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { reviewService } from "./review.service";

// Create Review
const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const requestId = req.params.requestId;
    const tenantId = req.user?.id;
    const payload = req.body;

    const result = await reviewService.createReviewIntoDB(
      requestId as string,
      tenantId as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Review created successfully.",
      data: result,
    });
  },
);

export const reviewController = { createReview };
