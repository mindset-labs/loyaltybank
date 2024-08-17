import type { Request, RequestHandler, Response } from "express"
import dbClient from '@/db'
import { handleErrorResponse, handleSuccessResponse } from '@/common/utils/httpHandlers'
import { StatusCodes } from 'http-status-codes'
import { CustomError, CustomErrorCode } from '@/common/utils/errors'
import { walletService } from './walletService'

export class WalletController {
    myWallets: RequestHandler = async (req: Request, res: Response) => {
        walletService
            .userWallets(req.userId!, req.query)
            .then((wallets) => handleSuccessResponse({ wallets }, res, StatusCodes.OK))
            .catch((error) => handleErrorResponse(error, res))
    };

    shareWallet: RequestHandler = async (req: Request, res: Response) => {
        const { walletId } = req.params
        const { recipientId } = req.body
        walletService
            .shareWallet(req.userId!, walletId, recipientId)
            .then((wallet) => handleSuccessResponse({ wallet }, res, StatusCodes.CREATED))
            .catch((error) => handleErrorResponse(error, res))
    };
}

export const walletController = new WalletController()
