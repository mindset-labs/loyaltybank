import type { Request, RequestHandler, Response } from "express"
import { StatusCodes } from 'http-status-codes'
import { transactionService } from './transactionService'
import { QueryPaging } from '@/common/utils/commonTypes'
import { Prisma, Role } from '@prisma/client'
import { handleErrorResponse, handleSuccessResponse } from '@/common/utils/httpHandlers'

export class TransactionController {
    queryTransactions: RequestHandler = async (req: Request, res: Response) => {
        let whereExt: Prisma.TransactionWhereInput = {}

        // If the user is not an admin, only allow to query transactions for the user's own records
        if (req.user?.role !== Role.ADMIN) {
            whereExt = {
                OR: [
                    { senderId: req.userId },
                    { receiverId: req.userId }
                ]
            }
        }

        const paging = req.query.paging as Record<string, string>
        return transactionService
            .queryTransactions(
                {
                    ...(req.query.where as Prisma.TransactionWhereInput || {}),
                    ...whereExt
                } as Prisma.TransactionWhereInput,
                req.query.include as Prisma.TransactionInclude,
                {
                    skip: parseInt(paging?.skip || '0'),
                    take: parseInt(paging?.take || '100'),
                }
            )
            .then(({ transactions, total }) => handleSuccessResponse({ transactions, total }, res, StatusCodes.OK))
            .catch((error) => handleErrorResponse(error, res, StatusCodes.INTERNAL_SERVER_ERROR))
    };

    createTransaction: RequestHandler = async (req: Request, res: Response) => {
        throw new Error('Not implemented')
    };
}

export const transactionController = new TransactionController()
