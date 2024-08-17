import type { Request, RequestHandler, Response } from "express"

export class TransactionController {
    queryTransactions: RequestHandler = async (req: Request, res: Response) => {
        throw new Error('Not implemented')
    };

    createTransaction: RequestHandler = async (req: Request, res: Response) => {
        throw new Error('Not implemented')
    };
}

export const transactionController = new TransactionController()
