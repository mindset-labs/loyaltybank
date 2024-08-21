import { Prisma, Achievement, AchievementReward, Role, CommunityRole } from '@prisma/client'
import dbClient from '@/db'
import { CustomError, CustomErrorCode } from '@/common/utils/errors'
import { communityService } from '../community/communityService'

export class AchievementService {
    async createAchievement(
        userId: string,
        data: Prisma.AchievementUncheckedCreateWithoutCreatedByInput
    ): Promise<Achievement> {
        const userData = await dbClient.user.findFirst({
            where: {
                id: userId,
            },
        })

        // Only system admins can create achievements outside of communities
        if (userData?.role !== Role.SYSTEM_ADMIN && !data.communityId) {
            throw new CustomError(
                'Only system admins can create achievements outside of communities',
                CustomErrorCode.INVALID_ACCESS_CONTROL
            )
        }

        // Check that the user has access to the community
        if (data.communityId) {
            const community = await communityService.findByIdWithEditAccess(data.communityId, userId)

            if (!community) {
                throw new CustomError('Invalid community or access', CustomErrorCode.INVALID_COMMUNITY_ACCESS, {
                    communityId: data.communityId,
                    userId,
                })
            }
        }

        return dbClient.achievement.create({
            data: {
                ...data,
                createdById: userId,
            },
        })
    }

    async updateAchievement(
        userId: string,
        id: string,
        data: Prisma.AchievementUncheckedUpdateInput
    ): Promise<Achievement> {
        const achievement = await dbClient.achievement.findFirst({
            where: {
                id,
            },
            include: {
                community: {
                    include: {
                        memberships: {
                            where: {
                                userId,
                                communityRole: CommunityRole.ADMIN,
                            },
                        },
                    }
                },
            }
        })

        if (!achievement) {
            throw new CustomError('Achievement not found', CustomErrorCode.INVALID_ACHIEVEMENT, {
                achievementId: id,
            })
        } else if (achievement.community?.memberships.length === 0) {
            throw new CustomError('Invalid community or access', CustomErrorCode.INVALID_COMMUNITY_ACCESS, {
                communityId: achievement.communityId,
                userId,
            })
        }

        return dbClient.achievement.update({
            where: {
                id,
            },
            data,
        })
    }
}

export const achievementService = new AchievementService()
