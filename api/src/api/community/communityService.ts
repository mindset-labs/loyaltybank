import { CustomError, CustomErrorCode } from "@/common/utils/errors"
import dbClient from "@/db"
import { type Prisma, type Community, Membership, CommunityStatus, CommunityRole, Transaction, TransactionType, TransactionSubtype, MembershipStatus } from "@prisma/client"
import { env } from '@/common/utils/envConfig'
import { round } from 'lodash'
import { type QueryPaging } from '@/common/utils/commonTypes'

type JoinCommunityOptions = {
    createWallet?: boolean,
    walletName?: string,
    ignorePublicCheck?: boolean,
    inviteId?: string,
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

    /**
     * Find a community by id and check if the user has view/edit access
     * @param communityId: the id of the community
     * @param userId: the user performing the action
     * @param include: (optional) the relationships to include
     * @returns the community
     */
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

    /**
     * Find a community by id and check if the user has edit access
     * @param communityId: the id of the community
     * @param userId: the user performing the action
     * @param select: (optional) the fields to select
     * @returns the community
     */
    async findByIdWithEditAccess(communityId: string, userId: string, select?: Prisma.CommunitySelect): Promise<Community | null> {
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
            },
            select,
        })
    }

    queryCommunities(query: Prisma.CommunityWhereInput, include?: Prisma.CommunityInclude, paging?: QueryPaging): Promise<Community[]> {
        return dbClient.community.findMany({
            where: query,
            take: paging?.take || 25,
            skip: paging?.skip || 0,
            include,
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

    /**
     * Add a member to a community
     * @param userId: the user performing the action
     * @param membershipData: the data to add the member with
     * @param membershipData.communityId: the community to add the member to
     * @param membershipData.userId: the user to add to the community
     * @param membershipData.communityRole: (optional) the role of the member in the community
     * @param membershipData.membershipStatus: (optional) the status of the membership
     * @returns the membership
     */
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

    /**
     * Join a community
     * @param id: the id of the community
     * @param userId: the user performing the action
     * @param options: (optional) options to join the community
     * @returns the membership
     */
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

        if (!community) {
            throw new CustomError('Community not found', CustomErrorCode.INVALID_COMMUNITY)
        } else if (community.memberships.length > 0) {
            throw new CustomError('User is already a member of the community', CustomErrorCode.USER_ALREADY_MEMBER, {
                membership: community.memberships[0],
            })
        } else if (community.status !== CommunityStatus.ACTIVE) {
            throw new CustomError('Community is not active', CustomErrorCode.COMMUNITY_NOT_ACTIVE)
        } else if (!community.isPublic && !options?.ignorePublicCheck) {
            throw new CustomError('Community is not public', CustomErrorCode.COMMUNITY_NOT_PUBLIC)
        }

        return dbClient.$transaction(async () => {
            const membership = await dbClient.membership.create({
                data: {
                    userId,
                    communityId: id,
                    inviteId: options?.inviteId,
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

    /**
     * Issue points to a wallet
     * @param userId: the user performing the action
     * @param data: the data to issue points
     * @param data.communityId: the community to issue points to
     * @param data.walletId: the wallet to issue points to
     * @param data.amount: the amount of points to issue
     * @param data.reason: (optional) the reason for issuing points
     * @returns the transaction
     */
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
                    communityId,
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

    /**
     * Create a membership for a user in a community
     * @param userId: the user performing the action
     * @param data: the data to create the membership with
     * @param data.userId: the user to create the membership for
     * @param data.communityId: the community to create the membership for
     * @param data.role: (optional) the role of the member in the community
     * @param data.status: (optional) the status of the membership
     * @param data.tags: (optional) the tags of the membership
     * @returns the membership
     */
    async createMembership(userId: string, data: Prisma.MembershipUncheckedCreateInput): Promise<Membership> {
        // check the user has access to the community
        const community = await this.findByIdAndCheckAccess(data.communityId, userId)

        if (!community) {
            throw new CustomError('Community not found or user does not have access', CustomErrorCode.INVALID_COMMUNITY_ACCESS, {
                communityId: data.communityId,
                userId,
            })
        }

        // check if the user to be added is a managed user
        const managedUser = await dbClient.user.findFirst({
            where: {
                id: data.userId,
                managedById: userId,
            }
        })

        if (!managedUser) {
            throw new CustomError('User is not a managed user', CustomErrorCode.USER_NOT_MANAGED)
        }

        // check if the user is already a member of the community
        const membership = await dbClient.membership.findFirst({
            where: {
                userId: data.userId,
                communityId: data.communityId,
            }
        })

        if (membership) {
            throw new CustomError('User is already a member of the community', CustomErrorCode.USER_ALREADY_MEMBER, {
                membership,
            })
        }

        // create the membership
        return dbClient.membership.create({
            data: {
                ...data,
                communityRole: CommunityRole.MANAGED_MEMBER,
            },
        })
    }

    /**
     * Update a membership within a community
     * @param userId: the user performing the action
     * @param membershipId: the membership to update
     * @param communityId: the community the membership is in
     * @param data: the data to update the membership with
     * @returns the updated membership
     */
    async updateMembership(userId: string, communityId: string, membershipId: string, data: Prisma.MembershipUpdateInput): Promise<Membership> {
        // check the user has access to update the community / its memberships
        const community = await this.findByIdWithEditAccess(communityId, userId, { id: true })

        if (!community) {
            throw new CustomError('Community not found or user does not have edit access', CustomErrorCode.INVALID_COMMUNITY_ACCESS, {
                communityId,
                userId,
                membershipId,
            })
        }

        return dbClient.membership.update({
            where: {
                id: membershipId,
                communityId,
            },
            data,
        })
    }
}

export const communityService = new CommunityService()
