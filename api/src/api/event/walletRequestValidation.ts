import { z } from 'zod'
import {
    EventLogUncheckedCreateWithoutCreatedByInputSchema,
    EventUncheckedCreateWithoutCreatedByInputSchema
} from '@zodSchema/index'

export const CreateEventSchema = z.object({
    body: EventUncheckedCreateWithoutCreatedByInputSchema
})

export const CreateEventLogSchema = z.object({
    body: EventLogUncheckedCreateWithoutCreatedByInputSchema,
})
