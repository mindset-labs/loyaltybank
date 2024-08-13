import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import express, { type Router } from "express"
import { z } from "zod"

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders"
import verifyJWT from "@/common/middleware/verifyJWT"
import { validateRequest } from "@/common/utils/httpHandlers"
import { communityController } from "./communityController"
import { CommunityCreateInputSchema, CommunitySchema } from '@zodSchema/index'
import { UpdateCommunitySchema } from './communityRequestValidation'

export const userRegistry = new OpenAPIRegistry()
export const userRouter: Router = express.Router()

userRegistry.register("Community", CommunitySchema)

// Query all communities
userRegistry.registerPath({
    method: "get",
    path: "/communities",
    tags: ["Community"],
    responses: createApiResponse(z.array(CommunitySchema), "Success"),
})

userRouter.get("/", verifyJWT, communityController.communities)

// List communities created by user
userRegistry.registerPath({
    method: "get",
    path: "/communities/by-me",
    tags: ["Community"],
    responses: createApiResponse(z.array(CommunitySchema), "Success"),
})

userRouter.get("/me", verifyJWT, communityController.myCommunities)

// Get a community by ID
userRegistry.registerPath({
    method: "get",
    path: "/communities/{id}",
    tags: ["Community"],
    responses: createApiResponse(CommunitySchema, "Success"),
})

userRouter.get("/:id", verifyJWT, communityController.getCommunityById)

// Create a community
userRegistry.registerPath({
    method: "post",
    path: "/communities",
    tags: ["Community"],
    responses: createApiResponse(CommunitySchema, "Success"),
})

userRouter.post("/", verifyJWT, validateRequest(CommunityCreateInputSchema), communityController.createCommunity)

// Update a community
userRegistry.registerPath({
    method: "put",
    path: "/communities/{id}",
    tags: ["Community"],
    responses: createApiResponse(CommunitySchema, "Success"),
})

userRouter.put("/:id", verifyJWT, validateRequest(UpdateCommunitySchema), communityController.updateCommunity)

// Archive a community
userRegistry.registerPath({
    method: "put",
    path: "/communities/{id}/archive",
    tags: ["Community"],
    responses: createApiResponse(CommunitySchema, "Success"),
})

userRouter.put("/:id/archive", verifyJWT, communityController.archiveCommunity)
