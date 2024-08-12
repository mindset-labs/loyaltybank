import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import type { ZodError, ZodSchema } from "zod";

import type { ServiceResponse } from "@/common/models/serviceResponse";
import { CustomError, CustomErrorCode } from "./errors";

export const handleServiceResponse = (serviceResponse: ServiceResponse<any>, response: Response) => {
  return response.status(serviceResponse.statusCode).send(serviceResponse);
};

export const handleSuccessResponse = (data: Record<string, unknown>, response: Response, code = 200) => {
  return response.status(code).json({
    success: true,
    data,
  });
};

export const handleErrorResponse = (error: CustomError, response: Response, code = 500) => {
  return response.status(code).json({
    success: false,
    error: {
      ...error,
      statusCode: error.statusCode || code,
    },
  });
};

export const validateRequest = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({ body: req.body, query: req.query, params: req.params, headers: req.headers });
    next();
  } catch (err) {
    const error = new CustomError("Invalid inputs", CustomErrorCode.INVALID_REQUEST_DATA, err);
    return handleErrorResponse(error, res, StatusCodes.BAD_REQUEST);
  }
};
