import type { Request, RequestHandler, Response } from "express"
import { paymentService } from './paymentService'
import { handleErrorResponse, handleSuccessResponse } from '@/common/utils/httpHandlers'
import { StatusCodes } from 'http-status-codes'

export class PaymentController {
    createPayment: RequestHandler = async (req: Request, res: Response) => {
        paymentService
            .createPayment(req.userId!, req.body)
            .then((transaction) => handleSuccessResponse(transaction, res, StatusCodes.CREATED))
            .catch((error) => handleErrorResponse(error, res))
    };
}

export const paymentController = new PaymentController()
