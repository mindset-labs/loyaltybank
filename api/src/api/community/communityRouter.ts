import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import express, { type Router } from "express"
import { z } from "zod"

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders"
import verifyJWT from "@/common/middleware/verifyJWT"
import { validateRequest } from "@/common/utils/httpHandlers"
import { communityController } from "./communityController"
import { CommunitySchema } from '@zodSchema/index'
import { CreateCommunitySchema, UpdateCommunitySchema } from './communityRequestValidation'

export const communityRegistry = new OpenAPIRegistry()
export const communityRouter: Router = express.Router()

communityRegistry.register("Community", CommunitySchema)

// Query all communities
communityRegistry.registerPath({
    method: "get",
    path: "/communities",
    tags: ["Community"],
    responses: createApiResponse(z.array(CommunitySchema), "Success"),
})

communityRouter.get("/", verifyJWT, communityController.communities)

// List communities created by user
communityRegistry.registerPath({
    method: "get",
    path: "/communities/by-me",
    tags: ["Community"],
    responses: createApiResponse(z.array(CommunitySchema), "Success"),
})

communityRouter.get("/me", verifyJWT, communityController.myCommunities)

// Get a community by ID
communityRegistry.registerPath({
    method: "get",
    path: "/communities/{id}",
    tags: ["Community"],
    responses: createApiResponse(CommunitySchema, "Success"),
})

communityRouter.get("/:id", verifyJWT, communityController.getCommunityById)

// Create a community
communityRegistry.registerPath({
    method: "post",
    path: "/communities",
    tags: ["Community"],
    responses: createApiResponse(CommunitySchema, "Success"),
})

communityRouter.post("/", verifyJWT, validateRequest(CreateCommunitySchema), communityController.createCommunity)

// Update a community
communityRegistry.registerPath({
    method: "put",
    path: "/communities/{id}",
    tags: ["Community"],
    responses: createApiResponse(CommunitySchema, "Success"),
})

communityRouter.put("/:id", verifyJWT, validateRequest(UpdateCommunitySchema), communityController.updateCommunity)

// Archive a community
communityRegistry.registerPath({
    method: "put",
    path: "/communities/{id}/archive",
    tags: ["Community"],
    responses: createApiResponse(CommunitySchema, "Success"),
})

communityRouter.put("/:id/archive", verifyJWT, communityController.archiveCommunity)
