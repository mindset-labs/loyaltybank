import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import express, { type Router } from "express"
import { z } from "zod"

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders"
import verifyJWT, { verifyJWTAndRole } from "@/common/middleware/verifyJWT"
import { inviteController } from "./inviteController"
import { InviteSchema } from '@zodSchema/index'
import { Role } from '@prisma/client'
import { AcceptInviteSchema, QueryInviteSchema, UpdateInviteSchema } from './inviteRequestValidation'
import { validateRequest } from '@/common/utils/httpHandlers'

export const inviteRegistry = new OpenAPIRegistry()
export const inviteRouter: Router = express.Router()

inviteRegistry.register("Invite", InviteSchema)

// Get invites
inviteRegistry.registerPath({
    method: "get",
    path: "/invites",
    tags: ["Invite"],
    responses: createApiResponse(z.object({
        invites: z.array(InviteSchema),
        total: z.number(),
    }), "Success"),
})

inviteRouter.get("/", verifyJWT, validateRequest(QueryInviteSchema), inviteController.queryInvites)

// Create an invite
inviteRegistry.registerPath({
    method: "post",
    path: "/invites",
    tags: ["Invite"],
    responses: createApiResponse(InviteSchema, "Success"),
})

inviteRouter.post("/", verifyJWTAndRole([Role.ADMIN]), inviteController.createInvite)

// Accept an invite
inviteRegistry.registerPath({
    method: "post",
    path: "/invites/accept",
    tags: ["Invite"],
    responses: createApiResponse(z.object({
        invite: InviteSchema,
    }), "Success"),
})

inviteRouter.post("/accept", verifyJWT, validateRequest(AcceptInviteSchema), inviteController.acceptInvite)

// Update an invite
inviteRegistry.registerPath({
    method: "put",
    path: "/invites/{inviteId}",
    tags: ["Invite"],
    responses: createApiResponse(z.object({
        invite: InviteSchema,
    }), "Success"),
})

inviteRouter.put("/:inviteId", verifyJWT, validateRequest(UpdateInviteSchema), inviteController.updateInvite)