import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

extendZodWithOpenApi(z)

export const CreateOrUpdateCommunitySchema = z.object({
    body: z.object({
        name: z.string(),
        description: z.string().optional(),
        isPrivate: z.boolean().optional(),
        pointsTokenName: z.string().optional(),
        imageUrl: z.string().optional(),
        metadata: z.record(z.string()).optional(),
    })
})
