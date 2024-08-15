import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import express, { type Router } from "express"
import { z } from "zod"

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders"
import verifyJWT from "@/common/middleware/verifyJWT"
import { validateRequest } from "@/common/utils/httpHandlers"
import { paymentController } from "./paymentController"
import { TransactionSchema } from '@zodSchema/index'

export const paymentRegistry = new OpenAPIRegistry()
export const paymentRouter: Router = express.Router()

paymentRegistry.register("Payment", TransactionSchema)

// Query user's own transactions
paymentRegistry.registerPath({
    method: "post",
    path: "/payments",
    tags: ["Payment"],
    responses: createApiResponse(z.array(TransactionSchema), "Success"),
})

paymentRouter.post("/", verifyJWT, paymentController.createPayment)
