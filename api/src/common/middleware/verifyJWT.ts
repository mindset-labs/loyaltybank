import { env } from "@/common/utils/envConfig"
import { CustomError, CustomErrorCode } from "@/common/utils/errors"
import { handleErrorResponse, handleSuccessResponse } from "@/common/utils/httpHandlers"
import db from "@/db"
import type { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import jwt from "jsonwebtoken"

const rejectJWT = (res: Response) => {
  return handleErrorResponse(
    new CustomError("Invalid token", CustomErrorCode.INVALID_TOKEN, {
      message: "Invalid or missing auth token",
    }),
    res,
    StatusCodes.UNAUTHORIZED,
  )
}

export const verifyJWTAndRole = (role: string) => async (req: Request, res: Response, next: NextFunction) => {
  // TODO: implement role-based access control
}

export default async (req: Request, res: Response, next: NextFunction) => {
  // If the user ID has already been set (via API Key validation), continue
  // No need to check for an Auth token
  if (req.userId) {
    return next()
  }

  const token = req.headers.authorization

  // If no token is provided and no user ID is set (via API Key validation), reject the request
  if (!token) {
    return rejectJWT(res)
  }

  // Verify the token
  jwt.verify(token.split(" ")[1], env.JWT_AUTH_SECRET, async (err, decoded: any) => {
    if (err || !decoded?.id) {
      return rejectJWT(res)
    }

    // Set the user ID in the request
    req.userId = decoded?.id

    const user = await db.user.findFirst({ where: { id: req.userId } })

    if (!user) {
      return rejectJWT(res)
    }

    req.user = user

    next()
  })
}
