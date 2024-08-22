import { Prisma, Achievement, AchievementReward, Role, CommunityRole, AchievementRewardType, TransactionType, TransactionSubtype } from '@prisma/client'
import dbClient from '@/db'
import { CustomError, CustomErrorCode } from '@/common/utils/errors'
import { communityService } from '../community/communityService'
import { logger } from '@/server'

export class AchievementService {
    /**
     * Create an achievement configuration for a certain community. 
     * This method will check if the user has edit access to the community (i.e. creator or admin).
     * 
     * @param userId The ID of the user creating the achievement
     * @param data The achievement data
     * @returns Promise<Achievement>
     */
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

    /**
     * This method will update an existing achievement configuration.
     * This method also checks if the user has edit access to the community.
     * 
     * @param userId The ID of the user updating the achievement
     * @param id The ID of the achievement to update
     * @param data The updated achievement data
     * @returns Promise<Achievement>
     */
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

    /**
     * This method will issue a reward for a certain achievement to a user.
     * 
     * @param userId: the ID of the user issuing the achievement reward
     * @param achievementId: the ID of the achievement whose reward is to be issued
     * @param data: the reward data
     *  - userId: the ID of the user receiving the reward
     *  - walletId: the ID of the wallet to receive the reward
     * @returns AchievementReward object
     */
    async issueAchievementReward(
        userId: string,
        achievementId: string,
        data: Prisma.AchievementRewardUncheckedCreateInput
    ): Promise<AchievementReward> {
        const achievement = await dbClient.achievement.findFirst({
            where: {
                id: achievementId,
                // Check if the user has access to issue rewards for the community
                OR: [
                    {
                        community: {
                            memberships: {
                                some: {
                                    userId,
                                    communityRole: CommunityRole.ADMIN,
                                },
                            },
                        },
                    },
                    {
                        community: {
                            createdById: userId,
                        },
                    },
                ]
            },
        })

        if (!achievement) {
            throw new CustomError('Achievement not found or invalid access', CustomErrorCode.INVALID_COMMUNITY_ACCESS, {
                achievementId,
                userId,
            })
        }

        return dbClient.$transaction(async () => {
            let claimedAt

            // Check if the reward is points based and if the walletId can be found
            // If yes, update the wallet balance
            if (data.walletId && achievement.rewardType === 'POINTS') {
                // Update the user's wallet balance
                await dbClient.wallet.update({
                    where: {
                        id: data.walletId,
                    },
                    data: {
                        balance: {
                            increment: achievement.rewardAmount,
                        },
                    },
                })

                await dbClient.transaction.create({
                    data: {
                        receiverId: data.userId,
                        receiverWalletId: data.walletId,
                        amount: achievement.rewardAmount,
                        transactionType: TransactionType.REWARD,
                        transactionSubtype: TransactionSubtype.POINTS,
                        description: `Reward for achievement ${achievement.name}`,
                    },
                })

                claimedAt = new Date()
            }

            // Create the achievement reward
            return dbClient.achievementReward.create({
                data: {
                    userId: data.userId,
                    walletId: data.walletId,
                    achievementId,
                    claimedAt,
                },
            })
        })
    }

    /**
     * This method will claim an achievement reward for a user.
     * 
     * @param userId The ID of the user claiming the reward
     * @param rewardId The ID of the reward to claim
     * @param walletId The ID of the wallet to claim to
     * @returns Promise<AchievementReward>
     */
    async claimAchievementReward(userId: string, rewardId: string, walletId: string): Promise<AchievementReward> {
        const reward = await dbClient.achievementReward.findFirst({
            where: {
                id: rewardId,
                userId,
            },
            include: {
                achievement: true,
            }
        })

        if (!reward) {
            throw new CustomError('Invalid reward', CustomErrorCode.INVALID_ACHIEVEMENT_REWARD, {
                rewardId,
                userId,
            })
        } else if (reward.claimedAt) {
            throw new CustomError('Reward already claimed', CustomErrorCode.INVALID_REWARD_CLAIM, {
                rewardId,
                claimedAt: reward.claimedAt,
                userId,
            })
        }

        return dbClient.$transaction(async () => {
            switch (reward.achievement.rewardType) {
                case AchievementRewardType.POINTS:
                    // Update the user's wallet balance
                    await dbClient.wallet.update({
                        where: {
                            id: walletId,
                        },
                        data: {
                            balance: {
                                increment: reward.achievement.rewardAmount,
                            },
                        },
                    })

                    await dbClient.transaction.create({
                        data: {
                            receiverId: userId,
                            receiverWalletId: walletId,
                            amount: reward.achievement.rewardAmount,
                            transactionType: TransactionType.REWARD,
                            transactionSubtype: TransactionSubtype.POINTS,
                            description: `Reward for achievement ${reward.achievement.name}`,
                        },
                    })
                    break
                case AchievementRewardType.BADGE:
                case AchievementRewardType.COUPON:
                case AchievementRewardType.POINTS_CUSTOM:
                    // TODO: handle other reward types for claims
                    logger.error({
                        rewardType: reward.achievement.rewardType,
                        rewardId,
                        userId,
                    }, 'Unhandled reward type claim')
                default:
                    break
            }

            return dbClient.achievementReward.update({
                where: {
                    id: rewardId,
                },
                data: {
                    claimedAt: new Date(),
                },
            })
        })
    }
}

export const achievementService = new AchievementService()
