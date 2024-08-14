import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import express, { type Router } from "express"
import { z } from "zod"

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders"
import verifyJWT from "@/common/middleware/verifyJWT"
import { validateRequest } from "@/common/utils/httpHandlers"
import { communityController } from "./communityController"
import { CommunitySchema, MembershipSchema } from '@zodSchema/index'
import { CreateOrUpdateCommunitySchema, GetCommunitySchema } from './communityRequestValidation'

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

communityRouter.get("/:id", verifyJWT, validateRequest(GetCommunitySchema), communityController.getCommunityById)

// Create a community
communityRegistry.registerPath({
    method: "post",
    path: "/communities",
    tags: ["Community"],
    responses: createApiResponse(CommunitySchema, "Success"),
})

communityRouter.post("/", verifyJWT, validateRequest(CreateOrUpdateCommunitySchema), communityController.createCommunity)

// Update a community
communityRegistry.registerPath({
    method: "put",
    path: "/communities/{id}",
    tags: ["Community"],
    responses: createApiResponse(CommunitySchema, "Success"),
})

communityRouter.put("/:id", verifyJWT, validateRequest(CreateOrUpdateCommunitySchema), communityController.updateCommunity)

// Join a community
communityRegistry.registerPath({
    method: "post",
    path: "/communities/{id}/join",
    tags: ["Community"],
    responses: createApiResponse(MembershipSchema, "Success"),
})

communityRouter.post("/:id/join", verifyJWT, communityController.joinCommunity)

// Archive a community
communityRegistry.registerPath({
    method: "put",
    path: "/communities/{id}/archive",
    tags: ["Community"],
    responses: createApiResponse(CommunitySchema, "Success"),
})

communityRouter.put("/:id/archive", verifyJWT, communityController.archiveCommunity)
