import { InviteStatus } from '@prisma/client'
import { InviteIncludeSchema, InviteWhereInputSchema } from '@zodSchema/index'
import { z } from "zod"

export const QueryInviteSchema = z.object({
    query: z.object({
        where: InviteWhereInputSchema.optional(),
        include: InviteIncludeSchema.optional(),
        paging: z.object({
            take: z.string().optional(),
            skip: z.string().optional(),
        }).optional(),
    }),
})

export const AcceptInviteSchema = z.object({
    body: z.object({
        inviteCode: z.string(),
    }),
})

export const UpdateInviteSchema = z.object({
    params: z.object({
        inviteId: z.string(),
    }),
    body: z.object({
        status: z.nativeEnum(InviteStatus).optional(),
        expiresAt: z.string().date().optional(),
        maxUses: z.number().optional(),
    }),
})