import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import express, { type Router } from "express"
import { z } from "zod"

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders"
import verifyJWT from "@/common/middleware/verifyJWT"
import { validateRequest } from "@/common/utils/httpHandlers"
import { transactionController } from "./transactionController"
import { TransactionSchema } from '@zodSchema/index'

export const transactionRegistry = new OpenAPIRegistry()
export const transactionRouter: Router = express.Router()

transactionRegistry.register("Transaction", TransactionSchema)

// Query user's own transactions
transactionRegistry.registerPath({
    method: "get",
    path: "/transactions",
    tags: ["Transaction"],
    responses: createApiResponse(z.array(TransactionSchema), "Success"),
})

transactionRouter.get("/", verifyJWT, transactionController.queryTransactions)
