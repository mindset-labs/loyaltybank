import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { CommunityIncludeSchema } from '@zodSchema/index'
import { z } from 'zod'

extendZodWithOpenApi(z)

export const GetCommunitySchema = z.object({
    query: z.object({
        include: CommunityIncludeSchema.optional(),
    })
})

export const JoinCommunitySchema = z.object({
    query: z.object({
        createWallet: z.boolean().optional(),
        walletName: z.string().optional(),
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

export const IssueCommunityPointsSchema = z.object({
    body: z.object({
        amount: z.number(),
        walletId: z.string().uuid(),
        communityId: z.string().uuid(),
        reason: z.string().optional(),
    })
})
