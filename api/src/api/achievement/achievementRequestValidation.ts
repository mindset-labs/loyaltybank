import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi"
import { z } from "zod"
import { AchievementUncheckedCreateWithoutCreatedByInputSchema } from '@zodSchema/index'
import { AchievementRewardType } from '@prisma/client'

extendZodWithOpenApi(z)

// Input Validation for 'POST achievements/' endpoint
export const CreateAchievementSchema = z.object({
    body: AchievementUncheckedCreateWithoutCreatedByInputSchema.superRefine((data, ctx) => {
        if ((!data.rewardType || data.rewardType === AchievementRewardType.POINTS) && !data.rewardAmount) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Reward type POINTS requires rewardPoints",
                path: ['rewardAmount'],
            })
        }

        return true
    }),
})
