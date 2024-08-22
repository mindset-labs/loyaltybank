import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import express, { type Router } from "express"
import { z } from "zod"

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders"
import verifyJWT from "@/common/middleware/verifyJWT"
import { eventController } from "./eventController"
import { EventLogSchema, EventSchema } from '@zodSchema/index'
import { validateRequest } from '@/common/utils/httpHandlers'
import { CreateEventLogSchema, CreateEventSchema } from './eventRequestValidation'

export const eventRegistry = new OpenAPIRegistry()
export const eventRouter: Router = express.Router()

// open API zod schemas
const EventLogWithoutMetadataSchema = EventLogSchema.omit({ metadata: true })

eventRegistry.register("Event", EventSchema)
eventRegistry.register("EventLog", EventLogWithoutMetadataSchema)

// Create a new event type
eventRegistry.registerPath({
    method: "post",
    path: "/events",
    tags: ["Event"],
    responses: createApiResponse(z.object({ event: EventSchema }), "Success"),
})

eventRouter.post("/", verifyJWT, validateRequest(CreateEventSchema), eventController.createEvent)

// Log an event for a user
eventRegistry.registerPath({
    method: "post",
    path: "/events/log",
    tags: ["Event"],
    responses: createApiResponse(z.object({
        eventLog: EventLogWithoutMetadataSchema,
    }), "Success"),
})

eventRouter.post("/log", verifyJWT, validateRequest(CreateEventLogSchema), eventController.logEvent)
