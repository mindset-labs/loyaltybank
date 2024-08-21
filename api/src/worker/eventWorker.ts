import BeeQ from 'bee-queue'
import { logger } from '@/server'
import { env } from '@/common/utils/envConfig'
import db from '@/db'
import { AchievementConditionAggregateType, AchievementConditionComparisionType, AchievementRewardType, AchievementStatus, TransactionSubtype, TransactionType } from '@prisma/client'

type EventQJob = {
    eventId: string
    userId: string
    eventLogId?: string
    metadata?: any
}

const queue = new BeeQ('eventQueue', {
    redis: {
        url: env.REDIS_URL,
    },
})

queue.on('job failed', (jobId, error) => {
    logger.error(`Job ${jobId} failed with error: ${error.message}`)
})

const compareValue = (valA: number, condition: AchievementConditionComparisionType, valB: number) => {
    switch (condition) {
        case AchievementConditionComparisionType.EQUAL:
            return valA === valB
        case AchievementConditionComparisionType.GREATER_THAN:
            return valA > valB
        case AchievementConditionComparisionType.GREATER_THAN_OR_EQUAL:
            return valA >= valB
        case AchievementConditionComparisionType.LESS_THAN:
            return valA < valB
        case AchievementConditionComparisionType.LESS_THAN_OR_EQUAL:
            return valA <= valB
        default:
            return false
    }
}

queue.process(async ({ data, id }: { data: EventQJob, id: string }) => {
    logger.info({ data }, `Processing EventQ job ${id}`)

    const eventDetails = await db.event.findFirst({
        where: {
            id: data.eventId,
        },
        include: {
            eventLogs: {
                where: {
                    id: data.eventLogId,
                    userId: data.userId,
                },
            },
            achievements: {
                where: {
                    status: AchievementStatus.ACTIVE,
                    OR: [
                        {
                            dateFrom: { lte: new Date() },
                            dateTo: { gte: new Date() }
                        },
                        {
                            dateFrom: null,
                            dateTo: null
                        },
                    ]
                },
                // count the number of times the user has obtained the achievement reward
                include: {
                    _count: {
                        select: {
                            achievementRewards: {
                                where: {
                                    userId: data.userId,
                                }
                            }
                        }
                    }
                },
            },
        },
    })

    if (!eventDetails) {
        logger.error(`Event ${data.eventId} not found`)
        return
    }

    for (let achievement of eventDetails.achievements) {
        // Check if the user can obtain the achievement once more
        if (achievement.frequencyLimit > 0 && achievement._count.achievementRewards >= achievement.frequencyLimit) {
            // User has already met the limit for this achievement
            continue
        }

        // If the user has met the criteria, create an achievement reward
        const pastEventsAgg = await db.eventLog.aggregate({
            where: {
                userId: data.userId,
                eventId: data.eventId,
                createdAt: {
                    lte: achievement.conditionDateTo || new Date('9999-12-31'),
                    gte: achievement.conditionDateFrom || new Date('0001-01-01'),
                },
            },
            _sum: {
                value: true,
            },
            _count: {
                id: true,
            },
            _avg: {
                value: true,
            },
            _min: {
                value: true,
            },
            _max: {
                value: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: achievement.conditionEventCountLimit || 999,
        })

        logger.info({ pastEventsAgg }, 'Past events aggregation')

        // TODO: Check if the user has met the criteria for the achievement based on conditions

        let comparisionValue = 0

        switch (achievement.conditionEventAggregateType) {
            case AchievementConditionAggregateType.COUNT:
                comparisionValue = pastEventsAgg._count.id
                break
            case AchievementConditionAggregateType.SUM:
                comparisionValue = pastEventsAgg._sum.value || 0
                break
            case AchievementConditionAggregateType.AVG:
                comparisionValue = pastEventsAgg._avg.value || 0
                break
            case AchievementConditionAggregateType.MIN:
                comparisionValue = pastEventsAgg._min.value || 0
                break
            case AchievementConditionAggregateType.MAX:
                comparisionValue = pastEventsAgg._max.value || 0
                break
            case AchievementConditionAggregateType.CUSTOM:
            default:
                logger.error(`Unhandled condition aggregate type ${achievement.conditionEventAggregateType}`)
                break
        }

        const isConditionMet = compareValue(
            comparisionValue,
            achievement.conditionEventComparisonType,
            achievement.conditionEventValue
        )

        logger.info({
            isConditionMet,
            comparisionValue,
            condition: achievement.conditionEventComparisonType,
            valueEventValue: achievement.conditionEventValue,
        }, 'Achievement condition met')

        // issue the reward
        if (isConditionMet) {
            await db.$transaction(async () => {
                let claimedAt = null

                // auto claim the reward if the achievement reward is points based and a wallet exists
                // for that user in the community
                if (achievement.rewardType === AchievementRewardType.POINTS) {
                    const wallet = await db.wallet.findFirst({
                        where: {
                            ownerId: data.userId,
                            communityId: achievement.communityId,
                        },
                        select: {
                            id: true,
                        }
                    })

                    if (wallet?.id) {
                        await db.wallet.update({
                            where: {
                                id: wallet.id,
                            },
                            data: {
                                balance: {
                                    increment: achievement.rewardAmount,
                                }
                            }
                        })

                        claimedAt = new Date()

                        await db.transaction.create({
                            data: {
                                receiverWalletId: wallet.id,
                                receiverId: data.userId,
                                amount: achievement.rewardAmount,
                                transactionType: TransactionType.REWARD,
                                transactionSubtype: TransactionSubtype.POINTS,
                                description: `Achievement reward for ${achievement.name}`,
                            }
                        })
                    }
                }

                await db.achievementReward.create({
                    data: {
                        userId: data.userId,
                        achievementId: achievement.id,
                        claimedAt,
                    },
                })
            })
        }
    }
})

export const addJob = async (data: EventQJob) => {
    return queue
        .createJob(data)
        .timeout(30_000)
        .retries(3)
        .backoff('exponential', 1_000)
        .save()
}

export default queue