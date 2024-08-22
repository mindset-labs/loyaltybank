import type { Request, RequestHandler, Response } from "express"
import { achievementService } from "./achievementService"
import { handleErrorResponse, handleSuccessResponse } from '@/common/utils/httpHandlers'

export class AchievementController {
    createAchievement: RequestHandler = async (req: Request, res: Response) => {
        achievementService
            .createAchievement(req.userId!, req.body)
            .then((data) => handleSuccessResponse(data, res))
            .catch((error) => handleErrorResponse(error, res))
    };

    updateAchievement: RequestHandler = async (req: Request, res: Response) => {
        achievementService
            .updateAchievement(req.userId!, req.params.id, req.body)
            .then((data) => handleSuccessResponse(data, res))
            .catch((error) => handleErrorResponse(error, res))
    };

    issueAchievementReward: RequestHandler = async (req: Request, res: Response) => {
        achievementService
            .issueAchievementReward(req.userId!, req.params.id, req.body)
            .then((data) => handleSuccessResponse(data, res))
            .catch((error) => handleErrorResponse(error, res))
    };

    claimAchievementReward: RequestHandler = async (req: Request, res: Response) => {
        achievementService
            .claimAchievementReward(req.userId!, req.params.achievementId, req.params.rewardId)
            .then((reward) => handleSuccessResponse(reward, res))
            .catch((error) => handleErrorResponse(error, res))
    };
}

export const achievementController = new AchievementController()
