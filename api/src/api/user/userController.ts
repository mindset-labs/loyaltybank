import { userService } from "@/api/user/userService"
import { env } from "@/common/utils/envConfig"
import { CustomError, CustomErrorCode } from '@/common/utils/errors'
import { handleErrorResponse, handleSuccessResponse } from "@/common/utils/httpHandlers"
import { UserIncludeSchema } from '@zodSchema/index'
import type { Request, RequestHandler, Response } from "express"
import { StatusCodes } from "http-status-codes"
import jwt from "jsonwebtoken"
import { generateUUID } from '@/common/utils/random'
import { logger } from '@/server'
import { Prisma } from '@prisma/client'

class UserController {
  public getUsers: RequestHandler = async (_req: Request, res: Response) => {
    return userService
      .findAll()
      .then((users) => handleSuccessResponse({ users }, res, StatusCodes.OK))
      .catch((error) => handleErrorResponse(error, res, StatusCodes.INTERNAL_SERVER_ERROR))
  };

  public getUser: RequestHandler = async (req: Request, res: Response) => {
    const user = await userService.findById(req.params.id)
    return handleSuccessResponse({ user }, res, StatusCodes.OK)
  };

  public login: RequestHandler = async (req: Request, res: Response) => {
    userService
      .verifyLogin(req.body)
      .then(({ userId, role }) => jwt.sign({ id: userId, role }, env.JWT_AUTH_SECRET, {}))
      .then((token) => handleSuccessResponse({ token }, res, StatusCodes.OK))
      .catch((error) => handleErrorResponse(error, res, StatusCodes.INTERNAL_SERVER_ERROR))
  };

  public register: RequestHandler = async (req: Request, res: Response) => {
    userService
      .createUser(req.body)
      .then((user) => jwt.sign({ id: user.id, role: user.role }, env.JWT_AUTH_SECRET, {}))
      .then((token) => handleSuccessResponse({ token }, res, StatusCodes.OK))
      .catch((error) => handleErrorResponse(error, res, StatusCodes.INTERNAL_SERVER_ERROR))
  };

  public myInfo: RequestHandler = async (req: Request, res: Response) => {
    logger.debug({ include: req.query.include }, 'Get community by ID with include')

    return userService
      .myInfo(req.userId!, req.query.include as Prisma.UserInclude | undefined)
      .then((user) => handleSuccessResponse({ user }, res, StatusCodes.OK))
      .catch((error) => handleErrorResponse(error, res, StatusCodes.INTERNAL_SERVER_ERROR))
  };

  public createManagedUser: RequestHandler = async (req: Request, res: Response) => {
    const emailSplit = req.user?.email.split("@")

    userService
      .createUser({
        name: req.body.name,
        email: `${emailSplit?.[0]}+${generateUUID()}@${emailSplit?.[1]}`,
        password: generateUUID(),
        managedById: req.userId!,
      })
      .then((user) => jwt.sign({ id: user.id, role: user.role }, env.JWT_AUTH_SECRET, {}))
      .then((token) => handleSuccessResponse({ token }, res, StatusCodes.OK))
      .catch((error) => handleErrorResponse(error, res, StatusCodes.INTERNAL_SERVER_ERROR))
  };
}

export const userController = new UserController()
