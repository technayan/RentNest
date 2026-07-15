import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(httpStatus.NOT_FOUND).json({
    message: "Route not found!",
    path: req.originalUrl,
  });
};
