import type { Request, RequestHandler, Response } from "express"
import { StatusCodes } from 'http-status-codes'
import { handleErrorResponse, handleSuccessResponse } from '@/common/utils/httpHandlers'
import { walletService } from './walletService'
import { transactionService } from '../transaction/transactionService'

export class WalletController {
    myWallets: RequestHandler = async (req: Request, res: Response) => {
        walletService
            .userWallets(req.userId!)
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

    generateQRCode: RequestHandler = async (req: Request, res: Response) => {
        const { walletId } = req.params
        walletService
            .generateWalletQRCode(req.userId!, walletId)
            .then((qrCode) => handleSuccessResponse({ qrCode }, res, StatusCodes.OK))
            .catch((error) => handleErrorResponse(error, res))
    }

    createPlaceholderTransaction: RequestHandler = async (req: Request, res: Response) => {
        walletService
            .createPlaceholderTransaction(req.userId!, req.params.walletId, req.body.amount, req.body.options)
            .then((transaction) => handleSuccessResponse({ transaction }, res, StatusCodes.CREATED))
            .catch((error) => handleErrorResponse(error, res))
    }
}

export const walletController = new WalletController()
