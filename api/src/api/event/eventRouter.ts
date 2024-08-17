import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import express, { type Router } from "express"
import { z } from "zod"

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders"
import verifyJWT from "@/common/middleware/verifyJWT"
import { eventController } from "./eventController"
import { EventLogSchema, EventSchema } from '@zodSchema/index'
import { validateRequest } from '@/common/utils/httpHandlers'
import { CreateEventLogSchema, CreateEventSchema } from './walletRequestValidation'

export const eventRegistry = new OpenAPIRegistry()
export const eventRouter: Router = express.Router()

eventRegistry.register("Event", EventSchema)

// Create a new event type
eventRegistry.registerPath({
    method: "post",
    path: "/events",
    tags: ["Event"],
    responses: createApiResponse(z.array(EventSchema), "Success"),
})

eventRouter.post("/", verifyJWT, validateRequest(CreateEventSchema), eventController.createEvent)

// Log an event for a user
eventRegistry.registerPath({
    method: "post",
    path: "/events/log",
    tags: ["Event"],
    responses: createApiResponse(z.array(EventLogSchema), "Success"),
})

eventRouter.post("/log", verifyJWT, validateRequest(CreateEventLogSchema), eventController.logEvent)
