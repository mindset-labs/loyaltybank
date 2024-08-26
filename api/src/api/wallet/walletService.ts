import { Community, Prisma, Transaction, TransactionStatus, TransactionSubtype, TransactionType, User, Wallet, WalletRole } from '@prisma/client'
import dbClient from '@/db'
import { CustomError, CustomErrorCode } from '@/common/utils/errors'
import QRCode from 'qrcode'
import { logger } from '@/server'

type WalletWithOwnerAndCommunity = Wallet & { owner?: User | null, community?: Community | null }

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

    async findWalletWithPermission(userId: string, walletId: string, include?: Prisma.WalletInclude): Promise<WalletWithOwnerAndCommunity | null> {
        return dbClient.wallet.findFirst({
            where: {
                id: walletId,
                OR: [
                    {
                        ownerId: userId,
                    },
                    {
                        isShared: true,
                        users: {
                            some: {
                                userId,
                            }
                        }
                    }
                ]
            },
            include,
        })
    }

    async queryWalletTransactions(userId: string, walletId: string, query: Prisma.TransactionWhereInput): Promise<Transaction[]> {
        const walletDetails = await this.findWalletWithPermission(userId, walletId)

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

    /**
     * Generate a QR code for a wallet
     * @param walletId: The ID of the wallet
     * @param userId: The ID of the user
     * @returns A string of the QR code data URL (image as a string)
     */
    async generateWalletQRCode(walletId: string, userId: string): Promise<string> {
        const wallet = await this.findWalletWithPermission(userId, walletId, {
            owner: true,
            community: true,
        })

        if (!wallet) {
            throw new CustomError('Wallet not found or user is not the owner', CustomErrorCode.INVALID_WALLET_ID, {
                walletId,
                userId,
            })
        }

        const qrCodeData = {
            walletId: wallet.id,
            userId: userId,
            ownerName: wallet.owner?.name || null,
            communityId: wallet.community?.id || null,
            communityName: wallet.community?.name || null,
        }

        const qrCodeString = JSON.stringify(qrCodeData)

        try {
            const qrCodeDataUrl = await QRCode.toDataURL(qrCodeString)
            return qrCodeDataUrl
        } catch (error) {
            logger.error('Failed to generate QR code', {
                walletId,
                userId,
                error,
            })
            throw new CustomError('Failed to generate QR code', CustomErrorCode.QR_CODE_GENERATION_FAILED, {
                walletId,
                userId,
            })
        }
    }

    async createPlaceholderTransaction(userId: string, walletId: string, amount: number, options?: {
        transactionType?: TransactionType,
        transactionSubtype?: TransactionSubtype,
    }): Promise<Transaction> {
        const wallet = await this.findWalletWithPermission(userId, walletId)

        if (!wallet) {
            throw new CustomError('Wallet not found or user is not the owner', CustomErrorCode.INVALID_WALLET_ID, {
                walletId,
                userId,
            })
        }

        return dbClient.transaction.create({
            data: {
                transactionType: options?.transactionType || TransactionType.PAYMENT,
                transactionSubtype: options?.transactionSubtype || TransactionSubtype.BALANCE,
                receiverWalletId: walletId,
                receiverId: userId,
                amount,
                status: TransactionStatus.PLACEHOLDER,
            }
        })
    }
}

export const walletService = new WalletService()
