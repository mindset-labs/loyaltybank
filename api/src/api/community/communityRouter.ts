import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import express, { type Router } from "express"
import { z } from "zod"

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders"
import verifyJWT from "@/common/middleware/verifyJWT"
import { validateRequest } from "@/common/utils/httpHandlers"
import { communityController } from "./communityController"
import { CommunitySchema, MembershipSchema } from '@zodSchema/index'
import { CreateOrUpdateCommunitySchema, GetCommunitySchema, IssueCommunityPointsSchema, UpdateMembershipSchema } from './communityRequestValidation'

export const communityRegistry = new OpenAPIRegistry()
export const communityRouter: Router = express.Router()

// open API zod schemas
const CommunityWithoutMetadata = CommunitySchema.omit({ metadata: true })
const MembershipWithoutMetadata = MembershipSchema.omit({ nftMetadata: true, membershipMetadata: true })

communityRegistry.register("Community", CommunityWithoutMetadata)

// Query all communities
communityRegistry.registerPath({
    method: "get",
    path: "/communities",
    tags: ["Community"],
    responses: createApiResponse(z.array(CommunityWithoutMetadata), "Success"),
})

communityRouter.get("/", verifyJWT, communityController.communities)

// List communities created by user
communityRegistry.registerPath({
    method: "get",
    path: "/communities/me",
    tags: ["Community"],
    responses: createApiResponse(z.array(CommunityWithoutMetadata), "Success"),
})

communityRouter.get("/me", verifyJWT, communityController.myCommunities)

// Get a community by ID
communityRegistry.registerPath({
    method: "get",
    path: "/communities/{id}",
    tags: ["Community"],
    responses: createApiResponse(CommunityWithoutMetadata, "Success"),
})

communityRouter.get("/:id", verifyJWT, validateRequest(GetCommunitySchema), communityController.getCommunityById)

// Create a community
communityRegistry.registerPath({
    method: "post",
    path: "/communities",
    tags: ["Community"],
    responses: createApiResponse(CommunityWithoutMetadata, "Success"),
})

communityRouter.post("/", verifyJWT, validateRequest(CreateOrUpdateCommunitySchema), communityController.createCommunity)

// Update a community
communityRegistry.registerPath({
    method: "put",
    path: "/communities/{id}",
    tags: ["Community"],
    responses: createApiResponse(CommunityWithoutMetadata, "Success"),
})

communityRouter.put("/:id", verifyJWT, validateRequest(CreateOrUpdateCommunitySchema), communityController.updateCommunity)

// Join a community
communityRegistry.registerPath({
    method: "post",
    path: "/communities/{id}/join",
    tags: ["Community"],
    responses: createApiResponse(MembershipWithoutMetadata, "Success"),
})

communityRouter.post("/:id/join", verifyJWT, communityController.joinCommunity)

// Update a community
communityRegistry.registerPath({
    method: "put",
    path: "/communities/{id}/memberships/{membershipId}",
    tags: ["Community", "Membership"],
    responses: createApiResponse(z.object({ membership: MembershipWithoutMetadata }), "Success"),
})

communityRouter.put("/:id/memberships/:membershipId", verifyJWT, validateRequest(UpdateMembershipSchema), communityController.updateMembership)

// Issue points to community member
communityRegistry.registerPath({
    method: "post",
    path: "/communities/{id}/issue-points",
    tags: ["Community"],
    responses: createApiResponse(MembershipWithoutMetadata, "Success"),
})

communityRouter.post("/:id/issue-points", verifyJWT, validateRequest(IssueCommunityPointsSchema), communityController.issueCommunityPoints)

// Archive a community
communityRegistry.registerPath({
    method: "put",
    path: "/communities/{id}/archive",
    tags: ["Community"],
    responses: createApiResponse(CommunityWithoutMetadata, "Success"),
})

communityRouter.put("/:id/archive", verifyJWT, communityController.archiveCommunity)
