import { Community, Prisma, Transaction, TransactionStatus, TransactionSubtype, TransactionType, User, Wallet, WalletRole } from '@prisma/client'
import dbClient from '@/db'
import { CustomError, CustomErrorCode } from '@/common/utils/errors'
import QRCode from 'qrcode'
import { logger } from '@/server'
import { transactionService } from '../transaction/transactionService'

type WalletWithOwnerAndCommunity = Wallet & { owner?: User | null, community?: Community | null }

export class WalletService {
    /**
     * Get all wallets for a user (owned and shared)
     * @param userId: the id of the user
     * @returns an array of wallets
     */
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

    /**
     * Find a wallet by id and check if the user has view/edit access
     * @param userId: the id of the user
     * @param walletId: the id of the wallet
     * @param include: the fields to include
     * @returns the wallet if found, otherwise null
     */
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

    /**
     * Query transactions for a wallet. The user must have view access to the wallet (owner or shared).
     * @param userId: the id of the user
     * @param walletId: the id of the wallet
     * @param query: the query to filter transactions
     * @returns an array of transactions
     */
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

    /**
     * Share a wallet with a user. The user must be the owner of the wallet.
     * @param userId: the id of the user
     * @param walletId: the id of the wallet
     * @param recipientId: the id of the user to share the wallet with
     * @returns the shared wallet
     */
    async shareWallet(userId: string, walletId: string, recipientId: string): Promise<Wallet> {
        const wallet = await dbClient.wallet.findFirst({
            where: {
                id: walletId,
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

    /**
     * Create a placeholder transaction for a wallet. The user must have edit access to the wallet.
     * The transaction will be created with a status of PLACEHOLDER and can be paid & confirmed later by the payer.
     * @param userId: the id of the user
     * @param walletId: the id of the wallet
     * @param amount: the amount of the transaction
     * @param options: the options for the transaction
     * @param options.transactionType: the type of the transaction
     * @param options.transactionSubtype: the subtype of the transaction
     * @returns the created transaction
     */
    async createPlaceholderTransactionForWallet(userId: string, walletId: string, amount: number, options?: {
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

        return transactionService.createPlaceholderTransaction(userId, walletId, amount, options)
    }
}

export const walletService = new WalletService()
