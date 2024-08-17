import { Wallet, WalletRole } from '@prisma/client'
import dbClient from '@/db'
import { CustomError, CustomErrorCode } from '@/common/utils/errors'
import { logger } from '@/server'

export class WalletService {
    async userWallets(userId: string, options?: { includeShared?: boolean }): Promise<Wallet[]> {
        const ownedWallets = await dbClient.wallet.findMany({
            where: {
                ownerId: userId,
                isShared: false,
            }
        })

        if (!options?.includeShared) {
            return ownedWallets
        }

        const sharedWallets = await dbClient.userOnWallet.findMany({
            where: {
                walletId: {
                    notIn: ownedWallets.map((wallet) => wallet.id)
                },
                userId: userId
            },
            select: {
                wallet: true
            }
        }).then((userOnWallets) => userOnWallets.map((userOnWallet) => userOnWallet.wallet))

        return [...ownedWallets, ...sharedWallets]
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
