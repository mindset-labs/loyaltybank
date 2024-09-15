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
    inviteCode: z.string(),
})