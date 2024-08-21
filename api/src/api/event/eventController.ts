import type { Request, RequestHandler, Response } from "express"
import { eventService } from './eventService'
import { handleErrorResponse, handleSuccessResponse } from '@/common/utils/httpHandlers'
import { StatusCodes } from 'http-status-codes'
import { addJob } from '@/worker/eventWorker'

export class EventController {
    createEvent: RequestHandler = async (req: Request, res: Response) => {
        eventService
            .createEvent(req.userId!, {
                ...req.body,
                createdById: req.userId!
            })
            .then(event => handleSuccessResponse({ event }, res, StatusCodes.CREATED))
            .catch(error => handleErrorResponse(error, res))
    };

    logEvent: RequestHandler = async (req: Request, res: Response) => {
        eventService
            .logEvent({
                ...req.body,
                createdById: req.userId!
            })
            .then(async (eventLog) => {
                // add the event job to the queue
                await addJob({
                    eventId: eventLog.eventId,
                    eventLogId: eventLog.id,
                    userId: eventLog.userId,
                })
                return handleSuccessResponse({ eventLog }, res, StatusCodes.CREATED)
            })
            .catch(error => handleErrorResponse(error, res))
    };
}

export const eventController = new EventController()
