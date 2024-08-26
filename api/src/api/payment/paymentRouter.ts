import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import express, { type Router } from "express"
import { z } from "zod"

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders"
import verifyJWT from "@/common/middleware/verifyJWT"
import { validateRequest } from "@/common/utils/httpHandlers"
import { paymentController } from "./paymentController"
import { TransactionSchema, WalletSchema } from '@zodSchema/index'
import { CreatePaymentSchema } from './paymentRequestValidation'

export const paymentRegistry = new OpenAPIRegistry()
export const paymentRouter: Router = express.Router()

// open API zod schemas
const TransactionWithoutMetadataSchema = TransactionSchema.omit({ metadata: true })

paymentRegistry.register("Payment", TransactionWithoutMetadataSchema)

// Create a payment
paymentRegistry.registerPath({
    method: "post",
    path: "/payments",
    tags: ["Payment"],
    responses: createApiResponse(z.object({
        transaction: TransactionWithoutMetadataSchema,
        wallet: WalletSchema,
    }), "Success"),
})

paymentRouter.post("/", verifyJWT, validateRequest(CreatePaymentSchema), paymentController.createPayment)
