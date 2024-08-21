import type { Request, RequestHandler, Response } from "express"
import { StatusCodes } from 'http-status-codes'
import { handleErrorResponse, handleSuccessResponse } from '@/common/utils/httpHandlers'
import { walletService } from './walletService'

export class WalletController {
    myWallets: RequestHandler = async (req: Request, res: Response) => {
        walletService
            .userWallets(req.userId!, req.query)
            .then((wallets) => handleSuccessResponse({ wallets }, res, StatusCodes.OK))
            .catch((error) => handleErrorResponse(error, res))
    };

    queryWalletTransactions: RequestHandler = async (req: Request, res: Response) => {
        walletService
            .queryWalletTransactions(req.userId!, req.params.walletId, req.query)
            .then((transactions) => handleSuccessResponse({ transactions }, res, StatusCodes.OK))
            .catch((error) => handleErrorResponse(error, res))
    }

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
