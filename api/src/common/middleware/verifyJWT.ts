import { env } from "@/common/utils/envConfig"
import { CustomError, CustomErrorCode } from "@/common/utils/errors"
import { handleErrorResponse, handleSuccessResponse } from "@/common/utils/httpHandlers"
import db from "@/db"
import { logger } from '@/server'
import { Role } from '@prisma/client'
import type { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import jwt from "jsonwebtoken"

const rejectJWT = (res: Response, message?: string) => {
  return handleErrorResponse(
    new CustomError(message || "Invalid token", CustomErrorCode.INVALID_TOKEN, {
      message: message || "Invalid or missing auth token",
    }),
    res,
    StatusCodes.UNAUTHORIZED,
  )
}

/**
 * Verifies that the user has a valid JWT and the required role.
 * Attaches the user to the request object.
 */
export const verifyJWTAndRole = (allowedRoles: Role[]) => async (req: Request, res: Response, next: NextFunction) => {
  // If the user ID has already been set (via API Key validation), continue
  // No need to check for an Auth token
  if (req.userId) {
    return next()
  }

  const token = req.headers.authorization

  if (!token) {
    return rejectJWT(res)
  }

  jwt.verify(token.split(" ")[1], env.JWT_AUTH_SECRET, async (err, decoded: any) => {
    if (err || !decoded?.id) {
      return rejectJWT(res)
    }

    req.userId = decoded?.id
    const user = await db.user.findFirst({ where: { id: req.userId } })

    if (!user) {
      return rejectJWT(res)
    } else if (!allowedRoles.includes(user.role)) {
      return rejectJWT(res, "User does not have the required role")
    }

    req.user = user
    next()
  })
}

/**
 * Verifies that the user has a valid JWT.
 * Attaches the user to the request object.
 */
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
