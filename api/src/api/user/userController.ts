import { userService } from "@/api/user/userService";
import { env } from "@/common/utils/envConfig";
import { handleErrorResponse, handleSuccessResponse } from "@/common/utils/httpHandlers";
import type { Request, RequestHandler, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

class UserController {
  public getUsers: RequestHandler = async (_req: Request, res: Response) => {
    return userService
      .findAll()
      .then((users) => handleSuccessResponse({ users }, res, StatusCodes.OK))
      .catch((error) => handleErrorResponse(error, res, StatusCodes.INTERNAL_SERVER_ERROR));
  };

  public getUser: RequestHandler = async (req: Request, res: Response) => {
    const user = await userService.findById(req.params.id);
    return handleSuccessResponse({ user }, res, StatusCodes.OK);
  };

  public login: RequestHandler = async (req: Request, res: Response) => {
    userService
      .verifyLogin(req.body)
      .then((userId) => jwt.sign({ id: userId }, env.JWT_AUTH_SECRET, {}))
      .then((token) => handleSuccessResponse({ token }, res, StatusCodes.OK))
      .catch((error) => handleErrorResponse(error, res, StatusCodes.INTERNAL_SERVER_ERROR));
  };

  public register: RequestHandler = async (req: Request, res: Response) => {
    userService
      .createUser(req.body)
      .then((user) => jwt.sign({ id: user.id }, env.JWT_AUTH_SECRET, {}))
      .then((token) => handleSuccessResponse({ token }, res, StatusCodes.OK))
      .catch((error) => handleErrorResponse(error, res, StatusCodes.INTERNAL_SERVER_ERROR));
  };

  public myInfo: RequestHandler = async (req: Request, res: Response) => {
    handleSuccessResponse({ user: req.user }, res, StatusCodes.OK);
  };
}

export const userController = new UserController();
