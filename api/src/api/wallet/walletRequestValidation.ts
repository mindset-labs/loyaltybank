import { TransactionWhereInputSchema } from '@zodSchema/index'
import { z } from 'zod'

export const GetWalletsSchema = z.object({
    query: z.object({}),
})

export const GetWalletTransactionsSchema = z.object({
    query: TransactionWhereInputSchema,
})
