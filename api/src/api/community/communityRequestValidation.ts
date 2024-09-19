import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { CommunityRole, MembershipStatus, MembershipTier } from '@prisma/client'
import { CommunityAnnouncementCreateInputSchema, CommunityAnnouncementUpdateInputSchema, CommunityIncludeSchema, CommunityWhereInputSchema } from '@zodSchema/index'
import { z } from 'zod'

extendZodWithOpenApi(z)

export const QueryAllCommunitiesSchema = z.object({
    query: z.object({
        include: CommunityIncludeSchema.optional(),
        where: CommunityWhereInputSchema.optional(),
        paging: z.object({
            take: z.string().optional(),
            skip: z.string().optional(),
        }).optional(),
    })
})

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

export const UpdateMembershipSchema = z.object({
    params: z.object({
        communityId: z.string().uuid(),
        membershipId: z.string().uuid(),
    }),
    body: z.object({
        status: z.nativeEnum(MembershipStatus).optional(),
        tier: z.nativeEnum(MembershipTier).optional(),
        tags: z.array(z.string()).optional(),
    })
})

export const CreateMembershipSchema = z.object({
    params: z.object({
        communityId: z.string().uuid(),
    }),
    body: z.object({
        userId: z.string().uuid(),
        role: z.nativeEnum(CommunityRole).default(CommunityRole.MEMBER),
        tags: z.array(z.string()).optional(),
        status: z.nativeEnum(MembershipStatus).default(MembershipStatus.ACTIVE),
    })
})

export const CreateCommunityAnnouncementSchema = z.object({
    body: CommunityAnnouncementCreateInputSchema,
    params: z.object({
        communityId: z.string().uuid(),
    })
})

export const UpdateCommunityAnnouncementSchema = z.object({
    body: CommunityAnnouncementUpdateInputSchema,
    params: z.object({
        communityId: z.string().uuid(),
        announcementId: z.string().uuid(),
    })
})
