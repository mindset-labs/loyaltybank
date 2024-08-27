import { TransactionSchema, WalletSchema } from '@zodSchema/index'
import { z } from 'zod'

// Input validation for creating a new transaction
export const CreatePaymentSchema = z.object({
    body: z.object({
        senderWalletId: z.string().uuid(),
        receiverWalletId: z.string().uuid(),
        amount: z.number().positive(),
        // in most cases the receiver is the same as wallet owner
        // the field is optional to allow for receiving funds on shared wallets
        receiverUserId: z.string().uuid().optional(),
        description: z.string().max(255).optional(),
        communityId: z.string().uuid().optional(),
        transactionId: z.string().uuid().optional(),
    }),
})
export type CreatePaymentSchemaType = z.infer<typeof CreatePaymentSchema.shape.body>
