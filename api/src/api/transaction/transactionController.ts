import type { Request, RequestHandler, Response } from "express"
import { StatusCodes } from 'http-status-codes'
import { transactionService } from './transactionService'
import { QueryPaging } from '@/common/utils/commonTypes'
import { Prisma } from '@prisma/client'
import { handleErrorResponse, handleSuccessResponse } from '@/common/utils/httpHandlers'

export class TransactionController {
    queryTransactions: RequestHandler = async (req: Request, res: Response) => {
        return transactionService
            .queryTransactions(
                req.userId!,
                (req.query.where || {}) as Prisma.TransactionWhereInput,
                req.query.include as Prisma.TransactionInclude,
                req.query.paging as QueryPaging
            )
            .then(({ transactions, total }) => handleSuccessResponse({ transactions, total }, res, StatusCodes.OK))
            .catch((error) => handleErrorResponse(error, res, StatusCodes.INTERNAL_SERVER_ERROR))
    };

    createTransaction: RequestHandler = async (req: Request, res: Response) => {
        throw new Error('Not implemented')
    };
}

export const transactionController = new TransactionController()
