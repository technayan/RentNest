import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { Role, UserStatus } from "../../generated/prisma/enums";
import config from "../config";
import { prisma } from "../lib/prisma";
import { catchAsync } from "../utils/catchAsync";
import { jwtUtils } from "../utils/jwtUtils";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        role: Role;
        status: UserStatus;
      };
    }
  }
}

export const auth = (...requiredRoles: Role[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.accessToken
      ? req.cookies.accessToken
      : req.headers.authorization?.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : req.headers.authorization;

    const verifiedToken = jwtUtils.verifyToken(
      token,
      config.jwt_access_token_secret,
    );

    if (!verifiedToken.success) {
      throw new Error(verifiedToken.error);
    }

    const { id, name, email, role, status } = verifiedToken.data as JwtPayload;

    if (requiredRoles.length && !requiredRoles.includes(role)) {
      throw new Error(
        "Forbidden, You don't have permission to access this resource.",
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id,
        name,
        email,
        role,
        status,
      },
      omit: { password: true },
    });

    if (!user) {
      throw new Error("User not found! Please, login again.");
    }

    if (user.status === "BAN") {
      throw new Error("You account has been banned! Please, contact support.");
    }

    req.user = {
      id,
      name,
      email,
      role,
      status,
    };

    next();
  });
};
