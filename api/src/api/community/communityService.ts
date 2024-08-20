import { CustomError, CustomErrorCode } from "@/common/utils/errors"
import dbClient from "@/db"
import { type Prisma, type Community, Membership, CommunityStatus, CommunityRole, Transaction, TransactionType, TransactionSubtype, MembershipStatus } from "@prisma/client"
import { env } from '@/common/utils/envConfig'
import { round } from 'lodash'

type CommunityQuery = Prisma.CommunityGetPayload<{
    select: {
        createdById: true,
        name: true,
        isPrivate: true,
    }
}>

type QueryPaging = {
    take?: number,
    skip?: number,
}

type JoinCommunityOptions = {
    createWallet?: boolean,
    walletName?: string,
}

export class CommunityService {
    findById(id: string, include: Prisma.CommunityInclude = {}): Promise<Community | null> {
        return dbClient.community.findFirst({
            where: {
                id,
            },
            include,
        })
    }

    findByIdAndCheckAccess(communityId: string, userId: string, include: Prisma.CommunityInclude = {}): Promise<Community | null> {
        return dbClient.community.findFirst({
            where: {
                id: communityId,
                OR: [
                    // community is public and active
                    {
                        status: CommunityStatus.ACTIVE,
                        isPublic: true
                    },
                    // OR the community is created by the user
                    { createdById: userId },
                    // OR the user is a member of the community
                    {
                        memberships: {
                            some: {
                                userId,
                                membershipStatus: {
                                    in: [MembershipStatus.ACTIVE, MembershipStatus.PENDING],
                                }
                            }
                        }
                    }
                ]
            },
            include,
        })
    }

    async findByIdWithEditAccess(communityId: string, userId: string): Promise<Community | null> {
        return dbClient.community.findFirst({
            where: {
                id: communityId,
                OR: [
                    // OR the community is created by the user
                    { createdById: userId },
                    // OR the user is a member of the community
                    {
                        memberships: {
                            some: {
                                userId,
                                communityRole: CommunityRole.ADMIN,
                            }
                        }
                    }
                ]
            }
        })
    }

    queryCommunities(query: Partial<CommunityQuery>, paging?: QueryPaging): Promise<Community[]> {
        const queryFields: Partial<Prisma.CommunityWhereInput> = {
            ...query,
        }

        // ... add more complex queries here

        return dbClient.community.findMany({
            where: queryFields,
            take: paging?.take || 25,
            skip: paging?.skip || 0,
        })
    }

    createCommunity(data: Prisma.CommunityCreateInput): Promise<Community> {
        return dbClient.community.create({
            data,
        })
    }

    updateCommunity(id: string, data: Prisma.CommunityUpdateInput): Promise<Community> {
        return dbClient.community.update({
            where: {
                id,
            },
            data,
        })
    }

    async addMember(userId: string, membershipData: Prisma.MembershipUncheckedCreateInput): Promise<Membership> {
        // find the community
        const community = await dbClient.community.findFirst({
            where: {
                id: membershipData.communityId,
            }
        })

        if (!community) {
            throw new CustomError('Community not found', CustomErrorCode.INVALID_COMMUNITY)
        } else if (community.createdById !== userId) {
            throw new CustomError('Invalid authorization', CustomErrorCode.INVALID_ACCESS_CONTROL)
        }

        return dbClient.membership.create({
            data: membershipData,
        })
    }

    async joinCommunity(id: string, userId: string, options?: JoinCommunityOptions): Promise<Membership> {
        // find the community
        const community = await dbClient.community.findFirst({
            where: {
                id,
            },
            include: {
                memberships: {
                    where: {
                        userId,
                    },
                }
            }
        })

        // TODO: add ability to join community via invite code

        if (!community) {
            throw new CustomError('Community not found', CustomErrorCode.INVALID_COMMUNITY)
        } else if (community.memberships.length > 0) {
            throw new CustomError('User is already a member of the community', CustomErrorCode.USER_ALREADY_MEMBER, {
                membership: community.memberships[0],
            })
        } else if (community.status !== CommunityStatus.ACTIVE) {
            throw new CustomError('Community is not active', CustomErrorCode.COMMUNITY_NOT_ACTIVE)
        } else if (!community.isPublic) {
            throw new CustomError('Community is not public', CustomErrorCode.COMMUNITY_NOT_PUBLIC)
        }

        return dbClient.$transaction(async () => {
            const membership = await dbClient.membership.create({
                data: {
                    userId,
                    communityId: id,
                }
            })

            // create a wallet for the user if requested
            if (options?.createWallet) {
                await dbClient.wallet.create({
                    data: {
                        name: options?.walletName || `${community.name} Wallet`,
                        ownerId: userId,
                        communityId: community.id,
                        token: community.pointsTokenName,
                        // start with a balance of 1000 points if not in production
                        balance: env.DEFAULT_BALANCE,
                    }
                })
            }

            return membership
        })
    }

    async issuePoints(
        userId: string,
        data: {
            communityId: string,
            walletId: string,
            amount: number,
            reason?: string,
        }
    ): Promise<Transaction> {
        const { communityId, walletId, amount, reason } = data
        // find the community
        const community = await dbClient.community.findFirst({
            where: {
                id: communityId,
            },
            include: {
                memberships: {
                    where: {
                        userId,
                        communityRole: CommunityRole.ADMIN,
                    }
                }
            }
        })

        if (!community) {
            throw new CustomError('Community not found', CustomErrorCode.INVALID_COMMUNITY)
        } else if (community.memberships.length === 0 && community.createdById !== userId) {
            throw new CustomError('User is not an admin of the community', CustomErrorCode.INVALID_ACCESS_CONTROL)
        }

        // find the wallet and check if the user has access to it
        const wallet = await dbClient.wallet.findFirst({
            where: {
                id: walletId,
            }
        })

        if (!wallet) {
            throw new CustomError('Wallet not found', CustomErrorCode.INVALID_WALLET_ID)
        } else if (wallet.communityId !== communityId) {
            throw new CustomError('Wallet does not belong to the community', CustomErrorCode.INVALID_WALLET_FOR_COMMUNITY)
        }

        const [transaction, _] = await dbClient.$transaction([
            dbClient.transaction.create({
                data: {
                    receiverWalletId: walletId,
                    // reward points to the wallet owner
                    receiverId: wallet.ownerId,
                    senderId: userId,
                    amount,
                    transactionType: TransactionType.REWARD,
                    transactionSubtype: TransactionSubtype.POINTS,
                    description: reason || `Awarded by ${community.name} community's admin`,
                }
            }),
            dbClient.wallet.update({
                where: {
                    id: walletId,
                },
                data: {
                    balance: {
                        increment: round(amount, 2),
                    }
                }
            })
        ])

        return transaction
    }
}

export const communityService = new CommunityService()
