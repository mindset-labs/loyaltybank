import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import express, { type Router } from "express"
import { z } from "zod"

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders"
import verifyJWT from "@/common/middleware/verifyJWT"
import { validateRequest } from "@/common/utils/httpHandlers"
import { achievementController } from "./achievementController"
import { AchievementSchema } from '@zodSchema/index'
import { CreateAchievementSchema } from './achievementRequestValidation'

export const achievementRegistry = new OpenAPIRegistry()
export const achievementRouter: Router = express.Router()

achievementRegistry.register("Achievement", AchievementSchema)

// Query user's own transactions
achievementRegistry.registerPath({
    method: "post",
    path: "/achievement",
    tags: ["Achievement"],
    responses: createApiResponse(z.array(AchievementSchema), "Success"),
})

achievementRouter.post("/", verifyJWT, validateRequest(CreateAchievementSchema), achievementController.createAchievement)

// Create a reward for an achievement
// achievementRegistry.registerPath({
//     method: "get",
//     path: "/achievement/{id}/reward",
//     tags: ["Achievement"],
//     responses: createApiResponse(z.array(AchievementRewardSchema), "Success"),
// })

// achievementRouter.get("/:achievementId/reward", verifyJWT, achievementController.createAchievementReward)
