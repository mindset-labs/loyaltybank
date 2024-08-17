import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi"
import { z } from "zod"

import { commonValidations } from "@/common/utils/commonValidation"
// import { Prisma } from '@prisma/client'

extendZodWithOpenApi(z)

// Input Validation for 'GET users/:id' endpoint
export const QueryTransactionsSchema = z.object({
    params: z.object({
        senderWalletId: z.string().uuid().optional(),
        receiverWalletId: z.string().uuid().optional(),
        fromDate: z.string().date().optional(),
        toDate: z.string().date().optional(),
    }),
})
