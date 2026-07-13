import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { paymentService } from "./payment.service";

const createPaymentSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const requestId = req.params.requestId;
    const tenantId = req.user?.id;

    const result = await paymentService.createPaymentSessionIntoStripe(
      requestId as string,
      tenantId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Payment session created.",
      data: { payemnt_url: result },
    });
  },
);

const handleWebhook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;
    const signature = req.headers["stripe-signature"];

    await paymentService.handleWebhook(payload, signature as string);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Payment completed successfully.",
      data: null,
    });
  },
);

export const paymentController = { createPaymentSession, handleWebhook };
