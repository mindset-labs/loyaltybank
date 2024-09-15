import { handleErrorResponse, handleSuccessResponse } from "@/common/utils/httpHandlers"
import type { Request, RequestHandler, Response } from "express"
import { StatusCodes } from "http-status-codes"
import { communityService } from "./communityService"
import { CustomError, CustomErrorCode } from '@/common/utils/errors'
import { CommunityStatus, MembershipStatus, Prisma } from '@prisma/client'
import { QueryPaging } from '@/common/utils/commonTypes'

class CommunityController {
    public communities: RequestHandler = async (req: Request, res: Response) => {
        const paging = req.query.paging as Record<string, string>

        return communityService
            .queryCommunities(
                (req.query.where || {}) as Prisma.CommunityWhereInput,
                req.query.include as Prisma.CommunityInclude,
                {
                    skip: parseInt(paging?.skip || '0'),
                    take: parseInt(paging?.take || '10'),
                }
            )
            .then((communities) => handleSuccessResponse({ communities }, res, StatusCodes.OK))
            .catch((error) => handleErrorResponse(error, res, StatusCodes.INTERNAL_SERVER_ERROR))
    };

    public myCommunities: RequestHandler = async (req: Request, res: Response) => {
        return communityService
            .queryCommunities({
                OR: [
                    {
                        createdById: req.userId!
                    },
                    {
                        memberships: {
                            some: {
                                userId: req.userId!,
                                // TODO: decide if we want to include non-active memberships
                                // membershipStatus: MembershipStatus.ACTIVE
                            }
                        }
                    }
                ]
            }, req.query.include as Prisma.CommunityInclude, req.query.paging as QueryPaging)
            .then((communities) => handleSuccessResponse({ communities }, res, StatusCodes.OK))
            .catch((error) => handleErrorResponse(error, res, StatusCodes.INTERNAL_SERVER_ERROR))
    };

    public getCommunityById: RequestHandler = async (req: Request, res: Response) => {
        return communityService
            .findByIdAndCheckAccess(req.params.id, req.userId!, req.query.include as Prisma.CommunityInclude | undefined)
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

    public issueCommunityPoints: RequestHandler = async (req: Request, res: Response) => {
        return communityService
            .issuePoints(req.userId!, req.body)
            .then((transaction) => handleSuccessResponse({ transaction }, res, StatusCodes.CREATED))
            .catch((error) => handleErrorResponse(error, res, StatusCodes.INTERNAL_SERVER_ERROR))
    }

    public addMembership: RequestHandler = async (req: Request, res: Response) => {
        return communityService
            .createMembership(req.userId!, {
                ...req.body,
                communityId: req.params.id,
            })
            .then((membership) => handleSuccessResponse({ membership }, res, StatusCodes.OK))
            .catch((error) => handleErrorResponse(error, res, StatusCodes.INTERNAL_SERVER_ERROR))
    }

    public updateMembership: RequestHandler = async (req: Request, res: Response) => {
        return communityService
            .updateMembership(req.userId!, req.params.communityId, req.params.membershipId, req.body)
            .then((membership) => handleSuccessResponse({ membership }, res, StatusCodes.OK))
            .catch((error) => handleErrorResponse(error, res, StatusCodes.INTERNAL_SERVER_ERROR))
    }
}

export const communityController = new CommunityController()