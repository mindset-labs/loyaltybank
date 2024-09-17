import { userService } from "@/api/user/userService"
import { env } from "@/common/utils/envConfig"
import { handleErrorResponse, handleSuccessResponse } from "@/common/utils/httpHandlers"
import type { Request, RequestHandler, Response } from "express"
import { StatusCodes } from "http-status-codes"
import jwt from "jsonwebtoken"
import { generateUUID } from '@/common/utils/random'
import { logger } from '@/server'
import { Prisma, Role } from '@prisma/client'

class UserController {
  public queryUsers: RequestHandler = async (req: Request, res: Response) => {
    const paging = req.query.paging as Record<string, string>

    return userService
      .queryAllUsers(
        req.query.where as Prisma.UserWhereInput,
        req.query.include as Prisma.UserInclude,
        {
          skip: parseInt(paging?.skip || '0'),
          take: parseInt(paging?.take || '10'),
        }
      )
      .then(({ users, total }) => handleSuccessResponse({ users, total }, res, StatusCodes.OK))
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
        email: req.body.email || `${emailSplit?.[0]}+${generateUUID()}@${emailSplit?.[1]}`,
        password: req.body.password || generateUUID(),
        managedById: req.userId!,
      })
      .then((user) => jwt.sign({ id: user.id, role: user.role }, env.JWT_AUTH_SECRET, {}))
      .then((token) => handleSuccessResponse({ token }, res, StatusCodes.OK))
      .catch((error) => handleErrorResponse(error, res, StatusCodes.INTERNAL_SERVER_ERROR))
  };

  public updateUser: RequestHandler = async (req: Request, res: Response) => {
    // allow overriding userId for admin users
    const isAdmin = ([Role.SYSTEM_ADMIN, Role.SYSTEM, Role.ADMIN] as Role[]).includes(req.user?.role as Role)
    // otherwise use the userId of the logged in user
    const userId = isAdmin ? req.body.userId : req.userId

    userService
      .updateUser(userId, req.body)
      .then((user) => handleSuccessResponse({ user }, res, StatusCodes.OK))
      .catch((error) => handleErrorResponse(error, res, StatusCodes.INTERNAL_SERVER_ERROR))
  };
}

export const userController = new UserController()
