import type { ServiceResponse } from "@/common/models/serviceResponse"
import { CustomError, CustomErrorCode } from "@/common/utils/errors"
import dbClient, { prismaExclude } from "@/db"
import { logger } from "@/server"
import { PrismaClient, type Prisma, type Community } from "@prisma/client"
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
}

export const communityService = new CommunityService()
