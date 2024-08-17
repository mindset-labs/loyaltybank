import { TransactionSchema, WalletSchema } from '@zodSchema/index'
import { z } from 'zod'

// Input validation for creating a new transaction
export const CreatePaymentSchema = z.object({
    body: z.object({
        senderWalletId: z.string().uuid(),
        receiverWalletId: z.string().uuid(),
        // in most cases the receiver is the same as wallet owner
        // the field is optional to allow for receiving funds on shared wallets
        receiverUserId: z.string().uuid().optional(),
        amount: z.number().positive(),
        description: z.string().max(255).optional(),
        communityId: z.string().uuid().optional(),
    }),
})
export type CreatePaymentSchemaType = z.infer<typeof CreatePaymentSchema.shape.body>

// Response schema for creating a new transaction
export const NewPaymentResponseSchema = z.object({
    body: z.object({
        transaction: TransactionSchema,
        wallet: WalletSchema,
    }),
})