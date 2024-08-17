import { CustomError, CustomErrorCode } from "@/common/utils/errors"
import dbClient from "@/db"
import { type Prisma, type Community, Membership, CommunityStatus } from "@prisma/client"
import { env } from '@/common/utils/envConfig'

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
    findById(id: string, include?: Prisma.CommunityInclude): Promise<Community | null> {
        return dbClient.community.findFirst({
            where: {
                id,
            },
            include,
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
            throw new CustomError('User is already a member of the community', CustomErrorCode.USER_ALREADY_MEMBER)
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
}

export const communityService = new CommunityService()
