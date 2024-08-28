import { Prisma, Transaction, TransactionStatus, TransactionSubtype, TransactionType, Wallet } from '@prisma/client'
import { round } from 'lodash'
import { CreatePaymentSchemaType } from './paymentRequestValidation'
import db from '@/db'
import { CustomError, CustomErrorCode } from '@/common/utils/errors'

export class PaymentService {
    /**
     * Create a payment transaction by the sender. If a `transactionId` is provided, the existing (placeholder) transaction is updated.
     * Otherwise, a new transaction is created. Balances of sending and receiving wallets are updated accordingly.
     * @param senderId - The ID of the sender
     * @param paymentRequest - The payment request object
     * @param paymentRequest.senderWalletId - The ID of the sender's wallet
     * @param paymentRequest.receiverWalletId - The ID of the receiver's wallet
     * @param paymentRequest.amount - The amount to be sent
     * @param paymentRequest.receiverUserId - The ID of the receiver user (optional)
     * @param paymentRequest.description - The description of the transaction (optional)
     * @param paymentRequest.communityId - The ID of the community (optional)
     * @param paymentRequest.transactionId - The ID of the existing transaction (optional)
     * @returns The transaction and the updated sender wallet
     */
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
                try {
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
                } catch (prismaError) {
                    if (prismaError instanceof Prisma.PrismaClientKnownRequestError && prismaError.code === 'P2025') {
                        throw new CustomError('Transaction ID invalid or already paid', CustomErrorCode.INVALID_OR_PAID_PAYMENT_TRANSACTION, {
                            transactionId: paymentRequest.transactionId,
                        })
                    }

                    throw prismaError
                }
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
