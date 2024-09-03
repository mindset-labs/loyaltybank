import { TransactionAggregateArgsSchema, TransactionGroupByArgsSchema } from '@zodSchema/index'
import { z } from 'zod'

export const aggregateTransactionsQuerySchema = z.object({
    query: TransactionAggregateArgsSchema
})

export const groupTransactionsQuerySchema = z.object({
    query: z.object({
        from: z.string().datetime(),
        to: z.string().datetime(),
    })
})
