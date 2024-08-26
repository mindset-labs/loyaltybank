import { Transaction, TransactionStatus, TransactionSubtype, TransactionType, Wallet } from '@prisma/client'
import { round } from 'lodash'
import { CreatePaymentSchemaType } from './paymentRequestValidation'
import db from '@/db'
import { CustomError, CustomErrorCode } from '@/common/utils/errors'
import { logger } from '@/server'

export class PaymentService {
    async createPayment(senderId: string, paymentRequest: CreatePaymentSchemaType): Promise<{
        transaction: Transaction,
        senderWallet: Wallet
    }> {
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
        } else if (round(senderWallet.balance, 2) < round(paymentRequest.amount, 2)) {
            throw new CustomError('Insufficient funds', CustomErrorCode.INSUFFICIENT_FUNDS, {
                balance: round(senderWallet.balance, 2),
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
        } else if (receiverWallet.id === senderWallet.id) {
            throw new CustomError('Cannot send funds to the same wallet', CustomErrorCode.WALLET_CANNOT_SEND_TO_ITSELF, {
                senderWalletId: paymentRequest.senderWalletId,
                receiverWalletId: paymentRequest.receiverWalletId,
            })
        }

        return db.$transaction(async () => {
            let transaction: Transaction

            // If the transaction ID is provided, update the existing (placeholder) transaction
            if (paymentRequest.transactionId) {
                transaction = await db.transaction.update({
                    where: {
                        id: paymentRequest.transactionId,
                        status: TransactionStatus.PLACEHOLDER,
                    },
                    data: {
                        senderId: senderId,
                        senderWalletId: paymentRequest.senderWalletId,
                        status: TransactionStatus.COMPLETED,
                    },
                })
            } else {
                transaction = await db.transaction.create({
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
                })
            }

            // update the sender wallet balance
            const senderWalletUpdated = await db.wallet.update({
                where: {
                    id: paymentRequest.senderWalletId,
                },
                data: {
                    balance: {
                        decrement: paymentRequest.amount,
                    },
                },
            })

            // update the receiver wallet balance
            const receiverWalletUpdated = await db.wallet.update({
                where: {
                    id: paymentRequest.receiverWalletId,
                },
                data: {
                    balance: {
                        increment: paymentRequest.amount,
                    },
                },
            })

            return {
                transaction,
                senderWallet: senderWalletUpdated,
            }
        })
    }
}

export const paymentService = new PaymentService()
