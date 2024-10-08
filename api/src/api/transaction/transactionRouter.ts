import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import express, { type Router } from "express"
import { z } from "zod"

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders"
import verifyJWT from "@/common/middleware/verifyJWT"
import { transactionController } from "./transactionController"
import { TransactionSchema } from '@zodSchema/index'

export const transactionRegistry = new OpenAPIRegistry()
export const transactionRouter: Router = express.Router()

// open API zod schemas
const TransactionWithoutMetadataSchema = TransactionSchema.omit({ metadata: true })

transactionRegistry.register("Transaction", TransactionWithoutMetadataSchema)

// Query user's own transactions
transactionRegistry.registerPath({
    method: "get",
    path: "/transactions",
    tags: ["Transaction"],
    responses: createApiResponse(z.object({
        transactions: z.array(TransactionWithoutMetadataSchema),
        total: z.number(),
    }), "Success"),
})

transactionRouter.get("/", verifyJWT, transactionController.queryTransactions)
