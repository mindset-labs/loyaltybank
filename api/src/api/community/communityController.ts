// import { communityService } from "@/api/community/communityService"
import { env } from "@/common/utils/envConfig"
import { handleErrorResponse, handleSuccessResponse } from "@/common/utils/httpHandlers"
import type { Request, RequestHandler, Response } from "express"
import { StatusCodes } from "http-status-codes"
import jwt from "jsonwebtoken"
import { communityService } from "./communityService"
import { CustomError, CustomErrorCode } from '@/common/utils/errors'
import { CommunityStatus } from '@prisma/client'

class CommunityController {
    public communities: RequestHandler = async (req: Request, res: Response) => {
        return communityService
            .queryCommunities({})
            .then((communities) => handleSuccessResponse({ communities }, res, StatusCodes.OK))
            .catch((error) => handleErrorResponse(error, res, StatusCodes.INTERNAL_SERVER_ERROR))
    };

    public myCommunities: RequestHandler = async (req: Request, res: Response) => {
        return communityService
            .queryCommunities({
                createdById: req.userId!
            })
            .then((communities) => handleSuccessResponse({ communities }, res, StatusCodes.OK))
            .catch((error) => handleErrorResponse(error, res, StatusCodes.INTERNAL_SERVER_ERROR))
    };

    public getCommunityById: RequestHandler = async (req: Request, res: Response) => {
        return communityService
            .findById(req.params.id)
            .then((community) => handleSuccessResponse({ community }, res, StatusCodes.OK))
            .catch((error) => handleErrorResponse(error, res, StatusCodes.INTERNAL_SERVER_ERROR))
    };

    public createCommunity: RequestHandler = async (req: Request, res: Response) => {
        return communityService
            .createCommunity({
                ...req.body,
                createdById: req.userId!
            })
            .then((community) => handleSuccessResponse({ community }, res, StatusCodes.OK))
            .catch((error) => handleErrorResponse(error, res, StatusCodes.INTERNAL_SERVER_ERROR))
    };

    public updateCommunity: RequestHandler = async (req: Request, res: Response) => {
        // TODO: check if the user is the creator or has the right permissions

        return communityService
            .updateCommunity(req.params.id, req.body)
            .then((community) => handleSuccessResponse({ community }, res, StatusCodes.OK))
            .catch((error) => handleErrorResponse(error, res, StatusCodes.INTERNAL_SERVER_ERROR))
    };

    public archiveCommunity: RequestHandler = async (req: Request, res: Response) => {
        // find the community
        const community = await communityService.findById(req.params.id)

        if (!community) {
            const notFoundError = new CustomError('Community not found', CustomErrorCode.INVALID_COMMUNITY)
            return handleErrorResponse(notFoundError, res, StatusCodes.NOT_FOUND)
        }

        // check if the user is the creator
        if (community.createdById !== req.userId) {
            const forbiddenError = new CustomError('Invalid authorization', CustomErrorCode.INVALID_ACCESS_CONTROL)
            return handleErrorResponse(forbiddenError, res, StatusCodes.FORBIDDEN)
        }

        // archive the community
        return communityService
            .updateCommunity(req.params.id, {
                status: CommunityStatus.ARCHIVED,
            })
            .then((community) => handleSuccessResponse({ community }, res, StatusCodes.OK))
            .catch((error) => handleErrorResponse(error, res, StatusCodes.INTERNAL_SERVER_ERROR))
    };
}

export const communityController = new CommunityController()