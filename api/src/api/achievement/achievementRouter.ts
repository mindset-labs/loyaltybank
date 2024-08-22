import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import express, { type Router } from "express"
import { z } from "zod"

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders"
import verifyJWT from "@/common/middleware/verifyJWT"
import { validateRequest } from "@/common/utils/httpHandlers"
import { achievementController } from "./achievementController"
import { AchievementRewardSchema, AchievementSchema } from '@zodSchema/index'
import { ClaimRewardSchema, CreateAchievementSchema, IssueAchievementReward, UpdateAchievementSchema } from './achievementRequestValidation'

export const achievementRegistry = new OpenAPIRegistry()
export const achievementRouter: Router = express.Router()

// open API zod schemas
const AchievementWithoutMetadataSchema = AchievementSchema.omit({ metadata: true })

achievementRegistry.register("Achievement", AchievementWithoutMetadataSchema)

// Query user's own transactions
achievementRegistry.registerPath({
    method: "post",
    path: "/achievement",
    tags: ["Achievement"],
    responses: createApiResponse(z.object({ achievement: AchievementWithoutMetadataSchema }), "Success"),
})

achievementRouter.post("/", verifyJWT, validateRequest(CreateAchievementSchema), achievementController.createAchievement)

// Update an achievement
achievementRegistry.registerPath({
    method: "put",
    path: "/achievement/{id}",
    tags: ["Achievement"],
    responses: createApiResponse(z.object({ achievement: AchievementWithoutMetadataSchema }), "Success"),
})

achievementRouter.put("/:id", verifyJWT, validateRequest(UpdateAchievementSchema), achievementController.updateAchievement)

// Update an achievement
achievementRegistry.registerPath({
    method: "post",
    path: "/achievement/{id}/rewards/issue",
    tags: ["Achievement"],
    responses: createApiResponse(z.object({ reward: AchievementRewardSchema }), "Success"),
})

achievementRouter.post("/:id/rewards/issue", verifyJWT, validateRequest(IssueAchievementReward), achievementController.issueAchievementReward)

// Update an achievement
achievementRegistry.registerPath({
    method: "post",
    path: "/achievement/{id}/rewards/claim",
    tags: ["Achievement"],
    responses: createApiResponse(z.object({ reward: AchievementRewardSchema }), "Success"),
})

achievementRouter.post("/:id/rewards/claim", verifyJWT, validateRequest(ClaimRewardSchema), achievementController.claimAchievementReward)

// Claim an achievement reward
// achievementRegistry.registerPath({
//     method: "post",
//     path: "/achievement/{id}/rewards/{rewardId}/claim",
//     tags: ["Achievement"],
//     responses: createApiResponse(z.object({}), "Success"),
// })

// achievementRouter.post("/:achievementId/rewards/:rewardId/claim", verifyJWT, achievementController.claimAchievementReward)
