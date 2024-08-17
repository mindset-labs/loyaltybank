import type { Request, RequestHandler, Response } from "express"
import { eventService } from './eventService'
import { handleErrorResponse, handleSuccessResponse } from '@/common/utils/httpHandlers'
import { StatusCodes } from 'http-status-codes'

export class EventController {
    createEvent: RequestHandler = async (req: Request, res: Response) => {
        eventService
            .createEvent({
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
            .then(eventLog => handleSuccessResponse({ eventLog }, res, StatusCodes.CREATED))
            .catch(error => handleErrorResponse(error, res))
    };
}

export const eventController = new EventController()
