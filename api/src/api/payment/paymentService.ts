import { Transaction, TransactionStatus, TransactionSubtype, TransactionType } from '@prisma/client'
import { CreatePaymentSchemaType } from './paymentRequestValidation'
import db from '@/db'
import { CustomError, CustomErrorCode } from '@/common/utils/errors'

export class PaymentService {
    async createPayment(senderId: string, paymentRequest: CreatePaymentSchemaType): Promise<Transaction> {
        // find the sender wallet
        const senderWallet = await db.wallet.findFirst({
            where: {
                id: paymentRequest.senderWalletId,
            },
            include: {
                users: {
                    where: {
                        userId: senderId,
                    },
                },
            }
        })

        // check that the sender owner or included in the wallet
        if (!senderWallet || (senderWallet.ownerId !== senderId && senderWallet.users.length === 0)) {
            throw new CustomError('Invalid sender wallet ID', CustomErrorCode.INVALID_WALLET_ID, {
                senderWalletId: paymentRequest.senderWalletId,
            })
        } else if (Math.round(senderWallet.balance * 100) < Math.round(paymentRequest.amount * 100)) {
            throw new CustomError('Insufficient funds', CustomErrorCode.INSUFFICIENT_FUNDS, {
                balance: senderWallet.balance,
                amount: paymentRequest.amount,
                walletId: paymentRequest.senderWalletId,
            })
        }

        // find the receiver wallet
        const receiverWallet = await db.wallet.findFirst({
            where: {
                id: paymentRequest.receiverWalletId,
            },
        })

        // check that the receiver wallet exists
        if (!receiverWallet) {
            throw new CustomError('Invalid receiver wallet ID', CustomErrorCode.INVALID_WALLET_ID, {
                receiverWalletId: paymentRequest.receiverWalletId,
            })
        } else if (receiverWallet.communityId !== senderWallet.communityId) {
            throw new CustomError('Cannot send funds from different communities', CustomErrorCode.INVALID_WALLET_COMMUNITY, {
                senderCommunityId: senderWallet.communityId,
                receiverCommunityId: receiverWallet.communityId,
            })
        } else if (receiverWallet.token !== senderWallet.token) {
            throw new CustomError('Cannot send funds between different tokens', CustomErrorCode.INVALID_WALLET_TOKEN, {
                senderToken: senderWallet.token,
                receiverToken: receiverWallet.token,
            })
        }

        const [transaction] = await db.$transaction(
            [
                db.transaction.create({
                    data: {
                        amount: paymentRequest.amount,
                        description: paymentRequest.description,
                        senderWalletId: paymentRequest.senderWalletId,
                        receiverWalletId: paymentRequest.receiverWalletId,
                        senderId: senderId,
                        receiverId: paymentRequest.receiverUserId || receiverWallet.ownerId,
                        communityId: paymentRequest.communityId,
                        transactionType: TransactionType.PAYMENT,
                        transactionSubtype: TransactionSubtype.BALANCE,
                        status: TransactionStatus.COMPLETED,
                    },
                }),
                db.wallet.update({
                    where: {
                        id: paymentRequest.senderWalletId,
                    },
                    data: {
                        balance: {
                            decrement: paymentRequest.amount,
                        },
                    },
                }),
                db.wallet.update({
                    where: {
                        id: paymentRequest.receiverWalletId,
                    },
                    data: {
                        balance: {
                            increment: paymentRequest.amount,
                        },
                    },
                }),
            ]
        )

        return transaction
    }
}

export const paymentService = new PaymentService()
