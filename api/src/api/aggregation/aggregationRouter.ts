import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import express, { type Router } from "express"
import { z } from "zod"

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders"
import { verifyJWTAndRole } from "@/common/middleware/verifyJWT"
import { aggregationController } from "./aggregationController"
import { validateRequest } from '@/common/utils/httpHandlers'
import { Role } from '@prisma/client'
import { aggregateTransactionsQuerySchema, groupTransactionsQuerySchema } from './aggregationRequestValidation'

export const aggregationRegistry = new OpenAPIRegistry()
export const aggregationRouter: Router = express.Router()

// Aggregate transactions
aggregationRegistry.registerPath({
    method: "get",
    path: "/aggregations/transactions/aggregate",
    tags: ["Aggregation"],
    responses: createApiResponse(z.object({}), "Success"),
})

aggregationRouter.get(
    "/transactions/aggregate",
    verifyJWTAndRole([Role.ADMIN]),
    validateRequest(aggregateTransactionsQuerySchema),
    aggregationController.aggregateTransactions
)

// Group transactions
aggregationRegistry.registerPath({
    method: "get",
    path: "/aggregations/transactions/group",
    tags: ["Aggregation"],
    responses: createApiResponse(z.object({}), "Success"),
})

aggregationRouter.get(
    "/transactions/group",
    verifyJWTAndRole([Role.ADMIN]),
    validateRequest(groupTransactionsQuerySchema),
    aggregationController.groupTransactions
)

// Get overall stats
aggregationRegistry.registerPath({
    method: "get",
    path: "/aggregations/stats",
    tags: ["Aggregation"],
    responses: createApiResponse(z.object({}), "Success"),
})

aggregationRouter.get(
    "/stats",
    verifyJWTAndRole([Role.ADMIN]),
    aggregationController.getOverallStats
)