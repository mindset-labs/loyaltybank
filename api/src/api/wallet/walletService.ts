import { Prisma, Transaction, Wallet, WalletRole } from '@prisma/client'
import dbClient from '@/db'
import { CustomError, CustomErrorCode } from '@/common/utils/errors'
import { logger } from '@/server'
import { TransactionWhereInputSchema } from '@zodSchema/index'
import { StatusCodes } from 'http-status-codes'

export class WalletService {
    async userWallets(userId: string): Promise<Wallet[]> {
        return dbClient.wallet.findMany({
            where: {
                OR: [
                    {
                        ownerId: userId,
                    },
                    {
                        users: {
                            some: {
                                userId,
                            }
                        }
                    }
                ]
            }
        })
    }

    async queryWalletTransactions(userId: string, walletId: string, query: Prisma.TransactionWhereInput): Promise<Transaction[]> {
        const walletDetails = await dbClient.wallet.findFirst({
            where: {
                id: walletId,
                OR: [
                    {
                        ownerId: userId,
                    },
                    {
                        users: {
                            some: {
                                userId,
                            }
                        }
                    }
                ]
            },
        })

        if (!walletDetails) {
            throw new CustomError('Wallet not found or not accessible', CustomErrorCode.INVALID_WALLET_ID, {
                walletId,
                userId,
            })
        }

        return dbClient.transaction.findMany({
            where: {
                ...query,
                OR: [
                    {
                        senderWalletId: walletId,
                    },
                    {
                        receiverWalletId: walletId,
                    }
                ],
            }
        })
    }

    async shareWallet(userId: string, walletId: string, recipientId: string): Promise<Wallet> {
        const wallet = await dbClient.wallet.findFirst({
            where: {
                id: walletId,
                // must be owned by the user
                ownerId: userId,
            },
            include: {
                users: {
                    where: {
                        userId: recipientId,
                    }
                },
            }
        })

        if (!wallet) {
            throw new CustomError('Wallet not found', CustomErrorCode.INVALID_WALLET_ID, {
                walletId,
                userId,
            })
        } else if (recipientId === userId) {
            throw new CustomError('Cannot share wallet with yourself', CustomErrorCode.INVALID_RECIPIENT_ID, {
                recipientId,
                userId,
            })
        } else if (wallet.users.length > 0) {
            throw new CustomError(
                'User is already a member of the wallet',
                CustomErrorCode.WALLET_ALREADY_SHARED_WITH_USER,
                {
                    recipientId,
                    walletId,
                }
            )
        }

        const [_, sharedWallet] = await dbClient.$transaction([
            dbClient.userOnWallet.create({
                data: {
                    userId: recipientId,
                    walletId,
                    role: WalletRole.MEMBER,
                }
            }),
            dbClient.wallet.update({
                where: {
                    id: walletId,
                },
                data: {
                    isShared: true,
                }
            })
        ])

        return sharedWallet
    }
}

export const walletService = new WalletService()
