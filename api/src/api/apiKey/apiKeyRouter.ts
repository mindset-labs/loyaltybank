import express, { Router } from 'express'
import verifyJWT from "@/common/middleware/verifyJWT"
import { OpenAPIRegistry } from '@asteasolutions/zod-to-openapi'
import { ApiKeySchema } from '@zodSchema/index'
import { createApiResponse } from '@/api-docs/openAPIResponseBuilders'
import { z } from 'zod'

import { apiKeyController } from './apiKeyController'

export const apiKeyRegistry = new OpenAPIRegistry()
export const apiKeyRouter: Router = express.Router()

const ApiKeyWithoutSecretAndMetadata = ApiKeySchema.omit({ secret: true, metadata: true })

// All the user's api keys
apiKeyRegistry.registerPath({
    method: "get",
    path: "/api-keys",
    tags: ["ApiKey"],
    responses: createApiResponse(z.array(ApiKeyWithoutSecretAndMetadata), "Success"),
})
apiKeyRouter.get('/', verifyJWT, apiKeyController.getAllApiKeys)

// Create a new api key
apiKeyRegistry.registerPath({
    method: "post",
    path: "/api-keys",
    tags: ["ApiKey"],
    responses: createApiResponse(z.object({
        apiKey: ApiKeyWithoutSecretAndMetadata,
        secretPlainText: z.string()
    }), "Success"),
})
apiKeyRouter.post('/', verifyJWT, apiKeyController.createApiKey)
