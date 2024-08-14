import { userService } from "@/api/user/userService"
import { env } from "@/common/utils/envConfig"
import { CustomError, CustomErrorCode } from '@/common/utils/errors'
import { handleErrorResponse, handleSuccessResponse } from "@/common/utils/httpHandlers"
import { UserIncludeSchema } from '@zodSchema/index'
import type { Request, RequestHandler, Response } from "express"
import { StatusCodes } from "http-status-codes"
import jwt from "jsonwebtoken"

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
    if (req.query.include) {
      let include: Record<string, unknown> = {}
      try {
        const parsed = JSON.parse(req.query.include as string)
        UserIncludeSchema.parse(parsed)
        include = parsed
      } catch (err) {
        const error = new CustomError("Invalid inputs", CustomErrorCode.INVALID_REQUEST_DATA, err)
        return handleErrorResponse(error, res, StatusCodes.BAD_REQUEST)
      }

      return userService
        .myInfo(req.userId!, include)
        .then((user) => handleSuccessResponse({ user }, res, StatusCodes.OK))
        .catch((error) => handleErrorResponse(error, res, StatusCodes.INTERNAL_SERVER_ERROR))
    }

    handleSuccessResponse({ user: req.user }, res, StatusCodes.OK)
  };
}

export const userController = new UserController()
