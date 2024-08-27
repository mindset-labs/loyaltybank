import { TransactionSubtypeSchema, TransactionTypeSchema, TransactionWhereInputSchema } from '@zodSchema/index'
import { z } from 'zod'

export const GetWalletsSchema = z.object({
    query: z.object({}),
})

export const GetWalletTransactionsSchema = z.object({
    query: TransactionWhereInputSchema,
})

export const CreatePlaceholderTransactionSchema = z.object({
    body: z.object({
        amount: z.number(),
        options: z.object({
            transactionType: TransactionTypeSchema.optional(),
            transactionSubtype: TransactionSubtypeSchema.optional(),
        }).optional(),
    }),
})
