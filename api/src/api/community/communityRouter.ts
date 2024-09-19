import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import express, { type Router } from "express"
import { z } from "zod"

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders"
import verifyJWT, { verifyJWTAndRole } from "@/common/middleware/verifyJWT"
import { validateRequest } from "@/common/utils/httpHandlers"
import { communityController } from "./communityController"
import {
    CommunityAnnouncementSchema,
    CommunitySchema,
    MembershipSchema,
} from "@zodSchema/index"
import {
    CreateCommunityAnnouncementSchema,
    CreateMembershipSchema,
    CreateOrUpdateCommunitySchema,
    GetCommunitySchema,
    IssueCommunityPointsSchema,
    QueryAllCommunitiesSchema,
    UpdateCommunityAnnouncementSchema,
    UpdateMembershipSchema,
} from "./communityRequestValidation"
import { Role } from "@prisma/client"

export const communityRegistry = new OpenAPIRegistry()
export const communityRouter: Router = express.Router()

// open API zod schemas
const CommunityWithoutMetadata = CommunitySchema.omit({ metadata: true })
const MembershipWithoutMetadata = MembershipSchema.omit({ nftMetadata: true, membershipMetadata: true })
const CommunityAnnouncementWithoutMetadata = CommunityAnnouncementSchema.omit({ actionMetadata: true })

communityRegistry.register("Community", CommunityWithoutMetadata)

// Query all communities
communityRegistry.registerPath({
    method: "get",
    path: "/communities",
    tags: ["Community"],
    responses: createApiResponse(z.array(CommunityWithoutMetadata), "Success"),
})

communityRouter.get("/", verifyJWTAndRole([Role.ADMIN]), validateRequest(QueryAllCommunitiesSchema), communityController.communities)

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

// Add a member to a community as a managed member
communityRegistry.registerPath({
    method: "post",
    path: "/communities/{id}/add-member",
    tags: ["Community"],
    responses: createApiResponse(MembershipWithoutMetadata, "Success"),
})

communityRouter.post("/:id/add-member", verifyJWT, validateRequest(CreateMembershipSchema), communityController.addMembership)

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

// Create a community announcement
communityRegistry.registerPath({
    method: "post",
    path: "/communities/{id}/announcements",
    tags: ["Community"],
    responses: createApiResponse(CommunityAnnouncementWithoutMetadata, "Success"),
})

communityRouter.post(
    "/:id/announcements",
    verifyJWT,
    validateRequest(CreateCommunityAnnouncementSchema),
    communityController.createCommunityAnnouncement
)

// Update a community announcement
communityRegistry.registerPath({
    method: "put",
    path: "/communities/{id}/announcements/{announcementId}",
    tags: ["Community"],
    responses: createApiResponse(CommunityAnnouncementWithoutMetadata, "Success"),
})

communityRouter.put(
    "/:id/announcements/:announcementId",
    verifyJWT,
    validateRequest(UpdateCommunityAnnouncementSchema),
    communityController.updateCommunityAnnouncement
)