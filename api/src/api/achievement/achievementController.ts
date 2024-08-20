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

    // createAchievementReward: RequestHandler = async (req: Request, res: Response) => {
    //     achievementService
    //         .createAchievementReward(req.userId!, req.body)
    //         .then((data) => handleSuccessResponse(data, res))
    //         .catch((error) => handleErrorResponse(error, res))
    // };
}

export const achievementController = new AchievementController()
