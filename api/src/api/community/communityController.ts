// import { communityService } from "@/api/community/communityService"
import { env } from "@/common/utils/envConfig"
import { handleErrorResponse, handleSuccessResponse } from "@/common/utils/httpHandlers"
import type { Request, RequestHandler, Response } from "express"
import { StatusCodes } from "http-status-codes"
import jwt from "jsonwebtoken"
import { communityService } from "./communityService"
import { CustomError, CustomErrorCode } from '@/common/utils/errors'
import { CommunityStatus, Prisma } from '@prisma/client'
import { logger } from '@/server'
import { CommunityIncludeSchema } from '@zodSchema/index'

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
        let include: Prisma.CommunityInclude = {}

        if (req.query.include) {
            try {
                const parsed = JSON.parse(req.query.include as string)
                CommunityIncludeSchema.parse(parsed)
                include = parsed
            } catch (error) {
                logger.error('Failed to parse include query', error)
            }
        }

        return communityService
            .findByIdAndCheckAccess(req.params.id, req.userId!, include)
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
        const canEdit = !!(await communityService.findByIdWithEditAccess(req.params.id, req.userId!))

        if (!canEdit) {
            return handleErrorResponse(
                new CustomError('Invalid community or access', CustomErrorCode.INVALID_COMMUNITY_ACCESS, {
                    communityId: req.params.communityId,
                    userId: req.userId,
                }),
                res,
                StatusCodes.FORBIDDEN
            )
        }

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

    public joinCommunity: RequestHandler = async (req: Request, res: Response) => {
        return communityService
            .joinCommunity(req.params.id, req.userId!, req.query)
            .then((membership) => handleSuccessResponse({ membership }, res, StatusCodes.OK))
            .catch((error) => handleErrorResponse(error, res, StatusCodes.INTERNAL_SERVER_ERROR))
    };

    public addMemberToCommunity: RequestHandler = async (req: Request, res: Response) => {
        return communityService
            .addMember(req.userId!, {
                ...req.body,
                communityId: req.params.id,
            })
            .then((membership) => handleSuccessResponse({ membership }, res, StatusCodes.OK))
            .catch((error) => handleErrorResponse(error, res, StatusCodes.INTERNAL_SERVER_ERROR))
    };
}

export const communityController = new CommunityController()