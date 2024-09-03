import type { Request, RequestHandler, Response } from "express"
import { StatusCodes } from 'http-status-codes'
import { aggregationService } from './aggregationService'
import { Prisma } from '@prisma/client'
import { handleErrorResponse, handleSuccessResponse } from '@/common/utils/httpHandlers'

export class AggregationController {
    aggregateTransactions: RequestHandler = async (req: Request, res: Response) => {
        return aggregationService
            .aggregateTransactions(req.query)
            .then((data) => handleSuccessResponse({ aggregatedTransactions: data }, res, StatusCodes.OK))
            .catch((error) => handleErrorResponse(error, res, StatusCodes.INTERNAL_SERVER_ERROR))
    };

    groupTransactions: RequestHandler = async (req: Request, res: Response) => {
        return aggregationService
            .groupTransactionsByDate(new Date(req.query.from as string), new Date(req.query.to as string))
            .then((data) => handleSuccessResponse({ groupedTransactions: data }, res, StatusCodes.OK))
            .catch((error) => handleErrorResponse(error, res, StatusCodes.INTERNAL_SERVER_ERROR))
    };

    getOverallStats: RequestHandler = async (req: Request, res: Response) => {
        return aggregationService
            .getOverallStats()
            .then((data) => handleSuccessResponse({ overallStats: data }, res, StatusCodes.OK))
            .catch((error) => handleErrorResponse(error, res, StatusCodes.INTERNAL_SERVER_ERROR))
    };
}

export const aggregationController = new AggregationController()
