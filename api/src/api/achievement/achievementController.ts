import type { Request, RequestHandler, Response } from "express"
import { achievementService } from "./achievementService"
import { handleErrorResponse, handleSuccessResponse } from '@/common/utils/httpHandlers'
import { Prisma } from '@prisma/client'
import { QueryPaging } from '@/common/utils/commonTypes'

export class AchievementController {
    queryAllAchievements: RequestHandler = async (req: Request, res: Response) => {
        achievementService
            .queryAllAchievements(
                (req.query.where || {}) as Prisma.AchievementWhereInput,
                (req.query.include || {}) as Prisma.AchievementInclude,
                (req.query.paging || {}) as QueryPaging
            )
            .then(({ achievements, total }) => handleSuccessResponse({ achievements, total }, res))
            .catch((error) => handleErrorResponse(error, res))
    };

    createAchievement: RequestHandler = async (req: Request, res: Response) => {
        achievementService
            .createAchievement(req.userId!, req.body)
            .then((achievement) => handleSuccessResponse({ achievement }, res))
            .catch((error) => handleErrorResponse(error, res))
    };

    updateAchievement: RequestHandler = async (req: Request, res: Response) => {
        achievementService
            .updateAchievement(req.userId!, req.params.id, req.body)
            .then((achievement) => handleSuccessResponse({ achievement }, res))
            .catch((error) => handleErrorResponse(error, res))
    };

    issueAchievementReward: RequestHandler = async (req: Request, res: Response) => {
        achievementService
            .issueAchievementReward(req.userId!, req.params.id, req.body)
            .then((reward) => handleSuccessResponse({ reward }, res))
            .catch((error) => handleErrorResponse(error, res))
    };

    claimAchievementReward: RequestHandler = async (req: Request, res: Response) => {
        achievementService
            .claimAchievementReward(req.userId!, req.body.rewardId, req.body.walletId)
            .then((reward) => handleSuccessResponse({ reward }, res))
            .catch((error) => handleErrorResponse(error, res))
    };
}

export const achievementController = new AchievementController()
