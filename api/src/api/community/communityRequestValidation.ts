import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { CommunityIncludeSchema } from '@zodSchema/index'
import { z } from 'zod'

extendZodWithOpenApi(z)

export const GetCommunitySchema = z.object({
    query: z.object({
        include: z.string().optional(),
    })
})

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
