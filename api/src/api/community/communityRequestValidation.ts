import { CommunityCreateInputSchema } from '@zodSchema/index'
import { z } from 'zod'

// Input and Type validation for user creation
export const UpdateCommunitySchema = z.object({
    body: z.object({
        name: z.string(),
        description: z.string().optional(),
        isPrivate: z.boolean().optional(),
        pointsTokenName: z.string().optional(),
        imageUrl: z.string().optional(),
        metadata: z.record(z.string()).optional(),
    }),
})
