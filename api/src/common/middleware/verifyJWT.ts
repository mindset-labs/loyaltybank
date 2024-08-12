import { env } from "@/common/utils/envConfig";
import { CustomError, CustomErrorCode } from "@/common/utils/errors";
import { handleErrorResponse, handleSuccessResponse } from "@/common/utils/httpHandlers";
import db from "@/db";
import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

const rejectJWT = (res: Response) => {
  return handleErrorResponse(
    new CustomError("Invalid token", CustomErrorCode.INVALID_TOKEN, {
      message: "Invalid or missing auth token",
    }),
    res,
    StatusCodes.UNAUTHORIZED,
  );
};

export default async (req: Request, res: Response, next: NextFunction) => {
  // Check if the request has a valid token
  const token = req.headers.authorization;
  if (!token) {
    return rejectJWT(res);
  }

  // Verify the token
  jwt.verify(token.split(" ")[1], env.JWT_AUTH_SECRET, async (err, decoded: any) => {
    if (err || !decoded?.id) {
      return rejectJWT(res);
    }

    // Set the user ID in the request
    req.userId = decoded?.id;

    const user = await db.user.findFirst({ where: { id: req.userId } });

    if (!user) {
      return rejectJWT(res);
    }

    req.user = user;

    next();
  });
};
