import { z } from 'zod'

export const GetWalletsSchema = z.object({
    query: z.object({
        includeShared: z.boolean().optional(),
    }),
})
