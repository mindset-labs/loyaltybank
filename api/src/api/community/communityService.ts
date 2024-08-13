import type { ServiceResponse } from "@/common/models/serviceResponse"
import { CustomError, CustomErrorCode } from "@/common/utils/errors"
import dbClient, { prismaExclude } from "@/db"
import { logger } from "@/server"
import { PrismaClient, type Prisma, type Community, Membership, CommunityStatus } from "@prisma/client"
import bcrypt from "bcrypt"

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

export class CommunityService {
    findById(id: string): Promise<Community | null> {
        return dbClient.community.findFirst({
            where: {
                id,
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

    async joinCommunity(id: string, userId: string): Promise<Membership> {
        // find the community
        const community = await dbClient.community.findFirst({
            where: {
                id,
            }
        })

        if (!community) {
            throw new CustomError('Community not found', CustomErrorCode.INVALID_COMMUNITY)
        } else if (community.status !== CommunityStatus.ACTIVE) {
            throw new CustomError('Community is not active', CustomErrorCode.COMMUNITY_NOT_ACTIVE)
        } else if (!community.isPublic) {
            throw new CustomError('Community is not public', CustomErrorCode.COMMUNITY_NOT_PUBLIC)
        }

        return dbClient.membership.create({
            data: {
                userId,
                communityId: id,
            }
        })
    }
}

export const communityService = new CommunityService()
