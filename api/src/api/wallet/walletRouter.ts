import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import express, { type Router } from "express"
import { z } from "zod"

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders"
import verifyJWT from "@/common/middleware/verifyJWT"
import { walletController } from "./walletController"
import { TransactionSchema, WalletSchema } from '@zodSchema/index'
import { validateRequest } from '@/common/utils/httpHandlers'
import { GetWalletsSchema, GetWalletTransactionsSchema } from './walletRequestValidation'

export const walletRegistry = new OpenAPIRegistry()
export const walletRouter: Router = express.Router()

walletRegistry.register("Transaction", TransactionSchema)

// Get all wallets for the user
walletRegistry.registerPath({
    method: "get",
    path: "/wallets",
    tags: ["Wallet"],
    responses: createApiResponse(z.array(WalletSchema), "Success"),
})

walletRouter.get("/", verifyJWT, validateRequest(GetWalletsSchema), walletController.myWallets)

// Query a specific wallet's transactions
walletRegistry.registerPath({
    method: "get",
    path: "/wallets/{walletId}/transactions",
    tags: ["Wallet"],
    responses: createApiResponse(z.array(TransactionSchema), "Success"),
})

walletRouter.get("/:walletId/transactions", verifyJWT, validateRequest(GetWalletTransactionsSchema), walletController.queryWalletTransactions)

// Share wallet with another user
walletRegistry.registerPath({
    method: "put",
    path: "/wallets/{walletId}/share",
    tags: ["Wallet"],
    responses: createApiResponse(WalletSchema, "Success"),
})

walletRouter.put("/:walletId/share", verifyJWT, walletController.shareWallet)
